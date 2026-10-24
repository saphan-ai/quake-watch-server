import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Quake } from '../src/quake.ts'
import { migrations } from '../src/store/migrations.ts'
import { openStore, regions } from '../src/store/index.ts'

const ternate: Quake = {
  id: 'us7000abcd', time: '2026-10-21T03:14:07Z', magnitude: 5.4, depthKm: 35.2,
  lat: 1.23, lon: 126.4, place: '90 km NNW of Ternate, Indonesia',
}
const tokyo: Quake = {
  id: 'us7000tokyo', time: '2026-10-21T05:00:00Z', magnitude: 6.1, depthKm: 10,
  lat: 35.6, lon: 139.7, place: 'near Tokyo, Japan',
}
const lima: Quake = {
  id: 'us7000lima', time: '2026-10-19T12:00:00Z', magnitude: 4.8, depthKm: 80,
  lat: -12, lon: -77, place: 'near Lima, Peru',
}

test('a new empty file is migrated, and the migrations it ran are recorded', () => {
  const dir = mkdtempSync(join(tmpdir(), 'quakewatch-'))
  try {
    const path = join(dir, 'quakes.db')
    openStore(path).close()
    openStore(path).close() // opening again runs nothing new

    const db = new DatabaseSync(path)
    const ran = db.prepare('SELECT version FROM migrations ORDER BY version').all().map((r) => r.version)
    assert.deepEqual(ran, migrations.map((m) => m.version))
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((r) => r.name)
    assert.ok(tables.includes('events') && tables.includes('thresholds'))
    db.close()
  } finally {
    rmSync(dir, { recursive: true })
  }
})

test('the same feed ingested twice gives the same row count', () => {
  const store = openStore(':memory:')
  store.upsertEvents([ternate, tokyo])
  assert.equal(store.countEvents(), 2)
  store.upsertEvents([ternate, tokyo])
  assert.equal(store.countEvents(), 2)
})

test('an event whose fields changed under the same id is updated, not duplicated', () => {
  const store = openStore(':memory:')
  store.upsertEvents([ternate])
  store.upsertEvents([{ ...ternate, magnitude: 5.9, place: 'revised place' }])
  assert.equal(store.countEvents(), 1)
  const [row] = store.listEvents('southeast-asia')
  assert.equal(row.magnitude, 5.9)
  assert.equal(row.place, 'revised place')
})

test('a threshold written is read back, and a second write replaces it', () => {
  const store = openStore(':memory:')
  assert.equal(store.getThreshold('japan'), undefined)
  store.setThreshold('japan', { minMagnitude: 5, maxDepthKm: 70 })
  assert.deepEqual(store.getThreshold('japan'), { region: 'japan', minMagnitude: 5, maxDepthKm: 70 })
  store.setThreshold('japan', { minMagnitude: 6.5, maxDepthKm: 30 })
  assert.deepEqual(store.getThreshold('japan'), { region: 'japan', minMagnitude: 6.5, maxDepthKm: 30 })
  assert.equal(store.getThreshold('mediterranean'), undefined) // other regions are untouched
})

test('a threshold survives closing and reopening the file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'quakewatch-'))
  try {
    const path = join(dir, 'quakes.db')
    const first = openStore(path)
    first.setThreshold('south-america', { minMagnitude: 4.5, maxDepthKm: 100 })
    first.close()
    const second = openStore(path)
    assert.deepEqual(second.getThreshold('south-america'), { region: 'south-america', minMagnitude: 4.5, maxDepthKm: 100 })
    second.close()
  } finally {
    rmSync(dir, { recursive: true })
  }
})

test('listEvents returns only events inside the region box', () => {
  const store = openStore(':memory:')
  store.upsertEvents([ternate, tokyo, lima])
  assert.deepEqual(store.listEvents('southeast-asia').map((q) => q.id), ['us7000abcd'])
  assert.deepEqual(store.listEvents('japan').map((q) => q.id), ['us7000tokyo'])
  assert.deepEqual(store.listEvents('south-america').map((q) => q.id), ['us7000lima'])
  assert.deepEqual(store.listEvents('mediterranean'), [])
})

test('a box edge counts as inside', () => {
  const store = openStore(':memory:')
  store.upsertEvents([{ ...ternate, id: 'corner', lat: -11, lon: 141 }, { ...ternate, id: 'outside', lat: -11.01, lon: 141 }])
  assert.deepEqual(store.listEvents('southeast-asia').map((q) => q.id), ['corner'])
})

test('listEvents returns only events at or after since, newest first', () => {
  const store = openStore(':memory:')
  const older = { ...ternate, id: 'older', time: '2026-10-20T00:00:00Z' }
  store.upsertEvents([ternate, older])
  assert.deepEqual(store.listEvents('southeast-asia').map((q) => q.id), ['us7000abcd', 'older'])
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-20T00:00:00Z').map((q) => q.id), ['us7000abcd', 'older'])
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-20T00:00:01Z').map((q) => q.id), ['us7000abcd'])
})

test('listEvents gives back exactly the Quake that went in', () => {
  const store = openStore(':memory:')
  store.upsertEvents([ternate])
  assert.deepEqual(store.listEvents('southeast-asia'), [ternate])
})

