# The owner's decisions

Every decision the owner made in this train, with the reason where the record holds one. Where the record has a decision but not its reason, this page says so instead
of supplying one. Times are UTC. Sources: the beat files written during the build, the master's verification of each round
([`../status/`](../status/)) and the reviews ([`../reviews/`](../reviews/)).

## Before the first job

| when | decision | reason, as recorded |
|---|---|---|
| 2026-10-21 | Build a "write your first app in Saphan Studio" repository, with the whole process explained | *"I just had a call with an engineer who found it hard to understand what Saphan is, because it is too big a beast."* |
| 2026-10-21 | Start fresh · server only first, but make clear what comes next · appoint a new master | The advisor asked three questions: build on the plan written in September or start fresh; build all four parts at once or the server first; give the work to a busy master or a new one. The owner answered in one line, *"1 - fresh · 2 - server only first but make it understandable what comes next · 3 - new master"*: a clean start a newcomer can follow, one part at a time with the rest of the road shown, and a master whose only job is this app |
| 2026-10-21 | Create the public repository | creating a public repository is the owner's act, not an agent's; he created it and answered "done" |
| 2026-10-21 | The bar for the tutorial | *"It must be simple, super simple, how to start."* |

## Gates and landings

| when | wagon | decision | reason, as recorded |
|---|---|---|---|
| 2026-10-21 | W0 contract | signed the first order, then signed it again after the master added the missing model | a changed order needs a new approval |
| 2026-10-21 ~13:00 | W0 contract | asked whether to run the review on the executor's own backend to save time: **no, wait for the other vendor's reviewer** | The master offered a shortcut: let a reviewer from the same company as the coder check the work, to save hours of waiting. The owner said no, *"Wait for codex."*: wait for the reviewer from the other company (OpenAI's codex). A reviewer that shares the coder's model shares its blind spots; the point of a review is a second opinion that did not write the code |
| 2026-10-21 | W0 contract | review gate: **reject** | the review's finding: all nine tests could still pass with a contract example removed, and the mock answered 200 where the contract promised 400. The owner's own reason text is not in the record |
| 2026-10-22 01:33–01:37 | W0 contract | signed round 2 and its review; landed with review decision **conditions**; published it | the master's proposed reason, confirmed. The conditions travelled on: W3 must test error answers, W6 must write the first-run recipe |
| 2026-10-22 | W1 feed | signed both W1 and W2 orders in one touch; landed W1 with **conditions** | the reason carried the master's measurements, as the reviewer asked |
| 2026-10-22 | W2 store | landed after the third round | no reason recorded |
| 2026-10-22 | the advisor's documents | add the advisor's preparation and the advisor role to the public repository | *"The quake watch repo also needs the documents of the work with the advisor, the preparations for the project, because it did not appear out of nothing"* and *"in the docs you must add the advisor role, who prepares the material for the master together with the owner."* |
| date not recorded | how work reaches another machine | no copies of the code made by hand | The master's scripts had copied the repository onto another machine by hand, to get a job running there. The owner stopped it, *"Nobody makes a clone."*: getting the code to a machine is Saphan's job, done the same recorded way every time, never a one-off copy someone made and nobody can account for |
| 2026-10-23 | W3 server and W3b contract | landed | no reason recorded |
| 2026-10-23 | the oversized PUT | landed the review's one condition as its own small change, without a separate review | a documented existing behaviour, no server change: master verification only |
| 2026-10-24 | licence | **Apache-2.0**, as in the sibling public repository | the owner's order for this wagon |

## Where the reasons are

Most gate decisions carry no reason text of their own in the record. The reasons sit in the reviews: each reject names a defect
and each accept names what remains owed. The owner's reject, accept and conditions are acts on a review, so the review is the reason.
