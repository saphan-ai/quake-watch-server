# ORDER — quakewatch-the-feed-survives-usgs-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W1
- round: 2
- repo: quake-watch-server
- branch: review/quakewatch-the-feed-survives-usgs-review
- base: fix/quakewatch-the-feed-survives-usgs @ 9dfaaf512
- reviewed-sha: 9dfaaf512
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify that round 2 (e1d310de4...9dfaaf512) closes the conditions of review round 1, and judge the whole wagon 578462ad0...9dfaaf512

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `9dfaaf512`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: round 2 is e1d310de4...9dfaaf512 — 1 commit; the wagon is 578462ad0...9dfaaf512. W1 of a public tutorial repository;
the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

Round 1's order (still binding): a feed client in `src/feed/` reading the USGS GeoJSON summary feed with built-in `fetch` into
the contract's `Quake`, returning `{ quakes, skipped }`; malformed features skipped and counted, never fatal; a duplicate id keeps
one; 429/5xx retried at most 3 times with an injectable wait, then one clear error; fixtures; a live test only with
`QUAKEWATCH_LIVE=1`; no new runtime dependency; `src/quake.ts` byte-identical to the shared bytes.

Your round-1 conditions, verbatim:
> To clear rejection: make malformed coordinate values count as skipped; add a duplicate with conflicting values and assert
> first-wins; replace or substantiate the hand-written fixtures as recorded feed samples; verify `src/quake.ts` byte identity
> against the shared contract; run `npm test` and the opt-in live test on a seat with dependencies and network.

The shared `src/quake.ts` bytes, so you can compare them yourself:
```ts
// One earthquake, as the contract's `Quake` schema defines it (docs/api/openapi.yaml).
export interface Quake {
  id: string // the USGS event id
  time: string // when it happened, RFC 3339, UTC
  magnitude: number
  depthKm: number
  lat: number
  lon: number
  place: string
}
```

The recording: the master fetched the real feed on 2026-10-22 at about 02:15Z (184 features) and kept the first 3 features
unchanged; the round-2 order carried those exact bytes, and the leg saved them as `test/fixtures/usgs/recorded-2026-10-22.geojson`.

The executor's round-2 claims (claims, not facts): 21 pass, 1 skipped; bad coordinates (missing, not an array, shorter than 3,
non-number) skipped and counted; a conflicting duplicate (5.2 vs 6.9) asserts first-wins; the recorded fixture gives 3 quakes,
0 skipped, and the first equals the ordered quake with time `2026-10-22T01:49:28.640Z` (the order said 2026-10-21 — the leg
measured the master wrong); controls: guard removed → 2 red, keep-last → 1 red; `src/quake.ts` identical by `diff`.

MASTER'S MEASUREMENT (2026-10-22, █████, fresh clone at 9dfaaf512, node v26.7.0): `npm test` 22 tests, 21 pass, 1 skipped;
`QUAKEWATCH_LIVE=1 npm test` 22 pass against the real feed; the recorded fixture equals the master's recording byte for byte
plus a trailing newline. Your seat has no network and no npm cache for some packages (round 1 measured it): say what you could
and could not run, and do not repeat the live test the master ran.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Are the four round-1 conditions you can judge closed? Unplug the coordinates guard and the first-wins rule yourself.
2. Is the recorded fixture used by a test that would fail if the parsing of a real feature went wrong?
3. Do the hand-written failure fixtures now say they are hand-written, or is that said elsewhere (JSON has no comments)?
4. Anything round 2 broke in round 1's promises.
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
