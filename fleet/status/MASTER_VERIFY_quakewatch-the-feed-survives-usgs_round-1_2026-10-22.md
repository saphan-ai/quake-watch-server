# MASTER VERIFY — quakewatch-the-feed-survives-usgs

- round: 1
- by: MASTER · 2026-10-22
- base: 578462ad0 · tip e1d310de4
- verdict: READY — the suite is green, and the master ran the live test the leg could not run, against the real USGS feed

## Checks
- █████, fresh clone checked out detached at e1d310de4, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 21 · pass 20 · fail 0 · skipped 1` (base 578462ad0: 11 tests; 10 new feed tests, none gone).
- `QUAKEWATCH_LIVE=1 npm test` exit 0, `tests 21 · pass 21 · skipped 0`: `✔ live: the real USGS feed reads into quakes`.
- Real feed shape, `curl https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` at 2026-10-22 ~02:15Z: 184 features; feature keys `geometry, id, properties, type`; `properties.time` int, `mag` float, `place` str; `geometry.coordinates` `[lon, lat, depth]` (e.g. `[-151.958, 61.053, 95.4]`); 0 features with a null `mag` in this sample. The leg's fixture field names agree with it.
- The leg's red-first and negative-control evidence is in its status; not re-run by the master.
- Merged tree: `main` is 578462ad0, the base, so the tree at e1d310de4 is the merged tree.
- Master wrong: none. Caveat: the fixtures are hand-written from the documented shape, not recorded (the leg's seat had no network); a commit message calls them "recorded-shape". Passed to the reviewer.

## Next
Named review on codex: `quakewatch-the-feed-survives-usgs-review`, reviewed-sha e1d310de4.
