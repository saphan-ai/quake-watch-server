# ORDER — quakewatch-the-api-answers-from-the-store-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W3
- repo: quake-watch-server
- branch: review/quakewatch-the-api-answers-from-the-store-review
- base: fix/quakewatch-the-api-answers-from-the-store @ f2c5670c7
- reviewed-sha: f2c5670c7
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify every claim of d1a106d9a...f2c5670c7 — and nothing beyond it

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `f2c5670c7`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/supply-chain-npm/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: d1a106d9a...f2c5670c7 — 1 commit, 5 files (`src/server.ts`, `test/server.test.ts`, `docs/RUN_IT.md`, `package.json`,
`package-lock.json`). W3 of a public tutorial repository; the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

The order promised: the real server behind `docs/api/openapi.yaml` (`node:http`, no framework), reading the feed into the store
and answering the five operations from it, errors included — the contract's `info.description` says the error responses are
"for the real server, which is tested against all of them" (a W0 review condition carried to W3). A contract test validates
every response, success and error, against `openapi.yaml`. `docs/RUN_IT.md`: run with the recorded fixture, three curls and
their exact output. The mock stays (`npm run mock`); `README.md` is not touched.

The master's rulings in the order (MASTER, 2026-10-22):
1. A region with no threshold set answers `minMagnitude: 5`, `maxDepthKm: 70`, from one named constant (ASSUMED — not the owner's decision yet).
2. `GET /api/v1/events` without `region` returns the events of all five regions, newest first, each event once.
3. Bad input answers `400` with the shared error schema: unknown region, a `since` the store refuses, a `PUT` body that is not
   a `ThresholdInput` (missing field, wrong type, negative depth). An unknown path answers `404`. Nothing answers `500` for bad input.
4. The feed is read at start and every `QUAKEWATCH_REFRESH_SECONDS` (default 300); a failed refresh is logged in one line and
   never stops the server; `QUAKEWATCH_FEED_FILE` reads a file instead; `QUAKEWATCH_DB` (default `./quakewatch.db`); `PORT` (8080).

The executor's claims (claims, not facts): 72 tests, 71 pass, 1 skipped; contract test with `ajv`; controls: unknown region
answered 200 → 3 red; alert magnitude as a string → red. Its seat refused `curl`, so `docs/RUN_IT.md` outputs were produced
through the handler. A new error code `bad_threshold` in the shared Error schema's free-form code field.

MASTER'S MEASUREMENT (2026-10-22, █████, fresh clone at f2c5670c7, node v26.7.0): `npm test` 72 tests, 71 pass, 1 skipped.
Real `npm start` with the recorded fixture, then the three curls of `docs/RUN_IT.md`: each output equals the document byte
for byte; alerts before the PUT `{"alerts":[]}`; `GET /api/v1/events?region=atlantis` → 400.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Does every error the contract describes come back from the server with its status and schema? Unplug one 400 path.
2. Can any bad input reach a 500 or crash the server (a malformed JSON body, a huge body, a `since` with an offset)?
3. Does a failed feed refresh keep the server answering? Is the refresh timer cleaned up on shutdown?
4. Is the contract test a real check (does it fail on a schema drift), or does it only replay what the server says?
5. Rulings 1–4 as written; the new dependency; is `src/server.ts` plain enough for a stranger?
Licences are out of scope: the owner decides them, once.

## BOUNDARY
This diff.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-api-answers-from-the-store-review/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

**LEAVE THE WORKTREE AS YOU FOUND IT.** Before you write `- state: recommendation-ready`, delete every probe, mutation
and scratch file you created outside `.saphan/work/`, restore every file you inverted, and confirm `git status --porcelain`
in the reviewed worktree shows nothing of yours. A leftover file blocks the stream's teardown (W4a, 2026-10-10).

## Review output — the return manifest the reviewer owes
`_REVIEW_STATUS.md`: H1 `# REVIEW — quakewatch-the-api-answers-from-the-store-review`; keys `state · verdict · ref · abstract · artifacts ·
updated`; the abstract at most 5 lines. `_REVIEW_NOTES.md` H2s: Ground · Differential · Unplug · Closure · Remainder ·
Profile · Focus · Conditions · Unrun. Check with `saphan doc check _REVIEW_STATUS.md --family review-status`.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
