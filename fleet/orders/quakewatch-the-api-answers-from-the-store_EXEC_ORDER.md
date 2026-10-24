# ORDER — quakewatch-the-api-answers-from-the-store
track: quakewatch-server
- train: quakewatch-server
- wagon: W3
- review: named
- repo: quake-watch-server
- base: main @ d1a106d9a
- branch: fix/quakewatch-the-api-answers-from-the-store
- lands-on: main
- quote-usd: 20
- cap-usd: 40
- wall: 75m
- backend: claude-code
- model: claude-sonnet-5-5
- task: the real QuakeWatch server behind `docs/api/openapi.yaml`, reading the feed into the store and answering every path from the store, errors included, with a test that checks every response against the contract.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-api-answers-from-the-store] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository is public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*
The repository is a public tutorial: a stranger reads every file you write. Prefer the plain form over the clever one.

## CONTEXT
`main` @ the base above holds W0–W2. Read before you change anything:
- `docs/api/openapi.yaml` — THE contract: five operations, the region enum and boxes in `info.description`, the shared error
  schema, `Quake`, `Threshold`, `ThresholdInput`, `Alert`. Its `info.description` says: "The mock promises only the success
  examples [...] The error responses are described here for the real server, which is tested against all of them." That
  promise is yours to keep (the W0 review condition carried to W3).
- `src/feed/usgs.ts` — `fetchQuakes(options)` returns `{ quakes, skipped }`; `parseFeed(body)`; an injectable `fetch`.
- `src/store/index.ts` — `openStore(path)` returns `Store`: `upsertEvents`, `listEvents(region, since?)` (newest first),
  `getThreshold(region)` (undefined if never set), `setThreshold(region, input)`, `countEvents()`, `close()`; times are
  validated by `toStoredTime` (UTC only, at most milliseconds; invalid times throw).
- `mock/server.ts` — the 30-line mock; its `handle(req, res)` pattern lets tests call a handler without opening a port. KEEP the
  mock (the tutorial shows the contract coming first); `npm start` runs the real server, `npm run mock` stays the mock.
- `test/fixtures/usgs/recorded-2026-10-22.geojson` — 3 real USGS features, recorded by the master.

## THE MASTER'S RULINGS (MASTER, 2026-10-22)
1. A region with no threshold set answers the contract's example threshold, `minMagnitude: 5`, `maxDepthKm: 70`, from one
   named constant. ASSUMED — the owner has not decided a default; the master names it at the gate.
2. `GET /api/v1/events` without `region` returns the events of all five regions, newest first, each event once.
3. Bad input answers `400` with the shared error schema: unknown region, a `since` the store refuses, a `PUT` body that is not
   a `ThresholdInput` (missing field, wrong type, negative depth). An unknown path answers `404`. Nothing answers `500` for bad input.
4. The server reads the feed once at start and then every `QUAKEWATCH_REFRESH_SECONDS` (default 300). A failed refresh is
   logged in one line and never stops the server. `QUAKEWATCH_FEED_FILE=<path>` reads a GeoJSON file instead of the network
   (for tests and for a stranger without network). The database file is `QUAKEWATCH_DB` (default `./quakewatch.db`).
   `PORT` overrides 8080.

## WHAT TO BUILD
1. `src/server.ts` (one file, plain): the request handler for the five operations per the rulings, and `npm start`.
2. `test/server.test.ts`: drives the real handler with fake request/response objects (your seat refuses `listen()`), seeded from
   the recorded fixture through `QUAKEWATCH_FEED_FILE` or an in-memory store. A CONTRACT TEST: every response body, success and
   error, is validated against its response schema in `openapi.yaml` (add one small JSON Schema validator as a dev dependency if
   you need one, and name it). Cover: each operation's success; each 400 of ruling 3; 404; a threshold change that changes the
   alert list.
3. `docs/RUN_IT.md` (new, short): how to run it with `QUAKEWATCH_FEED_FILE=test/fixtures/usgs/recorded-2026-10-22.geojson npm start`,
   three `curl` commands (events in a region, set a threshold, alerts), and their exact output, produced by running them.
   Do not edit `README.md`.

## ACCEPTANCE
1. `npm ci && npm test` exits 0; `npm run typecheck` exits 0. Paste the summary lines.
2. Negative control, executed: make the server answer `200` for an unknown region; the contract test turns red. Restore. Paste the red line.
3. Negative control, executed: return one alert field with the wrong type; the contract test turns red. Restore. Paste the red line.
4. The three curls of `docs/RUN_IT.md`: run them against `npm start` if your seat allows; otherwise `UNRUN` with the exact
   refusal, and produce the outputs through the handler (the master runs the curls on his host).

## WHAT IS NOT IN SCOPE
- `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`, `fleet/` — the master and the scribe own them.
- Changing the contract. If the contract is wrong, write it on the `NOTICED` list and stop that part.
- No authentication, Docker, CI file, clients. No framework (no Express, Fastify, etc.): `node:http` is enough.

## WHERE YOU MAY PROVE ME WRONG
If a ruling conflicts with the contract or a claim here is false, measure it, write `master-wrong: <claim> — <measurement>`
in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-api-answers-from-the-store/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
