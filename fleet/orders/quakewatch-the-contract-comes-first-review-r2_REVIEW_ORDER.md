# ORDER — quakewatch-the-contract-comes-first-review
track: quakewatch-server
- train: quakewatch-server
- wagon: W0
- round: 2
- repo: quake-watch-server
- branch: review/quakewatch-the-contract-comes-first-review
- base: fix/quakewatch-the-contract-comes-first @ 73f09100c
- reviewed-sha: 73f09100c
- role: review
- backend: codex
- model: gpt-6-sol
- quote-usd: 7
- cap-usd: 14
- wall: 45m
- task: verify that round 2 (b35ee8dfe...73f09100c) closes the conditions of review round 1, and judge the whole wagon 21dafea60...73f09100c

LAW-CHECK: the laws ride inline in your prompt; echo their slugs in your LAST message; absent → `- state: blocked`, stop.
ROLE-LOCK: YOU = REVIEW. FIRST `git rev-parse --short=9 HEAD` must print `73f09100c`, else `- state: blocked`. One-shot headless:
foreground commands only. You never fix the code under review.

## SKILLS
- .provision/skills/lang-typescript-node/SKILL.md
- .provision/skills/contract-first-boundaries/SKILL.md
- .provision/skills/supply-chain-npm/SKILL.md

Craft: `.provision/craft/COMMON.md` + `.provision/craft/REVIEW.md` (R1–R14).

## WHAT IS UNDER REVIEW
Scope: round 2 is b35ee8dfe...73f09100c — 1 commit, 5 files (`.redocly.lint-ignore.yaml`, `docs/api/openapi.yaml`,
`mock/server.ts`, `redocly.yaml`, `test/contract.test.ts`). The wagon is 21dafea60...73f09100c. W0 of a public tutorial
repository; the owner's bar is "super simple" (owner, 2026-10-21: *"It must be simple, super simple, how to start."*).

Round 1's order (still binding): an OpenAPI 3.1 contract with five operations, each with a schema and an example; a closed
region enum of at most five that includes `southeast-asia`; one shared error schema; one `Quake` schema; a mock of at most 30
lines on port 8080 (`PORT` overrides) that reads the examples from `openapi.yaml`; Node 22 + TypeScript; `npm test` runs locally.

Your round-1 conditions, verbatim:
> 1. Blocking: make a missing response example fail a test and a mock startup or request, and validate the example's schema;
>    `mock/server.ts:12`, `test/contract.test.ts:27,39-40`.
> 2. Blocking decision: reconcile the 400 behavior at `openapi.yaml:73-74,119-120,150-151` with `mock/server.ts:15-24`; either
>    implement and test it in the mock or document that the mock demonstrates only the successful example and keep error
>    conformance for the later real server. The master must state which contract surface the mock promises.
> 3. Owed: clarify the global lint suppression at `redocly.yaml:7-8`, and provide a first-run recipe and mock limits in the
>    in-scope documentation wagon.

The master's ruling on condition 2 (MASTER, 2026-10-21): the mock promises ONLY the success examples; it does not validate
input and never answers 400; error behaviour belongs to the real server (wagon W3, whose acceptance is a contract test of every
response, errors included). The ruling must be written in `mock/server.ts` and in `info.description`. The first-run recipe of
condition 3 belongs to the documentation wagon (W6), not to W0.

The executor's round-2 claims (claims, not facts): 11 pass / 0 fail; a missing `/healthz` example turns the suite red with
`openapi.yaml has no 200 example for: GET /healthz` and stops the mock at start; a wrong-typed example turns the lint test red
(`no-invalid-media-type-examples` set to error); a new test drives the real HTTP handler with fake request and response
objects; the 4XX exemption is now `/healthz` only, in `.redocly.lint-ignore.yaml`; `mock/server.ts` is 30 lines.

MASTER'S MEASUREMENT (2026-10-22, █████, fresh clone at 73f09100c, node v26.7.0 — not Node 22): `npm ci` exit 0;
`npm test` 11 pass / 0 fail; lint valid, "1 problem is explicitly ignored"; `wc -l` 30; removing the `/healthz` example → exit 1
with the message above; `magnitude: "strong"` → exit 1, `Validation failed with 2 errors.`; live mock on port 18088: the five
operations each `HTTP/1.1 200 OK`.

## WHAT TO JUDGE
FILE·LINE·CONTROL; verdict `accept` · `accept-with-conditions` · `reject`.
1. Is condition 1 closed? Run your own unplug of a missing example and of a wrong-typed example, and say which test turns red.
2. Is condition 2 closed by the ruling as written? Does a reader of `mock/server.ts` and of the contract learn that the mock
   never answers 400?
3. Does the per-operation lint exception hold only for `/healthz`? Say what happens to it when that path is renamed.
4. Does the new handler test prove the serialized HTTP response, or only `answer()` again?
5. Anything round 2 broke in round 1's promises (30 lines, examples read from the contract, port 8080 / `PORT`).
Licences are out of scope: the owner decides them, once.

## BOUNDARY
This diff (the wagon 21dafea60...73f09100c, with round 2 as the focus).

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
