// A contract test for the real server: every response, success or error, is checked against its schema in
// docs/api/openapi.yaml (with the `ajv` JSON Schema validator). The handler is driven with fake request and
// response objects, so no port is opened.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Readable } from 'node:stream'
import Ajv2020 from 'ajv/dist/2020.js'
import { parse } from 'yaml'
import { DEFAULT_THRESHOLD, handler, refresh } from '../src/server.ts'
import { openStore, type Store } from '../src/store/index.ts'

const spec = parse(readFileSync(new URL('../docs/api/openapi.yaml', import.meta.url), 'utf8'))
const fixture = new URL('./fixtures/usgs/recorded-2026-10-22.geojson', import.meta.url).pathname

// The whole contract is one schema document; a response schema is a JSON pointer into it.
const ajv = new Ajv2020.default({ strict: false, validateFormats: false })
ajv.addSchema(spec, 'openapi')

const escape = (s: string) => s.replaceAll('~', '~0').replaceAll('/', '~1')

// The response the contract declares for `status` of this operation (a `$ref`ed response is followed), with its
// pointer. A status the operation does not declare fails here: the server may answer nothing the contract omits.
function declared(path: string, method: string, status: number): { pointer: string; response: any } {
  let pointer = `/paths/${escape(path)}/${method.toLowerCase()}/responses/${status}`
  let response = spec.paths[path][method.toLowerCase()].responses[status]
  assert.ok(response, `the contract does not declare ${status} for ${method} ${path}`)
  if (response.$ref) {
    pointer = response.$ref.slice(1)
    response = pointer.split('/').slice(1).reduce((node: any, key: string) => node[key], spec)
  }
  return { pointer, response }
}

// The `error` codes a declared response shows as examples: the server may answer only codes the contract shows.
const exampleCodes = (response: any): string[] =>
  Object.values<any>(response.content['application/json'].examples ?? { one: { value: response.content['application/json'].example } })
    .map((example) => example.value.error)

// Calls the real handler and checks the reply against the contract before returning it.
async function call(store: Store, method: string, url: string, body?: unknown) {
  const req = Readable.from(body === undefined ? [] : [typeof body === 'string' ? body : JSON.stringify(body)])
  return callRaw(store, method, url, req)
}

// The same, with a request stream of the caller's making (many chunks, or one that never ends).
async function callRaw(store: Store, method: string, url: string, stream: Readable) {
  const req: any = stream
  req.method = method
  req.url = url
  const sent = await new Promise<{ status: number; headers: any; body: any }>((resolve) => {
    const res: any = {
      writeHead(status: number, headers: any) { res.status = status; res.headers = headers; return res },
      end(text: string) { resolve({ status: res.status, headers: res.headers, body: JSON.parse(text) }) },
    }
    handler(store)(req, res)
  })
  assert.equal(sent.headers['content-type'], 'application/json')

  const path = Object.keys(spec.paths).find((p) => new RegExp('^' + p.replace(/\{[^}]+\}/g, '[^/]+') + '$').test(url.split('?')[0]))
  // An unknown path (or a method the contract lacks) is in no operation: the contract explains its 404 in
  // info.description, and it answers with the shared error schema.
  const known = path !== undefined && spec.paths[path][method.toLowerCase()] !== undefined
  let pointer = '/components/schemas/Error'
  if (known) {
    const { pointer: at, response } = declared(path, method, sent.status)
    assert.ok(exampleCodes(response).includes(sent.body.error),
      `${method} ${url} -> ${sent.status} ${sent.body.error}: the contract shows no such code (it shows ${exampleCodes(response)})`)
    pointer = `${at}/content/application~1json/schema`
  } else {
    // An oversized PUT is refused before its path is looked at, so it answers body_too_large on any path.
    const code = sent.status === 404 ? 'not_found'
      : sent.status === 400 ? (method === 'PUT' && sent.body.error === 'body_too_large' ? 'body_too_large' : 'bad_request')
      : undefined
    assert.equal(sent.body.error, code, `${method} ${url} is in no operation, so it can only answer 404 not_found, 400 bad_request, or 400 body_too_large for an oversized PUT`)
    assert.ok(spec.info.description.includes(`\`${sent.status}\``) && spec.info.description.includes(`\`${code}\``),
      `info.description does not explain the ${sent.status} ${code} answer`)
  }
  const validate = ajv.compile({ $ref: `openapi#${pointer}` })
  assert.ok(validate(sent.body), `${method} ${url} -> ${sent.status} breaks the contract: ${ajv.errorsText(validate.errors)}`)
  return sent
}

