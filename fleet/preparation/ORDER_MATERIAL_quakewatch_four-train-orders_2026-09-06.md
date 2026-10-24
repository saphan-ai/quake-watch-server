# ORDER MATERIAL — QuakeWatch, four train orders (server · android · ios · deploy), each for its own master

> Preparation document, written by the advisor on 2026-09-06 before the QuakeWatch trains were cut. Private details are blacked out (█).

**Advisor, 2026-09-06.** ⚠ INTERNAL. **Stream home:** `development/backlog/quakewatch/` — four sub-streams the masters move to `active/`
as `quakewatch-server`, `quakewatch-android`, `quakewatch-ios`, `quakewatch-deploy` (ORCHESTRATION.md:39-46). **Source spec:**
`strategy/DESIGN_BRIEF_ADOPTION_FUNNEL_GOVERNED_MASTER.md:114-136` (RESOLVED 2026-07-14). **Protocol:** `ADVISOR_DESIGN_quakewatch_…` §2
(P1–P12). **Pre-flight:** `PREFLIGHT_what-must-be-repaired-before-quakewatch_2026-09-06.md` — §1 B1–B6 land before dispatch.
The advisor neither dispatches nor gates; wagon cuts are a recommendation the master reshapes and prices (law #16).

## §0 Rules that bind all four trains (from the owner's acts, this week and July)

1. **Not Go, anywhere.** A Go helper is refused at review.
2. **Contract first.** `quakewatch-server` W1 (OpenAPI 3.1 + mock) lands before any other train dispatches; every other train pins a
   contract **version** in its train order and moves it by an explicit wagon.
3. **A gap is a bug, not a patch.** The hygiene rider rides every order: a fleet gap met on the way is filed in `development/backlog/bugs/`
   with `- flags:`; the leg does not work around it silently; the master does not hand-fix the fleet.
4. **Tests report JUnit XML** (`jest-junit` · Gradle default · `xcresulttool` → junit · a compose check emitting a suite) — the fleet's
   stack-agnostic count (PREFLIGHT C3); a return without counts reads `unmeasured`, never 0.
5. **Egress is the stack's registries and nothing else**; the USGS host only in `quakewatch-server` W3, and only there.
6. **No store migration lands while a QuakeWatch leg is live** (PREFLIGHT C5) — until the sequencing guard exists.
7. **Reviews:** `named` on every wagon that touches the contract, the data model or the parity gate; **`twice`** (two families) on the
   two clients' threshold + parity wagons and on the deploy image; `master-verify-only` on scaffolding.
8. **Every return names its §2 rows** (P1–P12) with `measured` / `not built` / `unmeasured` — the exercise's ledger is the union of the four.
9. **Fixture, not feed:** tests run on a recorded USGS fixture committed in `quakewatch-server`; the clients and deploy consume the mock.
10. **Routing — the owner's ruling, 2026-09-06, verbatim: *"Development: Claude Code. A single review on codex, and if none is free, then Qwen.
    A double review is codex and Qwen. Qwen is not fit for development, it is fit for review."*** ⇒ every executor leg runs on
    **claude-code**; **machines (owner, 2026-09-06: *"The machines other than █████ will be new"*): every machine named in this material except `█████` is
    today's and will be replaced — the orders bind machine CLASSES (`linux claude runner` · `android runner` · `mac-xcode` · `image-runner` ·
    `codex reviewer` · `qwen reviewer`) and the master resolves names from the registry at dispatch, after the owner admits the new ones; a **`named`** review runs on
    **codex** (the codex reviewer machine) and falls back to **qwen** (the qwen reviewer machine) only when no codex slot is free — the order says which
    it got; a **`twice`** review is **codex AND qwen**, always both. Qwen never executes. Masters run on claude-code. ~~one qwen master,
    one codex master~~ — withdrawn; the advisor's earlier routing was wrong and the owner corrected orders after it.
11. **Machine liveness (owner, 2026-09-06): the emulator on `█████` and Xcode on `█████` ARE there** — M1 is answered by
    the owner's word; the first leg still records `saphan machine observe` as the measurement, not as a question.
