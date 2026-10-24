# CAPTURE PROTOCOL — what QuakeWatch must record, as it happens, so *How to build your first governed app* is assembled from the record and not remembered

> Preparation document, written by the advisor on 2026-09-06 before the QuakeWatch trains were cut. Private details are blacked out (█).

**Advisor, 2026-09-06.** ⚠ INTERNAL. **Stream home:** `development/backlog/quakewatch/`. **Owner's act:** *"We need to collect information
for making the document 'how to build your first governed app'."* Companion to the four train orders
(`ORDER_MATERIAL_quakewatch_…`) — this protocol is **§0 rule 12** of every QuakeWatch train order and binds all four masters from their
first dispatch.

> ## ⇒ The document has a spine already — the eight beats of `strategy/SITE_GUIDED_JOURNEY.md:30-44` (bridge init · decisions signed ·
> first dispatch · executor works → STOP-2 with evidence · the gate and the Consult · the parallel wave with the parity gate · one thing
> goes wrong on purpose · the report). **QuakeWatch is the first time all eight happen for real, on stacks that are not Go.** The howto
> is those eight beats written for a stranger, and its every command, refusal, duration and cost is a **fact the fleet records anyway**
> — what this protocol adds is the *one file per beat per train* that ties the facts to the moment a reader would meet them, written
> **at the moment**, never after. The customer-docs master measured what "after" costs: 6 431 lines of archaeology to reconstruct four
> artefacts. We do not pay that twice.

---

## §1 WHAT IS CAPTURED — one `howto/BEAT-<n>_<train>.md` per beat per train, written by the master when the beat happens

```
# BEAT <n> · <train> · <the beat's name from the spine>
- when: <YYYY-MM-DD HH:MMZ>          ← the moment, not the day
- run / gate rows: <run id(s)> · <gate row id(s)>            ← the record's own ids; the howto links them, never retypes their content
- cost: <$ with class>                                      ← law #51
- duration: <dispatch → return HH:MM> · <return → gate HH:MM>

## What the reader would have typed                          ← the literal commands, in order, exactly as run (law #12) — copied from the
<the command lines, one per line, with the flags that mattered>   shell history / order, not from memory

## What the reader would have seen                           ← the engine's own output, quoted: the refusal text, the started-ack, the
<quoted output, trimmed to the lines that carry the beat>      STOP-2 line, the gate sentence

## What went wrong, and what the fix was                      ← every refusal, every retry, every hand step — including the ones that
<one line each: refusal → what was done → the bug file if one was filed>   embarrass; the honesty beat is made of these

## What the owner decided                                     ← the Consult beat, the gate decision, the amendment — as the owner's words,
<the act, verbatim or by its record row>                        or the act's row id

## What a stranger would not know                             ← the sentence a new customer would need here that the docs do not yet carry
<one to three sentences; each becomes a GAP row for the customer-docs master>
```