// A store holding the recorded fixture, plus two events of our own: one in Japan, and one in the part of
// Japan's box that southeast-asia's box also covers (so it is in two regions).
async function seededStore(): Promise<Store> {
  const store = openStore(':memory:')
  await refresh(store, fixture)
  store.upsertEvents([
    { id: 'jp1', time: '2026-10-21T10:00:00Z', magnitude: 6.1, depthKm: 30, lat: 35, lon: 139, place: 'near Tokyo' },
    { id: 'both1', time: '2026-10-21T11:00:00Z', magnitude: 5.5, depthKm: 10, lat: 26, lon: 130, place: 'Ryukyu Islands' },
  ])
  return store
}

test('GET /healthz says ok', async () => {
  const { status, body } = await call(await seededStore(), 'GET', '/healthz')
  assert.equal(status, 200)
  assert.deepEqual(body, { status: 'ok' })
})

test('GET /healthz answers 500 with the contract error when the store cannot be read', async () => {
  const broken: Store = { ...openStore(':memory:'), countEvents() { throw new Error('disk gone') } }
  const { status, body } = await call(broken, 'GET', '/healthz')
  assert.equal(status, 500)
  assert.equal(body.error, 'unavailable')
})

test('GET /api/v1/events with a region lists its events, newest first', async () => {
  const { status, body } = await call(await seededStore(), 'GET', '/api/v1/events?region=japan')
  assert.equal(status, 200)
  assert.deepEqual(body.events.map((e: any) => e.id), ['both1', 'jp1'])
})

test('GET /api/v1/events without a region lists all regions, newest first, each event once', async () => {
  const { body } = await call(await seededStore(), 'GET', '/api/v1/events')
  // both1 lies in japan and in southeast-asia, and is listed once.
  assert.deepEqual(body.events.map((e: any) => e.id), ['nc75453191', 'both1', 'jp1'])
})

test('GET /api/v1/events with since leaves out older events', async () => {
  const { body } = await call(await seededStore(), 'GET', '/api/v1/events?since=2026-10-21T10:30:00Z')
  assert.deepEqual(body.events.map((e: any) => e.id), ['nc75453191', 'both1'])
})

test('a region with no events answers an empty list', async () => {
  const { status, body } = await call(await seededStore(), 'GET', '/api/v1/events?region=mediterranean')
  assert.equal(status, 200)
  assert.deepEqual(body, { events: [] })
})

test('GET /api/v1/thresholds/{region} answers the default until one is set', async () => {
  const { status, body } = await call(await seededStore(), 'GET', '/api/v1/thresholds/japan')
  assert.equal(status, 200)
  assert.deepEqual(body, { region: 'japan', ...DEFAULT_THRESHOLD })
})

test('PUT /api/v1/thresholds/{region} stores the threshold and GET reads it back', async () => {
  const store = await seededStore()
  const put = await call(store, 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 6, maxDepthKm: 40 })
  assert.equal(put.status, 200)
  assert.deepEqual(put.body, { region: 'japan', minMagnitude: 6, maxDepthKm: 40 })
  const got = await call(store, 'GET', '/api/v1/thresholds/japan')
  assert.deepEqual(got.body, put.body)
})

test('GET /api/v1/alerts lists events that cross the default threshold', async () => {
  const { status, body } = await call(await seededStore(), 'GET', '/api/v1/alerts?region=japan')
  assert.equal(status, 200)
  assert.deepEqual(body.alerts.map((a: any) => [a.region, a.quake.id]), [['japan', 'both1'], ['japan', 'jp1']])
})

