# ORDER — quakewatch-the-contract-comes-first-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W0
- repo: quake-watch-server
- branch: review/quakewatch-the-contract-comes-first-review
- base: fix/quakewatch-the-contract-comes-first @ b35ee8dfe
- reviewed-sha: b35ee8dfe
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify every claim of 21dafea60...b35ee8dfe — and nothing beyond it

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `b35ee8dfe`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/supply-chain-npm/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: 21dafea60...b35ee8dfe — 1 commit, 8 files (`docs/api/openapi.yaml`, `mock/server.ts`, `test/contract.test.ts`,
`package.json`, `package-lock.json`, `redocly.yaml`, `tsconfig.json`, `.gitignore`). This is W0 of a public tutorial repository:
a stranger reads every file, so the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

The order promised, in its own words:
1. `docs/api/openapi.yaml` — OpenAPI 3.1 with `GET /api/v1/events?region=&since=` · `GET /api/v1/thresholds/{region}` ·
   `PUT /api/v1/thresholds/{region}` · `GET /api/v1/alerts?region=` · `GET /healthz`, each with a schema and at least one
   `example`. Regions are a closed enum that includes `southeast-asia`, five or fewer, each a named latitude/longitude box
   described in the contract. Errors (400 unknown region, 400 bad `since`) share one error schema. One `Quake` schema: `id`,
   `time` (RFC 3339 UTC), `magnitude`, `depthKm`, `lat`, `lon`, `place`.
2. A mock of at most 30 lines answering every path with that path's example, port 8080 (`PORT` overrides), `npm run mock`; it
   reads the examples from `openapi.yaml`, never copies them.
3. `package.json` pinning Node 22, TypeScript, one test runner, a committed lockfile, `@redocly/cli` as a dev dependency;
   `npm test` runs locally with no CI.
4. Tests: the contract lints; the mock answers each path with the example's body and status.
Out of scope for the executor: `README.md`, `docs/SAPHAN_IN_5_MINUTES.md`, `docs/WHAT_COMES_NEXT.md`, `fleet/`; no feed client,
store, real server, Docker, CI, or authentication.

The executor's return (claims, not facts): `npm ci && npm test` 9/9 pass; `redocly lint` 0 errors; `mock/server.ts` 26 lines.
It turned off two `recommended` lint rules in `redocly.yaml` (`no-server-example.com`, `operation-4xx-response`) and declared
`security: []` at the root. Its seat refused `listen()` with EPERM, so it tested the mock in-process through `answer()` only.

MASTER'S MEASUREMENT (2026-10-21, █████, fresh clone at b35ee8dfe, node v26.7.0 — not Node 22): `npm ci` exit 0; `npm test`
`tests 9 · pass 9 · fail 0`; `redocly lint` "Your API description is valid"; `wc -l mock/server.ts` 26; `PORT=18087 npm run mock`
then one `curl -s -i` per path: all five `HTTP/1.1 200 OK` with the example body. `GET /api/v1/events?region=atlantis` also
returned 200 with the example (the mock ignores the query).

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Does the contract hold every property item 1 lists? Name each one you checked and the line that holds it.
2. Do the two disabled lint rules and `security: []` keep the bar the order set ("0 errors"), or do they lower it? Say which,
   with the rule's own meaning.
3. Is the mock's reading of the contract sound? Unplug one example in a scratch copy of `openapi.yaml` and say what the mock and
   the tests then do.
4. Do the tests fail when the mock or the contract is wrong? Name one mutation per test that turns it red, or say which test
   cannot fail.
5. Can a stranger follow the files? Name anything a first-time reader of this public repository would not understand.
   Review focus — inputs no test covers: an unknown region, a malformed `since`, a `PUT` body outside the threshold schema,
   a path with a trailing slash.
Licences are out of scope: the owner decides them, once.

## BOUNDARY
This diff.

## ARTIFACT CONFINEMENT
Every artifact this leg makes — captures, logs, evidence, scratch — lives under `.saphan/work/quakewatch-the-contract-comes-first-review/` in the worktree.
Nothing outside the worktree; nothing committed unless this order names it.

**LEAVE THE WORKTREE AS YOU FOUND IT.** Before you write `- state: recommendation-ready`, delete every probe, mutation
and scratch file you created outside `.saphan/work/`, restore every file you inverted, and confirm `git status --porcelain`
in the reviewed worktree shows nothing of yours. A leftover file blocks the stream's teardown (W4a, 2026-10-10).

## Review output — the return manifest the reviewer owes
`_REVIEW_STATUS.md`: H1 `# REVIEW — quakewatch-the-contract-comes-first-review`; keys `state · verdict · ref · abstract · artifacts ·
updated`; the abstract at most 5 lines. `_REVIEW_NOTES.md` H2s: Ground · Differential · Unplug · Closure · Remainder ·
Profile · Focus · Conditions · Unrun. Check with `saphan doc check _REVIEW_STATUS.md --family review-status`.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
