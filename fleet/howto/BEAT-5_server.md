# BEAT 5 · quakewatch-server · Another agent checks

- what this step is: a reviewer that did not write the code checks it
- for QuakeWatch: the first wagon's review took 8 minutes

## What happens

The reviewer runs on an AI model from a different company than the one that wrote the code, so it does not share its blind spots.
It starts only after the master's own check is on record. It returned:

> **Reject.** All nine tests were green, and none of them could ever fail. The reviewer deleted one example from the contract on
> purpose and ran the tests again: they still passed. And the stand-in server answered "OK" where the contract promised an error.

The full review: [`../reviews/`](../reviews/).

## Why

A test that cannot fail proves nothing. The reviewer's job is to show that the work can turn red, not only that it is green.

The next step: [BEAT-5b](BEAT-5b_server.md), the owner's decision.
