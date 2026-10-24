# ORDER MATERIAL — THE ENVIRONMENT TRAIN: two masters, two lanes — one builds the machines, the other configures them for Saphan **with the owner at the keyboard** — and hands QuakeWatch a fleet that passed pre-flight

> Preparation document, written by the advisor on 2026-09-06 before the QuakeWatch trains were cut. Private details are blacked out (█).

**Advisor, 2026-09-06.** ⚠ INTERNAL. **Stream home:** `development/backlog/quakewatch/` (this train opens as `quakewatch-environment`; the four
app trains follow it). **Owner's words:** *"Add a precise section on how to configure the environment, for the master who will lead me
through it. One master will prepare the infrastructure, and the second one, on it, together with me, will configure it for Saphan … The
second [train], complete for starting QuakeWatch, with the infrastructure pre-flight."* Companions: `PREFLIGHT_…`
(what the fleet repairs), `ORDER_MATERIAL_quakewatch_four-train-orders…` (what runs after),
`../image-runner/ORDER_MATERIAL_image-runner_train_2026-09-06.md` (the image lane this train's Lane I waits on for one machine).

> ## ⇒ Two lanes, one handover document, one acceptance. **Lane I (infrastructure master)** provisions the new machines to a written
> inventory and hands over `INVENTORY.md` — hosts, users, engines, tools, versions, each line measured on the machine. **Lane S (setup
> master)** takes that inventory and walks the owner through Saphan's own acts in the order the engine requires — trust, identity, admission,
> probes, seats, grants, egress, images, repositories, rehearsal — **one command at a time, the owner typing, the master reading what came
> back and saying what it means.** The train is done when every pre-flight B-row reads *repaired* or *observed and recorded*, and
> `saphan dry-run run` rehearses green on every machine class. Then the four app masters get their kickoff.

**Verbs below are cited from the census `.claude/VERB_CENSUS.md` (walked 2026-08-24)** — a two-week-old snapshot; the setup master's
first act is `saphan <noun> --help` on every noun he will use and a re-walk of the census, because *"a verb absent from this file may still
exist"* and one present may have moved. Verbs marked **[proposed]** do not exist and belong to a named train.

---

## §0 The machines — classes, and what each must be (the owner: *"the machines other than █████ will be new"*)

| class | count | role in QuakeWatch | what Lane I delivers on it | measured by |
|---|---|---|---|---|
| **console host** | 1 (the owner's Mac — `█████`, kept) | gateway (**serving the QuakeWatch bridge over mTLS — bridge-server BR-1/BR-3**), record, console, the owner's seat; **the workspace `█████/quakewatch`** holding `quakewatch-bridge` and the four application repositories (owner, 2026-09-06) | the `saphan` binary of the release; `serverd`; CouchDB (obligatory) on loopback; the new workspace directory, empty | `saphan serverd status` · `saphan trust doctor` |
| **role machines** — master · advisor · scribe | 1 each (new; owner: *"the roles will be on separate machines, it will be the ideal test"*) | the four app masters (one machine may hold several master seats if slots allow), the advisor, the scribe — **each reaches the bridge only through the gateway** (`saphan bridge pull/commit/push`, machine cert) | Linux or macOS, the release binary, the vendor CLI (claude-code) at a fixed path, `git`, **no clone of anything but what `bridge pull` brings**, `sshd` key-only | `machine observe`; the first `bridge pull` over mTLS |
| **linux claude runner** | 1–2 (new) | server legs; Landlock legs of every train until the image runner lands | Linux (Debian/Ubuntu LTS), a non-root `saphan` user, `sshd` with key-only login, `git`, `node 22` + `npm`, **Landlock-capable kernel (≥ 5.13; probe-confinement decides)**, the vendor CLI (`claude`) at a fixed path, `bwrap` | `saphan machine probe-confinement`, `machine observe` |
| **android runner** | 1 (the owner says the emulator is there — new or existing, the probe decides) | R2 legs | as above + JDK 17, Android SDK (cmdline-tools, platform-tools, an emulator image with KVM), `adb`; the vendor CLI | `machine probe` (android toolchain), `machine observe` |
| **mac-xcode** | 1 (`█████`, existing) | R3 legs | Xcode 16 + simulator runtime iOS 17, `xcodebuild`, `xcrun simctl`, a JUnit converter for `xcresult`; `sshd` on; the vendor CLI | `machine probe`, `machine observe` |
| **image runner** | 1 (new) | R4 legs; later every containerised leg | Linux, **docker or podman** (one, recorded — `image_engine`), rootless if podman, `saphan-agent` never on the host (it lives in the image); `git` | `machine probe` (PRED-OCI), IR-4's first run |
| **codex reviewer** | 1 (new) | every `named` review | Linux, `codex` CLI at a fixed path, `git`, **and the toolchain of what it reviews** — Go (engine) + node (console) + a headless chromium for UI reviews. ⛔ WITHDRAWN 2026-09-06 (advisor): the earlier row said *"no toolchains beyond what a review needs to read"* — measured against 89 review notes, **27 report an instrument they could not run**, and a review that only reads is the hole the review-protocol design names (`development/backlog/review-protocol/`). The fear behind the old row (a reviewer talked into running) is answered by the reviewer's write-set (`_REVIEW_STATUS.md` + notes) and confinement, not by an absent compiler. Mobile reviews run on the class machine itself. | `machine probe` (go · node · chromium), `machine observe` |
| **qwen reviewer** | 1 (new; may share a host with codex if slots allow — the owner's call) | fallback and the second half of `twice` | Linux, `qwen` CLI, `git`, the same review toolchain as the codex reviewer | `machine probe`, `machine observe` |

**Network (Lane I):** all runners on one private interface reachable from the console host by name (DNS or `/etc/hosts` — the same
spelling everywhere, because `fleet_session`'s workspace-spelling defect taught what six spellings cost); **no runner reaches the internet
except through the egress door** — the door's host:port is the only route Lane I leaves open on each runner (firewall or routing; Lane I
records which). Time synchronised (the witness relay's -30 min mtime story is what unsynchronised clocks do to a record).

**The handover (Lane I → Lane S): `INVENTORY.md`** — one row per machine: class · hostname · IP · ssh user · ssh port · OS + kernel ·
engine + version (image runner) · vendor CLI path + version · toolchain versions · the one open route (door host:port) · `sshd` key
fingerprint · **the command that measured each cell**. Signed by the infra master (a commit under his write-set). **Lane S refuses to start
without it, and re-runs every measurement in it before trusting a row** (law #8: the inventory is evidence, the re-run is the check).

---

## §1 LANE S — the guided configuration, in the order the engine requires (the owner types; the master reads back)

Every step below has four parts the master says aloud before the owner types: **what** (one sentence), **the command** (literal, no
placeholder the owner cannot fill), **what you will see** (the engine's own line), **what it recorded** (the row or file). If the engine
refuses, the refusal text is read *as the next instruction* (the fleet's refusals say what to do) and **filed** if it is a defect (the
hygiene rider applies to this master too).

### S0 · before anything: the binary and the doctor
- **what:** the console host and every runner run the *same* release binary (PREFLIGHT C5 — a store ahead of a binary locks the fleet out).
- `saphan version` on every machine (over ssh for runners) → identical.
- `saphan trust doctor` on the console host → *root pin present, keypair custody clean, trust.enforce valid*. If the root key does not
  exist yet (a fresh estate): `saphan trust init` — **once, ever**; the master says aloud that this is the act that cannot be repeated.
- **recorded:** nothing new; the doctor reads.

### S1 · identity and configuration
- `saphan config init` → the human identity (`identity.actor`) confirmed by the owner — *"always human-confirmed"* (census).
- `saphan config set run.confinement <value>` — per the machine the leg will run on (`landlock`-class on Linux runners; `container` on the
  image runner once IR lands; the exact vocabulary is `confine.go:174-197`'s and the master reads it from `--help`).
- `saphan config set image_engine docker|podman` **[proposed — image-runner IR-6]**; until it exists, the engine reads the runtime from the probe.
- **recorded:** `█████` (the saphan config file) on the console host (git-identical `config set`).

### S2 · the workspace and the bridge — born v2, served by the gateway (owner, 2026-09-06: *"we will set up a new workspace █████/quakewatch and all the repositories will be there … before that I must finish the train with our git for the bridge — we will test that right away too"*)
**Ruling 2026-09-06 (one gateway, many workspaces — `../workspaces/`):** S2 mints the **second workspace id on the owner's gateway** beside `saphan-studio`; `saphan bridge init quakewatch` registers the `workspace` row (id · name · path) and the gateway serves `bridge/<id>.git`; S2 measures two rows, two repos, one gateway, and that a QuakeWatch seat reads the fleet's prompts and laws but not Saphan's orders (WS-5). WS-0/WS-1 precede this step.

- **Precondition: the bridge-server train has landed BR-0 · BR-1 · BR-3 · BR-4 · BR-5 · BR-7 · BR-10** (the gateway serves a bare repo over mTLS
  with the receive hook; the verbs `pull · commit · push`; `init` creates the bare repo on the gateway and the v2 layout). PREFLIGHT gains
  **B8** for it. Without it, the roles on separate machines have no bridge to pull — the exercise would fall back to one machine and plain
  git, which is exactly the thing the owner wants tested, so **the environment train waits for it; it does not work around it.**
- `mkdir -p █████/quakewatch && cd █████/quakewatch` — the owner's console, the owner's hand.
- `saphan bridge init quakewatch` → *generates a blank-but-working `quakewatch-bridge` and registers the workspace* — **v2 layout** (`governance/
  decisions/ correspondence/ mailbox/<role>/ memory/ development/{pending,backlog,active,done,archived,bugs}`), the bare repository created on
  the gateway (`https://<console-host>:<port>/bridge/quakewatch.git`), the workspace remote set, the `bridge-write-set` document seeded. The
  master reads the layout back to the owner directory by directory and says which role may write where.
- This is the **first bridge born v2 and the first one the gateway serves from day one** — our own `saphan-studio-bridge` migration (BR-11) is
  *not* on this path and does not have to precede it; QuakeWatch is the clean test the migration will later copy.
- The four application repositories are created beside it in the same workspace (S8); they are **code**, not bridges — they live on the forge (or
  as bare repos on the console host), and the legs clone them; the bridge is what every role pulls.
- **recorded:** the `.saphan` workspace marker; the bare repo on the gateway; `saphan fleet show` answers with a valid empty envelope; the
  howto's beat 1 is captured here — this is the spine's *"bridge init — the bridge exists, law reachable (30 sec)"*, timed.

### S2b · the roles reach the bridge (the ideal test, in the owner's words)
- On each **role machine** (after S3 admitted it): `saphan bridge pull` → the clone arrives over mTLS with the machine's cert; a machine without a
  cert is refused by the gateway — the master shows the owner **both** (pull once with, once from an unadmitted box) and both are recorded.
- One role writes one file in its own write-set and `saphan bridge commit && saphan bridge push` → accepted; the same role touches a path outside
  its set and pushes → **refused by the receive hook with the rule named, and a `bridge_refusal` row exists** — the owner sees the refusal on the
  screen of the role's machine and the row on the console. That pair of acts is the acceptance of the bridge-server train's BR-3 *in the
  owner's hand*, and beat 1's second screen.
- **recorded:** the first `bridge_refusal` row of the estate, on purpose.

### S3 · admit each machine (owner act, once per machine)
For each row of `INVENTORY.md`, in this order — runners first, reviewers last:
1. **on the machine** (over ssh): `saphan machine csr` → *mints or reuses this machine's P-256 key and builds its CSR*; the CSR comes back
   to the console host (the verb prints where).
2. **on the console host:** `saphan machine admit <name> --transport ssh …` (flags from `--help`: host-ref, transport, slots, the CSR path)
   → the certificate issued by the fleet CA; **`MACHINES.md` gains the row** (`bridge/registry`, which the bridge train moves into
   `governance/`). The master reads the row back to the owner: *machine · host-ref · transport · suite · cert-ref · slots · admitted-by*.
3. `saphan machine set-slots <name> <n>` if the admit did not take it; `saphan machine set-repo-dir <name> <abs path>` for the bare
   admission repository the far leg clones from (the mirror `refresh-repo` fills); `saphan machine set-binary <name> --backend
   claude-code <path>` (and `codex`/`qwen-code` on the reviewers) — *"NOT a custody act"*, so the owner types it without ceremony.
3b. **reservation (optional, owner act — workspaces WS-4b):** `saphan machine reserve <name> --workspace quakewatch` **[proposed]** for a machine that
   only QuakeWatch may use (the android runner and the image runner are the natural candidates); every other machine stays shared with
   `saphan-studio`. The master shows the owner one refused dispatch from the other workspace once the reservation stands.
4. **probes — never installs, never accepts a typed value:** `saphan machine probe-confinement <name>` (Landlock yes/no, recorded);
   `saphan machine probe <name> …` per declared toolchain (node · android · xcode · oci); `saphan machine observe <name>` (*"read what a machine
   is running now, from that machine"*). The probe results are the truth of the inventory row; a disagreement is filed, the inventory is
   not edited.
- **recorded:** `MACHINES.md` rows, capability rows, the machine's cert-ref; the howto's beat 0.

### S4 · seats (owner act)
- `saphan machine seat <machine> …` per slot: an executor identity on an admitted machine's slot (*"cast-surface write path"*); the
  routing rule decides which identities: claude seats on the runners and █████, codex seats on the codex reviewer, qwen on the qwen
  reviewer — **never a codex or qwen seat on a runner that executes** (owner, 2026-09-06).
- `saphan seat auth <seat>` → *what the record says about a seat's credential — and, only when it is dead, the exact host-side line to repair
  it*. The owner repairs a dead one by typing that line, nothing else.
- `saphan machine trust-stamp <seat>` → the vendor's own trust dialog pre-answered from an owner act (the `trustgate.go` finding: without it
  the first far leg stalls on a dialog nobody sees).
- **recorded:** seat rows, `ACTORS.md`/BINDINGS, the stamp.

### S5 · grants (the six files today; record documents when the policies lane lands)
- The owner **ratifies** `worktree-node-toolchain` (PREFLIGHT B1 — the seed becomes a class: the master shows the JSON, the owner says the word,
  the file lands under `development/permission-classes/` with the EVIDENCE sidecar the others have) and the new
  `worktree-container-toolchain` (QW-P2, written by the image-runner train, ratified here).
- The master shows, for each of the four app trains, **which class its legs will run under** and reads the `deny` list aloud (`git push`,
  `sudo`, `curl`, `wget` …) — the owner hears what a leg cannot do before the first leg runs.
- **recorded:** the two files + evidence; later the `permission-class` documents (PD lane).

### S6 · egress — the door and the rule-sets
- The door runs on the console host (the egress lane); Lane I left it as the only route from every runner. The master verifies from one
  runner: a dial to the door's host:port connects; a dial to anything else is refused by the host (Lane I's rule) — **recorded as a
  measurement in the inventory**.
- Rule-sets: today the engine reads `documents/egress_policy/build.json`-shaped documents and `.saphan/state/egress/policy.json` (measured
  literals in the engine); the admitted rule-sets for the exercise are the five drafts in `prompt-library/policies-seed/` (`dev-node-registries` +
  `usgs-feed`, `dev-java-android-registries`, `apple-developer`, `container-registry-dockerhub`) — **the exact assignment verb is UNMEASURED
  in the 08-24 census (no `egress` noun)**; the setup master reads the egress lane's current verbs from `--help` and the egress design, and the
  owner assigns per machine/seat (effective = machine ∩ seat). Until B2 lands, claude-code legs run in the **observe** posture and the master
  says so in the inventory and the beat file.
- **recorded:** the assignment (document or file), the door's fact rows from the verification dial.

### S7 · images (after the image-runner train's IR-2/IR-3/IR-6 — else this step reads *not yet*)
- `saphan image pull base` **[proposed]** on the image runner → manifest + signature verified, digest recorded, admission row written (Solo path);
  `saphan image build dev-ts` / `admit` **[proposed]** for the server's image; the owner sees the admitted list.
- **recorded:** image-capability rows (machine × oci × digest, one spelling).

### S8 · the four repositories
- Where: the forge the fleet reaches (GitHub or Gitea — the forge-half train's state decides; if neither is end-to-end, **bare repositories on
  the console host** and `saphan merge` local — the exercise still runs, P11's tags are local, and the choice is written in the beat file).
- Create `quakewatch-server`, `quakewatch-android`, `quakewatch-ios`, `quakewatch-deploy` **in `█████/quakewatch/`**, beside the
  bridge — empty but for a README stub and the contract's placeholder; `saphan machine set-repo-dir` per runner per repo; `saphan machine refresh-repo <machine>` → the admission mirror
  and shared clone exist on each runner that will work on that repo.
- **recorded:** repo dirs on the machine rows; the mirrors.

### S9 · rehearsal (law #33: an owner act you cannot rehearse is an act you hand over blind)
- `saphan dry-run run …` for **one leg per machine class** — the composed command from `saphan dispatch command` for a trivial order (the
  README stub) — the engine composes, confines and refuses or passes **without spawning**; every refusal here is a pre-flight row found early.
- `saphan fleet show`, `saphan fleet headroom`, `saphan fleet legs` → the empty fleet answers; slots and seats read as admitted.
- **recorded:** the dry-run's own output, kept as the last beat-0 file.

### S10 · the pre-flight read-back
The master and the owner read `PREFLIGHT_…` §1 row by row: **B1** repaired here (S5) · **B2** the egress door for claude-code — repaired by the
egress lane or *observe* recorded (S6) · **B4** `twice` declarable — repaired by its wagon or **no `twice` orders until it is** · **B5** review
card for codex/qwen — repaired or *reviews run without it* recorded · **B6** the acceptance flag — repaired or *hand-fetch* recorded · **B7**
the image runner — IR-4 landed or R4 on Landlock recorded. **Each row gets one of two words in the train's ledger: `repaired` or `recorded`.**
Nothing is left as *"we'll see"*. Then the four app masters get their kickoff (the paste in `ORDER_MATERIAL_quakewatch_four-train-orders…`).

---

## §2 WAGONS

| # | lane | wagon | proves | must NOT | review |
|---|---|---|---|---|---|
| E-I1 | I | **provision** the new machines to §0 (OS, users, sshd key-only, packages, engines, vendor CLIs at fixed paths, time sync) | every §0 cell exists on the machine | install a toolchain a §0 row does not name | master-verify-only |
| E-I2 | I | **network**: private names, one spelling, the door as the only route out of every runner; measured from each runner | a dial past the door is refused by the host | leave a default route open "for now" | **named** (a boundary) |
| E-I3 | I | **`INVENTORY.md`** — every cell with the command that measured it; signed | Lane S re-runs each and finds no disagreement | type a value from memory | **named** |
| E-S1 | S | **S0–S2** with the owner: binary parity, trust doctor (or init once), identity, config, the bridge distinction; beat 0/1 files | the console host answers `fleet show`; the owner has typed every act himself | run a command for the owner | master-verify-only |
| E-S1b | S | **S2b**: every role machine pulls the bridge over mTLS; one in-set push accepted, one out-of-set push refused with the rule named and a `bridge_refusal` row — the owner sees both | the bridge-server train's boundary, accepted by the owner's own hand | let a role clone the bridge by any other route | **named** |
| E-S2 | S | **S3–S4**: admit every machine, probes, repo dirs, binaries, seats, seat auth, trust stamps | `MACHINES.md` and seats match the inventory; every probe recorded; no seat of the wrong backend on an executing runner | skip a probe because the inventory says so | **named** |
| E-S3 | S | **S5–S6**: grants ratified, egress verified and assigned (or *observe* recorded) | a leg's deny list read aloud; the door is the only way out, measured | assign a rule-set with `hosts: UNMEASURED` as if measured | **named** |
| E-S4 | S | **S7–S8**: images (or *not yet*), the four repositories and their mirrors | `refresh-repo` green on each runner for its repos | build the app | master-verify-only |
| E-S5 | S | **S9–S10**: a dry-run per class; the pre-flight ledger with `repaired` / `recorded` per B-row; the kickoff handed to the four masters | every class rehearses; no B-row is blank | dispatch a real leg | **named** (the exercise's starting line) |
| E-D | S | **DOCS**: the beat-0 files and the *What a stranger would not know* sentences relayed as GAP rows to the customer-docs master — this is the install chapter's own material | — | — | master-verify-only |

**Seams:** the **bridge-server train precedes S2** (BR-0/1/3/4/5/7/10 — a relay from its master says *landed*; until then Lane S stops at S1); Lane I ‖ Lane S share only `INVENTORY.md` (I writes, S reads); the image-runner train hands IR-2/3/6 to S7 by relay; the egress
lane hands B2's state to S6 by relay; the bridge train's `governance/` move does not block S3 (MACHINES.md is where it is today).

---

## KICKOFF PASTES

**Lane I — infrastructure master**
```
Master of quakewatch-environment / Lane I: provision the fleet's new machines to §0 of development/backlog/quakewatch/
ORDER_MATERIAL_environment_infrastructure-and-saphan-setup_2026-09-06.md — one linux claude runner (two if slots allow), the android
runner (emulator present — verify with the probe), the image runner (docker OR podman, one, recorded), a codex reviewer and a qwen
reviewer (each WITH the review toolchain: go · node · headless chromium — the "no toolchains" line is withdrawn, see §0), and the ROLE machines — master(s), advisor, scribe, each on its own box, each reaching the bridge
only through the gateway, plus network: one private spelling per host, time synced, and the egress door as the ONLY route
out of every runner, measured from each. █████ and the owner's Mac stay. Hand over INVENTORY.md — every cell with the command that
measured it, signed under your write-set. You do not run saphan on these machines beyond `saphan version` and `saphan machine csr`
when Lane S asks; admission, seats, grants and egress are the owner's acts with Lane S. Move the lane backlog→active in your dispatch commit.
```

**Lane S — setup master (with the owner)**
```
Master of quakewatch-environment / Lane S: you walk the owner through Saphan's own configuration of the fleet Lane I built — §1 S0–S10 (S2 waits for the bridge-server
train: the new workspace █████/quakewatch and `saphan bridge init quakewatch` create the first bridge born v2 and
served by the gateway; S2b has every role machine pull it over mTLS and the owner see one accepted and one refused push) of
development/backlog/quakewatch/ORDER_MATERIAL_environment_infrastructure-and-saphan-setup_2026-09-06.md — one command at a time, the
owner typing, you reading back what the engine said and what it recorded. Before S0: re-walk the verb census (`saphan <noun> --help` on
every noun you will use; the census is from 2026-08-24). Refuse to start without INVENTORY.md, and re-run every measurement in it. Each
step captures a beat-0/1 file (CAPTURE_PROTOCOL). Every refusal is read as the next instruction and filed if it is a defect. End with
S10: the pre-flight ledger, one word per B-row — repaired or recorded — and hand the four app masters their kickoff. Never run a
command for the owner; never dispatch a real leg; a dry-run per machine class is your last act.
```

## UNMEASURED
- The egress assignment verb and the grant assignment flag as of today (the 08-24 census has no `egress` noun; `--grant`/class selection on `run`/`dispatch command` not read) — Lane S's first `--help` walk.
- Whether `saphan machine seat` takes the backend (claude-code / codex / qwen-code) or the seat identity implies it — decides how the routing rule is enforced at seating.
- The JUnit converter for `xcresult` on █████ (PREFLIGHT C3) — Lane I lists it or the R3 master installs it under the apple grant.
- Whether the android emulator on the new runner has KVM (headless `emulator -no-window` needs it) — the probe measures; the owner's word is that the emulator is present.
- The forge-half state on the day (GitHub/Gitea end-to-end) — decides S8's branch.
