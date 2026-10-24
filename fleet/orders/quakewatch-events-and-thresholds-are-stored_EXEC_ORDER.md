# ORDER — quakewatch-events-and-thresholds-are-stored
track: quakewatch-server
- train: quakewatch-server
- wagon: W2
- review: named
- repo: quake-watch-server
- base: main @ 578462ad0
- branch: fix/quakewatch-events-and-thresholds-are-stored
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: a SQLite store in `src/store/` that keeps earthquake events and per-region alert thresholds, with migrations, an idempotent upsert by USGS id, and a threshold that is written and read back.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-events-and-thresholds-are-stored] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository is public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*
The repository is a public tutorial: a stranger reads every file you write. Prefer the plain form over the clever one.

## CONTEXT
- `main` @ `578462ad0` holds W0: `docs/api/openapi.yaml` (the contract), `mock/server.ts`, `test/contract.test.ts`,
  `package.json` (Node 22, TypeScript, `node:test` through `tsx`, `npm test` = typecheck + tests). Read them first; follow the
  test style of `test/contract.test.ts`. The contract's `Region` enum, `ThresholdInput` (`minMagnitude`, `maxDepthKm`) and
  `Threshold` schemas are what you store.
- A parallel wagon (W1, the USGS feed client) is built at the same time from the same base. The two share only the `Quake` type.
  To keep both branches mergeable, BOTH create `src/quake.ts` with EXACTLY these bytes (copy them; do not reformat):
  ```ts
  // One earthquake, as the contract's `Quake` schema defines it (docs/api/openapi.yaml).
  export interface Quake {
    id: string // the USGS event id
    time: string // when it happened, RFC 3339, UTC
    magnitude: number
    depthKm: number
    lat: number
    lon: number
    place: string
  }
  ```
- SQLite: prefer Node's built-in `node:sqlite` if the Node 22 the project pins runs it without a flag; otherwise one small,
  widely used package. Measure which, and return it as `ruling: what — why — cost if wrong`. MASTER'S CLAIM (not measured):
  `node:sqlite` is unflagged from Node 22.13; your seat may run a newer Node, so say which version you measured on.

## WHAT TO BUILD
1. `src/quake.ts` — the bytes above.
2. `src/store/` — open a database file (path passed in; `:memory:` works in tests); numbered migrations that create
   `events` and `thresholds` from an empty file and record which ran; `upsertEvents(quakes)` keyed on the USGS id;
   `listEvents(region, since)` using the region boxes in the contract's `info.description`; `getThreshold(region)` and
   `setThreshold(region, input)`.
3. `test/store.test.ts` — migration from empty; the same feed ingested twice gives the same row count; an event whose fields
   changed under the same id is updated, not duplicated; a threshold written is read back; `listEvents` returns only events
   inside the region's box and after `since`.

## ACCEPTANCE
1. `npm ci && npm test` exits 0. Paste the summary line.
2. Red first, for idempotent ingest: paste the failing run (a plain INSERT doubles the rows) BEFORE the upsert, then the passing run.
3. Negative control, executed: replace the upsert with a plain insert; the idempotency test turns red. Restore. Paste the red line.
4. The ruling on `node:sqlite` vs a package, with the Node version you measured on.

## WHAT IS NOT IN SCOPE
- `src/feed/`, `docs/api/openapi.yaml`, `mock/server.ts`, the real HTTP server — other wagons.
- `README.md`, `docs/`, `fleet/` — the master and the scribe own them.
- No ORM. No database server.

## WHERE YOU MAY PROVE ME WRONG
If a claim above is false on your seat (the Node version, `node:sqlite`, the region boxes), measure it, write
`master-wrong: <claim> — <measurement>` in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-events-and-thresholds-are-stored/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
