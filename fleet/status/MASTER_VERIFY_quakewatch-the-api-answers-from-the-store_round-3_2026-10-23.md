# MASTER VERIFY — quakewatch-the-api-answers-from-the-store

- round: 3
- by: MASTER · 2026-10-23
- base: d1a106d9a · tip 1586a8350 (previous round tip f2c5670c7)
- verdict: READY — F1–F4 of review round 1 are paid; measured on a real server, not only through the handler

## Checks
- █████, fresh clone checked out detached at 1586a8350, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 82 · pass 81 · fail 0 · skipped 1` (round 1: 72).
- Real server (`node --import tsx src/server.ts`, which is `npm start`) on port 18094 with the recorded feed: the three curls of `docs/RUN_IT.md` equal the document byte for byte.
- F3 over real HTTP: a 20 000-byte `PUT` → 400; the server answered `/healthz` 200 afterwards.
- F1 over real HTTP: `GET /api/v1/thresholds/%zz` → 400.
- F4: SIGINT to the server process → it stopped within 2 s.
- The leg's evidence (not re-run): 8 tests red on f2c5670 first; region guard bypassed → 3 red; `clearInterval` removed → the lifecycle test red.
- NOTICED by the leg for the contract (not edited, as ordered): 500 `unavailable` is declared only on /healthz; 404 `not_found` nowhere; `body_too_large` and `bad_request` codes are not listed. The master takes these to a contract amendment.
- Master wrong: the leg notes the sandbox refuses every listen; the order had already said so.

## Next
Named review round 2 on codex: `quakewatch-the-api-answers-from-the-store-review`, reviewed-sha 1586a8350.
