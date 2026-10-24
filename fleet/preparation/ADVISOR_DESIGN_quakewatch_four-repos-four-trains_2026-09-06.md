# QUAKEWATCH — four repositories, four trains: the fleet proves it works off Go before anyone is asked to trust it on their stack

> Preparation document, written by the advisor on 2026-09-06 before the QuakeWatch trains were cut. Private details are blacked out (█).

**Advisor, 2026-09-06.** ⚠ INTERNAL. **Stream home:** `development/backlog/quakewatch/`. **Owner's words:** *"Four tasks —
four repositories. We already have a plan prepared for such a demo application. On its development we will test that everything works
not only on Go. Look it up in the documents. An application about earthquakes. Without it, releasing is frightening, because only Go
would work."*

## §0 FOUND — the plan exists, resolved on 2026-07-14, and it names itself PoC-zero

`[MEASURED 2026-09-06]` `strategy/DESIGN_BRIEF_ADOPTION_FUNNEL_GOVERNED_MASTER.md:114-136` (*RESOLVED — the demo app: QuakeWatch*),
cross-referenced from `strategy/SITE_GUIDED_JOURNEY.md:140`, `strategy/POC_READINESS_LADDER.md:23,29,48`, `strategy/BD_FIELD_BRIEF.md`,
`tasks/done/ORDER_bd-field-brief.md:27`. **No repository, directory or stream named QuakeWatch exists in the workspace or in
`development/`** — the plan is a plan. Verbatim, the parts that bind:

> The demo app = **QuakeWatch** — seismic alert monitor for a configurable region (owner context: SE Asia). SAME architecture as
> owner's spec: external feed client (USGS earthquake GeoJSON — public, keyless, stable), Node server with `/api/v1` contract for
> mobile, SQLite (events + user alert thresholds), Android + iOS clients (list/map + threshold editing), Docker image hosting the lot.
> WHY not weather: … seismic gives real domain consultation at the gate (threshold defaults vs depth — the Consult beat writes itself),
> real failure material (feed format/rate-limit assumptions → amendment loop), and a thesis-aligned domain: safety-alert software built
> under recorded accountability. Waves: (1) feed+server+contract, (2) mobiles in parallel with the parity gate, (3) devops+final report.

> `POC_READINESS_LADDER.md:29` — **QuakeWatch doubles as PoC-zero — never take a first customer through an onboarding no one has
> survived internally.**

⇒ The owner's sentence today — *"without it, releasing is frightening, because only Go would work"* — is the
July sentence with the fleet two months older. **The app is not the deliverable. The deliverable is the fleet's own record of building it
on four stacks that are not Go**, with every train designed this week exercised on the way: permission classes and egress rule-sets per
stack, runner images and a Mac seat, the review classes, the bugs lane with its flags, process documentation in three profiles, fleet
memory per repository, the reports over a multi-repo period, the bridge verbs. **What the fleet cannot do for QuakeWatch it cannot do
for a customer.**

---

## §1 THE FOUR REPOSITORIES — one per train, one master each, in parallel where the contract allows

| # | repository | stack (not Go) | what it is | what it PROVES about the fleet |
|---|---|---|---|---|
| **R1** | `quakewatch-server` | **Node / TypeScript** · SQLite | USGS GeoJSON feed client with a mock; `/api/v1` (events by region, thresholds CRUD); OpenAPI 3.1 contract **as the repository's first artefact**; migrations; tests (unit + contract) | `dev-node`/`dev-ts` image + `worktree-node-toolchain` grant (seeded, never used); egress rule-set `dev-node-registries` + **one named external host** (`earthquake.usgs.gov`, 443) for the *feed* tests only — the first time a leg's egress names a customer's real API; `npm ci` not `npm install` (the grant's rule); a contract the other three repos consume by version |
| **R2** | `quakewatch-android` | **Kotlin** · Gradle · Jetpack Compose | list + map + threshold editor against `/api/v1`; instrumentation tests on the emulator | `dev-android` image on `█████` (admitted 08-04, **1 slot**, ssh); `worktree-android-toolchain-grant` (ratified, **never exercised on a real leg** — UNMEASURED); egress `dev-java-android-registries` (Maven Central · Gradle · `dl.google.com`); the *parity gate* (R4) |
| **R3** | `quakewatch-ios` | **Swift** · SwiftUI · Xcode | the same screens; XCTest on the simulator | the **Mac seat**: `█████` (`█████`, ssh, 5 slots) with `worktree-apple-toolchain-grant`; machine class `mac-xcode` — the one runner class that is a **bare machine, not an image**, so the runner tool manifest question (PD-3) is answered for real; Apple's own egress hosts (UNMEASURED); a leg that cannot be containerised |
| **R4** | `quakewatch-deploy` | **Docker · Compose · shell** | the image hosting server + SQLite; compose for local; the **parity gate** as a runnable check (both clients against one recorded fixture of `/api/v1`); the final report | `█████` (admitted 08-12); container posture (*mounts not yet enumerated into the sandbox record* — the witness relay's own words: this repo makes that measurable); `container-registry-dockerhub` egress; the Compliance Report over four repos in one period; `saphan docs product` across four trains |

**Not a fifth repository:** the *feed client* is a module of R1 (the July text puts it with the server); a fifth master would add a
seam without adding a stack.

**Contract first, then parallel.** R1's first wagon is the OpenAPI document and a mock server that serves it (`prism`-class or a
30-line Node stub) — **that wagon lands before R2/R3 dispatch**. From then on R2, R3 and R4 run in parallel against the contract's
*version*, not against R1's trunk; a contract change is a new version R1 publishes and the others pull by explicit act — the same
discipline the fleet already keeps between engine and bridge (`clients/openapi.yaml`, conformance-tested). The dependency edges the
July text calls *"the dependency-graph demo for free"* are exactly these.

