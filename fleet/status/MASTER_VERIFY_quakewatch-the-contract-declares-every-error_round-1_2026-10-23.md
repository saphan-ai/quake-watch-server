# MASTER VERIFY — quakewatch-the-contract-declares-every-error

- round: 1
- by: MASTER · 2026-10-23
- base: 0c36dd416 · tip af976cc01
- verdict: READY — the contract declares every status the server answers, and the contract test fails on an undeclared one

## Checks
- █████, fresh clone checked out detached at af976cc01, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 83 · pass 82 · fail 0 · skipped 1` (base 0c36dd416: 82 / 81 / 1 skipped; 1 new, none gone).
- `npx redocly lint docs/api/openapi.yaml`: "Your API description is valid".
- `PORT=18095 npm run mock`: four GET paths answer 200 (the mock still serves the success examples).
- The leg's evidence (not re-run): the undeclared-status check red first (14 fail with the contract untouched); deleting the 500 of GET /api/v1/thresholds/{region} → 1 red.
- NOTICED by the leg: the shared BadRequest lists all five 400 codes under every operation, so some are over-declared (e.g. bad_since on GET thresholds); the test accepts any code under a declared status, not per operation. Passed to the reviewer.
- Master wrong: none.

## Next
Named review on codex: `quakewatch-the-contract-declares-every-error-review`, reviewed-sha af976cc01.
