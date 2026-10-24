# BEAT 3 · quakewatch-server · Start the work

- what this step is: the master turns the plan into orders and starts the first agent
- for QuakeWatch: 21 October 2026, the first wagon, the API contract

## What you do

In the master's session you write one sentence:

```
Start working on the QuakeWatch server. Your order is TRAIN_ORDER_quakewatch-server.md.
```

The master writes the order for the first wagon: what to build, how to check it, what not to touch, which AI model does it, and
what it may cost. When it is ready, you approve it with one click in the web console. Then the master starts an executor on it.

## What the first wagon builds

The API contract: one file that says what every request and every answer of the server looks like. Every later wagon builds to it,
so it comes first.

## Why an order needs your approval

An agent only starts work you approved: what it may change, with which model, at what price. If the order changes, it needs your
approval again.

The next step: [BEAT-4](BEAT-4_server.md).
