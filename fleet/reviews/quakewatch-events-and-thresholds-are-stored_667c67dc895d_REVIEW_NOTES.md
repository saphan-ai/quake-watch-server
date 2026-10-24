# REVIEW NOTES — quakewatch-events-and-thresholds-are-stored

## Ground

Reviewed `578462ad0...a59e6c409` (one commit, seven files) at HEAD `a59e6c409`; no product files changed. Runtime: Node v22.23.2, npm 10.9.8. `package.json` pins `>=22.13 <23`, npm via `package-lock.json`, `node:test` through `npm test` (`tsc --noEmit` followed by `node --import tsx --test test/*.test.ts`). No workspace declaration or CI workflow found. The source worktree had no installed dependencies; a source copy and lockfile were installed with `npm ci --ignore-scripts --no-audit --no-fund --cache ./.npm-cache` under `.saphan/work/quakewatch-events-and-thresholds-are-stored-review/verification/`. This copy returned 20 pass, 0 fail, 0 skipped, 0 todo from `npm test`; `npm run typecheck` passed separately; `npm run lint:api` passed with one pre-existing explicit ignore. `node --experimental-strip-types --test test/store.test.ts` against the reviewed source returned 9 pass, 0 fail. `git diff --check 578462ad0...a59e6c409` passed. No dependency or lockfile change, install script addition, skip, or suppression appears in the diff.

The five boxes in `src/store/regions.ts:10-16` match `docs/api/openapi.yaml:15-21` exactly: southeast-asia (-11..28, 92..141), japan (24..46, 122..146), western-north-america (30..60, -170..-115), mediterranean (30..46, -6..37), south-america (-56..13, -82..-34). This was a direct table-to-literal comparison; no repository check enforces it.

