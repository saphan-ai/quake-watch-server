// The real QuakeWatch server. It answers the five operations of docs/api/openapi.yaml from the store.
// Run it with `npm start`. Settings come from environment variables, listed at the bottom of this file.
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { fetchQuakes, parseFeed } from './feed/usgs.ts'
import { isRegion, openStore, regions, toStoredTime, type Region, type Store } from './store/index.ts'
import type { Quake } from './quake.ts'

// A region nobody has set a threshold for answers this (the contract's example threshold).
export const DEFAULT_THRESHOLD = { minMagnitude: 5, maxDepthKm: 70 }

export interface Answer {
  status: number
  body: unknown
}

const ok = (body: unknown): Answer => ({ status: 200, body })
const bad = (error: string, message: string): Answer => ({ status: 400, body: { error, message } })
const notFound: Answer = { status: 404, body: { error: 'not_found', message: 'no such path' } }

const unknownRegion = () =>
  bad('unknown_region', `region must be one of: ${Object.keys(regions).join(', ')}`)
const badSince = () =>
  bad('bad_since', 'since must be an RFC 3339 UTC time such as 2026-10-20T00:00:00Z')
const badThreshold = (why: string) =>
  bad('bad_threshold', `body must be {"minMagnitude": <number>, "maxDepthKm": <number, 0 or more>}: ${why}`)

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

const unavailable: Answer = { status: 500, body: { error: 'unavailable', message: 'the store cannot be reached' } }

// Answers one request. `body` is the raw request body (only a PUT reads it). Pure apart from the store.
// Everything a client can get wrong is checked before the store is touched and answers 400, so an exception
// that reaches the catch below is the store failing, and it answers 500.
export function answer(store: Store, method: string, url: string, body = ''): Answer {
  try {
    return route(store, method, url, body)
  } catch (err) {
    console.error('store failed:', err)
    return unavailable
  }
}

function route(store: Store, method: string, url: string, body: string): Answer {
  let parsed: URL
  try {
    parsed = new URL(url, 'http://localhost')
  } catch {
    return bad('bad_request', 'the request path cannot be read')
  }
  const { pathname, searchParams } = parsed

  if (method === 'GET' && pathname === '/healthz') {
    try {
      store.countEvents() // proves the store can be read
      return ok({ status: 'ok' })
    } catch {
      return { status: 500, body: { error: 'unavailable', message: 'the store cannot be reached' } }
    }
  }

  if (method === 'GET' && pathname === '/api/v1/events') return listEvents(store, searchParams)

  if (method === 'GET' && pathname === '/api/v1/alerts') {
    const region = searchParams.get('region') ?? ''
    if (!isRegion(region)) return unknownRegion()
    const { minMagnitude, maxDepthKm } = thresholdOf(store, region)
    const alerts = store
      .listEvents(region)
      .filter((q) => q.magnitude >= minMagnitude && q.depthKm <= maxDepthKm)
      .map((quake) => ({ region, quake }))
    return ok({ alerts })
  }

  const match = /^\/api\/v1\/thresholds\/([^/]+)$/.exec(pathname)
  if (match && (method === 'GET' || method === 'PUT')) {
    let region: string
    try {
      region = decodeURIComponent(match[1])
    } catch {
      return unknownRegion() // a segment that does not decode names no region
    }
    if (!isRegion(region)) return unknownRegion()
    if (method === 'GET') return ok(thresholdOf(store, region))
    return putThreshold(store, region, body)
  }

  return notFound
}

function thresholdOf(store: Store, region: Region) {
  return store.getThreshold(region) ?? { region, ...DEFAULT_THRESHOLD }
}

function listEvents(store: Store, query: URLSearchParams): Answer {
  const region = query.get('region')
  if (region !== null && !isRegion(region)) return unknownRegion()
  const since = query.get('since') ?? undefined
  if (since !== undefined) {
    try {
      toStoredTime(since) // the store's own reading of a time, asked before the store is used
    } catch {
      return badSince()
    }
  }
  // Without a region: all five. The boxes overlap, so an event can be in two; each is kept once.
  const found = (region === null ? (Object.keys(regions) as Region[]) : [region]).flatMap((r) =>
    store.listEvents(r, since),
  )
  const byId = new Map<string, Quake>(found.map((q) => [q.id, q]))
  const events = [...byId.values()].sort((a, b) => b.time.localeCompare(a.time) || a.id.localeCompare(b.id))
  return ok({ events })
}

