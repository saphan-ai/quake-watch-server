# REVIEW NOTES — quakewatch-the-feed-survives-usgs

## Ground

Reviewed HEAD `9dfaaf51272803d44d8ba25c855bdb451fa5c5f9` against wagon base `578462ad0` and round-2 base `e1d310de4`. Node `v22.23.2`; npm `10.9.8`; npm lockfile, no installed `node_modules`. `package.json` uses `npm test` (`tsc --noEmit`, then Node test runner with `tsx`); no CI workflow or numeric quality bar was found. `npm test` stopped before tests at `sh: 1: tsc: not found`. Independent `node --experimental-strip-types --test test/feed.test.ts` ran 11 tests: 10 passed, 1 opt-in live test skipped. That command bypasses the project's typecheck and `tsx` runner. Master's recorded fresh-clone measurements were 21/22 and 22/22 with live enabled; this seat did not reproduce those counts.

## Differential

Round 2 adds the array guard at `src/feed/usgs.ts:55-57`, malformed coordinate cases at `test/feed.test.ts:49-68`, conflicting duplicate data and assertion at `test/fixtures/usgs/duplicate.geojson:4` and `test/feed.test.ts:70-76`, a recorded sample and assertion at `test/feed.test.ts:78-95`, and `_comment` provenance in the four hand-written fixtures. No runtime dependency or lockfile delta. The wagon also adds a feed reader, shared `Quake` type and tests; `tsconfig.json` includes `src` for type checking. `src/quake.ts` is byte-identical to the 281-byte shared contract supplied in the order, checked by a byte comparison on this seat. No weakened assertion, suppression, threshold, or new skip appears in round 2; the pre-existing live skip is explicitly opt-in. Check ranking: the supplied contract byte comparison is external to product code; project typecheck is a project check; feed tests are suite checks. No declared numeric bar exists.

## Unplug

On a temporary edit to `src/feed/usgs.ts:56`, removing `Array.isArray` made both malformed tests fail with `TypeError: coordinates is not iterable` (2 red). Replacing the first-wins branch at `src/feed/usgs.ts:46` with unconditional `Map.set` made the conflicting-duplicate test fail `6.9 !== 5.2` (1 red). Swapping longitude and latitude at `src/feed/usgs.ts:57` made the recorded-sample test fail on both exact coordinate fields (1 red). Each mutation was restored from a local backup; `git diff --exit-code` is empty. These controls discriminate a broken parser from the current implementation.

## Closure

- ADDRESSED: malformed coordinate values are skipped and counted. The code guards the array before destructuring; the malformed fixture and in-memory cases assert both survivors and skipped count (`src/feed/usgs.ts:55-60`, `test/feed.test.ts:42-68`).
- ADDRESSED: conflicting duplicate values prove first-wins (`src/feed/usgs.ts:46`, `test/feed.test.ts:70-76`, `test/fixtures/usgs/duplicate.geojson:4`).
- ADDRESSED: the captured three-feature USGS sample is consumed by a test asserting the exact first parsed `Quake`, all three items, and zero skips (`test/feed.test.ts:78-95`). Hand-written fixtures self-identify with `_comment` on their first line. The sample's first timestamp converts to `2026-10-22T01:49:28.640Z`; the master's earlier 2026-10-21 claim was wrong.
- ADDRESSED: `src/quake.ts` matches the supplied bytes exactly. Master's reported dependency-and-network seat ran `npm test` and `QUAKEWATCH_LIVE=1 npm test`; local replication is listed under Unrun.

## Remainder

No new blocking defect found in round 2. `src/feed/usgs.ts:27-28` does not catch transport or malformed JSON failures; the order specifies retry for HTTP 429/5xx and malformed *features*, so I declined to judge those separate failure classes. The recorded fixture contains three unchanged feature samples according to the order; this seat did not independently fetch or compare the original 184-feature capture. Ruling: treat it as a recorded sample, given the order's provenance and the content's realistic fields; if provenance is wrong, the test would still check parsing but its claim of a real feed sample would be false.

## Profile

Backend feed I/O. `fetchQuakes` makes one request at a time, retries status 429/5xx at most three attempts, and exposes terminal HTTP status and attempt count in its error. No data store, cache, server state, authentication, or destructive path in this wagon. The live path uses the same `fetchQuakes` function as the injected-fetch tests. A network timeout is absent at `src/feed/usgs.ts:27`; noticed as future work, since the order does not require one. No declared quality metric to compare at base and tip.

## Focus

The four round-1 conditions are addressed by the round-2 diff. The feed's original promises remain covered by tests for normal/empty/malformed/duplicate feeds and 429, 503, 404 and invalid top-level body. The recorded fixture would catch a real-feature coordinate-order error. The sample metadata's count is 3 after trimming from a reported 184-feature response; the order describes it as a three-feature sample, not a full capture.

## Conditions

Carry the master's fresh-clone `npm test` (21 passed, 1 skipped) and `QUAKEWATCH_LIVE=1 npm test` (22 passed) outputs into the gate record. This review seat could run only the isolated feed suite, so the full-suite and live claims are not independent review measurements. Verdict: accept-with-conditions. No review-condition reclassification was made.

## Unrun

`npm test`: unable to run because `tsc` is absent (`node_modules` absent); its attempt stopped before tests. `QUAKEWATCH_LIVE=1 npm test`: not run on this networkless seat per order. Full contract suite and typecheck: not independently run here; direct Node test invocation failed to import package `yaml` from `test/contract.test.ts`. Fresh upstream capture comparison: not run here because the original response is not available on this seat. The master reports those test runs and capture comparison, which are attributed claims rather than this review's measurements.
