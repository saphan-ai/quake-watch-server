# Saphan in 5 minutes

Saphan Studio runs a team of AI coding agents for you. You stay in charge: agents do the work, and you decide what is kept.
Every example below comes from building QuakeWatch server, the app in this repository.

## Who does what

| who | what they do |
|---|---|
| **owner** (you) | says what to build, and approves or rejects every change |
| **advisor** | an agent that works with you before any code: together you turn the idea into a design and the material the master plans from |
| **master** | an agent that plans: it turns your goal into small jobs and writes an order for each |
| **executor** | an agent that builds one job and reports what it did |
| **reviewer** | another agent, from another vendor, that checks the job. It did not write the code, so it has no reason to go easy on it |
| **tester** | an agent that uses the result the way a user would: here, it followed the README as a stranger |

## The words

| word | meaning | in QuakeWatch |
|---|---|---|
| **train** | one goal, from idea to done | "build the QuakeWatch server" |
| **wagon** | one small step of a train, with its own test | "read the earthquake feed" |
| **order** | the written instructions for one wagon: what to build, how to check it, what not to touch | [the plan](../fleet/orders/TRAIN_ORDER_quakewatch-server.md) and [one order per round](../fleet/orders/) |
| **leg** | one agent run that works on a wagon | an executor writing the feed reader |
| **round** | one try at a wagon. A rejected wagon gets a new round, and nothing from the old one is erased | the store wagon took three rounds |
| **STOP** | the point where an agent says "I am done" (the engine calls it `stop-2-ready`). A claim, not a fact | [the executor's report](../README.md#4-the-work) |
| **gate** | a point where you decide: accept, accept with conditions, or reject | after each review |
| **record** | everything written down: who asked, who built, who checked, who approved, the cost | [`fleet/`](../fleet/) |
| **fleet** | Saphan's team of agents and the machines they run on; also the folder `fleet/` that holds their paper trail | [`fleet/`](../fleet/) |
| **ledger** | the table that adds the train up: wagons, rounds, verdicts, model, cost, time | [`fleet/LEDGER.md`](../fleet/LEDGER.md) |

## What one change looks like

0. Before the first order, you and the **advisor** prepare the material: the design, the plan of the work, and what must be ready first. In QuakeWatch it is in [`fleet/preparation/`](../fleet/preparation/).
1. The master writes an **order**: what to build, how to check it, and what not to touch. You sign it.
2. An **executor** builds it in its own copy of the code and writes a **status report**.
3. A **reviewer** checks it and writes a **review** with a verdict: accept, accept with conditions, or reject.
4. **You** read the review and decide at the **gate**.
5. If it goes back, it gets a new **round**. Every round stays in the record.

In QuakeWatch this loop ran for eight wagons. The reviewer rejected a wagon the first time in four of the five wagons it checked,
and each time it had found a real defect.

## Why bother

Getting AI agents to write code is easy. Knowing what to trust is hard. Saphan answers three questions for every change: who
asked for it, who checked it, and on what evidence it was accepted.

More: [docs.saphan.ai](https://docs.saphan.ai/docs).
