# ORDER — quakewatch-the-feed-survives-usgs-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W1
- repo: quake-watch-server
- branch: review/quakewatch-the-feed-survives-usgs-review
- base: fix/quakewatch-the-feed-survives-usgs @ e1d310de4
- reviewed-sha: e1d310de4
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify every claim of 578462ad0...e1d310de4 — and nothing beyond it

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `e1d310de4`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: 578462ad0...e1d310de4 — 2 commits, 8 files (`src/quake.ts`, `src/feed/usgs.ts`, `test/feed.test.ts`, four fixtures under
`test/fixtures/usgs/`, `tsconfig.json`). W1 of a public tutorial repository; the owner's bar is "super simple" (owner, 2026-10-21:
*"It must be simple, super simple, how to start."*).

The order promised: a feed client in `src/feed/` that reads `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
with Node's built-in `fetch` into the contract's `Quake` (`src/quake.ts`, exact bytes shared with a parallel wagon), returning
`{ quakes, skipped }`; a malformed feature is skipped and counted, never fatal; a duplicate id keeps one; HTTP 429 and 5xx are
retried with a backoff (at most 3 tries, injectable wait) and then one clear error; recorded fixtures (normal, empty, malformed,
duplicate); tests against fixtures with a fake `fetch`; one live test only when `QUAKEWATCH_LIVE=1`. No new runtime dependency.

The executor's claims (claims, not facts): `npm test` 21 tests, 20 pass, 1 skipped (live); red-first and a negative control
executed. Its seat could not reach the network, so the fixtures are HAND-WRITTEN from the documented shape, not recorded, and
the live test did not run there. Judgement calls it returned: a too-large time is malformed; a body without `features` throws;
a 4xx other than 429 is not retried; waits are 1 s then 2 s; a duplicate keeps the first.

MASTER'S MEASUREMENT (2026-10-22, █████, fresh clone at e1d310de4, node v26.7.0): `npm test` 21 tests, 20 pass, 1 skipped;
`QUAKEWATCH_LIVE=1 npm test` 21 pass, `✔ live: the real USGS feed reads into quakes`. A real response of the feed at about
02:15Z had 184 features, keys `geometry, id, properties, type`, `properties.time` int, `mag` float, `place` str,
`geometry.coordinates` `[lon, lat, depth]`, and no null `mag` in that sample.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Does each failure mode have a test that can fail? Unplug the skip-and-count, the dedupe and the retry one at a time.
2. Are the fixtures a fair stand-in for the real feed, given they were hand-written? Name any real-feed field or value the
   client mishandles (null `mag`, a missing `place`, a negative depth).
3. Is the retry bounded and is the error clear to a stranger? Does any test sleep for real?
4. Does `src/quake.ts` carry exactly the ordered bytes?
5. Is the code plain enough for a public tutorial reader?
Licences are out of scope: the owner decides them, once.

## BOUNDARY
This diff.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-feed-survives-usgs-review/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

**LEAVE THE WORKTREE AS YOU FOUND IT.** Before you write `- state: recommendation-ready`, delete every probe, mutation
and scratch file you created outside `.saphan/work/`, restore every file you inverted, and confirm `git status --porcelain`
in the reviewed worktree shows nothing of yours. A leftover file blocks the stream's teardown (W4a, 2026-10-10).

## Review output — the return manifest the reviewer owes
`_REVIEW_STATUS.md`: H1 `# REVIEW — quakewatch-the-feed-survives-usgs-review`; keys `state · verdict · ref · abstract · artifacts ·
updated`; the abstract at most 5 lines. `_REVIEW_NOTES.md` H2s: Ground · Differential · Unplug · Closure · Remainder ·
Profile · Focus · Conditions · Unrun. Check with `saphan doc check _REVIEW_STATUS.md --family review-status`.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
