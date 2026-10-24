# ORDER — quakewatch-events-and-thresholds-are-stored-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W2
- round: 3
- repo: quake-watch-server
- branch: review/quakewatch-events-and-thresholds-are-stored-review
- base: fix/quakewatch-events-and-thresholds-are-stored @ 52d5bf91e
- reviewed-sha: 52d5bf91e
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify that round 3 (b4d525001...52d5bf91e) closes the findings of review round 2, and judge the whole wagon 578462ad0...52d5bf91e

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `52d5bf91e`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: round 3 is b4d525001...52d5bf91e — 1 commit; the wagon is 578462ad0...52d5bf91e. W2 of a public tutorial repository;
the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

Rounds 1 and 2 still bind (store, migrations, idempotent upsert, region boxes from the contract with a drift test, all events
without `since`, at most millisecond precision with finer refused, never rounded).

Your round-2 findings, verbatim:
> 1. BLOCKING — valid UTC offset rejected. `src/store/index.ts:34` requires literal `Z` [...] A caller sending
>    `2026-10-21T03:14:07+00:00` to `listEvents` gets `invalid time` [...]
> 2. BLOCKING — impossible calendar day silently becomes a different event time. [...] ingest `2026-02-30T00:00:00Z` succeeded
>    and listing returned `2026-03-02T00:00:00Z`.
> Conditions: Fix the two blocking findings above, retain the addressed regressions, and run `npm test` plus
> `npm run typecheck` on the final tip. The master should settle offset acceptance against the API contract.

The master's ruling on offsets (MASTER, 2026-10-22): the contract says UTC; accept `Z`, `+00:00` and `-00:00`, store and return
as `Z`; refuse any other offset with one clear error naming the value — the store does not convert time zones.

The executor's round-3 claims (claims, not facts): one `toStoredTime` used by `upsertEvents` and `since`; zero offsets accepted
and returned as `Z`; other offsets refused by value; the parsed time is read back and compared, so 7 impossible values
(`2026-02-30`, `2026-13-01`, `2026-04-31`, `24:00:00`, `23:60:00`, ...) are refused, and the leap day 2028-02-29 is accepted;
red on b4d525001 first; control: round-trip check removed → `Missing expected exception: 2026-02-30T00:00:00Z`.

MASTER'S MEASUREMENT (2026-10-22, █████, node v26.7.0): fresh clone at 52d5bf91e, `npm test` 29 pass, 0 fail. The tree merged
with `main` (0d7aaa3, where W1 — the feed — has landed): no conflict, `npm test` 40 tests, 39 pass, 1 skipped (the live test).

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Are both round-2 findings closed? Re-run your own probes (`+00:00`; `2026-02-30`).
2. Does the ruling hold against the contract's `format: date-time`, and is every refusal clear to a stranger?
3. Did round 3 break any round-1 or round-2 promise (precision, pre-1970, drift test, box edges)?
4. Is the code still plain enough for a public tutorial reader?
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
