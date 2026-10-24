# MASTER VERIFY — quakewatch-events-and-thresholds-are-stored

- round: 3
- by: MASTER · 2026-10-22
- base: 578462ad0 · tip b4d525001 (previous round tip a59e6c409)
- verdict: READY — the blocking conditions of review round 1 are paid; the master ran the suite on a fresh clone

## Checks
- █████, fresh clone checked out detached at b4d525001, node v26.7.0: `npm ci` exit 0; `npm test` exit 0, `tests 26 · pass 26 · fail 0 · skipped 0` (round 1 tip: 20).
- `git merge-tree --write-tree` of this tip with the W1 round-2 tip 9dfaaf512: exit 0; with `main` (8baa737, documents only): exit 0.
- The leg's evidence, from its status (not re-run by the master): red first on a59e6c409 for pre-1970, sub-millisecond and malformed times (pass 12, fail 3); `minLon: 92` → `93` turns the drift test red; `lon BETWEEN` → `lon > ? AND lon <=` turns the boundary test red.
- The master's ruling on condition 2 (millisecond precision at most, finer refused) is implemented; the leg also refuses offsets other than `Z`, as the ruling names UTC — a judgement call returned for the reviewer.
- Not measured: Node 22 itself (both hosts run Node 26). Round 1's round-1 master verify could not run the suite; this one did.
- Master wrong: none in this round.

## Next
Named review round 2 on codex: `quakewatch-events-and-thresholds-are-stored-review`, reviewed-sha b4d525001.
