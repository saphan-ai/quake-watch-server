# ORDER — quakewatch-the-tutorial-is-the-record
track: quakewatch-server
- train: quakewatch-server
- wagon: W6
- review: named
- repo: quake-watch-server
- base: main @ 90b64c093
- branch: fix/quakewatch-the-tutorial-is-the-record
- lands-on: main
- quote-usd: 20
- cap-usd: 40
- wall: 90m
- backend: claude-code
- model: claude-sonnet-5-5
- task: assemble the public tutorial of this train from its real record — README in eight steps, the 5-minute guide, what comes next, and fleet/ with private details blacked out — plus the Apache-2.0 licence.

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

## WHAT TO BUILD
1. `README.md` — the tutorial: the eight steps already outlined in the draft (idea · plan · first job · work · check · decision ·
   something goes wrong · done), each filled from the BEAT files with the real command, the real output (trimmed) and why the
   step exists. "Something goes wrong" uses BEAT-7 with its `## Later` section: the real rejections, not a planted one. No Saphan
   word before it is explained; no step longer than one screen. Fix the five README gaps the tester found (quoted below). Keep
   the advisor role and the link to `fleet/preparation/`.
2. `docs/SAPHAN_IN_5_MINUTES.md` and `docs/WHAT_COMES_NEXT.md` — update from the record (the drafts exist); WHAT_COMES_NEXT names
   the next trains (Android and iOS clients against the same contract, the Docker image, the same process on any stack) with
   what each would prove.
3. `fleet/` — the same layout as the sibling repository: `fleet/orders/`, `fleet/status/`, `fleet/reviews/`, `fleet/decisions/`
   (the owner's gate decisions with their reasons, from the master-verify and the BEATs), `fleet/LEDGER.md` (wagons, rounds, review
   verdicts, model and cost per wagon where the record has it — say "not in the record" where it does not — and total wall time),
   and a short `fleet/README.md`. Keep `fleet/preparation/` and `fleet/orders/TRAIN_ORDER_quakewatch-server.md` as they are.
   BLACK OUT private details with `█████`, as `fleet/preparation/` does: host and machine names, seat/identity names, IP addresses,
   private URLs, absolute local paths, personal names other than "the owner", e-mail addresses, account ids, key ids. Keep short
   git SHAs, run ids may stay or be blacked out (be consistent). English only; translate the owner's Polish words and mark them
   `(translated from Polish)`.
4. `LICENSE` — the full Apache License 2.0 text; `"license": "Apache-2.0"` in `package.json`; `info.license` in
   `docs/api/openapi.yaml` changed from MIT to Apache-2.0 (name `Apache 2.0`, identifier `Apache-2.0`).

The tester's README gaps (W4, verbatim):
> 1. README says "Status: not built yet … This works once the server is built." The server is built.
> 2. README "Run it yourself" differs from `docs/RUN_IT.md`: no `QUAKEWATCH_FEED_FILE`, so the first thing a stranger does hits the
>    live feed; with no network the alerts are empty. The README never mentions `docs/RUN_IT.md`.
> 3. Node version is not in the README; `package.json` says `>=22.13 <23` and RUN_IT says "22.13 or newer" — they contradict.
> 4. README does not say the server needs a second terminal, how to stop it, or which port.
> 5. Words used before they are explained: STOP, train, wagon, order, fleet, ledger; threshold, alert and region are never defined.

## ACCEPTANCE
1. `npm ci && npm test` exits 0 and `npx redocly lint docs/api/openapi.yaml` is valid (nothing in src/ changes). Paste both lines.
2. Census: every shell command in README.md appears in a BEAT file or in `docs/RUN_IT.md` — one line per command with where.
3. Leak check prints nothing: a census of private host, seat, path, personal and address patterns over README.md, docs, fleet, LICENSE (the pattern itself is withheld here, so the published order does not contain what it forbids).
4. Reader test: a fresh subagent (or a second pass of yourself with no memory of the record) given ONLY the repository answers:
   what is a train, a wagon, a leg, a gate; who approved the merge. Paste the five answers.

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
