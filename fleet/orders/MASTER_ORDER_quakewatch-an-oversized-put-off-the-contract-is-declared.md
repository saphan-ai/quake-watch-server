# MASTER ORDER — quakewatch-an-oversized-put-off-the-contract-is-declared

- track: quakewatch-server
- worktree: █████
- repo: quake-watch-server
- branch: fix/quakewatch-an-oversized-put-off-the-contract-is-declared
- base: main @ af9a71184
- lands-on: main
- note: pays the W3b review's condition before W4

## Asked
The W3b review (codex, accept-with-conditions, 2026-10-23): "Before W4, correct test/server.test.ts:70-74: an unknown PUT path with an oversized body can return 400 body_too_large, not only 400 bad_request or 404 not_found. Add that exact handler case as a regression test, then make the off-operation assertion and info.description account for it. [...] no server behavior change is required."

## W1 — an oversized PUT on any path is declared and tested
**lands** test/server.test.ts (the off-operation assertion allows 400 body_too_large for a PUT; a regression case on /api/v1/nothing), docs/api/openapi.yaml (one sentence in info.description). **dod** the new case red with the old helper and green after; npm test and lint pass. **class** self-authored, master-verify-only (a documented existing behaviour, no server change).
