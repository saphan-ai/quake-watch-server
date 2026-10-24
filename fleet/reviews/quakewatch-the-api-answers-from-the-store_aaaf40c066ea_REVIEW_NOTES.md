# REVIEW NOTES — quakewatch-the-api-answers-from-the-store

## Ground

**RED — The OpenAPI response declarations and server behavior diverge across the API.** `docs/api/openapi.yaml:60-179` lists 500 only for `/healthz`, while `src/server.ts:35-40` returns 500 for store failures on events, alerts and thresholds. The server also returns `body_too_large`, `bad_request` and `not_found` without those cases being described by the operation responses. `test/server.test.ts:27-29,53-57` validates the shared Error shape through a fallback when the response is absent; it does not validate the operation's declared status. This is a separate contract change per the master's 2026-10-22 ruling, with a condition before downstream client work.

Reviewed commit `1586a83505fe6476483bde9662423dd8d046f6bc` (read with `git rev-parse HEAD`), round 2 `f2c5670...1586a8350` and wagon `d1a106d...1586a8350`. Node v22.23.2; npm lockfile; `npm test` invokes `tsc --noEmit` then Node's test runner through tsx. The checkout had no installed dependencies, so the first `npm test` and `npm run lint:api` were unavailable (`tsc: not found`, `redocly: not found`). I copied the source under `.saphan/work/quakewatch-the-api-answers-from-the-store-review/copy`, ran `npm ci --ignore-scripts --no-audit --no-fund` there, and ran checks there. Full `npm test`: 82 tests, 81 passed, 1 intentionally skipped live USGS test, 0 failed; typecheck passed. `npm run lint:api` exited 0 with the `/healthz` missing-4XX warning. `npm audit --package-lock-only --json`: 0 vulnerabilities at every severity. No lockfile change from the install.

The wagon adds direct `ajv@8.20.0` and transitive `fast-deep-equal@3.1.3`, `fast-uri@3.1.9`, `json-schema-traverse@1.0.0`, `require-from-string@2.0.2`; all five resolve from registry.npmjs.org with integrity entries and no install scripts in their installed manifests. The Node engine minimum changes to 22.13. The round-2 commit changes no dependency or run-guide file.

## Differential

Round 2 adds guarded threshold-path decoding (`src/server.ts:75-83`), validates `since` before calling the store and lets store failures become 500 (`src/server.ts:95-112`), caps PUT bodies at 16 KiB and answers other methods without retaining a body (`src/server.ts:129-161`), and adds a closeable server lifecycle (`src/server.ts:178-232`). The exported `toStoredTime` is the store's existing validator. The rest of the wagon supplies the five HTTP operations, fixture-based refresh and run guide. No round-2 API success shape or threshold default changed.

## Unplug

All mutations were made in the isolated copy and restored after each test; `git diff --no-index` confirmed the copy's `src/server.ts` matches the reviewed file afterward. Removing the F1 decode guard made both malformed-escape tests fail (2 red). Changing the F2 outer store-failure response to `bad_since` made both store-failure tests fail (2 red). Disabling the F3 size comparison made the 17 KiB PUT test fail (1 red). Removing the F4 `clearInterval` in `close()` made the lifecycle test fail (1 red). Removing each region guard independently made its unknown-region test fail (events, alerts, threshold: 1 red each). An initial F4 test-name filter matched no test; the corrected `stops the listener` filter ran the lifecycle test and produced the failure above. The mutation script is `.saphan/work/quakewatch-the-api-answers-from-the-store-review/copy/review-mutants.mjs`.

## Closure

F1 ADDRESSED — `src/server.ts:75-83`; real HTTP requests for `%`, `%zz` and `%E0%A4%A` returned 400 `unknown_region`, and the guard mutation reddened tests. F2 ADDRESSED — `src/server.ts:35-40,95-109`; a valid Japan request with a failing store returned 500 `unavailable`, while invalid `since` returned 400 `bad_since`; the error-classification mutation reddened tests. F3 ADDRESSED — `src/server.ts:142-159`; a real 20,000-byte PUT returned 400 `body_too_large`, followed by a 200 health request; the limit mutation reddened its test. F4 ADDRESSED — `src/server.ts:195-218,230-232`; `close()` clears the timer and closes the HTTP listener and store, and the lifecycle test reddened when timer clearing was removed. The same real listener returned byte-identical JSON for all three `docs/RUN_IT.md` curl examples. Independent probes ran in `review-probe.ts` in the isolated copy.

## Remainder

OWED, separate follow-up: on a `listen()` error, `start()` clears its timer and rejects without closing the store (`src/server.ts:199-207`). An injected server that emitted `listen failed` showed `store.close calls: 0` in `review-start-failure.ts`. Remedy: close the owned store on startup failure or explicitly put cleanup in the caller, with a failure-path test. This is new outside the F1–F4 re-review and does not reopen round 2.

NOTICED: `docs/RUN_IT.md:3` says Node 22.13 or newer, while `package.json:7` declares `<23`. Remedy: align the guide with the supported engine range or widen the engine range after verification. The guide examples themselves passed on Node 22.23.2.

Declined to judge: live USGS availability and licensing, both outside this diff and this order. The suite's live-feed test is intentionally skipped.

## Profile

Backend and HTTP contract. Data access remains through the existing SQLite store; this round adds no query or index. The error path logs the store exception at `src/server.ts:39` and returns a shared error body. The contract is `docs/api/openapi.yaml`; `mock/server.ts` promises only success examples. No generator or compatibility-diff checker is configured; there is no contract-file delta in round 2. The test's fallback proves the common error payload shape, but cannot establish that all statuses are declared by the operation. The live feed remains outside this review's network boundary.

## Focus

F1–F4 are addressed. Invalid `since`, unknown regions, malformed threshold escapes and oversized bodies return 400; unknown paths return 404; valid requests with store failure return 500. No exercised bad input returned 500, and no exercised store failure returned 400. The fixture, defaults (magnitude 5, depth 70 km), absent-region events, environment settings and three run-guide outputs retain their round-1 behavior. The contract gap is not a new F1–F4 code defect: editing the contract was expressly excluded from this wagon, but leaving it for client generation would teach clients an incomplete response set.

## Conditions

Accept with one condition: before W4 client implementation or generation, land a separate contract change declaring the server's 500 responses and the actual 400/404 cases, then make the contract tests fail when an operation returns an undeclared status. The master should record this condition in the gate note. Cost if deferred: consumers generated or implemented from OpenAPI can miss real error responses. The startup cleanup and guide engine-range findings are owed follow-ups, not conditions of this wagon.

## Unrun

none
