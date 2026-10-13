# Repository changelog

Product releases are recorded in [the complete SlotDesk changelog](docs/changelog.md).

## 2026-10-13 — Standalone private repository

- Establish `Yoavfried/slotdesk` as the canonical SlotDesk source, separate from private parent-website planning.
- Retain the complete 0.7.0 extension and engine; reorganize source into `extension/`, product records into `docs/`, and design references into `design/`.
- Credit both GitHub accounts and add the `[Website name TBD]` parent credit.
- Adapt preview, validation and packaging paths; add automated checks and contributor templates.
- Consolidate live acceptance into three sessions and one final export; retain pending work-account status.
- Preserve extension identity, OAuth scopes, bundled fonts and product version 0.7.0. This migration adds no calendar behavior.
- Preserve exact extension bytes through Git checkouts and emit the ZIP's SHA-256 alongside the package.

The initial commit is a curated snapshot. The original product versions remain documented; internal website plans and private audit/calendar artifacts are outside this repository.
