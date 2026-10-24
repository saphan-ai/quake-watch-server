# REVIEW NOTES — quakewatch-the-contract-comes-first

## Ground

Reviewed `21dafea60...73f09100c`, focusing on `b35ee8dfe...73f09100c`, at HEAD `73f09100c` on Node v22.23.2. `npm ci` succeeded; `npm test` passed 11/11, including typecheck and the Redocly lint test; `npm run lint:api` exited 0 with one explicitly ignored problem. The repository pins Node `>=22 <23` in `package.json:7`, uses npm's `package-lock.json` (lockfile version 3), TypeScript, and Node's built-in test runner. Round 2 changes no manifest or lockfile. The wagon introduces five direct development dependencies; the lockfile has 35 package entries, all resolved URLs checked were on registry.npmjs.org, and its install-script flags name esbuild 0.28.2 and optional fsevents 2.3.3. The `npm ci` output reported zero vulnerabilities; this is an advisory check, not a source audit.

## Differential

Round 2 adds a startup guard for absent response examples (`mock/server.ts:16-17`), a request handler test (`test/contract.test.ts:49-61`), a local Redocly exception (`.redocly.lint-ignore.yaml:3-5`), and explicit mock scope in code and contract (`mock/server.ts:8`, `docs/api/openapi.yaml:10-11`). The five operations, shared error and Quake schemas, five-value Region enum including `southeast-asia`, and examples remain in `docs/api/openapi.yaml`. `wc -l mock/server.ts` is 30. `mock/server.ts:5,13` reads response examples from that contract; `mock/server.ts:30` defaults to port 8080 and reads `PORT`. A live `PORT=18088 npm run mock` returned status 200 and JSON content type for all five operations.

## Unplug

Removed exactly the `GET /healthz` 200 example at `docs/api/openapi.yaml:167-168`: `npm test` exited 1 because importing `mock/server.ts` made `test/contract.test.ts` fail at file level with `openapi.yaml has no 200 example for: GET /healthz`; `npm run mock` independently exited 1 with the same message before listening. This is a file-level test failure, rather than the named example-presence assertion at `test/contract.test.ts:44-47`, because the module import executes first.

Changed exactly `magnitude: 5.4` to `magnitude: strong` at `docs/api/openapi.yaml:71`: `npm test` exited 1; its `the contract lints with no errors` test failed, while the other 10 tests passed. This validates the example schema through Redocly's `no-invalid-media-type-examples: error` at `redocly.yaml:8`. It does not make the mock itself reject a wrong-typed example at startup.

Changed only the handler's `JSON.stringify(body)` to `String(body)` at `mock/server.ts:27`: `npm test` exited 1 with the `HTTP handler sends the example as serialized JSON` assertion at `test/contract.test.ts:59`; the other 10 tests passed. All mutations were restored; `git diff --exit-code` returned 0 afterward.

## Closure

Condition 1 ADDRESSED: the missing example stops startup and turns the suite red; the wrong-typed example turns the lint test red. Condition 2 ADDRESSED under the master's explicit ruling: `mock/server.ts:8` and `docs/api/openapi.yaml:10-11` both say the mock serves only success examples, does not validate input, and never answers 400. `answer()` at `mock/server.ts:19-22` confirms only 200 for matching routes and 404 otherwise. Contract error responses remain a real-server W3 obligation. Condition 3 ADDRESSED for W0 lint scope; first-run documentation remains W6 work under the master's routing.

## Remainder

OWED, `redocly.yaml:4-8` and `.redocly.lint-ignore.yaml:3-5`: the exception is keyed only to `/healthz`, but the underlying recommended `operation-4xx-response` rule is still warning severity. Renaming `/healthz` to `/heartbeat` in `docs/api/openapi.yaml:155` produced an unsuppressed `Operation must have at least one 4XX response` warning at the new path; `npm run lint:api` still exited 0. If a future wagon relies on lint exit status to enforce error-response coverage, set this rule to error and retain only the `/healthz` exception. The exact-path exception then needs updating if `/healthz` is intentionally renamed. This is owed enforcement clarity, not a reason to rerun W0.

OWED in W6: a simple first-run recipe and the mock's limits in tutorial documentation. No license judgment was made; the order assigns licenses to the owner. Declined to judge the real server's 400/500 behavior because W3 is not part of this wagon.

## Profile

Contract-first boundary: `docs/api/openapi.yaml` is the authority; the mock imports it rather than copying JSON. The test at `test/contract.test.ts:49-61` drives `handle()` through fake request and response objects and asserts status, content type, and serialized JSON string. The serialization mutation proves it checks more than `answer()`; the fake does not verify Node's actual socket behavior. A separate live local request to `/healthz` returned `200 application/json {"status":"ok"}`. No generated client, consumer contract, real server, or compatibility checker exists in this initial wagon. All `$ref` values inspected in the contract are local `#/components/...` references.

## Focus

The new handler test proves what `handle()` sends to its response object's `end()` method, not bytes on a socket. The five live success requests show the server reaches the same routes on `PORT=18088`; they do not validate all wire payloads against the schemas. This matches the W0 mock promise. `test/contract.test.ts:49-61` should not be cited as a real-server contract test in W3.

## Conditions

Accept W0 with the W6 documentation obligation and the W3 real-server error conformance obligation carried forward. The lint warning severity should be made explicit before any later wagon treats `npm test` as proof that every operation has a documented 4XX response. No additional W0 code correction is required by the round-1 blockers.

## Unrun

Real-server response conformance and the W6 first-run tutorial were not run because those wagons are not present in this W0 diff. No compatibility-diff command could run against a pre-contract baseline. No other in-scope review check was left unrun.
