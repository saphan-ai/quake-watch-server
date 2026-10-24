# ORDER — quakewatch-the-contract-comes-first
track: quakewatch-server
- train: quakewatch-server
- wagon: W0
- review: named
- repo: quake-watch-server
- base: main @ 21dafea60
- branch: fix/quakewatch-the-contract-comes-first
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: write the QuakeWatch server's API contract first (OpenAPI 3.1), a tiny mock that serves its examples, and a Node 22 + TypeScript project whose `npm test` runs locally.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-contract-comes-first] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository becomes public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*
The repository is a public tutorial: a stranger reads every file you write. Prefer the plain form over the clever one.

## CONTEXT
- The repository is `main` @ `21dafea60`: `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`,
  `fleet/orders/TRAIN_ORDER_quakewatch-server.md`. No code yet. Read `README.md` first: it names port `8080` and the
  region `southeast-asia` in its "Run it yourself" curl. The contract must agree with it.
- The app reads the public USGS GeoJSON summary feed (later wagon, not this one) and keeps events and per-region alert
  thresholds. A threshold is a minimum magnitude and a maximum depth in km. An alert is an event in the region that crosses
  the region's threshold.
- Later wagons (feed client, store, real server) build against the types this contract defines. Keep one `Quake` schema:
  `id` (USGS id, string), `time` (RFC 3339 UTC), `magnitude` (number), `depthKm` (number), `lat`, `lon` (numbers), `place`
  (string).
- MASTER'S CLAIM (2026-10-21, not measured on your seat): the repository has no `package.json` and no lockfile, so the npm
  registry is needed for the first `npm install`. If your seat cannot reach it, that is a fact for your status, not a reason to
  vendor packages.

## WHAT TO BUILD
1. `docs/api/openapi.yaml` — OpenAPI 3.1 with these paths, each with a schema and at least one `example`:
   `GET /api/v1/events?region=&since=` · `GET /api/v1/thresholds/{region}` · `PUT /api/v1/thresholds/{region}` ·
   `GET /api/v1/alerts?region=` · `GET /healthz`. Regions are a closed list (an enum) that includes `southeast-asia`; keep it
   to five or fewer, each a named latitude/longitude box described in the contract. Error responses (400 unknown region,
   400 bad `since`) have one shared error schema.
2. A mock server of at most 30 lines (count them with `wc -l`) that answers every path in the contract with that path's
   example, on port 8080 (`PORT` overrides). `npm run mock` starts it. It reads the examples from `openapi.yaml`; it does not
   copy them.
3. `package.json` pinning Node 22 (`engines`), TypeScript, and one test runner; a committed lockfile; `npm test` runs the
   tests locally with no CI. Add `@redocly/cli` as a dev dependency so the lint runs from the lockfile.
4. Tests: the contract lints; the mock answers each path with the example's body and status.

## ACCEPTANCE
1. `npm ci && npm test` exits 0 on a clean checkout of your branch. Paste the summary line.
2. `npx redocly lint docs/api/openapi.yaml` reports 0 errors. Paste its last lines.
3. `npm run mock` then one `curl -s -i` per path (five) returns that path's example. Paste each status line and body.
4. `wc -l` of the mock file is 30 or less.

## WHAT IS NOT IN SCOPE
- `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`, `fleet/` — the master and the scribe own them.
  If the contract forces a change there, write it on the `NOTICED` list.
- No feed client, no database, no real server logic, no Docker, no CI workflow file.
- No authentication or user accounts.

## WHERE YOU MAY PROVE ME WRONG
If any claim above is false on your seat (the repo state, the README's port or region, the npm registry), measure it, write
`master-wrong: <claim> — <measurement>` in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-contract-comes-first/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
