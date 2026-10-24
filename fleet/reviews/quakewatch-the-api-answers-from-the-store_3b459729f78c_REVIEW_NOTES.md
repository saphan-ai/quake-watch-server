# REVIEW NOTES — quakewatch-the-api-answers-from-the-store

## Ground
RED — reject. At `f2c5670c7e79dd154fbda8ed30fce94598a6a6c4`, a client-controlled path returns 500, and a database read failure is reported as bad input. The 400 test survives removal of its region guard. These are wrong results at the API boundary.

Scope: `d1a106d9a...f2c5670c7`, one commit; reviewed `src/server.ts`, `test/server.test.ts`, `docs/RUN_IT.md`, `package.json`, `package-lock.json`, the unchanged OpenAPI, store, feed, and mock. No product code was committed. Node v22.23.2, npm 10.9.8; `package.json` pins Node >=22.13 <23, `package-lock.json` selects npm, `npm test` runs `tsc --noEmit` then Node's built-in test runner. No CI workflow or separate workspace was found.

`npm ci --ignore-scripts --no-audit --no-fund` installed from the lock. `npm test`: 72 tests, 71 passed, 1 skipped, 0 failed. `npm run lint:api`: valid, with one pre-existing ignored problem. `git diff --check d1a106d9a...f2c5670c7`: clean. `npm audit --json --package-lock-only`: 0 advisories at all severities. The skipped live USGS test remains skipped.

## Differential
Blocking F1 — `src/server.ts:56-59,110-113`: malformed percent encoding in a threshold path, for example `GET /api/v1/thresholds/%`, throws `URIError` at `decodeURIComponent`; the handler returns 500 `internal`. The measured handler response was `{"status":500,"body":{"error":"internal","message":"something went wrong on the server"}}`. Bad input must not produce 500. Remedy: decode under a client-input guard and return the shared 400 error; test the raw HTTP handler with malformed escapes.

Blocking F2 — `src/server.ts:75-84`: `listEvents` catches every store exception and returns 400 `bad_since`, even when `since` is absent and a valid region is used. A fake store whose `listEvents` throws `database unavailable` produced `{"status":400,"body":{"error":"bad_since",...}}` for `GET /api/v1/events?region=japan`. This hides an outage as user error and produces a misleading 400. Remedy: validate `since` separately or catch only the store's typed time-validation error, and let storage failures reach a 500 shared error; add a store-failure control with a valid request.

Blocking F3 — `src/server.ts:104-110`: the handler accumulates every request body without a byte limit, including GET and unknown paths, before routing. A peer can hold arbitrary data in `chunks` and force a second allocation in `Buffer.concat`. The public server has no authentication. Remedy: enforce a small maximum body size while reading and discard bodies for methods that do not need them; verify an oversized PUT is refused and the server remains responsive. This conclusion follows directly from the unbounded `data` listener; no exhaustion run was made.

Blocking F4 — `src/server.ts:137-141`: the refresh interval handle and HTTP server handle are discarded. There is no shutdown path, so the timer cannot be cleared and the SQLite store cannot be closed. Remedy: retain both handles and clear the interval and close the store on server shutdown; prove the interval does not fire after close. This is one of the order's explicit review questions.

The default threshold comes from one named constant (`src/server.ts:10`); all-region results deduplicate by ID and sort newest first (`src/server.ts:76-82`); the recorded fixture, PUT, and alert behavior pass the suite. Malformed JSON, missing fields, wrong types, negative depth, unknown regions, and rejected `since` have explicit 400 tests. A missing feed file logged one failure line, and a subsequent `/healthz` answer was 200. `docs/RUN_IT.md` supplies the three commands and expected outputs; the master's real-curl measurement is reported in the order, while this leg did not repeat those curls.