test('omitting since returns every event, including one before 1970', () => {
  const store = openStore(':memory:')
  store.upsertEvents([{ ...ternate, id: 'ancient', time: '1969-12-31T23:59:59Z', lat: 0, lon: 100 }])
  assert.equal(store.countEvents(), 1)
  assert.deepEqual(store.listEvents('southeast-asia').map((q) => q.id), ['ancient'])
})

test('a time finer than a millisecond is refused, in an event and in since, and never rounded', () => {
  const store = openStore(':memory:')
  const fine = '2026-10-21T03:14:07.0001Z'
  assert.throws(() => store.upsertEvents([{ ...ternate, time: fine }]), (err: Error) => err.message.includes(fine))
  assert.equal(store.countEvents(), 0)
  store.upsertEvents([ternate])
  const fineSince = '2026-10-21T03:14:07.0002Z'
  assert.throws(() => store.listEvents('southeast-asia', fineSince), (err: Error) => err.message.includes(fineSince))
})

test('a time that is not an RFC 3339 UTC time is refused with its value in the message', () => {
  const store = openStore(':memory:')
  for (const bad of ['yesterday', '2026-13-45T00:00:00Z', '2026-10-21T03:14:07+02:00']) {
    assert.throws(() => store.listEvents('japan', bad), (err: Error) => err.message.includes(bad))
  }
})

test('a zero UTC offset (+00:00, -00:00) is accepted in an event and in since, and comes back as Z', () => {
  const store = openStore(':memory:')
  store.upsertEvents([
    { ...ternate, id: 'plus', time: '2026-10-21T03:14:07+00:00' },
    { ...ternate, id: 'minus', time: '2026-10-21T03:14:08.5-00:00' },
  ])
  assert.deepEqual(
    store.listEvents('southeast-asia').map((q) => [q.id, q.time]),
    [['minus', '2026-10-21T03:14:08.500Z'], ['plus', '2026-10-21T03:14:07Z']],
  )
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-21T03:14:07+00:00').map((q) => q.id), ['minus', 'plus'])
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-21T03:14:08-00:00').map((q) => q.id), ['minus'])
})

test('a non-UTC offset is refused with its value, in an event and in since', () => {
  const store = openStore(':memory:')
  const bad = '2026-10-21T05:14:07+02:00'
  assert.throws(() => store.upsertEvents([{ ...ternate, time: bad }]), (err: Error) => err.message.includes(bad))
  assert.throws(() => store.listEvents('japan', bad), (err: Error) => err.message.includes(bad))
  assert.equal(store.countEvents(), 0)
})

test('an impossible calendar day or time is refused with its value, never moved to another day', () => {
  const store = openStore(':memory:')
  for (const bad of [
    '2026-02-30T00:00:00Z',
    '2026-13-01T00:00:00Z',
    '2026-04-31T00:00:00Z',
    '2026-10-21T24:00:00Z',
    '2026-10-21T23:60:00Z',
    '2026-10-21T23:59:60Z',
    '2025-02-29T00:00:00+00:00',
  ]) {
    assert.throws(() => store.upsertEvents([{ ...ternate, time: bad }]), (err: Error) => err.message.includes(bad), bad)
    assert.throws(() => store.listEvents('japan', bad), (err: Error) => err.message.includes(bad), bad)
  }
  assert.equal(store.countEvents(), 0)
  store.upsertEvents([{ ...ternate, id: 'leap', time: '2028-02-29T00:00:00Z' }])
  assert.equal(store.countEvents(), 1)
})

test('a millisecond boundary: since equal to the time includes it, one millisecond later excludes it, and the time comes back exact', () => {
  const store = openStore(':memory:')
  const ms = { ...ternate, id: 'ms', time: '2026-10-21T03:14:07.123Z' }
  store.upsertEvents([ms])
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-21T03:14:07.123Z'), [ms])
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-21T03:14:07.124Z'), [])
  assert.deepEqual(store.listEvents('southeast-asia', '2026-10-21T03:14:07.122Z'), [ms])
})

test('the lowest longitude and the lowest latitude of a box count as inside, one step beyond does not', () => {
  const store = openStore(':memory:')
  store.upsertEvents([
    { ...ternate, id: 'lon-edge', lat: 0, lon: 92 },
    { ...ternate, id: 'lon-out', lat: 0, lon: 91.99 },
    { ...ternate, id: 'lat-edge', lat: -11, lon: 100 },
    { ...ternate, id: 'lat-out', lat: -11.01, lon: 100 },
  ])
  assert.deepEqual(store.listEvents('southeast-asia').map((q) => q.id).sort(), ['lat-edge', 'lon-edge'])
})

test('the region boxes in code equal the table in the contract', () => {
  const yaml = readFileSync(new URL('../docs/api/openapi.yaml', import.meta.url), 'utf8')
  const fromContract: Record<string, unknown> = {}
  for (const m of yaml.matchAll(/^\s*\| `([a-z-]+)` \| (-?\d+) to (-?\d+) \| (-?\d+) to (-?\d+) \|$/gm)) {
    fromContract[m[1]] = { minLat: Number(m[2]), maxLat: Number(m[3]), minLon: Number(m[4]), maxLon: Number(m[5]) }
  }
  assert.equal(Object.keys(fromContract).length, Object.keys(regions).length)
  assert.deepEqual(fromContract, regions)
})