---

## §2 WHAT "IT WORKS" MEANS — the protocol, measurable per repository

The exercise is over when **every row below reads `measured` for all four repositories** — and P0 is the row that says the app runs, in the owner's hand, where a customer would run it. Each row is a fact
the record already knows how to hold; the exercise adds nothing to the fleet but the *proof that the existing rows fill on stacks that
are not Go*.

| # | property | how it is measured (the command or the row) | today (Go) | R1 · R2 · R3 · R4 |
|---|---|---|---|---|
| **P0** | **the owner runs it** — on a machine not used for development, from the README alone, against the live USGS feed; sees it work (owner, 2026-09-06: *"I start the app and look whether it works. Only then is it good. Otherwise it works at our place, and not at the customer's"*) | a signed gate row per train (W7) + `howto/BEAT-9_<T>.md` | the install docs' own stranger test — pending | — |
| P1 | a leg **spawns** with the stack's image / machine class and its grant class | `run_record.sandbox_*`, `permission_denials = 0` for the toolchain's own commands | measured daily | — |
| P2 | the leg's **egress** is the stack's registries and nothing else; the feed host only in R1 | `egress_fact` rows: every dial names a host in the assigned rule-set; **zero** dials refused for a legitimate install | measured | — |
| P3 | the leg **returns** with the fleet's own counts: tests PASS/FAIL/SKIP from the stack's runner (jest/vitest · JUnit · XCTest · a compose check) | RE-1's parser fills the columns; `unmeasured` never 0 | Go only | — |
| P4 | a **named review** on codex (qwen when no codex slot) reads a Kotlin / Swift / TS diff and issues a verdict the record can bind; `twice` = codex AND qwen on the clients | `fleet_gate` rows with `recommendation_ref`; both verdicts bound on a `twice` wagon | measured (Go) | — |
| P5 | the **parity gate** (R4) refuses when the two clients disagree against one fixture | a wagon in R4 whose test reddens on a planted divergence | n/a | — |
| P6 | the **Consult beat**: threshold defaults vs depth is a *domain* question the master relays to the owner at a gate, and the answer is a record document | a relay + an owner act row; the July text's *"the Consult beat writes itself"* | n/a | — |
| P7 | the **deliberate failure** (beat 7): the USGS rate-limit / format assumption breaks a leg; the bug is filed with the flags field; the repair rides a micro-train | a `bugs/` entry with `- flags:`; a `bug-repair` wagon; `fixed/` | the lane exists | — |
| P8 | **fleet memory** per repository: the second leg on each repo starts with the first leg's lessons | FM-2/FM-3: `memory/executor/quakewatch-<x>/` non-empty after wagon 1; a lesson read by wagon 2 | not built | — |
| P9 | **process documentation** in three profiles for each train, and `saphan docs product` across the four | PDX-3/PDX-4 render; the `public` set contains no host name | not built | — |
| P10 | the **reports** over the period show four trains, cost with class per stack, first-pass rate per stack | plates 1 · 4 · 5 with `train` filter | not built | — |
| P11 | **release**: a tag on each trunk observed as the release fact | RE-9 (deferred until the first tag — **this exercise produces the first tags**) | none | — |
| P12 | **the stranger test**: a master who has never seen the fleet builds R1's hello-world from docs.saphan.ai alone (customer-docs order material, already filed) | pass rate per step, per herd | pending the owner's read | — |

