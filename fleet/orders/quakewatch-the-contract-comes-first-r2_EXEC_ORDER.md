# ORDER — quakewatch-the-contract-comes-first
track: quakewatch-server
- train: quakewatch-server
- wagon: W0
- round: 2
- review: named
- repo: quake-watch-server
- base: main @ 21dafea60
- branch: fix/quakewatch-the-contract-comes-first
- worktree: █████
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: pay the two blocking conditions of review round 1 on W0: a missing or wrong example must fail a test, and the mock must say plainly that it serves only the success examples.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-contract-comes-first] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository becomes public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*

## WHERE YOU START
Your branch is at `b35ee8dfe` (round 1: contract, 26-line mock, 9 tests). Build on it; do not rewrite it. Round 1's order still
binds: OpenAPI 3.1 contract, a mock of at most 30 lines that reads the examples from `openapi.yaml`, Node 22 + TypeScript,
`npm test` runs locally. Read the files before you change them.

## THE REVIEW YOU ANSWER (round 1, codex, verdict `reject` — pasted from `_REVIEW_NOTES.md`)
> Unplug: removed only `/healthz`'s 200 `example` from a scratch `openapi.yaml`, then ran `npm test`. All 9 tests still passed.
> The scratch mock's `answer('GET','/healthz')` returned `{status:200, body:undefined}` [...] `test/contract.test.ts:27,39-40`
> and `mock/server.ts:12` take the same missing value as oracle and output.
>
> Conditions:
> 1. Blocking: make a missing response example fail a test and a mock startup or request, and validate the example's schema;
>    `mock/server.ts:12`, `test/contract.test.ts:27,39-40`.
> 2. Blocking decision: reconcile the 400 behavior at `openapi.yaml:73-74,119-120,150-151` with `mock/server.ts:15-24`; either
>    implement and test it in the mock or document that the mock demonstrates only the successful example and keep error
>    conformance for the later real server. The master must state which contract surface the mock promises.
> 3. Owed: clarify the global lint suppression at `redocly.yaml:7-8`, and provide a first-run recipe and mock limits in the
>    in-scope documentation wagon.

## THE MASTER'S RULING ON CONDITION 2 (MASTER, 2026-10-21)
The mock promises ONLY the success examples. It does not validate input and never answers 400. Error behaviour is the real
server's job (wagon W3, whose acceptance is a contract test of every response, errors included). Reason: the order caps the
mock at 30 lines so a stranger can read it in one look. Say this where a reader meets it: one comment line in
`mock/server.ts`, and one sentence in the contract's `info.description`.

## WHAT TO BUILD
1. Condition 1: a test fails when any operation's 200 response has no example. A test fails when an example does not match
   its response schema (and the PUT request example its request schema). Use the lint if Redocly has a rule for it
   (`no-invalid-media-type-examples`); set it to `error` in `redocly.yaml`. Otherwise add one small dev dependency for JSON
   Schema validation and name it in your status. The mock refuses to start when an example is missing, with one clear message.
2. Condition 1, last part: one test calls the mock's real HTTP request handler (not only `answer()`) with fake request and
   response objects, and checks the status, the `content-type` and the serialized body. Do not open a port; your seat refuses
   `listen()`.
3. Condition 2: the comment and the sentence named in the ruling above.
4. Condition 3, the part that is in this repository's code: make the `operation-4xx-response` suppression apply to
   `/healthz` only, if Redocly allows a per-operation exception; if it does not, keep it global and make the comment say it is
   global and why. The first-run recipe is NOT yours: it belongs to the documentation wagon.

## ACCEPTANCE
1. `npm ci && npm test` exits 0. Paste the summary line.
2. Negative control, executed (not inferred): delete the `/healthz` 200 example in a scratch copy; the suite turns red and
   names it. Change one example field to a wrong type; the suite turns red. Restore both. Paste both red lines.
3. `npx redocly lint docs/api/openapi.yaml` reports 0 errors. Paste its last lines.
4. `wc -l mock/server.ts` is 30 or less.

## WHAT IS NOT IN SCOPE
- `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`, `fleet/` — the master and the scribe own them.
- No input validation and no 400 answers in the mock (the ruling above). No feed client, store, real server, Docker, CI, auth.

## WHERE YOU MAY PROVE ME WRONG
If the ruling cannot hold inside 30 lines, or a Redocly rule does not do what this order says, measure it, write
`master-wrong: <claim> — <measurement>` in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-contract-comes-first/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
