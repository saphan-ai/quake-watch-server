# BEAT 0 · quakewatch-server · Tell Saphan where your code lives

- what this step is: before any work, you tell Saphan which repository the app lives in and what it is written in
- for QuakeWatch: about 10 minutes, on 21 October 2026

## What you do

1. Create the repository for your app (here: a new public repository on GitHub, `saphan-ai/quake-watch-server`).
2. Tell Saphan about it and what it is written in (here: Node.js). That is what lets the agents run `npm` in it, and nothing else.
3. Give the master the plan, the train order: [`../orders/TRAIN_ORDER_quakewatch-server.md`](../orders/TRAIN_ORDER_quakewatch-server.md).

In the web console this is one form; from the master's session it is one sentence.

## Why

Saphan does not start work that has no written plan behind it, and an agent only gets the tools of the language the project
declares. Both are set once per app.

The next step: [BEAT-1](BEAT-1_server.md).