Rows P8–P11 depend on trains still in the backlog; **the exercise runs anyway** — a row reads `not built` truthfully until its train lands,
and the QuakeWatch record is the first real data those trains will render. That is the order the owner already gave for reports (*all
of them, preview first*): the fixture comes before the projection.

---

## §3 SEATS, MACHINES, CLASSES — measured against the registry

```
[MEASURED 2026-09-06, bridge/registry/MACHINES.md · development/permission-classes/ · saphan-studio-engine/images/]
R1 node     █████ (█████, 6 slots) or █████ (4) · image dev-node / dev-ts (Dockerfiles exist) ·
            grant worktree-node-toolchain (SEED ONLY — development/backlog/prompt-library/policies-seed/, not ratified)
R2 android  █████ (█████, 1 slot!) · image dev-android · grant worktree-android-toolchain-grant.settings.json (RATIFIED)
R3 ios      █████ (█████, ssh, 5 slots) · NO image (bare machine, class mac-xcode) · grant worktree-apple-toolchain-grant.settings.json (RATIFIED)
R4 deploy   █████ (█████, 2 slots) · container posture · grant: NONE fits (build-only is Go-shaped) — a class is needed
routing     OWNER 2026-09-06: development legs = claude-code ONLY; single review = codex (qwen if no codex slot); twice = codex AND qwen;
            qwen never executes. ~~one qwen master, one codex master~~ withdrawn — the advisor's routing was wrong and the owner
            corrected orders after it. Masters on claude-code. Liveness: emulator on █████ and Xcode on █████ ARE there (owner)
```

