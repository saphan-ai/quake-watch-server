# ORDER — quakewatch-the-feed-survives-usgs
track: quakewatch-server
- train: quakewatch-server
- wagon: W1
- round: 2
- review: named
- repo: quake-watch-server
- base: main @ 578462ad0
- branch: fix/quakewatch-the-feed-survives-usgs
- worktree: █████
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: pay the three blocking conditions of review round 1 on W1: bad coordinates are skipped and counted, a duplicate test that can see an overwrite, and a fixture recorded from the real feed.

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

## WHERE YOU START
Your branch is at `e1d310de4` (round 1: `src/quake.ts`, `src/feed/usgs.ts`, 4 hand-written fixtures, `test/feed.test.ts`).
Build on it; do not rewrite it. Round 1's order still binds (one function returning `{ quakes, skipped }`, built-in `fetch`,
at most 3 tries with an injectable wait, no new runtime dependency, `src/quake.ts` byte-identical to the shared bytes).
`main` has moved since your base (documents only: `fleet/preparation/`, `README.md`, `docs/`); do not merge it — the master does.

## THE REVIEW YOU ANSWER (round 1, codex, verdict `reject` — pasted from `_REVIEW_NOTES.md`)
> Abstract: Malformed coordinate data aborts the feed, the duplicate test cannot detect overwriting, and required recorded
> fixtures were hand-written. Fix before the gate.
>
> Unplug: [...] the dedupe overwrite mutant survived (9 pass, 0 fail, 1 skip) [...]
>
> Conditions: To clear rejection: make malformed coordinate values count as skipped; add a duplicate with conflicting values
> and assert first-wins; replace or substantiate the hand-written fixtures as recorded feed samples; verify `src/quake.ts`
> byte identity against the shared contract; run `npm test` and the opt-in live test on a seat with dependencies and network.

## THE RECORDING (MASTER, 2026-10-22, about 02:15Z)
The master fetched `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` with `curl` (184 features)
and kept the first 3 features, unchanged, with the response's metadata (`count` set to 3) and its `bbox` (the bbox is the
full response's, not the 3 features'). Save these exact bytes as `test/fixtures/usgs/recorded-2026-10-22.geojson`:
```json
{"type":"FeatureCollection","metadata":{"generated":1792634771000,"url":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson","title":"USGS All Earthquakes, Past Day","status":200,"api":"2.8.2","count":3},"features":[{"type":"Feature","properties":{"mag":1.8,"place":"44 km W of Tyonek, Alaska","time":1792633768640,"updated":1792634071820,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/aka2026uxeadu","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/aka2026uxeadu.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"automatic","tsunami":0,"sig":50,"net":"ak","code":"a2026uxeadu","ids":",aka2026uxeadu,","sources":",ak,","types":",origin,phase-data,","nst":24,"dmin":0.2,"rms":0.4,"gap":83,"magType":"ml","type":"earthquake","title":"M 1.8 - 44 km W of Tyonek, Alaska"},"geometry":{"type":"Point","coordinates":[-151.958,61.053,95.4]},"id":"aka2026uxeadu"},{"type":"Feature","properties":{"mag":2.2,"place":"27 km E of Honaunau-Napoopoo, Hawaii","time":1792633651390,"updated":1792633858360,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/hv75061946","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/hv75061946.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"automatic","tsunami":0,"sig":74,"net":"hv","code":"75061946","ids":",hv75061946,","sources":",hv,","types":",origin,phase-data,","nst":19,"dmin":0.06635,"rms":0.389999986,"gap":110,"magType":"md","type":"earthquake","title":"M 2.2 - 27 km E of Honaunau-Napoopoo, Hawaii"},"geometry":{"type":"Point","coordinates":[-155.60400390625,19.4863338470459,33.3199996948242]},"id":"hv75061946"},{"type":"Feature","properties":{"mag":1.69,"place":"14 km SE of Petrolia, CA","time":1792633431960,"updated":1792633528893,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/nc75453191","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nc75453191.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"automatic","tsunami":0,"sig":44,"net":"nc","code":"75453191","ids":",nc75453191,","sources":",nc,","types":",nearby-cities,origin,phase-data,","nst":9,"dmin":0.0145,"rms":0.07,"gap":121,"magType":"md","type":"earthquake","title":"M 1.7 - 14 km SE of Petrolia, CA"},"geometry":{"type":"Point","coordinates":[-124.162666320801,40.236499786377,13.5299997329712]},"id":"nc75453191"}],"bbox":[-177.6176,-52.8338,-0.87,165.8331,65.14,572.281]}
```

## WHAT TO BUILD
1. A feature whose `geometry.coordinates` is missing, not an array, shorter than 3, or holds a non-number is skipped and
   counted, never fatal. Add a fixture case for it.
2. The duplicate fixture gets a second feature with the same id and DIFFERENT values; the test asserts the first one wins.
   Run the overwrite mutant yourself (keep the last instead of the first) and show the test turns red.
3. Add the recorded fixture above and a test that reads it: 3 quakes, 0 skipped, and the first quake equals
   `{ id: "aka2026uxeadu", time: "2026-10-21T...Z", magnitude: 1.8, depthKm: 95.4, lat: 61.053, lon: -151.958, place: "44 km W of Tyonek, Alaska" }`
   (compute the exact `time` from `1792633768640`). Keep the hand-written fixtures for the failure cases, and say in a comment
   at the top of each that it is hand-written to show one failure, shaped like the recording.
4. `src/quake.ts`: these exact bytes (compare with `cmp` or a hash, and paste the result):
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

## ACCEPTANCE
1. `npm ci && npm test` exits 0. Paste the summary line.
2. Negative controls, executed: (a) make bad coordinates throw → a test turns red; (b) keep the last duplicate → a test turns
   red. Restore both. Paste both red lines.
3. The live test: run it if your seat allows; otherwise `UNRUN` with the exact refusal (the master runs it on his host).

## WHAT IS NOT IN SCOPE
- `src/store/`, the contract, the mock, the real server; `README.md`, `docs/`, `fleet/`.
- No new runtime dependency.

## WHERE YOU MAY PROVE ME WRONG
If the recording above or a claim here is false, measure it, write `master-wrong: <claim> — <measurement>` in your status,
and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-feed-survives-usgs/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