**Rules that make it usable:** a beat file is written **within the hour** the beat completes (the master's exec status of that wagon
names it: `howto: BEAT-3_server.md written`); it quotes, never paraphrases (documents-look D4); it names ids, never content the record
holds (link, don't copy); it is **never edited after** — a correction is a `## Later` section with the date; it carries no secret
(the bridge's scan runs on it like on any file); it is a **development document** and lives in the train's stream directory
(`development/active/quakewatch-<T>/howto/`), so it travels with the train to `done/` and is an exhibit like any other.

**Per beat, which train writes it:**

| beat | the spine's line | written by | what the howto chapter will show |
|---|---|---|---|
| 1 | `saphan bridge init` — the bridge exists, law reachable | **the owner's own act**, captured by the server master (first train) | the one-time owner acts; the empty fleet answering `fleet show` |
| 2 | three decisions land, signed by a human | server master (the OpenAPI contract as decision 1; thresholds-by-depth as 2; the parity rule as 3) | what an ADR is to a customer: a decision with a signature and a date |
| 3 | first dispatch — the engine renders the order | server master (W1) | the order's anatomy; the kickoff line; what `dispatch` prints |
| 4 | executor works → started-ack → STOP-2 with evidence | server master (W1/W2), **and each other master for their first wagon** | what a return looks like on Node, Kotlin, Swift, Docker — four screenshots of the same shape |
| 5 | the gate: human reads, consults, accepts or amends | server master (W5, the Consult beat) + one amendment loop wherever it first happens | the gate sentence; the Consult relay and the owner's answer; an amendment as the normal path |
| 6 | the parallel wave: two clients, parity gate | android + ios masters (their W4/W5), deploy master (W3) | the fleet story: two trains, one contract, one gate that says *both or neither* |
| 7 | one thing goes wrong on purpose | server master (W3 — the feed), **plus every unplanned one** (a refused spawn, a dead tool, a stale mirror) | the honesty chapter: the refusal text, the bug file, the micro-train, the fix — real, not re-enacted |
| 8 | the close: the report, "generated by the engine" | deploy master (W5) | the ledger: delivery time, gate-wait median, cost lanes, who allowed what — pasted from the reports plates, not written |

**And two things the spine does not have, which a first-time builder meets first:**

| 0 | **before beat 1**: install, machines, seats, grants, egress rule-sets — the prerequisites the owner ratified this week (QW-P1…P4) | server master captures the owner's acts as they happen | *what you set up once* |
| 9 | **after beat 8**: **the owner runs the app himself**, on a clean machine, from the READMEs alone, against the live feed (rule 13, W7 of every train) — what he typed, what he saw, what failed the first time; then the four trains move to `done/`, the tags, what the record holds now | each master for his W7 (the owner's words verbatim) · deploy master for the close | *the moment it is real* — the chapter's last screen, and the one a buyer believes |

---

## §2 WHERE THE FACTS ALREADY ARE — so the beat file links, and the howto never retypes

| fact the howto needs | the record already has it in | the beat file writes only |
|---|---|---|
| every command a leg ran | the run's transcript (`transcript_sha256`, the run dir) | the 3–8 lines the reader types |
| every refusal | `run_record.refusal_rule / refusal_reason`, `permission_denials`, `egress_fact` | the refusal *sentence* as seen, and the row id |
| durations | `run_record.ts_started/ts_ended`, `fleet_gate.ts` | the two HH:MM a reader would feel |
| cost with class | `cost_ledger`, the run's `cost_raw/normalized` + class | one figure with its class |
| the owner's acts | `fleet_gate` rows with `sig`, `order_act`, the Consult relay + answer file | the row id and the sentence |
| the bug and its repair | `development/backlog/bugs/<file>` with `- flags:`, the micro-train's merge commit | the file name |
| the tests | JUnit counts on the return (PREFLIGHT C3) | *212 passed, 0 failed, 3 skipped — on the simulator, 2m10s* |

⇒ **The howto is the ninth process-docs document type** (documents-look §3): a *guided chapter* over the record — the same D1–D12 rules,
the same digests-before-content for its exhibits, the same provenance footer — with the beat files as its *narrative* layer, the one
layer the record cannot generate because it is written for a reader who was not there.

---

## §3 WHO ASSEMBLES — the scribe, from the beat files, when the four trains are in `done/`

**Scribe task S-13 — *Assemble "How to build your first governed app" from the QuakeWatch beat files*** (a Prompt Library prompt,
category `docs`, roles scribe — added to the fleet-memory/process-docs seed on the owner's word):

1. Read the 10 beat groups × 4 trains (≤ 40 files); for each beat pick the **one** train whose file is the clearest for a stranger and
   fold the others into *"on Android it looked like this"* asides — never four parallel narratives.
2. Every command in the chapter is a command from a beat file, verbatim, with its `when`; every quoted output is from a beat file; every
   number links its row id. The scribe writes the connective sentences and nothing else.
3. The chapter carries **the honesty beat as it happened** — the beat-7 files, including the unplanned ones, in the order they occurred;
   a howto that only shows the green path is the *"demo nobody believes"* of the spine's own line.
4. The *What a stranger would not know* sentences become **GAP rows** relayed to the customer-docs master — that is how the site's
   getting-started section grows from a real build, not from an author's guess.
5. The assembled chapter is **not published here**: it lands in `development/done/quakewatch-deploy/howto/HOWTO_first-governed-app.md`
   as a development document, and goes to `docs.saphan.ai/getting-started/first-governed-app` **by relay to the customer-docs master**,
   who runs it through his guards (icons, paths, history, vocabulary, capability state) and **the herd test** (ruling 21: a herd of
   strangers, docs-only, each performing the chapter; the pass rate per step is the acceptance) — the same acceptance the install docs
   already owe.

**What the scribe refuses:** a step he cannot trace to a beat file; a command "cleaned up" from what was run; a beat where all four
files are missing (he writes *"this beat was not captured"* and the gap is a bug of the exercise, flagged); any sentence about how the
engine does it inside (the property, never the mechanism — the owner's standing act for public pages).

---

## §4 WHAT I REFUSE

| refused | why |
|---|---|
| writing the howto **before** or **during** the exercise from the plan | it would be the plan re-typed — the exercise exists to find where the plan and the fleet disagree; the beat files are how that disagreement is caught |
| letting a leg write the beat file | a leg reports in its return; the master, who saw the gate and the owner, writes the beat — the beat is the master's reading (§1.2) |
| a beat file edited after the fact | the customer-docs master's measured failure: history rewritten into a chapter reads as *"corrected"* to a buyer; `## Later` with a date, never an edit |
| a green-path-only howto | the spine's own beat 7; and the honesty beat is the one competitors cannot fake |
| publishing without the herd | ruling 21/22 — the owner's read raises the floor, the herd measures the ceiling; a howto nobody stranger has walked is a claim |

---

## §5 WAGONS (into the four QuakeWatch trains, not a fifth)

| # | wagon | where | review |
|---|---|---|---|
| CP-0 | **§0 rule 13** in each train order: *every beat you complete has its `howto/BEAT-<n>_<T>.md` within the hour; your exec status names it* | the four train orders (the masters amend their own) | master-verify-only |
| CP-1 | **beat 0 and beat 1 captured by the server master** as the owner performs the prerequisites and `bridge init` — the two beats that happen once and before any leg | `quakewatch-server` W0 (a capture wagon, no code) | master-verify-only |
| CP-2 | **the beat-file census**: at each train's close, ≥ 1 file per beat the train owns (§1 table), each with all six sections non-empty or an explicit *none* | each train's DOCS wagon | master-verify-only |
| CP-3 | **S-13 prompt seeded** (category `docs`, roles scribe) | fleet-memory/process-docs seed, by relay | master-verify-only |
| CP-4 | **the assembly** (S-13) after the four trains reach `done/`; the GAP relays; the relay to the customer-docs master with the chapter and the herd-test ask | the scribe, on the owner's order | **named** (a public page) |

## UNMEASURED
- Whether the masters' exec statuses can carry a free `howto:` line under the closed key set (`doc-key-unknown` refusal — the witness file's own note about `_EXEC_STATUS.md`'s grammar); if not, the beat file's existence is asserted in the return's prose and checked by CP-2's census, not by a key.
- How many beats the July spine's *beat 2* really needs — three decisions is the spine's number; QuakeWatch may land two or five.
- Whether the herd test (ruling 21) has a harness yet — the customer-docs order material describes it; nothing measured here says it runs.
