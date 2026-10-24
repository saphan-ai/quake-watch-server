# ORDER — quakewatch-events-and-thresholds-are-stored-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W2
- repo: quake-watch-server
- branch: review/quakewatch-events-and-thresholds-are-stored-review
- base: fix/quakewatch-events-and-thresholds-are-stored @ a59e6c409
- reviewed-sha: a59e6c409
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify every claim of 578462ad0...a59e6c409 — and nothing beyond it

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `a59e6c409`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: 578462ad0...a59e6c409 — 1 commit, 7 files (`src/quake.ts`, `src/store/index.ts`, `src/store/migrations.ts`,
`src/store/regions.ts`, `test/store.test.ts`, `package.json`, `tsconfig.json`). W2 of a public tutorial repository; the owner's
bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

The order promised: a SQLite store in `src/store/` that opens a database file (`:memory:` in tests); numbered migrations that
create `events` and `thresholds` from an empty file and record which ran; `upsertEvents(quakes)` keyed on the USGS id;
`listEvents(region, since)` using the region boxes of the contract's `info.description`; `getThreshold` / `setThreshold`. Tests:
migration from empty; the same feed twice gives the same row count; a changed event under the same id is updated, not
duplicated; a threshold is read back; `listEvents` returns only events inside the box and after `since`. Prefer the built-in
`node:sqlite` if the pinned Node 22 runs it without a flag, and return the choice as a ruling. No ORM, no database server.
`src/quake.ts` carries exact bytes shared with a parallel wagon.

The executor's claims (claims, not facts): `npm test` 20 pass, 0 fail (11 before); red-first and a negative control executed
(a plain INSERT turns the two idempotency tests red). Ruling: `node:sqlite`, no package; it is still experimental and prints a
warning; `package.json` engines floor raised to Node 22.13 (not measured on Node 22 — the seat ran Node 26). Region boxes copied
into `src/store/regions.ts`; nothing checks they stay equal to the contract. `getThreshold` returns undefined when unset.

MASTER'S MEASUREMENT (2026-10-22): the W1 branch (feed) and this branch merge with no conflict (`git merge-tree` exit 0).
The master did NOT re-run this suite: his host refused the run. Your own run is the first independent one.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Is ingest idempotent, and does a test fail when it is not? Unplug the upsert.
2. Are the migrations safe to run twice and on an empty file? Unplug the record of which migration ran.
3. Do the region boxes in `src/store/regions.ts` equal the contract's table? Is there a check that would catch a drift?
4. `listEvents`: boundaries of the box and of `since`, including longitudes and times exactly on the edge.
5. Is `node:sqlite` a sound choice for a stranger on Node 22 (flag, warning, engines floor)? Is the code plain enough for a
   public tutorial reader?
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
