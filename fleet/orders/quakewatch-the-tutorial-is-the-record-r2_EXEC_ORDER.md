# ORDER — quakewatch-the-tutorial-is-the-record
track: quakewatch-server
- train: quakewatch-server
- wagon: W6
- round: 2
- review: named
- repo: quake-watch-server
- base: main @ 90b64c093
- worktree: <worktree>
- branch: fix/quakewatch-the-tutorial-is-the-record
- lands-on: main
- quote-usd: 12
- cap-usd: 24
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: pay the two conditions of the W6 review: a ledger whose order count is exact, and every historical command or output block in the README traced to a published, redacted source.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-tutorial-is-the-record] <area>: <what>` (subject at most 72 characters).
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository is public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*
2026-10-21: *"With an explanation of the whole process. [...] it was hard to understand what Saphan is, because it is too big a beast."*
2026-10-24: the licence is Apache-2.0, as in the sibling public repository.

## THE RECORD YOU BUILD FROM (provisioned, read-only)
`.provision/record/` holds this train's bridge directory: `howto/BEAT-*.md` (the beats, written as they happened — the spine of
the tutorial), `signed/*/EXEC_ORDER.md` and `signed/*/REVIEW_ORDER.md` (every order), `MASTER_VERIFY_*.md`, the train order,
`EVIDENCE_*.md`, and `.provision/reviews/<stream>/<digest>/_REVIEW_NOTES.md` (every review's notes). Quote them; never invent.

## WHERE YOU START
Your branch is at `1d4a87b0c` (round 1: README tutorial, docs, fleet/, LICENSE). Build on it; do not rewrite it. Round 1's order
still binds (simplicity, blackout rules, English only, no code change).

## THE REVIEW YOU ANSWER (codex, verdict `accept-with-conditions` — pasted from `_REVIEW_NOTES.md`)
> Quick start and tester fixes pass; correct the ledger's held-order count and source or label historical CLI excerpts before the gate.
>
> 1. Correct `fleet/LEDGER.md:23,36-37` to distinguish the 11 signed executor/tester orders and $162 held here from W6's external order and $20, or publish that order in the corpus. Show an enumeration that would fail if one held order disappeared.
>
> 2. For each historical command/output block in `README.md:88-177`, provide a redacted source excerpt with a dated source identifier or label condensed/reconstructed text clearly. In particular, source the registration, sign/place, executor status, review placement and gate/land/push blocks that the public corpus cannot now prove.

## WHAT TO BUILD
1. `fleet/howto/` — publish the beat files from `.provision/record/howto/BEAT-*.md`, redacted with the same blackout rules as
   fleet/ (`█████`), English only. These are the dated sources the README's excerpts come from.
2. README.md: under every historical command or output block, one short source line, e.g. `Source: fleet/howto/BEAT-3_server.md
   (2026-10-21)`. Where a block is condensed or retyped rather than copied, say so in the same line ("condensed from …"). Keep the
   README as simple as it is now; do not grow it.
3. fleet/LEDGER.md: separate the orders held in fleet/orders from W6's own order(s) (now publish W6's order and this round's too,
   redacted, in fleet/orders/), and make the counts exact. Add a short check line in the ledger that a reader can repeat
   (e.g. `ls fleet/orders | wc -l` → N).

## ACCEPTANCE
1. `npm ci && npm test` exits 0; lint valid (no code changes). Paste both lines.
2. The leak check from round 1 prints nothing, now also over `fleet/howto`.
3. A census: each README block → its source line (one line each).
4. The ledger's count line, run, with its output.

## WHAT IS NOT IN SCOPE
- `src/`, `test/`, `mock/` — no code change. No new dependency.
- Rewriting `fleet/preparation/` or the train order copy.

## WHERE YOU MAY PROVE ME WRONG
If the record contradicts a claim in this order, the record wins: write `master-wrong: <claim> — <measurement>` and follow it.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-tutorial-is-the-record/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
