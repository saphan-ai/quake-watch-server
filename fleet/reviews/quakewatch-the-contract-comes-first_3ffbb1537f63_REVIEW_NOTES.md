# REVIEW NOTES — quakewatch-the-contract-comes-first

## Ground

RED — reject. `mock/server.ts:15-18` ignores query values and `:22-24` ignores the PUT body, although `docs/api/openapi.yaml:73-74,119-120,150-151` promises 400 responses. Measured on Node 22.23.2: `answer('GET','/api/v1/events?region=atlantis')` and `?since=garbage` both returned 200 with the event example; `answer()` has no body argument, so an invalid PUT body cannot change its 200 response. Remedy: derive or implement input validation for the documented errors, and test the invalid region, time and threshold body through the HTTP handler. The order asks for a 30-line example mock, so the master should resolve whether error behavior is required of this mock or must instead be expressly described as absent before a reader uses it.

The contract at `docs/api/openapi.yaml:1` is OpenAPI 3.1. The five operations are `:39-74` GET events with `region` and `since`, `:75-94` GET threshold, `:95-120` PUT threshold, `:121-151` GET alerts with `region`, and `:152-167` GET health. Every 200 response has a schema reference and a concrete example (`:60-72,85-92,111-118,135-149,160-165`); PUT input has both (`:99-107`). `Region` is a five-value enum including `southeast-asia` (`:203-207`), and all five named latitude/longitude boxes are in `:10-18`. `Quake` lists and requires the seven requested fields (`:208-230`); `time` has `date-time` format and a UTC description (`:215-218`). The unknown-region and bad-since examples share `BadRequest` and `Error` (`:176-193,280-290`). UTC is described, but `format: date-time` alone does not restrict offsets to UTC; treat that as an owed schema precision issue if machine enforcement is intended.

`package.json:6-20` selects Node 22, TypeScript, built-in `node:test`, `tsx`, `yaml`, Redocly, and local `npm test`/`npm run mock`; `package-lock.json` is committed. `mock/server.ts` is 26 lines; `:5,8-13` reads examples from the contract and `:21-25` listens on 8080 with `PORT` override. Measured `npm ci --ignore-scripts` exit 0, `npm test` 9 pass/0 fail/0 skip, typecheck pass, and `npm audit --json` 0 vulnerabilities. No generator, generated output, consumer contracts, CI compatibility checker, or real server exists in this W0 diff; compatibility checking against the base is UNRUN because the contract is new and no checker is pinned.

## Differential

The diff is one new contract, mock, tests, toolchain and lockfile; the base has no corresponding API or mock. All 34 lockfile package entries are new: direct `@redocly/cli@2.66.1`, `@types/node@22.20.5`, `tsx@4.23.15`, `typescript@5.9.3`, `yaml@2.9.1`; transitive `esbuild@0.28.2`, `undici-types@6.21.0`, `fsevents@2.3.3`, and 26 platform-specific `@esbuild/*@0.28.2` entries. Resolved sources are npm registry URLs; no changed-version integrity anomaly exists in this additive lockfile. `esbuild` and optional `fsevents` declare install scripts. The clean install was made with scripts disabled; running their script sources was not needed for the observed suite. `npm audit signatures` produced no output for 35 seconds and was interrupted; provenance is UNRUN. Dependency release histories and publisher histories were not verified.

`redocly.yaml:5-8` disables two recommended rules. In a scratch config with both enabled, `npm run lint:api` exits 0 with two warnings: `no-server-example.com` rejects the localhost server URL (`openapi.yaml:26`), and `operation-4xx-response` asks every operation, including `/healthz` (`:157`), to declare a 4XX response. Thus the stated **zero errors** remains true; the config does lower the warning bar. The localhost URL is suitable for this local tutorial. `/healthz` has no client input, so the 4XX warning is arguably inapplicable, but the suppression is global. `security: []` (`openapi.yaml:28`) explicitly means no authentication, consistent with `:8` and the order; it does not disable a lint check.

## Unplug

