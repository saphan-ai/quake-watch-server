# REVIEW NOTES — quakewatch-events-and-thresholds-are-stored

## Ground

Reviewed `52d5bf91e0ed631abddef92c38a848a41512994e` (`git rev-parse HEAD`), round 3 `b4d525001...HEAD`, and the wagon `578462ad0...HEAD`. Node `v22.23.2` matches `package.json` (`>=22.13 <23`); npm owns `package-lock.json`; `npm test` runs typecheck and Node's built-in test runner through `tsx`. A lock-faithful `npm ci --ignore-scripts` passed using a cache under `.saphan/work/` after the default npm cache refused access. The contract at `docs/api/openapi.yaml:53-59,216-222` declares UTC `date-time` values. The master's ruling admits `Z`, `+00:00`, and `-00:00` with at most millisecond precision.

## Differential

`src/store/index.ts:35-45` uses one `toStoredTime` for ingest (`:75`) and `since` (`:93`). Its grammar accepts both zero offsets and rejects nonzero offsets; normalized values use `Z`. Comparing the parsed ISO rendering with the normalized input rejects impossible calendar values instead of rolling them forward. `test/store.test.ts:139-178` adds corresponding regressions. The wagon adds SQLite migrations, idempotent event and threshold upserts, region boxes, and a contract drift test. No lockfile or dependency delta. `git diff --check 578462ad0...HEAD` passed; no test weakening, skips, suppressions, or threshold changes found.

## Unplug

I mutated each new control in `src/store/index.ts`, ran its focused test, and restored the file from a byte-for-byte copy. Removing the parsed-time round-trip check failed on `2026-02-30T00:00:00Z` with `Missing expected exception`. Removing the zero-offset grammar alternative failed the zero-offset test with `invalid time` on `+00:00`. Broadening the grammar to any numeric offset failed the non-UTC test with `Missing expected exception`. Each mutant exited 1. `git diff --exit-code HEAD -- src/store/index.ts` passed after restoration.

## Closure

**ADDRESSED — UTC offset:** my direct probe ingested `2026-10-21T03:14:07+00:00`, queried with `2026-10-21T03:14:07-00:00`, and returned `2026-10-21T03:14:07Z`. `+02:00` was refused with its original value. Control: `src/store/index.ts:36,75,93`; regression: `test/store.test.ts:139-159`.

**ADDRESSED — impossible day:** my direct probe refused `2026-02-30T00:00:00Z` with its original value; no row was added. Control: `src/store/index.ts:38-43`; regression: `test/store.test.ts:161-178`.

The precision, pre-1970, region-edge, and contract-drift tests remain at `test/store.test.ts:115-130,180-208`. Error messages name the rejected value and state the UTC and precision rule. The accepted-offset examples in the error omit `-00:00`, although the code accepts it.

## Remainder

No blocking code finding. Owed wording polish at `src/store/index.ts:42`: include `-00:00` in the error's list of accepted offsets; the triggering example is any invalid time, whose error currently lists only `Z` and `+00:00`. At `src/store/migrations.ts:10`, the comment says time is always written by `toISOString()`; the new canonicalization constructs and checks the same ISO text. Update that comment with the wording edit. Neither changes stored values.

## Profile

Backend/data access: prepared SQLite statements bind values, ingest uses a rollback transaction, and duplicate ids update one row. `listEvents` is unbounded because the order requires all events when `since` is omitted. There is no cache or multi-instance state. No new external I/O, network, authentication, destructive path, or dependency in round 3. Quality checks rank as contract lint (external schema tool invoked in `npm test`), TypeScript typecheck (project configuration), then the repository's own suite. No numeric coverage, lint-warning, or mutation bar is declared, so no metric delta is claimed.

## Focus

The wagon is plain enough for a tutorial: a Quake type, a short migrations file, a five-region table, and one store module with direct SQL. The drift test reads all five boxes from the contract. The master's UTC-only interpretation of `format: date-time` is implemented consistently for events and `since`. Ruling: treat that narrowing as authoritative for this stream; if the owner wants arbitrary offsets, time-zone conversion needs a separate change. Declined to judge: licences (owner decision), live feed behaviour and HTTP server integration (outside W2).

## Conditions

Before the gate, the master should run and record `npm test` and `npm run typecheck` on `b4d525001` (round-3 base), then compare with the independently measured tip: `npm test` passed 29/29, 0 failed, 0 skipped; `npm run typecheck` passed separately. The baseline run is the only outstanding verification condition. The master's tip and main-merge results in the brief remain claims rather than this review's measurements.

## Unrun

Independent base suite and typecheck: `git worktree add --detach .saphan/work/quakewatch-events-and-thresholds-are-stored-review/base b4d525001` was refused by filesystem permission while creating `.git/worktrees/base`. I did not alter the permission or recreate the denied worktree by another spelling. Tip suite, separate typecheck, direct probes, and three focused mutant tests were run here.