12. **Capture for the howto (`CAPTURE_PROTOCOL_how-to-build-your-first-governed-app_2026-09-06.md`):** every beat of the guided-journey spine
    you complete has its `howto/BEAT-<n>_<T>.md` in your stream directory **within the hour**, written by you, quoting commands and output
    verbatim, naming record ids, never edited after (`## Later` with a date); your exec status names the file. The scribe assembles the
    howto from these when the four trains are in `done/`; a beat nobody captured is a bug of the exercise.
13. **The owner runs the app, or it is not done** (owner, 2026-09-06, verbatim: *"I start the app and look whether it works. Only then is it
    good. Otherwise it works at our place, and not at the customer's."*) ⇒ every train ends with **W7 · the owner runs it**: the owner, on a machine that
    was NOT used for development, following only the train's README (the stranger's path), starts the thing and sees it work against the
    **real** USGS feed for SE Asia — tests use the fixture, the owner's run uses the world. The result is a beat file (`howto/BEAT-9_<T>.md`,
    written by the master from what the owner said and did) and a gate row with the owner's signature. No W7 = the train is not in `done/`.
14. **The premiere gate (§P below):** if the fleet does not read `measured` on the gate rows by the day the owner names, the premiere
    moves by days — *"otherwise it will be a flop"* — and that decision is his, made on the ledger, not on a feeling.

---

## TRAIN 1 — `quakewatch-server` · Node 22 / TypeScript · SQLite · `/api/v1`

