# Repository changelog

## 2026-10-13 — SlotDesk 0.7.1

- Add reviewed guest/detail editing, narrow conditional writes and duplicate-safe recovery.
- Document UX57–UX60, editing scope/privacy and automated/browser evidence.
- Publish the 0.7.1 pilot package while preserving the pinned extension/OAuth identity and design kit.

## 2026-10-13 — Reported live rescheduling progress

- Record working No alerts, sensible replacement proposals, a successful actual reschedule and correct overlap details, as reported by the owner.
- Remove the retired manual checklist and consolidate the validation record around actual reported and automated evidence.
- Recheck calendar write entry points and rerun 251 existing booking/rescheduling/safety checks. No app or package change.


Product releases are recorded in [the complete SlotDesk changelog](docs/changelog.md).

## 2026-10-13 — Standalone private repository

- Establish `Yoavfried/slotdesk` as the canonical SlotDesk source, separate from private parent-website planning.
- Retain the complete 0.7.0 extension and engine; reorganize source into `extension/`, product records into `docs/`, and design references into `design/`.
- Credit both GitHub accounts and add the `[Website name TBD]` parent credit.
- Adapt preview, validation and packaging paths; add automated checks and contributor templates.
- Keep automated validation separate from actual live reports.
- Preserve extension identity, OAuth scopes, bundled fonts and product version 0.7.0. This migration adds no calendar behavior.
- Preserve exact extension bytes through Git checkouts and emit the ZIP's SHA-256 alongside the package.

The initial commit is a curated snapshot. The original product versions remain documented; internal website plans and private audit/calendar artifacts are outside this repository.