`node:sqlite` is available without an SQLite flag in the measured Node 22.23.2 runtime, while emitting `ExperimentalWarning`. The [Node 22.13.0 CLI documentation](https://nodejs.org/download/release/v22.13.0/docs/api/cli.html) says SQLite became unflagged at exactly 22.13.0 but remained experimental. Ruling: the raised engines floor is consistent with that documentation, and a built-in dependency suits this small tutorial; the warning should be disclosed to users. Cost if wrong: a stranger on another Node 22 build might hit an API difference; Node 22.13.0 itself was not run here.

## Differential

The diff introduces `Quake`, the SQLite store, a numbered migration, five copied region boxes, nine store tests, a Node engines floor change, and TypeScript inclusion of `src`. `package-lock.json` is unchanged because no dependency was added. The original eleven contract/mock tests plus nine new store tests make the measured twenty at tip. The base suite was not run, so eleven is a count read from test files rather than an independent baseline result. No quality metric or baseline command is declared in this repository; do not infer a coverage or mutation bar. Check ranking: published Node runtime documentation is external, TypeScript and API lint are project checks, and the twenty passing tests are suite checks, the most circular of these instruments.

## Unplug

All mutants were applied only to a confined source copy, run with `node --import tsx --test test/store.test.ts`, and restored afterward. Removing the event conflict clause produced two failing tests (same feed and changed event; 7 pass/2 fail). Removing the migration record insert produced two failing tests (reopen and threshold persistence; 7 pass/2 fail). Changing `time >= ?` to `time > ?` failed the since-edge test (8 pass/1 fail). Changing southeast-asia `minLon: 92` to `93` left all nine store tests green. Changing `lon BETWEEN ? AND ?` to `lon > ? AND lon <= ?` also left all nine green. Thus idempotence, migration recording, and the time edge have live alarms; region drift and the lower longitude edge do not.

## Closure

**Reject — two wrong results remain.**

1. **BLOCKING — `src/store/index.ts:66-68`; default `since` excludes stored events before 1970.** Trigger: store `{id:'ancient', time:'1969-12-31T23:59:59Z', lat:0, lon:100}` and call `listEvents('southeast-asia')` without `since`. Measured on Node 22.23.2: `countEvents() === 1`, but the list is `[]`. The interface at `src/store/index.ts:21` promises that omitting `since` means all events; `test/store.test.ts:100-107` only uses dates in 2026. Remedy: omit the SQL time predicate when no `since` is supplied, or use a range that truly covers every stored timestamp; add a pre-1970 regression that fails with the present implementation.
2. **BLOCKING — `src/store/index.ts:59,68,71`; millisecond conversion changes a valid timestamp and the `since` decision.** Trigger: insert an event at `2026-10-21T03:14:07.0001Z` and query since `2026-10-21T03:14:07.0002Z`. Measured: the returned event is included and its time is rewritten to `2026-10-21T03:14:07Z`, although it is earlier than `since`. `new Date(...).toISOString()` rounds both values to milliseconds. `test/store.test.ts:109-113` checks only whole-second equality. Remedy: preserve RFC 3339 fractional precision or explicitly narrow the accepted timestamp precision at the input contract, then test a fractional boundary and exact returned time.

Both findings concern results that callers can trust silently. The affected code is within the reviewed diff; no server or feed caller exists yet in this branch.

## Remainder

**OWED — `src/store/regions.ts:10-16`, `test/store.test.ts:85-99`:** the boxes match the contract today, but no check compares them. The southeast-asia minimum-longitude drift and lower-bound predicate mutants stayed green. Remedy: add a contract-to-code comparison plus a lower longitude edge test (and its just-outside neighbor) before this copied table is trusted in later wagons.

**OWED — `src/store/index.ts:41-44, src/store/migrations.ts:14`:** `events_time` indexes time, but `listEvents` can return an unbounded region history. This follows the current contract's list shape; decide whether the later HTTP layer will bound responses. No query plan or volume benchmark was run, so no index-performance claim is made.

Ruling: unset `getThreshold` returning `undefined` is consistent with the store interface. Cost if wrong: the later HTTP handler must decide whether to return an error/default and document it. No user-facing tutorial setup chapter was added by this diff; the later tutorial wiring must explain the Node 22.13 floor and SQLite warning. Readability is adequate for a small store; the duplicate region table is the only extra maintenance burden identified.

## Profile

Backend/data-access profile: prepared statements bind event and threshold values; `upsertEvents` uses one transaction for a feed and conflict update keyed by `id`; migrations use one transaction per version and record the version in that transaction. No cross-instance cache or in-memory rate limit appears. `listEvents` reads a DB file opened by the caller and is synchronous and unbounded. A failed SQLite operation throws to its caller; no logging or telemetry layer exists in this wagon. Security profile was also read because the diff adds persistence: the database path is caller-provided, no authentication or request handler is added, and no secrets or new dependency appear. No destructive derived path is introduced.

## Focus

Idempotent ingest: works in tests and the plain-insert mutant fails. Empty-file migration and repeat open: work in tests; removal of migration recording fails. Box literals: equal the contract, but unchecked. Latitude and maximum-longitude edge: one southeast-asia corner is tested; minimum longitude remains untested. `since` equality at whole seconds is tested; fractional equality and the absent-since all-events promise fail as detailed above. Node 22.13 floor: supported by the official Node documentation and by a newer Node 22 measurement, with an experimental warning. These observations do not inherit the executor's green/red claims.

## Conditions

Before a new review: fix both blocking time behaviours and add regressions that fail on this commit, add a region-table drift check and lower-longitude boundary test, and rerun `npm test`/`npm run typecheck` on the final tip. The master decides whether the unbounded history is acceptable for the later HTTP surface. No class was lowered from blocking to owed.

## Unrun

The exact `npm test` script was run in an installed, confined copy rather than the original worktree, because the order confines generated files to `.saphan/work/` and the original had no `node_modules`. The base commit's suite was not run. Node 22.13.0 itself was not available; the runtime claim at that floor rests on the cited Node documentation, while the execution check used Node 22.23.2. No load test or SQLite query plan was run.
