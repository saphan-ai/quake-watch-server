# ORDER — quakewatch-the-api-answers-from-the-store
track: quakewatch-server
- train: quakewatch-server
- wagon: W3
- round: 2
- review: named
- repo: quake-watch-server
- base: main @ d1a106d9a
- branch: fix/quakewatch-the-api-answers-from-the-store
- worktree: █████
- lands-on: main
- quote-usd: 15
- cap-usd: 30
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: pay the four blocking findings of review round 1 on W3 (a 500 on a malformed path, a store failure reported as bad input, unbounded request bodies, no shutdown) and make the unknown-region test able to fail.

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = EXECUTOR. One-shot headless: foreground commands only; your first act writes `_EXEC_STATUS.md`
(`- state: in-progress`). A permission denial is a fact: try once, then `- state: blocked`.
COMMIT EVERY PART BEFORE `stop-2-ready` · ZERO push/merge/PR · author = fleet identity · commit message `[quakewatch-the-api-answers-from-the-store] <area>: <what>`.
After `git commit`, `packed-refs.lock: Permission denied` means the commit LANDED — check `git log -1`.
ZERO AI ATTRIBUTION: no `Co-Authored-By:` trailer, no "Generated with" line, no tool or model name in any commit or file. This repository is public.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/testing-bar/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/EXECUTOR.md` — read first.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*

## WHERE YOU START
Your branch is at `f2c5670c7` (round 1: `src/server.ts`, `test/server.test.ts`, `docs/RUN_IT.md`, `ajv`). Build on it; do not rewrite
it. Round 1's order and rulings still bind (default threshold 5 / 70 km as a named constant; events without region = all regions;
bad input → 400 with the shared error schema, unknown path → 404, never 500 for bad input; refresh at start and every
`QUAKEWATCH_REFRESH_SECONDS`; `QUAKEWATCH_FEED_FILE`, `QUAKEWATCH_DB`, `PORT`). `docs/RUN_IT.md`'s three outputs must stay true.

## THE REVIEW YOU ANSWER (round 1, codex, verdict `reject` — pasted from `_REVIEW_NOTES.md`)
> Blocking F1 — `src/server.ts:56-59,110-113`: malformed percent encoding in a threshold path, for example `GET /api/v1/thresholds/%`, throws `URIError` at `decodeURIComponent`; the handler returns 500 `internal`. The measured handler response was `{"status":500,"body":{"error":"internal","message":"something went wrong on the server"}}`. Bad input must not produce 500. Remedy: decode under a client-input guard and return the shared 400 error; test the raw HTTP handler with malformed escapes.
>
> Blocking F2 — `src/server.ts:75-84`: `listEvents` catches every store exception and returns 400 `bad_since`, even when `since` is absent and a valid region is used. A fake store whose `listEvents` throws `database unavailable` produced `{"status":400,"body":{"error":"bad_since",...}}` for `GET /api/v1/events?region=japan`. This hides an outage as user error and produces a misleading 400. Remedy: validate `since` separately or catch only the store's typed time-validation error, and let storage failures reach a 500 shared error; add a store-failure control with a valid request.
>
> Blocking F3 — `src/server.ts:104-110`: the handler accumulates every request body without a byte limit, including GET and unknown paths, before routing. A peer can hold arbitrary data in `chunks` and force a second allocation in `Buffer.concat`. The public server has no authentication. Remedy: enforce a small maximum body size while reading and discard bodies for methods that do not need them; verify an oversized PUT is refused and the server remains responsive. This conclusion follows directly from the unbounded `data` listener; no exhaustion run was made.
>
> Blocking F4 — `src/server.ts:137-141`: the refresh interval handle and HTTP server handle are discarded. There is no shutdown path, so the timer cannot be cleared and the SQLite store cannot be closed. Remedy: retain both handles and clear the interval and close the store on server shutdown; prove the interval does not fire after close. This is one of the order's explicit review questions.
>
> Conditions: 

## THE MASTER'S RULINGS (MASTER, 2026-10-22)
1. F1: a path segment that does not decode is bad input → 400 with the shared error schema, never 500.
2. F2: validate `since` before calling the store. A failure of the store itself answers 500 with the shared error schema
   (`error: unavailable`, as the contract's `ServerError` example). The contract lists `500` only on some paths: do NOT edit
   the contract; write each path where the contract has no 500 on the `NOTICED` list (the master takes it to the contract).
3. F3: only `PUT` reads a body. A body over 16 KiB is refused with 400 (`error: body_too_large`) without being kept in memory;
   the other methods do not read the body.
4. F4: the server returns a handle with `close()` that stops the HTTP listener, clears the refresh timer and closes the store;
   `npm start` calls it on SIGINT and SIGTERM.

## WHAT TO BUILD
1. The four rulings in `src/server.ts`, each with a test that is red on `f2c5670c7` first: `GET /api/v1/thresholds/%` → 400;
   a fake store whose `listEvents` throws → 500 `unavailable` (not `bad_since`); a 17 KiB PUT body → 400 `body_too_large`;
   after `close()` the refresh does not fire again (fake timers or an injected clock — no real sleeping).
2. The unknown-region tests must fail when the region guard on `GET /api/v1/events` is removed. Show it.

## ACCEPTANCE
1. `npm ci && npm test` exits 0; `npm run typecheck` exits 0. Paste the summary lines.
2. Red-first lines for the four new tests on `f2c5670c7`, then green.
3. Negative control, executed: remove the region guard on events; an unknown-region test turns red. Restore. Paste the red line.

## WHAT IS NOT IN SCOPE
- The contract (`docs/api/openapi.yaml`), `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`, `fleet/`. No new dependency.

## WHERE YOU MAY PROVE ME WRONG
If a ruling conflicts with the contract or a claim here is false, measure it, write `master-wrong: <claim> — <measurement>`
in your status, and go on with what the measurement says.

## WHEN THIS ORDER CANNOT PROCEED
Write `SHOUT_<topic>.md` in the worktree, set `- state: blocked`, and stop.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-api-answers-from-the-store/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md`: `- state: stop-2-ready`, `- last commit:` <sha>, an `- abstract:` of at most 5 lines, the commands run and
their counts. Check it with `saphan doc check --family exec-status _EXEC_STATUS.md` before you end: its exit code is the verdict.
Read every `saphan` verb by its `RESULT:` line, its `--json` or its exit code, never by its sentences (`craft/COMMON.md`).