Measured in `.saphan/work/quakewatch-the-contract-comes-first-review/probe/`: removed only `/healthz`'s 200 `example` from a scratch `openapi.yaml`, then ran `npm test`. All 9 tests still passed. The scratch mock's `answer('GET','/healthz')` returned `{status:200, body:undefined}`; on the server path `JSON.stringify(undefined)` yields no JSON body. The lint rule did not require an example. This is a surviving negative control for the order's “each with an example” requirement: `test/contract.test.ts:27,39-40` and `mock/server.ts:12` take the same missing value as oracle and output. Remedy: assert each operation has a defined example, validate that example against its response schema, and test the actual serialized HTTP response.

## Closure

Reject until the master settles the documented 400 behavior and the missing-example blind spot, then a fresh review can verify the remedies. No reviewed source file was changed. The review probe lives only under `.saphan/work/`; `git diff --name-only` was empty after it, while the three pre-existing untracked harness paths remained.

## Remainder

The single `README.md` is outside this W0 order, so a stranger is not shown `npm ci`, `npm run mock`, the default port, a sample curl request, or that the mock always returns canned 200 bodies and does not persist PUTs. `redocly.yaml:7` explains only `/healthz` even though its 4XX suppression applies to every operation. These are owed documentation/clarity items for the master, not independent blockers. `GET /api/v1/events/` returned 404; the OpenAPI path has no trailing slash, so this is consistent, but readers may need an explicit example. Declined to judge licences (owner decision), a real server/feed/store, clients, CI, auth, and files the order excludes.

## Profile

Backend boundary: `docs/api/openapi.yaml` is the authority; `mock/server.ts` is the paired fake. The test compares happy-path body objects to values copied from the same contract but does not validate serialized bytes or the error responses. `$ref` values are local `#/components/...` pointers only. Security profile: no auth is an explicit scope decision; no secrets or destructive path appears in this diff. Docs profile: commands in `package.json` execute, but the public start path is not documented in an in-scope file. No performance claim was made.

## Focus

The four named inputs are uncovered by `test/contract.test.ts:38-46`: unknown region -> 200 (measured); malformed `since` -> 200 (measured); PUT body outside `ThresholdInput` -> cannot be passed to `answer()` and is ignored by HTTP handler `mock/server.ts:22-24` (code evidence); trailing slash -> 404 (measured). The first two contradict the 400 response contract. The threshold body case has no input validation at all. The trailing slash is not in the contract.

Mutation map for the nine tests: the lint test (`:11-14`) turns red if `openapi` is made invalid; the region test (`:16-20`) if `southeast-asia` is removed; the operation-list test (`:30-36`) if `/healthz` is removed; each of the five operation tests (`:38-42`) if `answer()` is changed to return 201 for that operation; and the unknown-path test (`:44-46`) if the fallback becomes 200. These are assertion-level controls inferred from code, not eight executed mutation runs. The executed missing-example mutation survives every test, so the tests cannot establish that promised examples exist. The operation tests also cannot establish that a schema matches the examples or that HTTP requests are handled correctly.

## Conditions

1. Blocking: make a missing response example fail a test and a mock startup or request, and validate the example's schema; `mock/server.ts:12`, `test/contract.test.ts:27,39-40`.
2. Blocking decision: reconcile the 400 behavior at `openapi.yaml:73-74,119-120,150-151` with `mock/server.ts:15-24`; either implement and test it in the mock or document that the mock demonstrates only the successful example and keep error conformance for the later real server. The master must state which contract surface the mock promises.
3. Owed: clarify the global lint suppression at `redocly.yaml:7-8`, and provide a first-run recipe and mock limits in the in-scope documentation wagon.

## Unrun

Live HTTP requests were not run on this review seat; the master reported five live 200 responses from a separate host, which is a claim rather than this review's measurement. `npm audit signatures` and dependency release/publisher histories were unverified. A breaking-change tool was unavailable. All other named checks above were measured locally on Node 22.23.2 and npm 10.9.8.
