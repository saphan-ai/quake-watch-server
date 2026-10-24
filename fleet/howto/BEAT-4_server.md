# BEAT 4 · quakewatch-server · The agent builds

- what this step is: an executor builds one wagon in its own copy of the code and reports back
- for QuakeWatch: the first wagon took one run of about 10 minutes of model time

## What happens

The executor works in a locked-down copy of the code. It writes the contract, a small stand-in server that answers with the
contract's examples, and tests. Then it reports:

```
tests 9 · pass 9 · fail 0
Your API description is valid.
```

It also said what it could not do: its locked-down workspace does not allow opening a network port, so it could not start the
server itself. It said so instead of working around it.

## What the master does with the report

A report is a claim, not a fact. The master took a fresh copy of the code and ran everything again himself: the tests, the
contract check, and a request to the stand-in server for every path. All answered correctly.

## Why

An agent's own word is never the proof. The proof is someone else running it again.

The next step: [BEAT-5](BEAT-5_server.md).
