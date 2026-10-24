# MASTER VERIFY — quakewatch-the-api-answers-from-the-store

- round: 1
- by: MASTER · 2026-10-22
- base: d1a106d9a · tip f2c5670c7
- verdict: READY — the suite is green, and the run guide's three curls reproduce its documented output byte for byte against the real server

## Checks
- █████, fresh clone checked out detached at f2c5670c7, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 72 · pass 71 · fail 0 · skipped 1` (base d1a106d9a: 40 tests, 39 pass, 1 skipped; 32 new, none gone).
- Real server: `PORT=18093 QUAKEWATCH_DB=<scratch> QUAKEWATCH_FEED_FILE=test/fixtures/usgs/recorded-2026-10-22.geojson npm start`, then the three `curl` commands of `docs/RUN_IT.md` (events in western-north-america; PUT a threshold 1.5 / 20 km; alerts): each output equals the JSON block in the document byte for byte.
- Alerts before the PUT: `{"alerts":[]}` (the ASSUMED default 5 / 70 km), as the document says. `GET /api/v1/events?region=atlantis` → HTTP 400.
- The leg's negative controls, from its status (not re-run by the master): unknown region answered 200 → 3 contract tests red; an alert magnitude as a string → `data/alerts/0/quake/magnitude must be number`.
- New dev dependency: `ajv` (JSON Schema validation in the contract test).
- Merged tree: the branch is based on `main` d1a106d9a, the current trunk.
- ASSUMED for the owner: the default threshold `minMagnitude 5, maxDepthKm 70` (`DEFAULT_THRESHOLD` in `src/server.ts`).
- Master wrong: none.

## Next
Named review on codex: `quakewatch-the-api-answers-from-the-store-review`, reviewed-sha f2c5670c7.
