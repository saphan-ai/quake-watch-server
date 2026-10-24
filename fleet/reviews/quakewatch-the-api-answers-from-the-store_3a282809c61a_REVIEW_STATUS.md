# REVIEW — quakewatch-the-api-answers-from-the-store
- state: recommendation-ready
- verdict: reject
- ref: _REVIEW_NOTES.md
- abstract: Reject: malformed threshold paths return 500, store failures masquerade as 400, request bodies are unbounded, and the refresh timer lacks shutdown cleanup. The unknown-region 400 test survives removal of its guard.
- artifacts:
    - _REVIEW_STATUS.md
    - _REVIEW_NOTES.md
- updated: 2026-10-22T11:49:59Z
