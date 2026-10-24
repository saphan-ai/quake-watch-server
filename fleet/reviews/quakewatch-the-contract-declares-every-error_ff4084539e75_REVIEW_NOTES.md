# REVIEW NOTES — quakewatch-the-contract-declares-every-error

## Ground

Reviewed `0c36dd416...af976cc01` (one commit; only `docs/api/openapi.yaml` and `test/server.test.ts`). `git rev-parse --short=9 HEAD` returned `af976cc01`. The author's and master's reported runs were treated as claims; I ran the checks below on Node v22.23.2, within `package.json`'s `>=22.13 <23` range. The npm lockfile supplies the dependencies; there is no CI workflow or contract compatibility checker in this repository. The mock file and `src/server.ts` did not change.

`npm test`: 83 tests, 82 passed, 0 failed, 1 skipped (the live USGS test guarded by `QUAKEWATCH_LIVE`). This includes `tsc --noEmit` and the mock/real contract tests. `npm run lint:api`: exit 0, API description valid; Redocly reports one explicitly ignored problem already configured by the repository. The first `npm test` could not find `tsc` because this worktree had no dependencies. An initial contained `npm ci` met an unwritable home npm cache; a second `npm ci` with its cache and installation under `.saphan/work/quakewatch-the-contract-declares-every-error-review/` succeeded. A temporary `node_modules` link used to execute the scripts was removed after the checks.

## Differential

At `src/server.ts:44-89`, routing gives `GET /healthz` 200/500; `GET /api/v1/events` 200/400/500; `GET` and `PUT /api/v1/thresholds/{region}` each 200/400/500; and `GET /api/v1/alerts` 200/400/500. The five operation response maps at `docs/api/openapi.yaml:68-186` match these status sets exactly. The 404 for an unknown path or method has no operation to attach to and is explained at `docs/api/openapi.yaml:18-19`. The `bad_request` for an unreadable path is also outside an operation. `src/server.ts:135-160` can answer `body_too_large` on a PUT before route selection; it is covered by the PUT operation's 400 response when that path is selected. On an unknown PUT path it is an off-operation 400 as well: a direct handler probe with `PUT /nope` and 17,000 bytes returned `400 body_too_large`.

For 400, the real paths produce `unknown_region` on events, alerts and thresholds; `bad_since` on events; and `bad_threshold` or `body_too_large` on PUT thresholds. The one shared `BadRequest` component at `docs/api/openapi.yaml:195-231` shows all five codes, including `bad_request` for the unreadable path. This over-declares codes in examples for individual operations, but does not over-declare an HTTP status. Its `Error.error` schema remains a plain string (`docs/api/openapi.yaml:318-328`), so a generated client cannot infer an operation-specific code union from these examples. Cost: generated examples or rendered API docs can suggest an impossible code, such as `bad_since` on GET thresholds. The global description says the examples list every 400 code, rather than promising that each operation can emit each one. With the order requiring one shared response per status and a super-simple contract, I treat this as a documentation precision debt, not a blocker for W4 client generation.

## Unplug

I removed exactly the `500` response declaration for `GET /api/v1/thresholds/{region}` at `docs/api/openapi.yaml:108-109` and ran `node --import tsx --test test/server.test.ts`. The test `500: a store that fails on getThreshold or setThreshold answers unavailable` failed with `the contract does not declare 500 for GET /api/v1/thresholds/{region}`; the file reported 41 pass and 1 fail. I restored the declaration; `git diff -- docs/api/openapi.yaml test/server.test.ts` was empty afterward. The test's `declared()` assertion at `test/server.test.ts:24-33` is the control that turned red.

## Closure

Verdict: accept-with-conditions. The diff supplies every reachable operation status, shares the error response schema and examples, and fails when a tested operation emits an undeclared status. The contract remains a short five-operation document with one shared response per error status. The off-operation branch of the new test helper asserts a narrower error set than the server really has; the condition below prevents that false guard from becoming trusted. No source change was made by this review. `git diff --check 0c36dd416...af976cc01` passed. The working tree has no tracked modifications from the probe.

## Remainder

NOTICED, non-blocking: `docs/api/openapi.yaml:195-231` gives every operation the same 400 code examples, although the server has narrower per-operation sets. If clients need precise per-operation error-code guidance later, add operation-level descriptions or a more specific response model and make the contract test check those declared sets. The current `test/server.test.ts:35-38,65-68` checks each returned code against the global shared examples, so it cannot detect that sort of over-declaration. There is no configured base-to-tip OpenAPI compatibility check; I inspected the diff by hand and found additions to response declarations and descriptions, with no removed operation, response, or schema member. No dependency manifest or lockfile changed. Declined to judge: licensing, as reserved for the owner.

## Profile

Docs and HTTP contract boundary. The authoritative contract is `docs/api/openapi.yaml`; `src/server.ts` is the real provider and `mock/server.ts` is the success-example mock. `test/server.test.ts` validates serialized real replies against the contract, and `test/contract.test.ts` checks mock examples. `$ref` targets in the changed contract are local `#/components/...` references. The mock remains success-only by design and unchanged in this diff. There is no generated client or consumer contract in this repository to run. The new change adds no I/O, store access, authentication, or performance claim.

## Focus

1. Every operation declares exactly the reachable HTTP statuses, based on the server's route and handler branches noted above.
2. Removing one 500 declaration produced the expected assertion failure, then was restored.
3. Shared 400 examples over-declare possible codes per operation. The cost is misleading examples, while generated types remain generic because `error` is a string. This is owed precision work if clients later depend on those lists. Separately, the helper's off-operation 400 assertion excludes a real `body_too_large` response.
4. The five-operation contract remains readable, though the long shared 400 description is the least concise part.

## Conditions

Before W4, correct `test/server.test.ts:70-74`: an unknown `PUT` path with an oversized body can return `400 body_too_large`, not only `400 bad_request` or `404 not_found`. Add that exact handler case as a regression test, then make the off-operation assertion and `info.description` account for it. The condition concerns the reviewed test helper and its corresponding contract explanation; no server behavior change is required.

## Unrun

none
