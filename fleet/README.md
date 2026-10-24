# fleet/: the paper trail

"Fleet" is Saphan's word for its team of agents and the machines they run on. This folder is what that team wrote down while it
built QuakeWatch server. The tutorial in the [README](../README.md) is made from these files; nothing here was written afterwards
to make the story neater. Private details (machine and seat names, people other than "the owner", addresses, local paths, key
ids) are blacked out with `█████`.

| folder | what is in it |
|---|---|
| [`preparation/`](preparation/) | before any code: the advisor's design and plan for the whole exercise |
| [`orders/`](orders/) | the plan (`TRAIN_ORDER_…`) and every order: what to build, how to check it, and what not to touch. `…_EXEC_ORDER.md` goes to an executor, `…_REVIEW_ORDER.md` to a reviewer, `-r2` and `-r3` are later rounds, `MASTER_ORDER_…` is the master's own order for small documentation or fix changes |
| [`status/`](status/) | the master's verification of each round: what was run on a fresh clone, with the result |
| [`reviews/`](reviews/) | every review: `…_REVIEW_STATUS.md` holds the verdict and one-paragraph summary, `…_REVIEW_NOTES.md` the full findings. The twelve characters in the name tell reviews of one wagon apart |
| [`howto/`](howto/) | the master's dated notes, written as the build happened: the commands, the answers and what went wrong. The README's command and output blocks come from these (each block names its note) |
| [`decisions/`](decisions/) | the owner's decisions, with their reasons where the record has one |
| [`LEDGER.md`](LEDGER.md) | the train added up: wagons, rounds, verdicts, models, cost and time |

## Reading order

1. [`LEDGER.md`](LEDGER.md) for the whole picture on one page.
2. One wagon end to end: the order, then the review, then the master's check. For example
   `quakewatch-the-feed-survives-usgs_EXEC_ORDER.md`, then its first review (a reject), then the `-r2` order that pastes the review's
   words in, then the second review.
3. [`decisions/`](decisions/) for what the owner decided and why.

## What is not here

- The agents' own executor status files, the run transcripts and the engine's database rows. They stay in Saphan's own store.
- Cost figures that the record does not carry: the ledger says "not in the record" instead.
- The orders of a separate stream that fixed Saphan Studio itself during the build (it is described in step 7 of the README). That
  work belongs to the Saphan Studio repository, not to this app.
