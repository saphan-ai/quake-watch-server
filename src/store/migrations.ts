import type { DatabaseSync } from 'node:sqlite'

// Numbered migrations. To change the schema, add the next number at the end; never edit one that has shipped.
export const migrations: { version: number; sql: string }[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE events (
        id        TEXT PRIMARY KEY, -- the USGS event id
        time      TEXT NOT NULL,    -- RFC 3339, UTC, always written by toISOString()
        magnitude REAL NOT NULL,
        depth_km  REAL NOT NULL,
        lat       REAL NOT NULL,
        lon       REAL NOT NULL,
        place     TEXT NOT NULL
      );
      CREATE INDEX events_time ON events (time);
      CREATE TABLE thresholds (
        region        TEXT PRIMARY KEY,
        min_magnitude REAL NOT NULL,
        max_depth_km  REAL NOT NULL
      );
    `,
  },
]

// Runs every migration the file has not seen yet, each in its own transaction, and records it.
export function migrate(db: DatabaseSync): void {
  db.exec('CREATE TABLE IF NOT EXISTS migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)')
  const done = new Set(db.prepare('SELECT version FROM migrations').all().map((row) => row.version))
  for (const m of migrations) {
    if (done.has(m.version)) continue
    db.exec('BEGIN')
    try {
      db.exec(m.sql)
      db.prepare('INSERT INTO migrations (version, applied_at) VALUES (?, ?)').run(m.version, new Date().toISOString())
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  }
}
