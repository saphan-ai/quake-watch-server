# ORDER — quakewatch-the-api-answers-from-the-store-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W3
- round: 2
- repo: quake-watch-server
- branch: review/quakewatch-the-api-answers-from-the-store-review
- base: fix/quakewatch-the-api-answers-from-the-store @ 1586a8350
- reviewed-sha: 1586a8350
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify that round 2 (f2c5670c7...1586a8350) closes the findings of review round 1, and judge the whole wagon d1a106d9a...1586a8350

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `1586a8350`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/supply-chain-npm/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: round 2 is f2c5670c7...1586a8350 — 1 commit; the wagon is d1a106d9a...1586a8350. W3 of a public tutorial repository;
the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

Round 1's order and rulings still bind (default threshold 5 / 70 km, events without region = all regions, bad input 400 with the
shared error schema, unknown path 404, never 500 for bad input, refresh at start and on a timer, `QUAKEWATCH_FEED_FILE`,
`QUAKEWATCH_DB`, `PORT`; `docs/RUN_IT.md`'s outputs).

Your round-1 findings, verbatim:
> Blocking F1 — `src/server.ts:56-59,110-113`: malformed percent encoding in a threshold path, for example `GET /api/v1/thresholds/%`, throws `URIError` at `decodeURIComponent`; the handler returns 500 `internal`. The measured handler response was `{"status":500,"body":{"error":"internal","message":"something went wrong on the server"}}`. Bad input must not produce 500. Remedy: decode under a client-input guard and return the shared 400 error; test the raw HTTP handler with malformed escapes.
>
> Blocking F2 — `src/server.ts:75-84`: `listEvents` catches every store exception and returns 400 `bad_since`, even when `since` is absent and a valid region is used. A fake store whose `listEvents` throws `database unavailable` produced `{"status":400,"body":{"error":"bad_since",...}}` for `GET /api/v1/events?region=japan`. This hides an outage as user error and produces a misleading 400. Remedy: validate `since` separately or catch only the store's typed time-validation error, and let storage failures reach a 500 shared error; add a store-failure control with a valid request.
>
> Blocking F3 — `src/server.ts:104-110`: the handler accumulates every request body without a byte limit, including GET and unknown paths, before routing. A peer can hold arbitrary data in `chunks` and force a second allocation in `Buffer.concat`. The public server has no authentication. Remedy: enforce a small maximum body size while reading and discard bodies for methods that do not need them; verify an oversized PUT is refused and the server remains responsive. This conclusion follows directly from the unbounded `data` listener; no exhaustion run was made.
>
> Blocking F4 — `src/server.ts:137-141`: the refresh interval handle and HTTP server handle are discarded. There is no shutdown path, so the timer cannot be cleared and the SQLite store cannot be closed. Remedy: retain both handles and clear the interval and close the store on server shutdown; prove the interval does not fire after close. This is one of the order's explicit review questions.

The master's rulings for round 2 (MASTER, 2026-10-22): F1 — a path segment that does not decode → 400; F2 — `since` validated
before the store; a store failure → 500 `unavailable` (the contract's ServerError example); paths where the contract lists no 500
go on the NOTICED list (the contract is not edited in this wagon); F3 — only PUT reads a body, over 16 KiB → 400 `body_too_large`;
F4 — the server returns a handle whose `close()` stops the listener, clears the timer and closes the store; `npm start` calls it
on SIGINT/SIGTERM. Plus: the unknown-region tests must fail when the guard is removed.

The executor's round-2 claims (claims, not facts): F1–F4 each with a test red on f2c5670 first (8 red); region guard bypassed
→ 3 red; `clearInterval` removed → lifecycle test red; 82 tests, 81 pass, 1 skipped; `toStoredTime` now exported from the store;
a stand-in HTTP server is injected for the lifecycle test because its seat refuses `listen()`. NOTICED for the contract: 500 only
on /healthz; 404 `not_found`, `body_too_large`, `bad_request` not listed.

MASTER'S MEASUREMENT (2026-10-23, █████, fresh clone at 1586a8350, node v26.7.0): `npm test` 82 / 81 pass / 1 skipped. A real
server (`npm start`'s command) on a port: the three `docs/RUN_IT.md` curls byte-equal; a 20 000-byte PUT → 400 and the server
still answers; `GET /api/v1/thresholds/%zz` → 400; SIGINT → the process stopped within 2 s.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Are F1–F4 closed? Re-run your own probes, and unplug each fix once.
2. Does any bad input still reach 500, or any server failure still come back as 400?
3. Is the NOTICED contract gap a condition for this wagon or a separate contract change? Say which, with the cost.
4. Did round 2 break any round-1 promise or the run guide?
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
