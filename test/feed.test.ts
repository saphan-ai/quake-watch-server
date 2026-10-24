import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fetchQuakes, parseFeed } from '../src/feed/usgs.ts'

const fixture = (name: string) => readFileSync(new URL(`./fixtures/usgs/${name}.geojson`, import.meta.url), 'utf8')

// A fake fetch that answers with the given responses in order, and counts the calls.
function fakeFetch(...answers: Array<{ status: number; body?: string }>) {
  const calls = { count: 0 }
  const fake = (async () => {
    const answer = answers[Math.min(calls.count, answers.length - 1)]
    calls.count++
    return new Response(answer.body ?? '', { status: answer.status })
  }) as typeof fetch
  return { fake, calls }
}

const noSleep = async () => {}

test('a normal feed becomes quakes in the contract shape', async () => {
  const { fake } = fakeFetch({ status: 200, body: fixture('normal') })
  const { quakes, skipped } = await fetchQuakes({ fetch: fake, sleep: noSleep })
  assert.equal(skipped, 0)
  assert.equal(quakes.length, 3)
  assert.deepEqual(quakes[0], {
    id: 'us7000abcd',
    time: '2025-10-21T23:40:00.000Z',
    magnitude: 5.2,
    depthKm: 10,
    lat: -6.7,
    lon: 106.5,
    place: '45 km SSW of Jakarta, Indonesia',
  })
})

test('an empty feed gives no quakes', async () => {
  const { fake } = fakeFetch({ status: 200, body: fixture('empty') })
  assert.deepEqual(await fetchQuakes({ fetch: fake, sleep: noSleep }), { quakes: [], skipped: 0 })
})

test('a malformed feature is skipped and counted, the rest are kept', async () => {
  const { fake } = fakeFetch({ status: 200, body: fixture('malformed') })
  const { quakes, skipped } = await fetchQuakes({ fetch: fake, sleep: noSleep })
  assert.equal(skipped, 2) // a null magnitude, and coordinates that are a number
  assert.deepEqual(quakes.map((q) => q.id), ['us7000abcd', 'us7000abce'])
})

test('each kind of malformed feature is skipped', () => {
  const good = JSON.parse(fixture('normal')).features[0]
  const broken = [
    { ...good, id: undefined },
    { ...good, properties: { ...good.properties, time: 'yesterday' } },
    { ...good, properties: { ...good.properties, place: 7 } },
    { ...good, geometry: { type: 'Point', coordinates: [1, 2] } },
    { ...good, geometry: null },
    { ...good, geometry: { type: 'Point' } },
    { ...good, geometry: { type: 'Point', coordinates: 7 } },
    { ...good, geometry: { type: 'Point', coordinates: 'abc' } },
    { ...good, geometry: { type: 'Point', coordinates: { 0: 1, 1: 2, 2: 3 } } },
    { ...good, geometry: { type: 'Point', coordinates: [1, 2, '3'] } },
    { ...good, geometry: { type: 'Point', coordinates: [1, null, 3] } },
    null,
  ]
  const { quakes, skipped } = parseFeed({ features: [good, ...broken] })
  assert.equal(quakes.length, 1)
  assert.equal(skipped, broken.length)
})

test('a duplicate id keeps the first quake, even when the later one differs', async () => {
  const { fake } = fakeFetch({ status: 200, body: fixture('duplicate') })
  const { quakes, skipped } = await fetchQuakes({ fetch: fake, sleep: noSleep })
  assert.deepEqual(quakes.map((q) => q.id), ['us7000abcd', 'us7000abce'])
  assert.equal(quakes[0].magnitude, 5.2) // the later duplicate says 6.9
  assert.equal(skipped, 0)
})

test('a recorded USGS response (2026-10-22) reads into quakes', async () => {
  const { fake } = fakeFetch({ status: 200, body: fixture('recorded-2026-10-22') })
  const { quakes, skipped } = await fetchQuakes({ fetch: fake, sleep: noSleep })
  assert.equal(skipped, 0)
  assert.equal(quakes.length, 3)
  assert.deepEqual(quakes[0], {
    id: 'aka2026uxeadu',
    time: '2026-10-22T01:49:28.640Z',
    magnitude: 1.8,
    depthKm: 95.4,
    lat: 61.053,
    lon: -151.958,
    place: '44 km W of Tyonek, Alaska',
  })
})

test('HTTP 429 is retried, then the feed is read', async () => {
  const { fake, calls } = fakeFetch({ status: 429 }, { status: 200, body: fixture('normal') })
  const waits: number[] = []
  const { quakes } = await fetchQuakes({ fetch: fake, sleep: async (ms) => { waits.push(ms) } })
  assert.equal(quakes.length, 3)
  assert.equal(calls.count, 2)
  assert.deepEqual(waits, [1000])
})

test('HTTP 503 three times ends in one clear error', async () => {
  const { fake, calls } = fakeFetch({ status: 503 })
  await assert.rejects(
    fetchQuakes({ fetch: fake, sleep: noSleep }),
    { message: 'USGS feed failed: HTTP 503 after 3 tries' },
  )
  assert.equal(calls.count, 3)
})

test('HTTP 404 is not retried', async () => {
  const { fake, calls } = fakeFetch({ status: 404 })
  await assert.rejects(fetchQuakes({ fetch: fake, sleep: noSleep }), { message: 'USGS feed failed: HTTP 404 after 1 try' })
  assert.equal(calls.count, 1)
})

test('a body that is not a feed is one clear error', async () => {
  const { fake } = fakeFetch({ status: 200, body: '{"hello":1}' })
  await assert.rejects(fetchQuakes({ fetch: fake, sleep: noSleep }), { message: 'USGS feed is not a GeoJSON feature collection' })
})

// The one test that talks to the real USGS. Run it with: QUAKEWATCH_LIVE=1 npm test
test('live: the real USGS feed reads into quakes', { skip: process.env.QUAKEWATCH_LIVE !== '1' }, async () => {
  const { quakes, skipped } = await fetchQuakes()
  assert.ok(quakes.length > 0)
  assert.ok(skipped < quakes.length)
  for (const q of quakes) {
    assert.equal(typeof q.id, 'string')
    assert.ok(!Number.isNaN(Date.parse(q.time)))
    assert.equal(typeof q.magnitude, 'number')
  }
})
