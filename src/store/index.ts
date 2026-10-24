import { DatabaseSync } from 'node:sqlite'
import type { Quake } from '../quake.ts'
import { migrate } from './migrations.ts'
import { regions, type Region } from './regions.ts'

export { isRegion, regions, type Region } from './regions.ts'

// What `PUT /api/v1/thresholds/{region}` takes, and what is stored (`ThresholdInput` in the contract).
export interface ThresholdInput {
  minMagnitude: number
  maxDepthKm: number
}

export interface Threshold extends ThresholdInput {
  region: Region
}

export interface Store {
  /** Insert new events and update known ones, keyed on the USGS id. Safe to call with the same feed twice. */
  upsertEvents(quakes: Quake[]): void
  /** Events inside the region's box, at or after `since`, newest first. Omit `since` for all. Times: see `toStoredTime`. */
  listEvents(region: Region, since?: string): Quake[]
  /** The region's threshold, or undefined if none was ever set. */
  getThreshold(region: Region): Threshold | undefined
  setThreshold(region: Region, input: ThresholdInput): Threshold
  /** Row count, for tests and the health check. */
  countEvents(): number
  close(): void
}

// The store takes RFC 3339 times whose offset is UTC ("Z", "+00:00" or "-00:00") with at most millisecond precision,
// which is what the USGS feed gives. Any other offset is refused (no time zone conversion here), and so is a time that
// does not exist (2026-02-30, 24:00:00): it is refused, never rounded and never moved to another day.
// Times are kept as "Z" with exactly three decimals so they sort as text.
export function toStoredTime(value: string): string {
  const m = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,3}))?(?:Z|[+-]00:00)$/.exec(value)
  const normalized = m ? `${m[1]}.${(m[2] ?? '').padEnd(3, '0')}Z` : ''
  const ms = Date.parse(normalized)
  // Date.parse rolls 02-30 over to 03-02; reading the date back and comparing it catches that.
  if (Number.isNaN(ms) || new Date(ms).toISOString() !== normalized) {
    throw new Error(
      `invalid time "${value}": expected an RFC 3339 time that exists, with a UTC offset (Z or +00:00) and at most millisecond precision, like 2026-10-21T03:14:07Z`,
    )
  }
  return normalized
}

// Opens (and creates, if missing) the database at `path`; ':memory:' gives a throwaway one. Migrates it.
export function openStore(path: string): Store {
  const db = new DatabaseSync(path)
  migrate(db)

  // A known id is updated in place; a new id is inserted. This is what makes ingesting a feed twice safe.
  const insertEvent = db.prepare(`
    INSERT INTO events (id, time, magnitude, depth_km, lat, lon, place) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET time = excluded.time, magnitude = excluded.magnitude,
      depth_km = excluded.depth_km, lat = excluded.lat, lon = excluded.lon, place = excluded.place`)
  const selectEvents = db.prepare(`
    SELECT id, time, magnitude, depth_km AS depthKm, lat, lon, place FROM events
    WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ?
    ORDER BY time DESC, id`)
  const selectEventsSince = db.prepare(`
    SELECT id, time, magnitude, depth_km AS depthKm, lat, lon, place FROM events
    WHERE lat BETWEEN ? AND ? AND lon BETWEEN ? AND ? AND time >= ?
    ORDER BY time DESC, id`)
  const upsertThreshold = db.prepare(`
    INSERT INTO thresholds (region, min_magnitude, max_depth_km) VALUES (?, ?, ?)
    ON CONFLICT (region) DO UPDATE SET min_magnitude = excluded.min_magnitude, max_depth_km = excluded.max_depth_km`)
  const selectThreshold = db.prepare(
    'SELECT region, min_magnitude AS minMagnitude, max_depth_km AS maxDepthKm FROM thresholds WHERE region = ?',
  )

  const store: Store = {
    upsertEvents(quakes) {
      const times = quakes.map((q) => toStoredTime(q.time)) // refuse a bad time before anything is written
      db.exec('BEGIN')
      try {
        for (const [i, q] of quakes.entries()) {
          insertEvent.run(q.id, times[i], q.magnitude, q.depthKm, q.lat, q.lon, q.place)
        }
        db.exec('COMMIT')
      } catch (err) {
        db.exec('ROLLBACK')
        throw err
      }
    },

    listEvents(region, since) {
      const box = regions[region]
      const rows =
        since === undefined
          ? selectEvents.all(box.minLat, box.maxLat, box.minLon, box.maxLon)
          : selectEventsSince.all(box.minLat, box.maxLat, box.minLon, box.maxLon, toStoredTime(since))
      // Rows come back with a null prototype; spreading makes them plain objects.
      // Times are stored with milliseconds so they sort as text; give them back the way USGS writes them.
      return rows.map((row) => ({ ...row, time: String(row.time).replace('.000Z', 'Z') }) as unknown as Quake)
    },

    getThreshold(region) {
      const row = selectThreshold.get(region)
      return row && ({ ...row } as unknown as Threshold)
    },

    setThreshold(region, input) {
      upsertThreshold.run(region, input.minMagnitude, input.maxDepthKm)
      return { region, ...input }
    },

    countEvents() {
      return (db.prepare('SELECT count(*) AS n FROM events').get() as { n: number }).n
    },

    close() {
      db.close()
    },
  }
  return store
}