function putThreshold(store: Store, region: Region, body: string): Answer {
  let input: any
  try {
    input = JSON.parse(body)
  } catch {
    return badThreshold('the body is not JSON')
  }
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return badThreshold('the body is not an object')
  if (!isNumber(input.minMagnitude)) return badThreshold('minMagnitude is missing or not a number')
  if (!isNumber(input.maxDepthKm)) return badThreshold('maxDepthKm is missing or not a number')
  if (input.maxDepthKm < 0) return badThreshold('maxDepthKm is negative')
  return ok(store.setThreshold(region, { minMagnitude: input.minMagnitude, maxDepthKm: input.maxDepthKm }))
}

// Turns a Node request into `answer(...)` and writes the reply.
// Only a PUT has a body worth reading, and no more than MAX_BODY_BYTES of it is ever kept.
export const MAX_BODY_BYTES = 16 * 1024

const tooLarge = bad('body_too_large', `the request body must be at most ${MAX_BODY_BYTES} bytes`)

export function handler(store: Store): (req: IncomingMessage, res: ServerResponse) => void {
  return (req, res) => {
    const method = req.method ?? 'GET'
    const reply = (a: Answer, headers: Record<string, string> = {}) =>
      res.writeHead(a.status, { 'content-type': 'application/json', ...headers }).end(JSON.stringify(a.body))
    const run = (body: string) => reply(answer(store, method, req.url ?? '/', body))

    if (method !== 'PUT') return run('') // the body is never read; Node drops what the client still sends

    const chunks: Buffer[] = []
    let size = 0
    let refused = false
    req.on('data', (chunk) => {
      if (refused) return
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        refused = true
        chunks.length = 0 // nothing over the limit is kept
        reply(tooLarge, { connection: 'close' })
        return
      }
      chunks.push(Buffer.from(chunk))
    })
    req.on('end', () => {
      if (!refused) run(Buffer.concat(chunks).toString('utf8'))
    })
  }
}

// Reads the feed (a file if QUAKEWATCH_FEED_FILE is set, else the USGS URL) into the store.
// A failure is logged in one line and never stops the server.
export async function refresh(store: Store, feedFile?: string): Promise<void> {
  try {
    const { quakes, skipped } = feedFile
      ? parseFeed(JSON.parse(readFileSync(feedFile, 'utf8')))
      : await fetchQuakes()
    store.upsertEvents(quakes)
    console.log(`feed: ${quakes.length} events stored, ${skipped} skipped`)
  } catch (err) {
    console.error(`feed: refresh failed: ${err instanceof Error ? err.message : err}`)
  }
}

export interface Running {
  server: Server
  /** Stops the listener, clears the refresh timer and closes the store. Safe to call twice. */
  close(): Promise<void>
}

// Refreshes now, then every `refreshSeconds`, and serves on `port` (0 = any free port).
export async function start(
  store: Store,
  options: {
    port: number
    host?: string
    feedFile?: string
    refreshSeconds: number
    /** Makes the HTTP server; tests pass a stand-in where the sandbox lets no one listen. */
    makeServer?: (listener: ReturnType<typeof handler>) => Server
  },
): Promise<Running> {
  await refresh(store, options.feedFile)
  const timer = setInterval(() => void refresh(store, options.feedFile), options.refreshSeconds * 1000)
  const server = (options.makeServer ?? createServer)(handler(store))
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(options.port, options.host, resolve)
    })
  } catch (err) {
    clearInterval(timer)
    throw err
  }
  let closed: Promise<void> | undefined
  const close = () =>
    (closed ??= new Promise<void>((resolve) => {
      clearInterval(timer)
      server.close(() => {
        store.close()
        resolve()
      })
      server.closeAllConnections()
    }))
  return { server, close }
}

async function main(): Promise<void> {
  const store = openStore(process.env.QUAKEWATCH_DB ?? './quakewatch.db')
  const port = Number(process.env.PORT ?? 8080)
  const running = await start(store, {
    port,
    feedFile: process.env.QUAKEWATCH_FEED_FILE,
    refreshSeconds: Number(process.env.QUAKEWATCH_REFRESH_SECONDS ?? 300),
  })
  console.log(`QuakeWatch listening on http://localhost:${port}`)
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => void running.close().then(() => process.exit(0)))
  }
}

// Settings (all optional):
//   PORT                         default 8080
//   QUAKEWATCH_DB                default ./quakewatch.db
//   QUAKEWATCH_FEED_FILE         read this GeoJSON file instead of the USGS feed
//   QUAKEWATCH_REFRESH_SECONDS   default 300
if (process.argv[1] === import.meta.filename) await main()
