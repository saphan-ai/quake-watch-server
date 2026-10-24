# ORDER — quakewatch-the-contract-declares-every-error
track: quakewatch-server
- train: quakewatch-server
- wagon: W3b
- review: named
- repo: quake-watch-server
- base: main @ 0c36dd416
- branch: fix/quakewatch-the-contract-declares-every-error
- lands-on: main
- quote-usd: 12
- cap-usd: 24
- wall: 45m
- backend: claude-code
- model: claude-sonnet-5-5
- task: the contract declares every status the real server answers (500, each 400 case, 404), and the contract test fails when an operation answers a status the contract does not declare.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-contract-declares-every-error] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository is public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*

## WHY THIS WAGON EXISTS (the W3 review's condition, verbatim, 2026-10-23)
> Accept with one condition: before W4 client implementation or generation, land a separate contract change declaring the
> server's 500 responses and the actual 400/404 cases, then make the contract tests fail when an operation returns an undeclared
> status. [...] Cost if deferred: consumers generated or implemented from OpenAPI can miss real error responses.

And the W3 executor's own list of the gaps (its status, 2026-10-23): "500 `unavailable` is listed only on /healthz, so it is
missing on getEvents, getThreshold, putThreshold and getAlerts; 404 `not_found` is declared nowhere; `body_too_large` and
`bad_request` (an unreadable request) [are not listed]."

## WHAT TO BUILD
1. `docs/api/openapi.yaml`: every operation declares every status `src/server.ts` can answer for it, with the shared error
   schema and an example per status: `500` (`unavailable`) on every store-backed operation; each `400` case the server answers
   (unknown region, bad `since`, bad threshold, `body_too_large`, `bad_request`) as examples under `400`; and the `404`
   (`not_found`) answer for an unknown path explained in `info.description` (OpenAPI has no operation for it). Keep the
   contract readable: one shared `responses` entry per status, referenced, not copied.
2. The contract test: a response whose status the contract does not declare for that operation FAILS (today it may pass).
   Show it red first: before the contract change, with that check added, the tests that hit a 500 or a new 400 turn red.
3. `npx redocly lint docs/api/openapi.yaml` stays at 0 errors; the mock still serves the success examples (`npm run mock`).
4. Do not change `src/server.ts` behaviour. If the contract and the server disagree in a way the contract should not paper
   over, write it on the `NOTICED` list.

## ACCEPTANCE
1. `npm ci && npm test` exits 0; `npm run typecheck` exits 0; `npx redocly lint docs/api/openapi.yaml` 0 errors. Paste the lines.
2. The red-first line for the undeclared-status check.
3. Negative control, executed: delete the `500` from one operation in a scratch copy; the contract test turns red. Restore. Paste it.

## WHAT IS NOT IN SCOPE
- `src/` behaviour, `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`, `fleet/`. No new dependency.

## WHERE YOU MAY PROVE ME WRONG
If a claim here is false (a status the server cannot answer, or one it answers that is missing here), measure it, write
`master-wrong: <claim> — <measurement>` in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-contract-declares-every-error/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