## Unplug
I changed exactly the `region` guard at `src/server.ts:73` to `false && ...`, ran `node --import tsx --test --test-name-pattern='400: unknown region on events' test/server.test.ts`, and the test still PASSED (1/1). The invalid region fell through to the store; the broad catch turned its exception into `bad_since`, which the test accepts through `/^(unknown_region|bad_since|bad_threshold)$/` (`test/server.test.ts:168`). This control is not effective. Restored the source; `git diff -- src/server.ts` is empty.

For schema drift, I changed only `components.schemas.Quake.properties.magnitude.type` from `number` to `string` in `docs/api/openapi.yaml`. The targeted `GET /api/v1/events with a region lists its events` test FAILED with `data/events/0/magnitude must be string` (0/1 passed). Restored the contract; `git diff -- docs/api/openapi.yaml` is empty. The Ajv response validator is a real shape check for exercised responses, but `validateFormats: false` (`test/server.test.ts:17`) leaves format drift unchecked, and the tests do not cover every possible request.

## Closure
Reject this round until F1-F4 are addressed with direct controls. The false 400 control also needs a precise `unknown_region` assertion so removing the guard turns the suite red. Re-run `npm test`, `npm run lint:api`, and the malformed-path, store-failure, oversized-body, and timer-close controls after the fixes. No source changes from this review remain in the worktree.

## Remainder
Owed: `test/server.test.ts:45-50` validates the body of unknown paths against `Error` without reading a response entry from OpenAPI; the current OpenAPI does not declare 404. Thus the claim that every response is checked against an operation's documented status is broader than the test's reach. Add an explicit 404 response to the contract if that is the intended public behavior, then validate status and body from it. `test/server.test.ts:17` disables format validation, so `time` format is not checked by Ajv. The review did not judge license policy, per the order.

## Profile
Backend: store access is synchronous and indexed by the existing region bounding query; all-region reads scan five regions and merge in memory, so response size is unbounded by the API. In-memory request accumulation is the principal capacity fault (F3). Refresh failure is visible as one console line and did not prevent the health response; there is no deadline in `fetchQuakes` (`src/feed/usgs.ts:21-35`), so a stalled remote feed can delay startup indefinitely. This is owed follow-up unless the master treats the startup-liveness promise as blocking.

Supply chain: `package.json` adds direct dev dependency `ajv@^8.20.0`; the lock adds `ajv@8.20.0`, `fast-deep-equal@3.1.3`, `fast-uri@3.1.9`, `json-schema-traverse@1.0.0`, and `require-from-string@2.0.2`, all resolved from `registry.npmjs.org` with integrity values and no lock-recorded install scripts. No existing package version or integrity changed. The manifest also adds `start` and raises the Node engine floor to 22.13, while correcting `mock` script spacing. No new dependency `preinstall`, `install`, `postinstall`, or `prepare` script appeared in the installed package manifests. The package name, registry sources, and script inventory showed no hostile-package signal. Ajv is test-only, so audit reachability is test-time. Signature verification was interrupted without a result.

## Focus
Order rulings 1-4: default 5/70 and all-region deduplication hold in the tested fixture. Bad-input handling is incomplete (F1, F2); malformed JSON and offset `since` return 400 in the suite. Refresh catches a missing file and keeps the store queryable, but timer cleanup is absent (F4). The contract test catches a magnitude schema drift, while the 400 guard unplug survives. The 149-line `src/server.ts` remains a single plain `node:http` module, although request handling, feed refresh, and lifecycle share that file; readability alone is not a blocker.

## Conditions
F1-F4 are blocking. F1: malformed path must return shared 400. F2: store outage must not be reported as `bad_since`. F3: request bytes must be bounded. F4: refresh interval and store must close with the server. The 400 negative control must fail when its guarded field, the events `region`, is bypassed. No condition was reclassified downward.

## Unrun
`npm audit signatures` produced no output within 35 seconds and was interrupted; signature status is unverified. No full live-USGS test, memory exhaustion run, or real-curl replay was performed. The master's separate real-curl result is a claim carried in the kickoff brief, not this leg's measurement. No automated OpenAPI compatibility diff tool exists in the repository; contract compatibility was read manually, and the contract was unchanged by the reviewed commit.
