# REVIEW NOTES — quakewatch-the-feed-survives-usgs

## Ground

Reviewed `578462ad0...e1d310de4` at HEAD `e1d310de4`, eight changed files. Runtime: Node v22.23.2 satisfies `package.json` (`>=22 <23`); npm and `package-lock.json`; `package.json` runs `npm run typecheck && node --import tsx --test test/*.test.ts` with Node's test runner. No CI file, workspace declaration, or numeric quality bar was found. `npm test` stopped before tests because `tsc` is absent; `npm ci --offline --ignore-scripts` could not fetch uncached `yaml-2.9.1.tgz`. `npm run lint:api` likewise stopped because `redocly` is absent. The fallback `node --experimental-strip-types --test test/feed.test.ts` measured 9 pass, 1 skipped, 0 fail; this does not typecheck and is not the project command. Source and lockfile have no dependency delta. No existing test or bar was weakened by the diff; the newly added live test is intentionally opt-in.

## Differential

Blocking — `src/feed/usgs.ts:55`, `test/feed.test.ts:49-61`: a malformed feature with `geometry.coordinates: 7` throws `TypeError: number 7 is not iterable` at destructuring, aborting the entire feed instead of increasing `skipped` and preserving good features. Control: a direct `parseFeed` call with that feature returned exit 1 and that TypeError. Validate that coordinates is an array before destructuring; add a non-array coordinate feature beside a good one and assert `{ quakes: [good], skipped: 1 }`.

Blocking — `test/feed.test.ts:64-69`, `src/feed/usgs.ts:46`: duplicate fixture entries for `us7000abcd` have identical data. The test only asserts IDs and count, so overwriting the first quake with the last still passes. Control: replacing `else if (!byId.has(quake.id)) byId.set(quake.id, quake)` with `else byId.set(quake.id, quake)` yielded 9 pass, 1 skip, 0 fail. Give the later duplicate a different magnitude or time and assert that the first value survives.

Blocking, order-mandated — `test/fixtures/usgs/*.geojson`: all four fixtures were hand-written according to the executor's return, while the order explicitly required recorded fixtures. The live test does not verify fixture provenance. Record and minimize a real response, preserve its origin/time in fixture documentation, and retain a deterministic fake-fetch suite.

`src/quake.ts:1-10` matches the required field names and types in `docs/api/openapi.yaml:211-233`. The precise ordered bytes were not supplied to this leg, so byte identity remains unverified; the master must compare against the parallel wagon's contract bytes.

## Unplug

With each source mutant restored afterward, the skip-count mutant failed two tests (7 pass, 2 fail, 1 skip), the dedupe overwrite mutant survived (9 pass, 0 fail, 1 skip), and the retry-disabled mutant failed two tests (7 pass, 2 fail, 1 skip). Outputs are under `.saphan/work/quakewatch-the-feed-survives-usgs-review/`. The source diff after restoration was empty. The retry tests inject immediate waits; no fixture test sleeps for real. The live opt-in test uses real waits if USGS returns retryable errors.

## Closure

Verdict: reject. The malformed-feature contract is violated and a required duplicate behavior has no effective test. The recorded-fixture requirement is unmet. Re-run the project command and live test after dependencies are available and the defects are fixed.

## Remainder

The parser skips `null` magnitude and missing/nonstring `place`, consistent with the nonnullable `Quake` contract, and accepts negative depth. Measured with direct `parseFeed` calls. It returns first duplicate under current code. HTTP 429 and 5xx have at most three attempts and waits of 1 s and 2 s; the terminal HTTP error includes status and attempt count. The code is compact and readable for a tutorial. Declined to judge network exceptions and invalid JSON response formatting because the order's explicit retry promise is for HTTP statuses.

## Profile

Backend: bounded feed read, injected fetch, no write or cache. A failed HTTP response is observable through a clear error. Quality-check circularity, strongest to weakest: API contract schema (external to this implementation), TypeScript configuration (project owned; UNRUN here), the feed suite (author owned). No numeric coverage or mutation bar is declared, so no numerical bar verdict exists.

## Focus

Scope stayed within the two commits and their eight files. The master-reported successful live test is a dated claim, not a run on this seat. The order's real-feed sample aligns with the fixture field shape but does not establish fixture provenance or cover null magnitude, absent place, or negative depth. Direct controls for these three values are reported in Remainder.

## Conditions

To clear rejection: make malformed coordinate values count as skipped; add a duplicate with conflicting values and assert first-wins; replace or substantiate the hand-written fixtures as recorded feed samples; verify `src/quake.ts` byte identity against the shared contract; run `npm test` and the opt-in live test on a seat with dependencies and network. No review condition was reclassified.

## Unrun

`npm test`: `tsc: not found`; clean offline install refused on uncached `yaml-2.9.1.tgz`. `npm run lint:api`: `redocly: not found`. Live USGS test: skipped on this seat; the order says this seat cannot reach the network. Exact-byte contract comparison: source bytes absent from this review order.
