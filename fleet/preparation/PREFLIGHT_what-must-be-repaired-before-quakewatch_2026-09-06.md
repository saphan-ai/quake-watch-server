# PRE-FLIGHT — what the fleet must repair BEFORE QuakeWatch dispatches, and what it may leave for the exercise to measure

> Preparation document, written by the advisor on 2026-09-06 before the QuakeWatch trains were cut. Private details are blacked out (█).

**Advisor, 2026-09-06.** ⚠ INTERNAL. **Stream home:** `development/backlog/quakewatch/`. Companion to
`ADVISOR_DESIGN_quakewatch_four-repos-four-trains_2026-09-06.md` (the protocol) and `ORDER_MATERIAL_quakewatch_four-train-orders_2026-09-06.md`
(the trains). **Owner's words:** *"Your role: preparing the train for building this application. And before that — from the description
and your knowledge of Saphan — finding the points we must repair even before those."*

> ## ⇒ Every item below is a **measured fact from this week's record** (the bugs lane, the vendor analysis, the witness relay, the
> registry) read against the four stacks. Sorted into **BLOCKS** (a leg cannot spawn, return or be reviewed — repair first),
> **CORRUPTS** (a leg runs, but the record it leaves lies — repair first, because the exercise's deliverable *is* the record), and
> **MEASURE** (a gap the exercise should hit on purpose and file). Each carries the two flags of the bugs lane and the train that owns
> the repair. Nothing here is a wish: 11 of 14 already have a bug file or a wagon.

---

## §1 BLOCKS — no leg on the new stacks spawns, returns or is reviewed until these land

| # | fact `[MEASURED]` | hits | flags | repair — where |
|---|---|---|---|---|
| B1 | **`worktree-node-toolchain` is a seed, not a ratified class**; **no grant class fits a container/compose leg** (`development/permission-classes/`: android · apple · build-only · executor · textproc; the node class exists only in `prompt-library/policies-seed/`) | R1 spawn refused; R4 has no class | URGENT | owner ratifies node (QW-P1); QW-P2 writes `worktree-container-toolchain` — one wagon, `named` |
| B2 | **`--egress-policy` on claude-code is a guaranteed dead leg** — the vendor client never dials the door; `3 of 3 legs dead, $0` (bugs: `the-egress-wall-kills-every-claude-code-leg…`, `the-agent-vendor-cannot-be-pointed-at-the-egress-door…`, 🔴 open) | **every governed leg of the exercise** — development is claude-code only (owner, 2026-09-06) | URGENT · **CRITICAL** | egress-control lane (the door on the far host) — **the single hardest blocker now**; until fixed, legs run with the *observe* posture and every return says so (premiere gate G4) |
| ~~B3~~ | ~~a codex leg cannot bind a listener~~ — **no longer blocks**: codex executes nothing (owner's routing: qwen and codex review only); a review leg binds no port. Stays a filed bug for the day codex executes again | — | — | — |
| B4 | **the `twice` review class the owner ratified cannot be declared** — the key is absent from the binary's enumerated set and writing it silently removes the review (bug 🔴) | P4: `twice` on R2/R3 reviews; every `twice` row in this week's designs | **CRITICAL** | one wagon in the engine (`fleet.verify.class.<class>` accepts `twice`, and a written `twice` that lands as *no review* reddens) — **before any R2/R3 review is ordered**; `named` |
| B5 | **codex and qwen legs receive nothing from the knowledge unit** (vendor analysis §1: unit loads 31/31 on claude-code; codex `declared`, qwen no row) | every **review** leg of the exercise — all reviews are codex/qwen (owner's routing) — reviews without the review role card, skills or hooks | URGENT | vendor plan X-1 → CX-0/QW-0 for the **review** role first — the review card is the one that must travel; codex reviews run today without it (24 role runs measured), so this is *worse reviews*, not *no reviews* — pre-flight if the schedule allows, measured if not |
| B7 | **the image runner (`--backend image`, engine docker\|podman) is not dispatchable end-to-end** — `█████` (the earlier docker dev-images stream, archived 08-14) left `p2e` egress NOT WRITTEN, the container+egress combination *unadjudicated* (`containerconfine.go:549`), two review conditions open (digest spelling seam · strong posture never resolved), no image admission verb; `images/_ctx` absent so no fleet image builds as committed | **R4 entirely** (its seat is the image runner, container posture) | URGENT · **CRITICAL** | `development/backlog/image-runner/ADVISOR_DESIGN_the-image-runner_2026-09-06.md` — IR-0..IR-4; **R4 dispatches after IR-4**; until then R4's master composes the image and compose files on a Landlock leg (`█████`) and the *container-posture* rows of P1/M2 read `not built` truthfully |
| B8 | **the bridge is not served by the gateway yet** — roles on separate machines have no way to pull a bridge except an external git host, which the owner ruled out (bridge-server design §1: `origin = █████`, one `bridge` verb, no receive hook, no mTLS git endpoint) | **the whole exercise as the owner shaped it on 2026-09-06**: a new workspace `█████/quakewatch`, `saphan bridge init quakewatch` born v2 and served, roles on separate machines pulling through the gateway — *"it will be the ideal test"* | URGENT · **CRITICAL** | `development/backlog/bridge-server/` BR-0 · BR-1 · BR-3 · BR-4 · BR-5 · BR-7 · BR-10 **before the environment train's S2**; BR-11 (our own migration) is NOT on this path |
| B6 | **every `proc`/`codex`/`agent-loop` return is `Unwitnessed` after round 8** and the remedy is a hand-fetch (witness relay, answered today) | every codex return in the exercise | URGENT | the `--accept-unwitnessed` recorded acceptance (my relay §2) — a small wagon in bug-repair after round 8 lands; without it the exercise's codex returns are a daily hand-procedure the record does not see |

---

## §2 CORRUPTS — a leg runs, and the record it leaves is wrong; the exercise's deliverable is the record

| # | fact `[MEASURED]` | hits | flags | repair — where |
|---|---|---|---|---|
| C1 | **`fleet_session` counts one stream up to 3×** (1.601×, six workspace spellings; bug 🔴) — root cause named 2026-09-06: **the workspace is keyed by its path** (`workspaceID(realPath)`, eight `workspace TEXT` columns) | every denominator on plates 1–5 over four trains; *first-pass %* per stack; **and the whole multi-workspace ruling** (one gateway, many projects) | **CRITICAL** | **WS-2 of `development/backlog/workspaces/`** (`workspace_id` on the record, backfill of every spelling to one id) — RE-0's true form; **before** any report over the exercise is read, and before S2 mints the second workspace |
| C2 | **two billing classes, one credential path**: 155 `auth-failed` legs + 327 auth refusals on one backend, `$368.23 real`; **a seat token dies mid-run and the whole spend is lost** (two bugs) | P10 cost-per-stack; codex/claude seats over days of parallel legs | **CRITICAL** | the seat-credential wagon (exists elsewhere — the seat-token-refresh recommendation of 2026-08-16); at minimum the class column read, never inferred (law #51) |
| C3 | **the differential recheck exists only for `go test` argv** (`unioniso.go:881-892`: *"not a `go test` invocation this package can turn into…"* → `RecheckUnavailable`); the verify contract does accept `junit-xml` (`config/verify.go:52`) | P3 on all four repos: PASS/FAIL/SKIP and base-vs-tip for jest · JUnit · XCTest | **CRITICAL** | one wagon: **every non-Go suite reports JUnit XML** (`jest-junit`, Gradle's default, `xcresulttool → junit`) and the recheck path accepts a JUnit report as the second reading — the reader (`internal/junitxml`) exists, only the recheck's argv gate is Go-shaped; `named` |
| C4 | **no view groups by train** (bug: 8 trains / 334 orders parsed, unviewed) | the owner watching four trains at once | URGENT | RE-7 / the Train plate — or, pre-flight, the `saphan fleet show --train <slug>` filter alone (one flag on an existing verb) |
| C5 | **a new store migration makes the record unreadable to every older binary in the fleet** (bug 🔴🔴🔴, no guard) | five machines on one shared binary during a multi-day exercise; any wagon above that adds a column (C3, B4) | **CRITICAL** | the sequencing guard the bug names — **or a standing rule for the exercise: no migration lands while a QuakeWatch leg is live**, written into the four train orders |
| C6 | **a far dispatch whose branch is checked out locally composes green and fails only at return; composing for an ssh host can outlast a two-minute window and fail silently; parallel dispatch to one machine races the mirror-refresh lock** (three bugs) | four masters dispatching to five machines in parallel | URGENT | bug-repair transit 3 has two of them; the lock race is the one to take first — four masters *will* race it |

---

## §3 MEASURE — hit on purpose, file, do not pre-fix

| # | gap | why it is the exercise's job |
|---|---|---|
| M1 | `█████` (the android runner) has **one slot**; the android grant and the apple grant were **ratified but never exercised on a real leg** (emulator and Xcode ARE there — owner, 2026-09-06) | the first R2/R3 legs are the measurement of the grants; a refusal there is a correct, recorded fact — file it with flags |
| M2 | the **container posture** records no mounts into the sandbox record (witness relay) | R4's first leg on `█████` measures it; the Unwitnessed acceptance (B6) records the consequence |
| M3 | **egress hosts** for Apple's toolchain, for Gradle/Google Maven under a real build, for USGS | the rule-sets are drafts with `hosts: UNMEASURED`; the first refused dial per stack is the measurement that turns a draft into an admitted set |
| M4 | the **beat-7 failure** (USGS rate-limit / format) | planted by design; the fleet's amendment loop is the thing under test |
| M5 | the executor role card says *"a refused `go` / `gofmt` is a permission fact"* (`EXECUTOR.md:44`) — Go is the only example the card knows | the first Kotlin/Swift/TS leg shows whether the card's sentences generalise; the lesson lands in fleet memory when FM lands, in the bugs lane until then |
| M6 | **four new repositories need a forge** — the forge half (GitHub *and* Gitea end-to-end) is the weekend's deadline (customer-docs handoff debt 4) | if the forge half is not there, the four repositories live as bare repos on the console host and merges are `saphan merge` local — the exercise still runs, and P11's tags are local; the forge is measured, not assumed |

---

## §4 THE ORDER OF REPAIRS, PRICED IN DAYS OF THE EXERCISE

0. **B8 — the bridge served by the gateway** (bridge-server BR-0/1/3/4/5/7/10) — the owner's own sequencing: *"before that I must finish the train with our git for the bridge"*; the environment train's S2 waits on it; Lane I and IR-* run meanwhile.
1. **B1 (owner act + one class), B4 (`twice`), C5 (the migration rule or guard)** — a day; nothing dispatches without them. **B7** runs as its own lane in parallel (image-runner IR-0..IR-4) — R1–R3 do not wait on it; R4's container rows do.
2. **B2** — the door for claude-code: with development on claude-code only (owner's routing), this is the one blocker every governed
   leg hits; until it lands, legs run with the observe posture and the premiere page says *observe posture* aloud (gate G4).
3. **B5** — the review role card for codex/qwen (X-1, CX-0/QW-0 for `review`); if the schedule refuses, reviews run as they run today
   and the report says the card was absent — a smaller true claim beats a larger unmeasured one.
4. **C3** — JUnit XML as the stack-agnostic report; a day, and it is the only way P3 reads `measured` for three of four repos.
5. **C1, C6, B6** — before the first *report* is read, not before the first *leg* runs.
6. Everything in §3 — the exercise itself.

Price of skipping §1–§2 and dispatching tomorrow: a record full of `Unwitnessed`, `RecheckUnavailable`, `unmeasured` and inflated
denominators — **which would prove the owner's fear, not refute it.** Price of doing them: ~4 days of two masters before the first
QuakeWatch leg; the exercise's report then says *"it works"* with numbers behind every word.

## UNMEASURED
- Whether B2's door fix is already in flight on the egress lane (W5) — the bug is open; the lane plan was not re-read today.
- Whether `xcresulttool` → JUnit conversion is packaged on `█████` or needs a tool the apple grant must allow (C3 on R3).
- The exact count of `fleet.verify.class` sites that must accept `twice` (B4) — the bug file names the key; the fix's size is the master's to measure.
- Whether the mirror-refresh lock race (C6) is per machine or per workspace — decides whether four masters on five machines hit it at all.
- The owner's phones are in developer mode (owner, 2026-09-06) — W7 on both clients installs on a real device, not only an emulator/simulator; the Android README needs `adb` on the clean machine and the iOS README a free personal signing team (7-day builds) — both are README sentences, not fleet gaps.
- Every machine but `█████` is new (owner, 2026-09-06): the registry rows this pre-flight measured (`█████` 1 slot, `█████` 4, `█████` 2, `█████` 2) describe machines that will not run the exercise — the slot counts and the android runner's single-slot note are the OLD fleet's; the new machines' probes are the measurement, and the owner's admission acts are a prerequisite row of their own (QW-P4 grows to *admit the new machines*).
