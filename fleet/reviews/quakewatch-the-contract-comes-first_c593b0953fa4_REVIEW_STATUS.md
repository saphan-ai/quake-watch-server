# REVIEW — quakewatch-the-contract-comes-first
- state: recommendation-ready
- verdict: reject
- ref: _REVIEW_NOTES.md
- abstract: The mock returns 200 for invalid region and since values despite documented 400 responses; removing a response example leaves all nine tests green and makes the mock return an undefined body. Reconcile the mock's promised behavior and add an example-presence/schema control before the gate.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
- updated: 2026-10-21T17:43:00Z
