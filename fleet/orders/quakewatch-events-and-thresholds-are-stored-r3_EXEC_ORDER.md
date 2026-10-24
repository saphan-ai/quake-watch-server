# ORDER — quakewatch-events-and-thresholds-are-stored
track: quakewatch-server
- train: quakewatch-server
- wagon: W2
- round: 3
- review: named
- repo: quake-watch-server
- base: main @ 578462ad0
- branch: fix/quakewatch-events-and-thresholds-are-stored
- worktree: █████
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 45m
- backend: claude-code
- model: claude-sonnet-5-5
- task: pay the two blocking findings of review round 2 on W2: a zero UTC offset is accepted and normalized, and an impossible calendar day is refused instead of moved.

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
Your branch is at `b4d525001` (round 2). Build on it; do not rewrite it. Rounds 1 and 2 still bind, including the master's
ruling: at most millisecond precision, finer refused, never rounded. Keep every regression round 2 added.

## THE REVIEW YOU ANSWER (round 2, codex, verdict `reject` — pasted from `_REVIEW_NOTES.md`)
> 1. BLOCKING — valid UTC offset rejected. `src/store/index.ts:34` requires literal `Z`, while `docs/api/openapi.yaml:53-59,218-221`
>    declares RFC 3339 UTC `date-time` and the master's ruling limits precision, not offset spelling. A caller sending
>    `2026-10-21T03:14:07+00:00` to `listEvents` gets `invalid time` (direct probe); the same occurs on ingest. That is a valid
>    RFC 3339 representation of UTC. Remedy: accept at least zero-offset RFC 3339 notation and normalize it before storing [...]
> 2. BLOCKING — impossible calendar day silently becomes a different event time. `src/store/index.ts:35-39` treats a finite
>    `Date.parse` result as valid RFC 3339. Direct probe: ingest `2026-02-30T00:00:00Z` succeeded and listing returned
>    `2026-03-02T00:00:00Z`. Remedy: validate calendar components or round-trip the parsed UTC components [...]
>
> Conditions: Fix the two blocking findings above, retain the addressed regressions, and run `npm test` plus
> `npm run typecheck` on the final tip. The master should settle offset acceptance against the API contract.

## THE MASTER'S RULING ON OFFSETS (MASTER, 2026-10-22)
The contract says UTC. Accept a time whose offset is UTC: `Z` or `+00:00` (also `-00:00`), and store and return it as `Z`.
Refuse any other offset (`+02:00`) with one clear error that names the value — the store does not convert time zones. Precision
stays at most milliseconds.

## WHAT TO BUILD
1. The offset ruling above, in one small function used by both `upsertEvents` and `listEvents`'s `since`.
2. An impossible calendar day (`2026-02-30`, `2026-13-01`, `2026-04-31`) or time (`24:00:00`, `23:60:00`) is refused with one
   clear error; never moved to another day.
3. Tests: `+00:00` and `-00:00` accepted and returned as `Z`; `+02:00` refused; each impossible value above refused. Show each new
   test red on `b4d525001` first.

## ACCEPTANCE
1. `npm ci && npm test` exits 0; `npm run typecheck` exits 0. Paste the summary lines.
2. Red-first lines for the `+00:00` test and the `2026-02-30` test on `b4d525001`, then green.
3. Negative control, executed: remove the calendar round-trip check; the impossible-day test turns red. Restore. Paste the red line.

## WHAT IS NOT IN SCOPE
- `src/feed/`, the contract, the mock, the real server; `README.md`, `docs/`, `fleet/`. No new dependency.

## WHERE YOU MAY PROVE ME WRONG
If the ruling conflicts with the contract or a claim here is false, measure it, write `master-wrong: <claim> — <measurement>`
in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-events-and-thresholds-are-stored/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
