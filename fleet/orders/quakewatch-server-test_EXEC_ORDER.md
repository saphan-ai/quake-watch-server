# ORDER — quakewatch-server-test
track: quakewatch-server
- train: quakewatch-server
- wagon: W4-test
- review: master-verify-only
- repo: quake-watch-server
- base: main @ 90b64c093
- branch: test/quakewatch-server
- role: executor
- quote-usd: 10
- cap-usd: 20
- wall: 60m
- backend: claude-code
- model: claude-sonnet-5-5
- task: test train quakewatch-server as a stranger would use it — from the repository's own documents alone, on a clean checkout, every wagon's acceptance and the step plan below

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = TESTER. Your craft is `.provision/craft/TESTER.md` with `.provision/craft/COMMON.md`. One-shot headless:
foreground commands only. You never fix the product.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/TESTER.md`.

## THE OWNER'S WORDS
2026-10-21: *"It must be simple, super simple, how to start."*
The train order's W4: "A tester leg follows the README's 'Run it yourself' on a clean machine: clone, install, start, the three
curls, change a threshold, see the alert list change. [...] each place the README was not enough. Gaps go back as a W3 or W6
round, never fixed by the tester."

## ACCEPTANCE
W0 — the contract comes first:
1. `npm ci && npm test` exits 0. 2. `npx redocly lint docs/api/openapi.yaml` reports 0 errors. 3. `npm run mock` then one
`curl -s -i` per path returns that path's example. 4. `mock/server.ts` is 30 lines or less.
W1 — the feed survives USGS: the tests cover a normal feed, an empty feed, a malformed feature (skipped and counted, never fatal),
a duplicate id (the first wins), HTTP 429/5xx with a bounded retry, and a recorded fixture of the real feed. `QUAKEWATCH_LIVE=1 npm test`
reads the real feed (network permitting).
W2 — events and thresholds are stored: idempotent ingest (the same feed twice, the same row count), a migration from empty, a
threshold read back, all events when `since` is absent, UTC times with at most millisecond precision (finer and impossible times
refused, never moved), region boxes equal to the contract's table.
W3 — the API answers from the store: every response, success and error, matches `docs/api/openapi.yaml`; bad input answers 400,
an unknown path 404, never 500 for bad input; `npm start` plus the three curls in `docs/RUN_IT.md` give the documented output
byte for byte; the server stops cleanly on SIGINT; a store failure answers 500 `unavailable`; a PUT over 16 KiB answers 400
`body_too_large`.
W3b — the contract declares every error: every status the server answers is declared in `docs/api/openapi.yaml`, and the contract
test fails on an undeclared one.

## STEP PLAN
Use ONLY what the repository's own `README.md` and `docs/` tell a stranger. Where they are not enough, stop that step, write what
was missing, and go on with the next step using the code.
1. Clone the repository fresh into your worktree's `.saphan/work/quakewatch-server-test/clone/` (from the worktree's own git, not
   the network) and record its tip.
2. Read `README.md` from the top as a stranger. Note every word used before it is explained.
3. "Run it yourself": install, start the server as the README says. Then as `docs/RUN_IT.md` says, with the recorded feed.
4. The three curls; compare with the documented output.
5. Change a threshold; see the alert list change. Set it back; see it change back.
6. Bad input: an unknown region, a bad `since`, a bad threshold body, an unknown path. Every answer is 400/404 with the error schema.
7. Stop the server with Ctrl-C (SIGINT); it exits and leaves no process behind.
8. Start it without `QUAKEWATCH_FEED_FILE` (the live USGS feed) if your seat has network; otherwise UNRUN with the refusal.
Review focus (inputs no test covers): a region in upper case, a `since` in the future, two PUTs at once, an empty database file.

PERMISSION CLASS (MASTER, 2026-10-23): this leg runs under the node executor class (`worktree-executor-node-grant`), not
`worktree-tester-grant`: the tester class admits only `npm ci` and `npm run`, so it could not run `npm test` or `npm start`,
which the README tells a stranger to type. Your craft is still TESTER (`.provision/craft/TESTER.md`); never product code.
Your seat may refuse to open a port or run `curl`. If it does, say so once with the exact refusal, drive the server through its
request handler as the tests do, and mark every curl step UNRUN-on-seat; the master runs them on his host.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-server-test/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

## RETURN
`_EXEC_STATUS.md` with `- state: done`, an `- abstract:` of at most 5 lines, and its `- return:` list naming
`_TEST_REPORT.md` (the list form: the key on its own line, each file nested below it). Read every `saphan` verb you test by
its `RESULT:` line, its `--json` or its exit code; when what a human sees is the thing under test, read the human form as a
human would and say which form you read.
