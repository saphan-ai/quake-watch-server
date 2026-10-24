# ORDER — quakewatch-the-feed-survives-usgs
track: quakewatch-server
- train: quakewatch-server
- wagon: W1
- review: named
- repo: quake-watch-server
- base: main @ 578462ad0
- branch: fix/quakewatch-the-feed-survives-usgs
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: a feed client in `src/feed/` that reads the public USGS GeoJSON summary feed into the contract's `Quake` type and survives the feed's real failure modes, tested against recorded fixtures only.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-feed-survives-usgs] <area>: <what>`.
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
  test style of `test/contract.test.ts`.
- A parallel wagon (W2, the SQLite store) is built at the same time from the same base. The two share only the `Quake` type.
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
- The feed: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` — public, no key. Each feature has
  `id`, `properties.time` (epoch milliseconds), `properties.mag`, `properties.place`, and `geometry.coordinates`
  `[longitude, latitude, depth in km]`. MASTER'S CLAIM (from the train order, not measured by me): check the field names
  against a real response before you trust them, and record what you found.
- Use Node's built-in `fetch`; no HTTP library.

## WHAT TO BUILD
1. `src/quake.ts` — the bytes above.
2. `src/feed/` — one function that fetches the feed and returns `{ quakes: Quake[], skipped: number }`. A malformed feature
   (missing or wrong-typed field) is skipped and counted, never fatal. A duplicate id keeps one `Quake`. HTTP 429 and 5xx
   are retried with a backoff (at most 3 tries; the wait is injectable so tests do not sleep); after the last try the
   function throws one clear error.
3. `test/fixtures/usgs/` — recorded fixtures: a normal feed (trim a real response to a few features), an empty feed, a feed
   with one malformed feature, a feed with a duplicate id. Record the real response once, by hand, and say in your status when
   and how. If your seat cannot reach USGS, write the fixtures from the documented shape and say so (`master-wrong` or `UNRUN`).
4. `test/feed.test.ts` — tests against the fixtures with a fake `fetch`: normal, empty, malformed (skipped and counted), duplicate,
   429 then success, 5xx three times then a clear error. One live test that runs only when `QUAKEWATCH_LIVE=1`, skipped otherwise.

## ACCEPTANCE
1. `npm ci && npm test` exits 0. Paste the summary line.
2. Red first, for the malformed feature: paste the failing run of that test BEFORE the code that skips it, then the passing run.
3. Negative control, executed: make the skip-and-count code throw instead; the malformed test turns red. Restore. Paste the red line.
4. `QUAKEWATCH_LIVE=1 npm test` — paste its result, or `UNRUN` with the reason (no network on the seat is a valid reason).

## WHAT IS NOT IN SCOPE
- `src/store/`, SQLite, `docs/api/openapi.yaml`, `mock/server.ts`, the real server — other wagons.
- `README.md`, `docs/`, `fleet/` — the master and the scribe own them.
- No new runtime dependency. A dev dependency only if you name why.

## WHERE YOU MAY PROVE ME WRONG
If a field name or a failure mode above is false against the real feed, measure it, write `master-wrong: <claim> — <measurement>`
in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-feed-survives-usgs/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
