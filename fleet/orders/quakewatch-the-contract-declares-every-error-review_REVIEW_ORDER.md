# ORDER — quakewatch-the-contract-declares-every-error-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W3b
- repo: quake-watch-server
- branch: review/quakewatch-the-contract-declares-every-error-review
- base: fix/quakewatch-the-contract-declares-every-error @ af976cc01
- reviewed-sha: af976cc01
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify every claim of 0c36dd416...af976cc01 — and nothing beyond it

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `af976cc01`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: 0c36dd416...af976cc01 — 1 commit, 2 files (`docs/api/openapi.yaml`, `test/server.test.ts`). W3b of a public tutorial
repository; the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

Why it exists — the W3 review's condition, verbatim (2026-10-23):
> Accept with one condition: before W4 client implementation or generation, land a separate contract change declaring the
> server's 500 responses and the actual 400/404 cases, then make the contract tests fail when an operation returns an undeclared
> status. [...] Cost if deferred: consumers generated or implemented from OpenAPI can miss real error responses.

The order asked: every operation declares every status `src/server.ts` can answer for it, with the shared error schema and an
example per status (500 `unavailable` on every store-backed operation; each 400 case: unknown region, bad `since`, bad threshold,
`body_too_large`, `bad_request`; the 404 `not_found` for an unknown path explained in `info.description`); one shared `responses`
entry per status, referenced; the contract test fails on an undeclared status; lint 0 errors; the mock unchanged; no change to
`src/server.ts` behaviour.

The executor's claims (claims, not facts): the check was red first (14 fail with the contract untouched); 83 tests, 82 pass,
1 skipped; deleting the 500 of `GET /api/v1/thresholds/{region}` → red. NOTICED: the shared BadRequest lists all five 400 codes
under every operation, so some are over-declared (e.g. `bad_since` on GET thresholds), and the test accepts any code under a
declared status rather than per operation.

MASTER'S MEASUREMENT (2026-10-23, █████, fresh clone at af976cc01, node v26.7.0): `npm test` 83 / 82 pass / 1 skipped; lint
valid; `npm run mock` answers 200 on four GET paths.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Does each operation now declare every status `src/server.ts` can answer for it — and only those? Read the server, not the claim.
2. Does the contract test fail on an undeclared status? Unplug one declaration yourself.
3. Is the over-declaration NOTICED by the executor a defect for a client generated from this contract, or acceptable? Cost?
4. Is the contract still readable for a stranger?
Licences are out of scope: the owner decides them, once.

## BOUNDARY
This diff.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-contract-declares-every-error-review/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

**LEAVE THE WORKTREE AS YOU FOUND IT.** Before you write `- state: recommendation-ready`, delete every probe, mutation
and scratch file you created outside `.saphan/work/`, restore every file you inverted, and confirm `git status --porcelain`
in the reviewed worktree shows nothing of yours. A leftover file blocks the stream's teardown (W4a, 2026-10-10).

## Review output — the return manifest the reviewer owes
`_REVIEW_STATUS.md`: H1 `# REVIEW — quakewatch-the-contract-declares-every-error-review`; keys `state · verdict · ref · abstract · artifacts ·
updated`; the abstract at most 5 lines. `_REVIEW_NOTES.md` H2s: Ground · Differential · Unplug · Closure · Remainder ·
Profile · Focus · Conditions · Unrun. Check with `saphan doc check _REVIEW_STATUS.md --family review-status`.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
