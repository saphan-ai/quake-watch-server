# ORDER — quakewatch-events-and-thresholds-are-stored
track: quakewatch-server
- train: quakewatch-server
- wagon: W2
- round: 2
- review: named
- repo: quake-watch-server
- base: main @ 578462ad0
- branch: fix/quakewatch-events-and-thresholds-are-stored
- worktree: █████
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: pay the blocking conditions of review round 1 on W2: all events when `since` is absent, timestamps that are never silently rounded, and a check that the region boxes stay equal to the contract.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-events-and-thresholds-are-stored] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository is public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*

## WHERE YOU START
Your branch is at `a59e6c409` (round 1: `src/quake.ts`, `src/store/{index,migrations,regions}.ts`, `test/store.test.ts`,
`package.json` engines `>=22.13 <23`, `tsconfig.json`). Build on it; do not rewrite it. Round 1's order still binds.
`main` has moved since your base (documents only); do not merge it — the master does.

## THE REVIEW YOU ANSWER (round 1, codex, verdict `reject` — pasted from `_REVIEW_NOTES.md`)
> 1. BLOCKING — `src/store/index.ts:66-68`; default `since` excludes stored events before 1970. Trigger: store
>    `{id:'ancient', time:'1969-12-31T23:59:59Z', lat:0, lon:100}` and call `listEvents('southeast-asia')` without `since`.
>    Measured on Node 22.23.2: `countEvents() === 1`, but the list is `[]`. The interface at `src/store/index.ts:21` promises that
>    omitting `since` means all events. Remedy: omit the SQL time predicate when no `since` is supplied [...]; add a pre-1970
>    regression that fails with the present implementation.
> 2. BLOCKING — `src/store/index.ts:59,68,71`; millisecond conversion changes a valid timestamp and the `since` decision.
>    Trigger: insert an event at `2026-10-21T03:14:07.0001Z` and query since `2026-10-21T03:14:07.0002Z`. Measured: the returned
>    event is included and its time is rewritten to `2026-10-21T03:14:07Z`, although it is earlier than `since`.
>    Remedy: preserve RFC 3339 fractional precision or explicitly narrow the accepted timestamp precision at the input contract,
>    then test a fractional boundary and exact returned time.
>
> Unplug: changing southeast-asia `minLon: 92` to `93` left all nine store tests green. Changing `lon BETWEEN ? AND ?` to
> `lon > ? AND lon <= ?` also left all nine green.
>
> Conditions: fix both blocking time behaviours and add regressions that fail on this commit, add a region-table drift check and
> lower-longitude boundary test, and rerun `npm test`/`npm run typecheck` on the final tip.

## THE MASTER'S RULING ON CONDITION 2 (MASTER, 2026-10-22)
Narrow the precision: the store accepts RFC 3339 UTC times with at most millisecond precision (the USGS feed gives epoch
milliseconds). A time with finer precision, in `upsertEvents` or in `since`, is refused with one clear error that names the
value — never rounded. A time with millisecond precision or less is returned exactly as the reader would expect it.

## WHAT TO BUILD
1. Condition 1: no time predicate when `since` is absent. A pre-1970 regression test, shown red on `a59e6c409` first.
2. Condition 2: the ruling above. Tests: a sub-millisecond time is refused (in both places); a millisecond boundary
   (`since` equal to an event's time, and one millisecond after it) gives the right answer and the exact time back. Show the
   sub-millisecond test red on `a59e6c409` first.
3. Region drift check: a test that reads the region table in the contract's `info.description` (`docs/api/openapi.yaml`) and
   asserts it equals `src/store/regions.ts`. Show it red by changing one box in a scratch copy.
4. Boundary tests on the minimum longitude and the minimum latitude of a box (on the edge = inside).

## ACCEPTANCE
1. `npm ci && npm test` exits 0 on the final tip; `npm run typecheck` exits 0. Paste the summary lines.
2. Red-first lines for items 1 and 2 (on `a59e6c409`), then green.
3. Negative controls, executed: `minLon: 92` → `93` turns the drift test red; `lon BETWEEN` → `lon > ? AND lon <=` turns the
   boundary test red. Restore both. Paste both red lines.

## WHAT IS NOT IN SCOPE
- `src/feed/`, the contract, the mock, the real server; `README.md`, `docs/`, `fleet/`.
- No new dependency.

## WHERE YOU MAY PROVE ME WRONG
If the ruling cannot hold, or a claim here is false, measure it, write `master-wrong: <claim> — <measurement>` in your status,
and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-events-and-thresholds-are-stored/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