test('changing a threshold changes the alert list', async () => {
  const store = await seededStore()
  const ids = async () => (await call(store, 'GET', '/api/v1/alerts?region=japan')).body.alerts.map((a: any) => a.quake.id)
  assert.deepEqual(await ids(), ['both1', 'jp1'])
  await call(store, 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 6, maxDepthKm: 70 }) // stronger only
  assert.deepEqual(await ids(), ['jp1'])
  await call(store, 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 5, maxDepthKm: 20 }) // shallower only
  assert.deepEqual(await ids(), ['both1'])
})

test('the recorded fixture raises an alert in western-north-america once its threshold is low enough', async () => {
  const store = await seededStore()
  assert.deepEqual((await call(store, 'GET', '/api/v1/alerts?region=western-north-america')).body, { alerts: [] })
  await call(store, 'PUT', '/api/v1/thresholds/western-north-america', { minMagnitude: 1.5, maxDepthKm: 20 })
  const { body } = await call(store, 'GET', '/api/v1/alerts?region=western-north-america')
  assert.deepEqual(body.alerts.map((a: any) => a.quake.id), ['nc75453191'])
})

// ---- 400 and 404: every one answers the contract's shared error schema ----

// [name, method, url, body, the exact error code]
const badRequests: [string, string, string, unknown, string][] = [
  ['unknown region on events', 'GET', '/api/v1/events?region=atlantis', undefined, 'unknown_region'],
  ['empty region on events', 'GET', '/api/v1/events?region=', undefined, 'unknown_region'],
  ['unknown region on alerts', 'GET', '/api/v1/alerts?region=atlantis', undefined, 'unknown_region'],
  ['no region on alerts', 'GET', '/api/v1/alerts', undefined, 'unknown_region'],
  ['unknown region on GET threshold', 'GET', '/api/v1/thresholds/atlantis', undefined, 'unknown_region'],
  ['malformed percent escape on GET threshold', 'GET', '/api/v1/thresholds/%', undefined, 'unknown_region'],
  ['malformed percent escape on PUT threshold', 'PUT', '/api/v1/thresholds/%E0%A4%A', { minMagnitude: 5, maxDepthKm: 70 }, 'unknown_region'],
  ['unknown region on PUT threshold', 'PUT', '/api/v1/thresholds/atlantis', { minMagnitude: 5, maxDepthKm: 70 }, 'unknown_region'],
  ['bad since', 'GET', '/api/v1/events?since=yesterday', undefined, 'bad_since'],
  ['bad since with a valid region', 'GET', '/api/v1/events?region=japan&since=yesterday', undefined, 'bad_since'],
  ['impossible since', 'GET', '/api/v1/events?since=2026-02-30T00:00:00Z', undefined, 'bad_since'],
  ['since with another offset', 'GET', '/api/v1/events?since=2026-10-20T00:00:00%2B02:00', undefined, 'bad_since'],
  ['PUT body is not JSON', 'PUT', '/api/v1/thresholds/japan', '{not json', 'bad_threshold'],
  ['PUT body is not an object', 'PUT', '/api/v1/thresholds/japan', '[1, 2]', 'bad_threshold'],
  ['PUT without minMagnitude', 'PUT', '/api/v1/thresholds/japan', { maxDepthKm: 70 }, 'bad_threshold'],
  ['PUT without maxDepthKm', 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 5 }, 'bad_threshold'],
  ['PUT with a string minMagnitude', 'PUT', '/api/v1/thresholds/japan', { minMagnitude: '5', maxDepthKm: 70 }, 'bad_threshold'],
  ['PUT with a string maxDepthKm', 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 5, maxDepthKm: '70' }, 'bad_threshold'],
  ['PUT with a negative depth', 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 5, maxDepthKm: -1 }, 'bad_threshold'],
  ['PUT with an empty body', 'PUT', '/api/v1/thresholds/japan', '', 'bad_threshold'],
  ['an unreadable request path', 'GET', '//', undefined, 'bad_request'],
  ['PUT body of 17 KiB','PUT', '/api/v1/thresholds/japan', ' '.repeat(17 * 1024) + '{"minMagnitude":5,"maxDepthKm":70}', 'body_too_large'],
  ['PUT body of 17 KiB on a path in no operation', 'PUT', '/api/v1/nothing', ' '.repeat(17 * 1024), 'body_too_large'],
]

