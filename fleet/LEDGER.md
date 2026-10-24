# Ledger: what the QuakeWatch server train did and cost

One row per wagon, built only from the record in this folder and from the beat files written during the build. "Not in the
record" means exactly that: no document held here carries the number, and none was invented. A **round** is one try at a wagon; a
rejected wagon gets another. Executors are `claude-code` / `claude-sonnet-5-5`; reviewers are `codex` / `gpt-6-sol`.

## Wagons

| wagon | what it built | executor rounds | reviews, in order | landed |
|---|---|---|---|---|
| W0 | the API contract, a mock, the project | 2 | reject, then accept with conditions | yes |
| W1 | the feed reader | 2 | reject, then accept with conditions | yes |
| W2 | the store | 3 | reject, reject, then accept with conditions | yes |
| W3 | the API server | 2 | reject, then accept with conditions | yes |
| W3b | the contract declares every error (a review condition of W3, made a wagon) | 1 | accept with conditions | yes |
| oversized PUT | the one condition of W3b's review, as a small change | 1 | master verification only | yes |
| W4 | a tester follows the README as a stranger | 1 (tests, no product code) | master verification only | nothing to land |
| W5 | the honesty step | recorded as a beat, no executor run | master verification only | nothing to land |
| advisor's preparation | the advisor's documents and role, public | 1 | master verification only (documents) | yes |
| W6 | this tutorial | 2 | accept with conditions | yes |

Totals from the rows: **13 executor/tester orders** in the signed orders published in [`orders/`](orders/): **11** for W0–W4 (W0 2, W1 2,
W2 3, W3 2, W3b 1, W4 1) and **2** for W6 (round 1 and round 2). The oversized-PUT change and the preparation work ran from the
master's own orders and are counted separately. **10 reviews** of W0–W3b (5 rejects, 5 accept-with-conditions, no plain accept), plus
W6's round-1 review, which accepted with conditions and is not in the 10. **5 extra executor rounds** caused by a reject (W0, W1, W3 once each,
W2 twice). One beat file says six; the orders held here show five, and the orders are the primary record.

**Repeat the count.** From the repository root, each line prints what follows the arrow. The total falls if any one
order file is removed from `fleet/orders/`; a subgroup count falls only when the removed order is in that subgroup:

```
ls fleet/orders | grep -c '_EXEC_ORDER.md$'                                  → 13  (11 + 2)
ls fleet/orders | grep -v 'tutorial-is-the-record' | grep -c '_EXEC_ORDER.md$'   → 11  (W0–W4)
ls fleet/orders | grep 'tutorial-is-the-record' | grep -c '_EXEC_ORDER.md$'      → 2   (W6)
node -e "const fs=require('fs');let n=0,s=0;for(const f of fs.readdirSync('fleet/orders'))if(f.endsWith('_EXEC_ORDER.md')){n++;s+=+fs.readFileSync('fleet/orders/'+f,'utf8').match(/^- quote-usd: (\d+)/m)[1]}console.log(n,s)"
                                                                              → 13 194  (orders, dollars quoted)
ls fleet/reviews | grep -c '_REVIEW_STATUS.md$'                              → 10  (the ten verdicts of W0–W3b)
```

Quotes of the 11 (W0–W4) sum to $162; W6's two orders add $20 and $12. The ten review verdicts are counted from the ten
`_REVIEW_STATUS` documents in [`reviews/`](reviews/), not from the review orders.

## Money, and what it means

Saphan prints a price class with every number, because the same column holds real money and its imaginary twin.

| figure | executors | reviews |
|---|---|---|
| seat class | subscription: a shared allowance, not money billed per run | the class shows $0.00; the clock is the bound |
| quote per round | W0 $15, W1 $15, W2 $15, W3 $20 then $15, W3b $12, W4 $10, W6 $20 then $12 | $7 each (cap $14) |
| quotes, summed | $194 for the 13 rounds whose signed order is published in `orders/`: $162 for W0–W4 and $32 for W6's two | $70 for the 10 reviews |
| actual, as the vendor reported it | **$0.99** for W0 round 1 (64 turns). **Not in the record** for every other round | not in the record (class $0.00) |

A quote is a price agreed before the run; the cap is twice the quote. Neither is a bill. The vendor-reported figures sit in each run's
transcript, which this repository does not hold, so no total "actual" is given.

## Time

| span | measured |
|---|---|
| train opened (repository registered, plan stored) | 2026-10-21 09:45 UTC |
| this wagon dispatched | 2026-10-23 21:29 UTC, about 60 hours later |
| W0 first dispatch → first review verdict | 2026-10-21 10:07 → 17:46: 7 h 39 min, of which the review was 8 minutes |
| W0 reject → fix landed | 2026-10-21 17:46 → 2026-10-22 01:37: about 7 h 50 min |
| executor time, W0 round 1 | 585 s of model time |
| total wall time of the train | about 60 hours up to this wagon; this wagon's own time is not yet in the record |

Most of that time is waiting, not working: for a free reviewer, for the owner's approval (the owner was asleep part of the time),
and for the master's own check, which comes before every review.

## Review conditions carried forward

| from | condition | paid in |
|---|---|---|
| W0 review 2 | a renamed health path produces only a warning; W6 owes the first-run recipe | `docs/RUN_IT.md` and this README |
| W2 review 3 | the master must record the baseline comparison before the gate | the master's verification of round 4 |
| W3 review 2 | reconcile the contract's response declarations; startup failure leaves an open store | the first part in W3b; the open store on a failed start is not shown paid in the record |
| W3b review | an oversized PUT on an unknown path answers `body_too_large`; make the test and the contract say so | the oversized-PUT change, `90b64c093` |
| W4 tester | no test for stopping the server; a corrupt database file crashes with a stack trace | owed, listed in [what comes next](../docs/WHAT_COMES_NEXT.md) |
