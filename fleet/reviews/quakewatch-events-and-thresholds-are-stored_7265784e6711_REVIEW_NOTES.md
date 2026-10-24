# REVIEW NOTES — quakewatch-events-and-thresholds-are-stored

## Ground

Reviewed SHA `b4d525001c5fc3c3301e04cdadb2622bfb5a06b1` (`git rev-parse HEAD`), round-2 diff `a59e6c409...b4d525001` and wagon diff `578462ad0...b4d525001`. The contract is `docs/api/openapi.yaml:53-59,218-221`: `since` and quake time are RFC 3339 UTC `date-time` strings. The master's dated ruling narrows precision to milliseconds, but does not say that `Z` is the only UTC offset notation. Node is v22.23.2, matching `package.json`'s Node 22 range; npm is 10.9.8. `package-lock.json` selects npm, with no workspaces. `package.json` runs `tsc --noEmit` then Node's test runner through `tsx`; there is no CI configuration or declared numeric test bar in this wagon. The round-2 diff changes no dependency, manifest, lockfile, or checker configuration.

## Differential

**ADDRESSED — pre-1970 exclusion.** `src/store/index.ts:52-59,82-87` omits the time predicate when `since` is absent. The `1969-12-31T23:59:59Z` regression at `test/store.test.ts:115-120` passed in the local 15-test store run.

**ADDRESSED — silent submillisecond rounding.** `src/store/index.ts:33-40,69,87` rejects `.0001Z` in an event and `.0002Z` in `since`, naming each value. The regression at `test/store.test.ts:122-130` passed; `:139-146` proves exact `.123Z` return and inclusive/exclusive millisecond boundaries. The input precision is now an explicit narrow contract in the store comment.

**ADDRESSED — drift and lower-longitude conditions.** `test/store.test.ts:159-167` reads the contract file, extracts its region table, and compares all five boxes to `src/store/regions.ts`; it is not a duplicated expected table. Lower longitude 92 and latitude -11 are covered by `:148-157`. A direct probe with points at all four limits and just outside each returned precisely `minLat,maxLat,minLon,maxLon`.

## Unplug

Changed only `src/store/regions.ts:11` from `minLon: 92` to `93`; `node --experimental-strip-types --test --test-name-pattern='the region boxes in code equal the table in the contract' test/store.test.ts` failed one assertion showing contract 92 versus code 93. Restored the file from a backup and confirmed `git diff -- src/store/regions.ts` empty. Existing lower-edge test would also fail this mutation. The SQL `BETWEEN` in both query paths includes every boundary; the eight-point direct probe distinguishes the four included edges from the four excluded adjacent points. The time regressions distinguish the round-1 behavior from the current implementation by their assertions; I did not rebuild and run the round-1 commit locally.

## Closure

**REJECT.** The two round-1 blocking findings and the named drift/edge conditions are addressed. The new time validator has two contract failures within the review focus; both are at `src/store/index.ts:33-39` and require a fix before this wagon can be accepted. The author's reported 26-pass/typecheck result is a claim; the local measured store run is 15 pass, 0 fail under Node's native type stripping.

## Remainder

1. **BLOCKING — valid UTC offset rejected.** `src/store/index.ts:34` requires literal `Z`, while `docs/api/openapi.yaml:53-59,218-221` declares RFC 3339 UTC `date-time` and the master's ruling limits precision, not offset spelling. A caller sending `2026-10-21T03:14:07+00:00` to `listEvents` gets `invalid time` (direct probe); the same occurs on ingest. That is a valid RFC 3339 representation of UTC. Remedy: accept at least zero-offset RFC 3339 notation and normalize it before storing; decide and document whether other numeric offsets representing UTC instants are accepted, then test both paths and exact `since` inclusion. If the intended contract is `Z` only, the master must explicitly narrow the API contract before accepting the refusal. The existing test at `test/store.test.ts:132-137` asserts rejection of `+02:00` but does not establish that `+00:00` is invalid.

2. **BLOCKING — impossible calendar day silently becomes a different event time.** `src/store/index.ts:35-39` treats a finite `Date.parse` result as valid RFC 3339. Direct probe: ingest `2026-02-30T00:00:00Z` succeeded and listing returned `2026-03-02T00:00:00Z`. The changed validator thus silently changes an invalid input while claiming to refuse malformed time; a future `since` can likewise be shifted. Remedy: validate calendar components or round-trip the parsed UTC components against the input before writing or querying, and add regression tests that require the original invalid value in the error. The test at `test/store.test.ts:132-137` covers invalid month 13, which `Date.parse` rejects, but not a rolled-over day.

No bar-weakening skip, deleted assertion, suppression, or changed baseline was found in the round-2 diff. Declined to judge licences (owner decision), live HTTP behavior (no server in this wagon), and feed availability (no network interface in this wagon). The local store tests are a suite-owned check and therefore more circular than the project typecheck; the API contract is the independent comparison. No numeric coverage, mutation, lint-warning, or type-warning bar is declared, so no invented target is reported.

## Profile

Backend/data access. The two SELECT paths share the same region bounds and order, with the time predicate only on the `since` path. Migration 1 adds a time index; no index performance claim was made. Writes are inside a transaction after time validation. The review focus was temporal correctness and contract boundaries; I made no performance or operational telemetry claim.

## Focus

The `Z`-only judgement is not justified by the contract's `format: date-time` or the quoted master ruling. It can reject a valid caller value even though the USGS example uses `Z`. The malformed-day normalization demonstrates a separate wrong timestamp reaching storage. Both trigger the changed guard in round 2; neither is an out-of-scope conjecture.

## Conditions

Fix the two blocking findings above, retain the addressed regressions, and run `npm test` plus `npm run typecheck` on the final tip. The master should settle offset acceptance against the API contract rather than treating this reviewer's reading as a new contract. Any reclassification of a condition needs the master's sentence in the gate note.

## Unrun

`npm test` was attempted at this tip and stopped before tests because `tsc: not found` (no installed dependencies in this confined review worktree); `npm run typecheck` would have the same missing compiler. The full 26-test suite and typecheck are therefore UNRUN here, notwithstanding the master's separate fresh-clone measurement. `node --experimental-strip-types --test test/store.test.ts` ran the store file only: 15 pass, 0 fail, 0 skipped. The contract test file and `npm run lint:api` are UNRUN locally. No test artifacts were installed outside the permitted scratch directory.