for (const [name, method, url, body, code] of badRequests) {
  test(`400: ${name}`, async () => {
    const store = await seededStore()
    const { status, body: error } = await call(store, method, url, body)
    assert.equal(status, 400)
    assert.equal(error.error, code)
    // a refused PUT changes nothing
    if (method === 'PUT') assert.equal(store.getThreshold('japan'), undefined)
  })
}

test('400: an oversized PUT sent in many small chunks is refused, and the next request is answered', async () => {
  const store = await seededStore()
  const chunks = Array.from({ length: 40 }, () => 'x'.repeat(1024))
  const { status, body } = await callRaw(store, 'PUT', '/api/v1/thresholds/japan', Readable.from(chunks))
  assert.equal(status, 400)
  assert.equal(body.error, 'body_too_large')
  assert.equal((await call(store, 'GET', '/healthz')).status, 200)
})

test('a body of exactly 16 KiB is read (the limit is on what is over it)', async () => {
  const store = await seededStore()
  const json = '{"minMagnitude":6,"maxDepthKm":40}'
  const { status } = await call(store, 'PUT', '/api/v1/thresholds/japan', json + ' '.repeat(16 * 1024 - json.length))
  assert.equal(status, 200)
})

test('a GET does not read its body: a huge one is never consumed', async () => {
  const store = await seededStore()
  let pulled = 0
  const huge = new Readable({ read() { pulled++; this.push(pulled > 5000 ? null : 'x'.repeat(1024)) } }) // 5000 KiB
  const { status } = await callRaw(store, 'GET', '/healthz', huge)
  assert.equal(status, 200)
  assert.ok(pulled < 100, `the handler pulled ${pulled} KiB of a body it does not need`)
  huge.destroy()
})

test('500: a store that fails on listEvents answers unavailable, not bad_since', async () => {
  const broken: Store = { ...openStore(':memory:'), listEvents() { throw new Error('database unavailable') } }
  const { status, body } = await call(broken, 'GET', '/api/v1/events?region=japan')
  assert.equal(status, 500)
  assert.equal(body.error, 'unavailable')
})

test('500: a store that fails on getThreshold or setThreshold answers unavailable', async () => {
  const broken: Store = {
    ...openStore(':memory:'),
    getThreshold() { throw new Error('database unavailable') },
    setThreshold() { throw new Error('database unavailable') },
  }
  assert.equal((await call(broken, 'GET', '/api/v1/thresholds/japan')).body.error, 'unavailable')
  assert.equal((await call(broken, 'PUT', '/api/v1/thresholds/japan', { minMagnitude: 5, maxDepthKm: 70 })).status, 500)
  assert.equal((await call(broken, 'GET', '/api/v1/alerts?region=japan')).status, 500)
})

test('the 400 codes are the ones the contract shows', async () => {
  const store = await seededStore()
  assert.equal((await call(store, 'GET', '/api/v1/events?region=atlantis')).body.error, 'unknown_region')
  assert.equal((await call(store, 'GET', '/api/v1/events?since=yesterday')).body.error, 'bad_since')
})

test('404: an unknown path, and a known path with a method the contract does not have', async () => {
  const store = await seededStore()
  for (const [method, url] of [['GET', '/nope'], ['GET', '/api/v1/quakes'], ['DELETE', '/api/v1/events'], ['POST', '/healthz']]) {
    const { status, body } = await call(store, method, url)
    assert.equal(status, 404, `${method} ${url}`)
    assert.equal(body.error, 'not_found')
  }
})

test('refresh: a missing feed file is logged and does not throw', async () => {
  const store = openStore(':memory:')
  await refresh(store, '/no/such/file.geojson')
  assert.equal(store.countEvents(), 0)
})

test('refresh: the same feed twice stores each event once', async () => {
  const store = openStore(':memory:')
  await refresh(store, fixture)
  await refresh(store, fixture)
  assert.equal(store.countEvents(), 3)
})
