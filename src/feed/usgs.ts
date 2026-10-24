import type { Quake } from '../quake.ts'

export const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

const MAX_TRIES = 3

export interface FeedOptions {
  url?: string
  fetch?: typeof fetch // injected in tests
  sleep?: (ms: number) => Promise<void> // injected in tests, so they do not wait
}

export interface FeedResult {
  quakes: Quake[]
  skipped: number // features that were malformed and left out
}

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// Reads the USGS feed. Retries HTTP 429 and 5xx up to 3 tries, then throws one clear error.
export async function fetchQuakes(options: FeedOptions = {}): Promise<FeedResult> {
  const url = options.url ?? USGS_URL
  const doFetch = options.fetch ?? fetch
  const sleep = options.sleep ?? realSleep

  for (let attempt = 1; ; attempt++) {
    const res = await doFetch(url)
    if (res.ok) return parseFeed(await res.json())
    const retryable = res.status === 429 || res.status >= 500
    if (!retryable || attempt === MAX_TRIES) {
      throw new Error(`USGS feed failed: HTTP ${res.status} after ${attempt} ${attempt === 1 ? 'try' : 'tries'}`)
    }
    await sleep(1000 * 2 ** (attempt - 1)) // 1s, then 2s
  }
}

// Turns the GeoJSON body into quakes.
// A malformed feature is skipped and counted; a duplicate id keeps the first one.
export function parseFeed(body: any): FeedResult {
  if (!Array.isArray(body?.features)) throw new Error('USGS feed is not a GeoJSON feature collection')
  const byId = new Map<string, Quake>()
  let skipped = 0
  for (const feature of body.features) {
    const quake = toQuake(feature)
    if (!quake) skipped++
    else if (!byId.has(quake.id)) byId.set(quake.id, quake)
  }
  return { quakes: [...byId.values()], skipped }
}

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

// Returns undefined when a field is missing or has the wrong type.
function toQuake(feature: any): Quake | undefined {
  const coordinates = feature?.geometry?.coordinates
  if (!Array.isArray(coordinates)) return undefined
  const [lon, lat, depthKm] = coordinates
  const { time, mag, place } = feature?.properties ?? {}
  if (typeof feature?.id !== 'string' || typeof place !== 'string') return undefined
  if (![time, mag, lon, lat, depthKm].every(isNumber)) return undefined
  if (Number.isNaN(new Date(time).getTime())) return undefined // a number too big to be a date
  return { id: feature.id, time: new Date(time).toISOString(), magnitude: mag, depthKm, lat, lon, place }
}
