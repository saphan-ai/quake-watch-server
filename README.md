# QuakeWatch server: your first app with Saphan Studio

**This repository shows how you build software with [Saphan Studio](https://saphan.ai/), using one small app.**
You do not need to know anything about Saphan to read it. Every step below happened for real while this app was built, and
everything the agents did is kept in [`fleet/`](fleet/).

QuakeWatch server is a tiny server. It reads the public list of earthquakes from the US Geological Survey (USGS) and tells you
which ones are strong enough to matter for your region. AI coding agents built it. One person, the **owner**, said what to
build and approved every step.

## Try the app first (5 minutes)

You need [Node.js](https://nodejs.org/) 22.13 or newer (the build was tested on Node 22 and on Node 26) and two terminals.

Three words, so the commands make sense. A **region** is a named box on the map, such as `western-north-america`. A
**threshold** is what you set for a region: the weakest **magnitude** (how strong a quake is) and the greatest **depth** (how far
down it started, in km) you care about. An **alert** is a recent earthquake inside a region that passes that threshold.

**Terminal 1.** Start the server. It uses a small recorded copy of the USGS feed, so it works without a network:

```
git clone https://github.com/saphan-ai/quake-watch-server
cd quake-watch-server
npm ci
QUAKEWATCH_FEED_FILE=test/fixtures/usgs/recorded-2026-10-22.geojson npm start
```

It listens on port 8080 and keeps running; stop it with Ctrl+C. Leave `QUAKEWATCH_FEED_FILE` out and it reads the live USGS feed instead.

**Terminal 2.** Ask for alerts, set a threshold, ask again:

```
curl 'http://localhost:8080/api/v1/alerts?region=western-north-america'
curl -X PUT -H 'content-type: application/json' -d '{"minMagnitude": 1.5, "maxDepthKm": 20}' \
  http://localhost:8080/api/v1/thresholds/western-north-america
curl 'http://localhost:8080/api/v1/alerts?region=western-north-america'
```

The first answer is empty (the default threshold is magnitude 5, and the only quake of the file's three that lies in this region is 1.69). After the second command
the third answer has one alert, near Petrolia, California. The full walk-through, with every answer, is in
[`docs/RUN_IT.md`](docs/RUN_IT.md). The tests: `npm test`.

## Saphan in one minute

You tell Saphan what you want. AI agents do the work. You decide what is accepted.

```
   you ──► advisor ──► master ──► executor ──► reviewer ──► you
  "build   shapes the   plans the   writes the   checks the    accept
   this"   idea with    steps       code         work          or reject
           you
```

- **You** are the owner. You give the goal and approve every change.
- **The advisor** is an agent you talk the idea through with, before any code.
- **The master** is an agent that splits your goal into small steps and runs them.
- **The executor** is an agent that builds one step in its own copy of the code and reports back.
- **The reviewer** is a different agent, from a different AI company. It checks the work and can say no.
- **Everything is written down**: every step, report, review and decision, in [`fleet/`](fleet/).

You can drive all of it in two ways: by talking to the master in plain words, or by clicking in Saphan's **web console**.
The [5-minute guide](docs/SAPHAN_IN_5_MINUTES.md) has a little more.

## How you build an app with Saphan, in eight steps

This is how QuakeWatch server was built, and how you would build yours.

1. [Set up once](#1-set-up-once) · 2. [Decide what to build](#2-decide-what-to-build) · 3. [Start the work](#3-start-the-work) ·
4. [The agent builds](#4-the-agent-builds) · 5. [Another agent checks](#5-another-agent-checks) · 6. [You decide](#6-you-decide) ·
7. [When something is wrong](#7-when-something-is-wrong) · 8. [Done](#8-done)

### 1. Set up once

You install Saphan Studio and open its web console. On the first start it walks you through a few screens: who you are, the
machines your agents may use, and a key that only you hold, so that nothing is approved without you. You do this once.

Then you tell Saphan where your code lives: here, one new repository on GitHub. Notes: [`fleet/howto/BEAT-0_server.md`](fleet/howto/BEAT-0_server.md), [`fleet/howto/BEAT-1_server.md`](fleet/howto/BEAT-1_server.md).

### 2. Decide what to build

You talk the idea through with the advisor, in plain words, the way you would with a colleague. QuakeWatch started with a call:
an engineer told the owner that Saphan was hard to understand because it does so much. So the owner asked the advisor for a small
public app, *"write your first app in Saphan Studio"*, built in the open, *"with an explanation of the whole process"*, and set
the bar: *"It must be simple, super simple, how to start."*

The advisor then asked three questions, and the owner answered each in a word:

- *Reuse an earlier attempt, or start fresh?* **Fresh**: a clean repository a newcomer can follow from the first commit.
- *Build all four parts at once (server, Android, iPhone, Docker), or the server first?* **The server first**, but say clearly what
  comes next, so a reader sees the whole road.
- *Give it to a master that is already busy, or to a new one?* **A new master**, whose only job is this app.

From those answers the advisor wrote the design and the plan: [`fleet/preparation/`](fleet/preparation/).

Your decisions are written down and kept: [`fleet/decisions/`](fleet/decisions/). Notes: [`fleet/howto/BEAT-2_server.md`](fleet/howto/BEAT-2_server.md).

### 3. Start the work

The master turns the plan into a **train**: your goal, cut into small steps called **wagons**, each with its own test. The plan
for this app is [`fleet/orders/TRAIN_ORDER_quakewatch-server.md`](fleet/orders/TRAIN_ORDER_quakewatch-server.md): eight wagons, from the
API contract to this tutorial.

To start, you write to the master, in its session:

```
Start working on the QuakeWatch server. Your order is TRAIN_ORDER_quakewatch-server.md.
```

From there the master works on its own. It writes an order for each wagon and starts an agent on it. When an order needs your
approval, you approve it with one click in the web console. Notes: [`fleet/howto/BEAT-3_server.md`](fleet/howto/BEAT-3_server.md).

### 4. The agent builds

An executor builds the wagon in its own copy of the code, runs the tests and reports back. Its report is a claim, not a fact: the
first wagon reported *"9 tests, 9 pass"*. The master then runs the tests again himself on a fresh copy, before anyone believes it.
Notes: [`fleet/howto/BEAT-4_server.md`](fleet/howto/BEAT-4_server.md).

### 5. Another agent checks

A reviewer that did not write the code checks it. It runs on an AI model from a different company, so it does not share the
blind spots of the one that wrote the code. It can say no, and here it did:

> **Reject.** All nine tests were green, and none of them could ever fail. The reviewer deleted part of the contract on purpose,
> ran the tests, and they still passed.

Green means something only if someone has shown it can turn red. Notes: [`fleet/howto/BEAT-5_server.md`](fleet/howto/BEAT-5_server.md);
the review itself: [`fleet/reviews/`](fleet/reviews/).

### 6. You decide

The reviewer advises; **you decide**. In the web console you see the work, the tests and the review, and you choose: accept,
accept with conditions, or reject. For the first wagon the owner rejected; a second round fixed the tests, the second review said
"accept with conditions", and the owner accepted.

Nothing is merged into the finished code, and nothing is published, without your approval. Every decision is kept:
[`fleet/decisions/`](fleet/decisions/). Notes: [`fleet/howto/BEAT-5b_server.md`](fleet/howto/BEAT-5b_server.md).

### 7. When something is wrong

A reviewer saying no is the normal path, not an emergency: the next round starts with the reviewer's own words. In this build the
reviewers sent work back several times, for example:

- **The feed reader:** bad data in the feed could stop it, and one test could not tell a duplicate from an overwrite. Fixed in round 2.
- **The store:** earthquakes before 1970 disappeared, and an impossible date like 30 February was quietly accepted. Fixed in round 3.
- **The server:** a malformed request got a server error instead of a clear refusal, and there was no limit on how big a request could be. Fixed in the next round.

Every round, every review and every fix is in [`fleet/`](fleet/), with what each one cost in the [ledger](fleet/LEDGER.md).
Notes: [`fleet/howto/BEAT-6_server.md`](fleet/howto/BEAT-6_server.md), [`fleet/howto/BEAT-7_server.md`](fleet/howto/BEAT-7_server.md).

### 8. Done

When the last review accepted, the owner accepted the last wagon: **every change in this repository was approved by the owner**,
and the agents never merge on their own. Then a **tester**, an agent that uses the result like a stranger would, followed this
README from the top. Its five complaints about the first version are why this page looks as it does.

The server ended with 84 tests and a contract that describes every answer it gives. The [ledger](fleet/LEDGER.md) lists each wagon
with its rounds, its reviews and the AI model that did the work.

## What comes next

QuakeWatch server is the first app. The same way, the agents build the next ones against this server's API: an Android app, an
iPhone app and a Docker image. More in [what comes next](docs/WHAT_COMES_NEXT.md).

## Where to look

- [`docs/RUN_IT.md`](docs/RUN_IT.md): run the server and try every call.
- [`docs/SAPHAN_IN_5_MINUTES.md`](docs/SAPHAN_IN_5_MINUTES.md): the words you will meet, explained.
- [`fleet/`](fleet/): every order, report, review and decision behind this code, and [`fleet/preparation/`](fleet/preparation/), the advisor's plan.
- [saphan.ai](https://saphan.ai/) and [docs.saphan.ai](https://docs.saphan.ai/docs): the product and its documentation.

Licence: [Apache-2.0](LICENSE).
