# ORDER — quakewatch-events-and-thresholds-are-stored-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W2
- round: 2
- repo: quake-watch-server
- branch: review/quakewatch-events-and-thresholds-are-stored-review
- base: fix/quakewatch-events-and-thresholds-are-stored @ b4d525001
- reviewed-sha: b4d525001
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify that round 2 (a59e6c409...b4d525001) closes the conditions of review round 1, and judge the whole wagon 578462ad0...b4d525001

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `b4d525001`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: round 2 is a59e6c409...b4d525001 — 1 commit (`src/store/index.ts`, `test/store.test.ts`); the wagon is
578462ad0...b4d525001. W2 of a public tutorial repository; the owner's bar is "super simple" (owner, 2026-10-21:
*"It must be simple, super simple, how to start."*).

Round 1's order (still binding): a SQLite store in `src/store/` with numbered migrations, `upsertEvents` keyed on the USGS id,
`listEvents(region, since)` by the contract's region boxes, `getThreshold` / `setThreshold`; `node:sqlite`; no ORM, no server.

Your round-1 findings and conditions, verbatim:
> 1. BLOCKING — `src/store/index.ts:66-68`; default `since` excludes stored events before 1970. [...]
> 2. BLOCKING — `src/store/index.ts:59,68,71`; millisecond conversion changes a valid timestamp and the `since` decision. [...]
>    Remedy: preserve RFC 3339 fractional precision or explicitly narrow the accepted timestamp precision at the input contract,
>    then test a fractional boundary and exact returned time.
> Conditions: fix both blocking time behaviours and add regressions that fail on this commit, add a region-table drift check and
> lower-longitude boundary test, and rerun `npm test`/`npm run typecheck` on the final tip.

The master's ruling on finding 2 (MASTER, 2026-10-22): the store accepts RFC 3339 UTC times with at most millisecond precision
(the USGS feed gives epoch milliseconds); a finer time, in `upsertEvents` or in `since`, is refused with one clear error that names
the value — never rounded.

The executor's round-2 claims (claims, not facts): no time predicate without `since` (pre-1970 listed); finer-than-millisecond
and malformed times refused by value; offsets other than `Z` refused too (its judgement call: the ruling names UTC); a drift test
reads the region table in the contract's `info.description` and compares it with `src/store/regions.ts`; boundary tests on the
lowest longitude and latitude. Red first on a59e6c409: pass 12, fail 3. Controls: `minLon: 92` → `93` red; `lon BETWEEN` →
`lon > ? AND lon <=` red. 26 pass, typecheck clean.

MASTER'S MEASUREMENT (2026-10-22, █████, fresh clone at b4d525001, node v26.7.0): `npm ci` exit 0; `npm test` 26 pass, 0 fail.
`git merge-tree` with the W1 round-2 tip and with `main` (documents only): exit 0 both.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Are both blocking findings closed? Re-run your own triggers (the 1969 event; the `.0001Z` / `.0002Z` pair).
2. Does the drift test turn red on a changed box, and does it read the contract rather than a copy?
3. Are the box edges right on all four sides now?
4. Is refusing non-`Z` offsets consistent with the ruling and the contract's `format: date-time`, or does it refuse valid input
   a later caller (the feed, the HTTP API) will send?
5. Anything round 2 broke in round 1's promises.
Licences are out of scope: the owner decides them, once.

## BOUNDARY
This diff.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-events-and-thresholds-are-stored-review/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

**LEAVE THE WORKTREE AS YOU FOUND IT.** Before you write `- state: recommendation-ready`, delete every probe, mutation
and scratch file you created outside `.saphan/work/`, restore every file you inverted, and confirm `git status --porcelain`
in the reviewed worktree shows nothing of yours. A leftover file blocks the stream's teardown (W4a, 2026-10-10).

## Review output — the return manifest the reviewer owes
`_REVIEW_STATUS.md`: H1 `# REVIEW — quakewatch-events-and-thresholds-are-stored-review`; keys `state · verdict · ref · abstract · artifacts ·
updated`; the abstract at most 5 lines. `_REVIEW_NOTES.md` H2s: Ground · Differential · Unplug · Closure · Remainder ·
Profile · Focus · Conditions · Unrun. Check with `saphan doc check _REVIEW_STATUS.md --family review-status`.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
