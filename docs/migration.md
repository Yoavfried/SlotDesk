# Standalone repository migration

Date: 13 October 2026. Product version: **0.7.0**.

The source snapshot comes from the private parent repository at commit `d2426ef2b2ca1a79331cd4bb0f25677c87b254e1`. The private original retains its full mixed history; this repository starts with curated product files and the recorded product changelog. No history or private planning is published by this migration.

| Original location | Standalone location |
| --- | --- |
| `apps/slotdesk/` | `extension/` |
| `docs/products/slotdesk/` | `docs/` |
| `docs/design/` | `design/` |
| `scripts/` | `scripts/` with standalone paths |

The extension's packaged files are unchanged. The pinned public extension key, OAuth client ID/scopes, font files and version remain identical. Existing installed copies do not need a new Google project because of the repository move. Source installs select `extension/`; packaged installs select the extracted folder containing `manifest.json`.

Only reviewed synthetic screenshot examples are carried into this snapshot. Internal build reports, venture plans, raw calendar exports, credentials and local security artifacts remain outside it. Documentation separates automated evidence from actual reported live results.

The private parent repository links to this canonical source and records an integration version. SlotDesk code and product decisions are edited here. Website implementation remains on hold.

The new repository stays private. A visibility change and a public software license are later decisions; see [publication](publication.md).

## Migration verification

- All 1,146 application checks and 22 standalone export-comparison checks passed in the new layout.
- Repository syntax, links, local assets and 0.7.0 manifest checks passed.
- All 47 extension source/test/font files other than the repository-only README match the original snapshot exactly.
- The 37-entry tester ZIP matches the previously supplied ZIP byte for byte. SHA-256: `e15dac4f52501a839fe751199b323a262f4a9c51e548e6d9d95024a06bb9f86f`.
- A scoped file scan found no calendar-export/private-key artifacts or recognized credential patterns. The only non-example email matches were the supplied font-license contacts, retained unchanged. This is a migration-content check, not an exhaustive security audit.
