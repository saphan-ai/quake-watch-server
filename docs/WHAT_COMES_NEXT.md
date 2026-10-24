# What comes next

QuakeWatch server is built. The same process builds what comes next, each part as its own **train** (one goal, from idea to
done; see [Saphan in 5 minutes](SAPHAN_IN_5_MINUTES.md)) in its own repository, against the one API contract in
[`docs/api/openapi.yaml`](api/openapi.yaml). None of these trains exists yet; this page says what each one would prove.

| train | repository | built with | what it adds |
|---|---|---|---|
| **server** (done) | `quake-watch-server` | Node, TypeScript, SQLite | reads the earthquake feed, stores events and thresholds, serves `/api/v1` |
| **Android** | `quake-watch-android` | Kotlin, Jetpack Compose | a list and a map of earthquakes, and a screen to set your threshold |
| **iOS** | `quake-watch-ios` | Swift, SwiftUI | the same screens on iPhone |
| **Docker** | `quake-watch-deploy` | Docker, Compose | everything in one image, plus a check that both apps read the API the same way |

## Why this order

The server came first because it defines the API: a written contract that says what every request and answer looks like. The
contract was written before the server, and the server was then tested against it, response by response. With the contract and a
running server, the Android and iOS apps can be built at the same time by different agents. They need the contract, not each other.

## What each next train would prove

- **Android and iOS** would prove that two groups of agents can build against one contract in parallel, on different machines
  (iOS needs a Mac), and that a reviewer can still say no to each of them. The contract's examples and its error answers
  are what both apps are tested against.
- **The Docker image** would prove that the parts fit. A separate agent, which built none of them, starts the server in the image
  and checks that both apps read the API the same way. The result goes in the record like every other check.
- **The same process on any stack** would prove that the method does not depend on the language. The server is Node; the apps
  are Kotlin and Swift; the image is Docker. The orders, rounds, reviews, gates and ledger look the same in all of them, and
  that sameness is the point.

## What this train handed forward

Two small things the tester found and did not fix, because a tester only reports: there is no test for stopping the server with
Ctrl+C, and a corrupt database file crashes the server with a stack trace instead of a plain message. They are owed to a later wagon.
