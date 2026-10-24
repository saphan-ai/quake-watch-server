# BEAT 7 · quakewatch-server · When something is wrong

- what this step is: what the reviewers found, and how each problem was fixed
- for QuakeWatch: nothing was planted; every problem below was real

## What the reviewers found

- **The contract:** the tests could not fail, and the stand-in server answered "OK" where the contract promised an error. Fixed in
  round 2.
- **The feed reader:** bad data in the feed could stop it, one test could not tell a duplicate from an overwrite, and some test
  data had been written by hand instead of recorded from the real feed. Fixed in round 2, with the real feed recorded.
- **The store:** earthquakes before 1970 disappeared and times were rounded; the first fix then refused a valid time zone and quietly
  turned 30 February into 2 March. Fixed in round 3.
- **The server:** a malformed request got a server error instead of a clear refusal, a database problem was reported as bad input,
  requests had no size limit, and there was no clean shutdown. Fixed in the next round. One of its review points, that the contract
  should describe every error the server can give, became a small wagon of its own.

## Why a rejection is good news

Every problem here was found before it reached anyone using the app. A reviewer saying no is the normal path: the next round
starts with the reviewer's words, and the owner decides again.

Back to the start: [the README](../../README.md).
