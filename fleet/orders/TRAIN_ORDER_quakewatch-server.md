# The plan: build the QuakeWatch server

This is the train order: the master's plan for the whole goal, split into small steps called wagons.
Each wagon has a test that proves it is done, and each one is checked by a reviewer before the owner accepts it.

## What the owner asked for

21 October 2026,:

> What if we made a quake-watch repository on GitHub, like proven? Like "write your first app in Saphan Studio", with the whole
> process explained. It must be simple, super simple: how to start.

## What will be true when it is done

A person who has never heard of Saphan opens this repository and understands, in about fifteen minutes, how Saphan builds
software, by following one small real app from idea to merge. The app reads the public earthquake list from the US Geological
Survey, keeps earthquakes and alert thresholds in a small database, and answers which recent earthquakes matter for a region.

## The wagons

| # | wagon | done when | checked by |
|---|---|---|---|
| W0 | **The API is written down first**, as a contract, with a small fake server that answers from it | the contract has no errors and the fake server answers every path | a reviewer |
| W1 | **Read the earthquake feed**, and survive its bad days (empty feed, broken entry, too many requests) | each of those cases has a test, and the tests pass | a reviewer |
| W2 | **Store earthquakes and thresholds** | loading the same feed twice gives the same data | a reviewer |
| W3 | **The real API**, replacing the fake one | every answer matches the contract, and the README's examples work as written | a reviewer |
| W4 | **A tester uses it from the README alone**, on a clean machine | every step works, or the gap is reported | the master |
| W5 | **One thing goes wrong**, shown honestly: what broke, how it was caught, what fixing it cost | the story is in the record | the master |
| W6 | **The tutorial**: this repository's README, written from the real record | every command in it really ran | a reviewer |

W0 comes first because everything else depends on the contract. W1 and W2 then run at the same time. W3 waits for both, W4 for W3,
and the tutorial comes last.

## Not in this plan

The Android app, the iPhone app and the Docker image. Each will be its own repository and its own plan:
[what comes next](../../docs/WHAT_COMES_NEXT.md).
