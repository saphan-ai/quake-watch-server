# MASTER VERIFY — quakewatch-events-and-thresholds-are-stored

- round: 4
- by: MASTER · 2026-10-22
- base: 578462ad0 · tip 52d5bf91e (previous round tip b4d525001)
- verdict: READY — both blocking findings of review round 2 are paid; the suite and the tree merged with main (W1 landed) are green on the master's host

## Checks
- █████, fresh clone checked out detached at 52d5bf91e, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 29 · pass 29 · fail 0 · skipped 0` (round 2 tip: 26).
- Merged tree: `git merge-tree --write-tree 52d5bf91e origin/main` (main 0d7aaa3, W1 landed) → tree b1bcc5a6, no conflict; that tree laid into the clone, `npm test` exit 0, `tests 40 · pass 39 · fail 0 · skipped 1` (the opt-in live test).
- The leg's evidence, from its status (not re-run by the master): red on b4d525001 for the zero-offset and impossible-date tests; negative control — round-trip check removed → `Missing expected exception: 2026-02-30T00:00:00Z`.
- The master's offset ruling (Z, +00:00, -00:00 accepted and stored as Z; any other offset refused by value) is implemented in one function used by ingest and `since`.
- Not measured: Node 22 itself (the host runs Node 26).
- Master wrong: none in this round.

## Next
Named review round 3 on codex: `quakewatch-events-and-thresholds-are-stored-review`, reviewed-sha 52d5bf91e.
