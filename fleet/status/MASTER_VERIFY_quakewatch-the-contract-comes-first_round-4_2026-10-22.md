# MASTER VERIFY — quakewatch-the-contract-comes-first

- round: 4
- by: MASTER · 2026-10-22
- base: 21dafea60 · tip 73f09100c (previous round tip b35ee8dfe)
- verdict: READY — both blocking conditions of review round 1 measured closed, each with a negative control run by the master

## Checks
- █████, fresh clone checked out detached at 73f09100c, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 11 · pass 11 · fail 0` (was 9 at b35ee8dfe; 2 new tests, none gone).
- `npx redocly lint docs/api/openapi.yaml`: "Your API description is valid", "1 problem is explicitly ignored" (the `/healthz` 4XX exception in `.redocly.lint-ignore.yaml`). `wc -l mock/server.ts`: 30 (limit 30).
- Negative control 1 (condition 1, executed): removed the `/healthz` 200 example in the scratch clone → `npm test` exit 1, `Error: openapi.yaml has no 200 example for: GET /healthz`. Restored.
- Negative control 2 (condition 1, schema, executed): set the events example `magnitude` to the string "strong" → `npm test` exit 1, `fail 1`, `Validation failed with 2 errors.` Restored; `git status` clean.
- Live mock (`PORT=18088 npm run mock`): GET events, GET threshold, PUT threshold, GET alerts, GET /healthz → five `HTTP/1.1 200 OK`.
- Condition 2: the master's ruling (the mock serves only success examples; errors are W3's) is written in `mock/server.ts` and in `info.description`.
- Merged tree: `main` is still 21dafea60, so the stream is a fast-forward and the tree at 73f09100c is the merged tree.
- Not measured: Node 22 itself (both hosts run Node 26).
- Master wrong: the order allowed that Redocly might have no per-operation exception; the leg measured that it has one and used it.

## Next
Named review round 2 on codex: `quakewatch-the-contract-comes-first-review`, reviewed-sha 73f09100c.