**Three things the registry says the exercise will hit first:** `█████` (the android runner) has **one slot** (R2's leg runs there; its reviews run
on `█████`/`█████` by the routing rule anyway); **no grant class fits R4** (a `worktree-container-
toolchain` class is a wagon before R4's first leg — the policies lane's own template); the node grant is a **seed, not a ratified class**
(ratify it by the owner's act or the first R1 leg is refused at spawn — which would itself be a correct refusal and a measured fact).

---

## §4 WHAT I REFUSE

| refused | why |
|---|---|
| **a single train with four lanes** | four stacks, four seats, four families — the owner said four tasks; one master would serialise what the fleet exists to parallelise, and the exercise measures parallel dispatch too |
| **Go anywhere in the four repositories** (a Go feed client, a Go deploy tool) | the exercise's one premise; a Go helper would be the fleet reaching for the stack it trusts |
| **hand-fixing a fleet gap to let a leg through** | every gap is a bug with its flags, filed by the hygiene rider, repaired on a micro-train — the exercise measures the fleet, not the operator's patience; a hand-fix is a lie in the record |
| **building the mobile clients before the contract lands** | the contract is the parallelism; without it R2/R3 build against a moving trunk and the parity gate has nothing to hold |
| **the real USGS feed in tests** | tests use a recorded fixture; the *feed* wagon dials USGS once under its own egress rule and records what it got — beat 7's failure material is then real, and every other leg's egress stays closed |
| **treating the app as a product** | PoC-zero (the ladder's words); the app is the fleet's test fixture and the docs' stranger-test subject; nothing in it ships to anyone |

---

## §5 SEQUENCE

0. **The bridge served by the gateway lands first** (bridge-server BR-0/1/3/4/5/7/10) — the owner's sequencing of 2026-09-06; then the new workspace `█████/quakewatch`, `saphan bridge init quakewatch` (born v2, served), and the role machines pulling it over mTLS — the environment train's S2/S2b. Lane I (machines) and the image-runner train run meanwhile.
1. **Prerequisites, by the owner's act** (a day): ratify the node grant class; write and ratify a container grant class for R4; admit
   the four egress rule-sets as drafts → signed (the policies lane's draft/admit; until it lands, the files); confirm `█████`'s
   emulator and `█████`'s Xcode are alive (`saphan machine observe`).
2. **R1 wagon 1 — the contract + mock** (one master, one leg): OpenAPI 3.1, mock server, contract test; **lands before anything else
   dispatches.**
3. **R1 · R2 · R3 · R4 in parallel** — four masters, each with the train order for its repository; R4's first wagons (image, compose,
   parity-gate skeleton) need only the mock.
4. **The Consult beat** at R2/R3's threshold wagon; **beat 7** planted in R1's feed wagon (the master does not know which assumption
   breaks — the feed decides).
5. **Wave 3**: R4 integrates, the parity gate runs both clients against one fixture, the first tags are cut (P11), the Compliance Report
   and `saphan docs product` are generated over the four trains — **the exercise's deliverable is that document set**, read by the owner
   as PoC-zero's survivor.

---

## §6 WAGONS FOR THE OWNER'S PREREQUISITES (material; each master composes his own train order for his repository)

| # | wagon | proves | review |
|---|---|---|---|
| QW-0 | **four train orders** — R1..R4, each from the July spec, each naming its stack, seat, image/class, grant, egress rule-set, and its rows of §2 | four masters can start in parallel after R1-W1 | master-verify-only (the advisor's material; the masters' orders) |
| QW-P1 | **ratify `worktree-node-toolchain`** (seed → class) | R1's first leg spawns | owner act |
| QW-P2 | **`worktree-container-toolchain` class** for R4 (docker · compose · sh; denies `docker push` to any registry but the fleet's) | R4's first leg spawns | **named** (a grant is a boundary) |
| QW-P3 | **egress rule-sets admitted** — `dev-node-registries` + `usgs-feed` (R1 only), `dev-java-android-registries` (R2), `apple-developer` (R3, hosts UNMEASURED), `container-registry-dockerhub` (R4) | every legitimate install dials; every other dial refuses | **named** |
| QW-P4 | **machine liveness**: `█████` emulator, `█████` Xcode + simulator, `█████` docker — measured, written to the machine registry | no leg is refused for a dead tool | master-verify-only |

---

## KICKOFF PASTE — for the owner, to open the exercise (four masters follow, one per repository, after R1-W1)

```
Masters of quakewatch-server · quakewatch-android · quakewatch-ios · quakewatch-deploy: the owner opens PoC-zero. The plan is
strategy/DESIGN_BRIEF_ADOPTION_FUNNEL_GOVERNED_MASTER.md:114-136 (RESOLVED 2026-07-14) — QuakeWatch, a seismic alert monitor:
USGS GeoJSON feed → Node/TypeScript server with an /api/v1 contract and SQLite → Kotlin Android and Swift iOS clients with a
parity gate → a Docker image hosting the lot. The app is NOT the deliverable. The deliverable is the fleet's own record of building
it on four stacks that are not Go: development/backlog/quakewatch/ADVISOR_DESIGN_quakewatch_four-repos-four-trains_2026-09-06.md
§2 is the protocol — twelve properties, each a row the record already holds, each to read `measured` for your repository.
Order: the server master lands wagon 1 — the OpenAPI contract and a mock that serves it — before anyone else dispatches; from then
on the four trains run in parallel against the contract's VERSION, never against a trunk. No Go anywhere in the four repositories.
No hand-fix of a fleet gap to let a leg through: a gap is a bug with its flags (URGENT · CRITICAL), filed by the hygiene rider,
repaired on a micro-train — the exercise measures the fleet, not your patience. Tests use a recorded feed fixture; the one feed
wagon dials USGS under its own egress rule and records what it got — that is beat 7's material.
Seats: server on █████ or █████ (image dev-node/dev-ts); android on █████ (ONE slot — reviews run
elsewhere); iOS on █████ (bare Mac, class mac-xcode, no image); deploy on █████. Development legs on claude-code only; a named review on codex (qwen if no codex slot is free); the two clients' threshold and parity
wagons are `twice` = codex AND qwen; qwen never executes. Before you dispatch, measure: your grant class is
RATIFIED (node's is a seed today; deploy's does not exist — QW-P1/P2 are the owner's), your egress rule-set is admitted, your
machine's tool is alive (saphan machine observe). Every train order names its §2 rows; every return names its counts; every gap
is a filed bug. Move your lane backlog→active in your dispatch commit; active→done at close.
```

## UNMEASURED
- ~~emulator / Xcode liveness~~ — answered by the owner (they are there); the first leg records it.
- Apple's developer egress hosts for a SwiftUI build with no third-party packages (may be zero beyond the local toolchain) — R3's rule-set may be the empty floor.
- Whether the container posture on `█████` records mounts into the sandbox record (the witness relay says *not yet enumerated*); R4 will measure it on its first leg.
- How the four masters synchronise contract versions in practice — the engine has the engine↔bridge conformance shape; whether it applies to a customer's own OpenAPI is R1-W1's first measurement.
- The July text's *beat* numbering (1–8) — from the site's guided journey spine; not re-read here beyond the lines quoted.