> ⚖ **Delivers:** a server that ingests a USGS GeoJSON feed (real once, fixture always), stores events and user alert thresholds in
> SQLite, and serves them under an OpenAPI 3.1 contract the two mobile clients and the deploy image consume by version.
> **Refuses:** a Go helper; `npm install` without a lockfile (`npm ci` only — the grant's rule); the real feed in any test; a route not
> in the contract.
**Seat:** the linux claude runner (new machine; claude-code, image `dev-ts` once the image runner lands, Landlock until then). **Reviews:** codex (qwen if no codex slot); `twice` = codex + qwen. **Grant:** `worktree-node-toolchain`
(ratified, QW-P1). **Egress:** `dev-node-registries` (+ `usgs-feed` on W3 only). **Contract version pinned by others:** `v1.0.0` after W1.

| W | wagon | premise · proves · must NOT · unplug | review |
|---|---|---|---|
| W1 | **the contract and its mock** — `openapi/quakewatch.v1.yaml`: `GET /api/v1/events?region&since&minMagnitude`, `GET /api/v1/events/{id}`, `GET/PUT /api/v1/thresholds/{userId}`, `GET /api/v1/health`; a mock that serves the contract from fixtures; a contract test (schemathesis-class or `openapi-backend` dry) | premise: three trains wait on one document · proves: `npm test` green with a JUnit report, the mock answers every path · must not: invent a route the spec lacks · unplug: remove a path from the spec ⇒ contract test reddens | **named** |
| W2 | **storage** — SQLite schema (events · thresholds · ingest_log), migrations as files, repository layer, seed from the fixture | proves: migrations idempotent; a fresh DB seeded == fixture count · must not: ORM magic that hides SQL · unplug: drop a migration ⇒ schema test red | **named** (data model) |
| W3 | **the feed client** — USGS GeoJSON `summary/all_day.geojson` parser, region filter (bbox), dedupe by event id, **one real dial under the `usgs-feed` egress rule recorded as a fixture refresh**, rate-limit/backoff; **beat 7 lives here** — the master does not know which assumption the feed breaks | proves: parser handles the recorded fixture and the live shape; the leg's egress facts show exactly one host · must not: dial anything else; retry without backoff · unplug: change a fixture field name ⇒ parser test red | **named** |
| W4 | **the API** — routes over storage, validation from the spec, pagination, ETag on events | proves: contract test green against the real server (not the mock); JUnit counts · must not: leave the port bound after tests · unplug: remove validation ⇒ contract test red | **named** |
| W5 | **thresholds semantics + the Consult beat** — default thresholds by magnitude AND depth (the July text's domain question); the master relays the owner: *what defaults for SE Asia?* and the answer is a record document the tests pin | proves: defaults are a signed document, not a constant · must not: pick defaults itself | **named** · owner act |
| W6 | **release** — `npm run build`, version `1.0.0`, tag on trunk (P11's first tag), CHANGELOG from the record | proves: `saphan` observes the tag when RE-9 exists; until then the tag is the measurement | master-verify-only |
| W7 | **the owner runs it** — on a clean machine, from the README alone: `npm ci && npm start` (or the compose from T4), then `curl /api/v1/events?region=sea` returns **today's real quakes** from the live USGS feed (the one place the real feed is used outside W3) | proves: rule 13 · unplug: — | **owner act** (gate row + BEAT-9 file) |
| DOCS | README for a stranger (the customer-docs stranger test's subject): run, test, refresh fixture | | master-verify-only |

---

## TRAIN 2 — `quakewatch-android` · Kotlin · Gradle · Jetpack Compose · min SDK 26

> ⚖ **Delivers:** list + map of events for the configured region, threshold editor, against `/api/v1` `v1.0.0`; instrumentation tests
> on the emulator; a parity fixture consumed by the deploy train's gate.
> **Refuses:** a dependency the contract does not need; network in unit tests; a Go anything.
**Seat:** the android runner (new machine; claude-code; emulator present — owner; reviews never run on the android box). **Grant:**
`worktree-android-toolchain-grant` (ratified; **first real use — M1**). **Egress:** `dev-java-android-registries`.

| W | wagon | premise · proves · must NOT · unplug | review |
|---|---|---|---|
| W1 | **scaffold + client** — Gradle project, generated API client from `quakewatch.v1.yaml` (`openapi-generator` kotlin), DI, a unit test suite emitting JUnit | proves: `./gradlew test` green with JUnit on the emulator-less path; the generated client compiles against `v1.0.0` · unplug: bump the pinned spec version ⇒ client regeneration test red | master-verify-only |
| W2 | **events list + detail** — Compose screens over the mock; pull-to-refresh; offline cache (Room) | proves: instrumentation test on the emulator lists fixture events · must not: talk to the real server · unplug: remove the cache ⇒ offline test red | **named** |
| W3 | **map** — events plotted (OSM tiles via osmdroid, no Google key), region bbox | proves: screenshot test of the fixture · must not: a keyed tile provider | **named** |
| W4 | **threshold editor** — magnitude/depth defaults from the server's signed document (T1-W5), edit, PUT, conflict handling | proves: PUT round-trip against the mock; the defaults shown are the document's | **twice** (the parity surface) |
| W5 | **parity fixture** — the client's rendering of `parity/fixture-01.json` exported as a normalised JSON the deploy gate compares | proves: deterministic export · unplug: change a label ⇒ export changes ⇒ the deploy gate reddens | **twice** |
| W6 | **release** — signed debug APK, tag `1.0.0` | | master-verify-only |
| W7 | **the owner runs it** — installs the APK on the emulator **and on his own phone** (owner, 2026-09-06: *"phones in developer mode"* — the phones are in developer mode; the README's first line under *On a device* is `adb install` with USB debugging on, not a store) from the README alone, points it at the running server, sees live SE-Asia events on the list and the map, edits a threshold and sees it persist | proves: rule 13 · a customer's first minute | **owner act** (gate row + BEAT-9 file) |
| DOCS | README for a stranger | | master-verify-only |

---

## TRAIN 3 — `quakewatch-ios` · Swift 5.10 · SwiftUI · Xcode 16 · iOS 17

> ⚖ **Delivers:** the same three screens; XCTest on the simulator; the same parity fixture export.
> **Refuses:** third-party packages the contract does not need; network in tests; a Go anything.
**Seat:** `█████` (claude-code, bare Mac, class `mac-xcode`, ssh; Xcode present — owner). **Reviews:** codex / qwen as rule 10. **Grant:** `worktree-apple-toolchain-grant` (ratified; **first real use — M1**).
**Egress:** `apple-developer` (hosts UNMEASURED — likely the empty floor for a package-free build; the first refused dial is the measurement).

| W | wagon | premise · proves · must NOT · unplug | review |
|---|---|---|---|
| W1 | **scaffold + client** — Xcode project, generated Swift client (`openapi-generator` swift5) from `v1.0.0`, XCTest emitting JUnit via `xcresulttool` (PREFLIGHT C3 — if the converter is not on the machine, that is a bug with flags, not a workaround) | proves: `xcodebuild test` green on the simulator with a JUnit report | master-verify-only |
| W2 | **events list + detail** — SwiftUI over the mock; offline cache (SwiftData) | | **named** |
| W3 | **map** — MapKit, region bbox, fixture pins | | **named** |
| W4 | **threshold editor** — as T2-W4, the same signed defaults document | | **twice** |
| W5 | **parity fixture export** — the same normalised JSON as T2-W5 | proves: byte-equal to android's for `fixture-01` or the gate says where not | **twice** |
| W6 | **release** — simulator build archived, tag `1.0.0` | | master-verify-only |
| W7 | **the owner runs it** — on the simulator and **on his iPhone** (developer mode on — owner; the README says: a free personal team signs a 7-day build, `xcodebuild -allowProvisioningUpdates`, trust the developer in Settings) from the README alone; the same three screens, live data | proves: rule 13 | **owner act** (gate row + BEAT-9 file) |
| DOCS | README for a stranger | | master-verify-only |

---

## TRAIN 4 — `quakewatch-deploy` · Docker · Compose · shell · the parity gate · the final report

> ⚖ **Delivers:** the image hosting server + SQLite; compose for local; the parity gate as a runnable check; and the exercise's
> final report — generated by the fleet, not written by a hand.
> **Refuses:** an image with a shell as default entrypoint; `docker push` anywhere but the fleet's registry; a report a model wrote.
**Seat:** the image runner (new machine, `--backend image`, engine docker or podman by `image_engine` — **after image-runner IR-4 lands**, PREFLIGHT B7; until then W1/W2 are authored on a Landlock leg on `█████` and the container rows read `not built`). **Reviews:** codex / qwen as rule 10. **Grant:** `worktree-container-toolchain` (QW-P2, new). **Egress:**
`container-registry-dockerhub` (base image pulls) + `dev-node-registries` (the server's `npm ci` in the build stage).

| W | wagon | premise · proves · must NOT · unplug | review |
|---|---|---|---|
| W1 | **image** — multi-stage build of `quakewatch-server` at its tag; non-root; healthcheck on `/api/v1/health`; SBOM emitted (`syft`-class) — the Compliance Report's SLSA row wants it | proves: image runs the contract test green inside compose · must not: run as root · unplug: drop the healthcheck ⇒ compose test red | **twice** (the artefact customers run) |
| W2 | **compose** — server + volume for SQLite + the mock for client dev; one command up | | master-verify-only |
| W3 | **the parity gate** — a check that runs both clients' fixture exports (T2-W5, T3-W5) against `parity/fixture-01.json` and refuses on any difference, printing the first; a **planted divergence** test proves it reddens | proves: P5 · must not: normalise away real differences · unplug: remove one field from the comparison ⇒ planted-divergence test goes green ⇒ red | **twice** |
| W4 | **egress and grant posture recorded** — the leg's own `egress_fact` and `permission_denials` for this repo summarised into the train's record (M2, M3) | proves: the container posture's mounts are enumerated, or the bug is filed | **named** |
| W5 | **the final report** — over the four trains: `saphan docs product` (when PDX lands) or, until then, the Compliance Report skeleton + the bugs the exercise filed, with their flags, and the P1–P12 ledger as a table | proves: the exercise's deliverable exists as record projections, not prose · must not: a model-written summary | **named** |
| W6 | **release** — image tagged `1.0.0`, pushed to the fleet's registry only | | master-verify-only |
| W7 | **the owner runs it** — `docker compose up` on a machine that never built it, from *Run QuakeWatch* alone; the server answers with live data; both clients connect to it; the parity gate is run by his hand and prints green | proves: rule 13 — **the premiere gate's G0** | **owner act** (gate row + BEAT-9 file) |
| DOCS | *Run QuakeWatch* for a stranger — one page, compose up, open the client | | master-verify-only |

---

## §P THE PREMIERE GATE — what must read `measured` before the owner keeps the date

| gate row | reads `measured` when | if it does not |
|---|---|---|
| **G0** | **the owner has run the app himself, on a clean machine, from the READMEs alone, against the live feed — all four W7 gate rows signed** (rule 13) | *"it works at our place, and not at the customer's"* — slip, no discussion |
| G1 | four repositories, each with ≥ 1 wagon **merged** through a gate row with a codex verdict (P1 · P4) | the fleet does not review off Go — slip |
| G2 | one `twice` review (codex + qwen) landed on a client wagon and both verdicts are bound (B4 fixed) | the ratified review class is a sentence, not a mechanism — slip |
| G3 | JUnit counts on the return of every repository (C3), no `unmeasured` in the tests column | the fleet cannot count tests it did not write in Go — slip |
| G4 | `egress_fact` rows for R1's feed wagon name exactly one external host, and every other leg's dials are registries only (B2 fixed or the observe posture recorded and said aloud) | egress is a Go-lane property — slip, or premiere with the sentence *observe posture* on the page |
| G5 | the parity gate reddened on the planted divergence and went green on the real exports (P5) | — the story's spine has no proof — slip |
| G6 | the bugs the exercise filed carry flags and at least the URGENT ones rode a micro-train to `fixed/` | the amendment loop is untested — premiere with the open list shown, not hidden |
| G7 | first tags on four trunks (P11) | release is a word — slip |

Rows P8–P10, P12 (memory · docs · reports · stranger test) are **not** premiere gates: they are the trains still in the backlog, and
the exercise is the fixture they will render. The owner reads G0–G7 as a table on the day, each with its row id, and decides; G0 is his own hand, and it is first.

## KICKOFF PASTE — one per master (fill `<T>`; the server master goes first)

```
Master of quakewatch-<T>: the owner opens PoC-zero — QuakeWatch, four repositories, four trains, and yours is <T>. Read first:
governance canon from disk; strategy/DESIGN_BRIEF_ADOPTION_FUNNEL_GOVERNED_MASTER.md:114-136 (the July spec — do not redesign the
app); development/backlog/quakewatch/ADVISOR_DESIGN_quakewatch_four-repos-four-trains_2026-09-06.md §2 (the twelve properties your
returns must name); PREFLIGHT_what-must-be-repaired-before-quakewatch_2026-09-06.md (§1 must have landed — verify each B-row against
the tree before your first dispatch, and refuse to dispatch if one has not); ORDER_MATERIAL_quakewatch_four-train-orders_2026-09-06.md
TRAIN <T> (your wagons, seats, grant, egress, review classes — reshape and price them, law #16).
Rules that bind you: development legs on claude-code only; a named review on codex, qwen only if no codex slot is free; twice = codex AND qwen; qwen never executes. No Go anywhere; the contract (server W1, v1.0.0) is pinned in your train order and moves only by an explicit
wagon; tests report JUnit XML; egress is your stack's registries and nothing else; a fleet gap is a bug with flags, never a
workaround; no store migration lands while any QuakeWatch leg is live; every return names P1–P12 as measured / not built /
unmeasured; every beat you complete has its howto/BEAT file within the hour (rule 12); your train is not done until the owner has run your artefact on a clean machine from your README alone (rule 13, W7). Your first act after measuring the tree: compose your TRAIN_ORDER.md from the material, name your seats and the
contract version, state your quote per wagon, and move the lane — git mv development/backlog/quakewatch/<T>
development/active/quakewatch-<T> in your dispatch commit. Server master: your W1 lands before anyone else dispatches — say so to the
other three by relay when it does.
```

## UNMEASURED
- `openapi-generator` availability on the runner images (`dev-ts` has node; the generator is a JVM tool — `dev-ts` may need the JDK or the generator's npm wrapper) — W1 of trains 2/3 measures it.
- `xcresulttool` → JUnit on `█████`; osmdroid tile egress (`tile.openstreetmap.org`) for T2-W3's screenshot test — likely a fixture tile set instead; both are the masters' first measurements.
- Whether `█████`'s emulator can run headless under the android grant (KVM on `█████`) — T2-W2 measures it.
- The fleet's registry for R4-W6 (`docker push` target) — none named in the registry today; the owner names it or R4-W6 tags locally.
