# Local backup/restore and profile export/import

Owner clarification: 15 October 2026. This supersedes the combined backup/import proposal in the initial usability review. Implementation remains planned. Keep this discussion focused on the two file operations below.

## 1. Complete SlotDesk setup backup and restore

Back up the complete local SlotDesk configuration: all saved person profiles with every setting, availability/travel/flight rules, application preferences, selected workspace calendars, default invitation calendar and calendar assignments. This file is portable between SlotDesk accounts; it is not restricted to the account that created it.

Restore is replacement, not merge. After a successful restore, existing local profiles/settings absent from the file are gone, and imported supported configuration replaces the previous configuration. Do not retain the old person's records or preferences simply because they are absent from the backup. This affects the receiving account's local SlotDesk setup, not other stored account workspaces.

Require a plain replacement warning, for example:

> Restore this backup? This will replace all SlotDesk settings, calendar selections and saved profiles in this account. Your current local setup will be removed and replaced with the backup. Your calendar events will not be changed.

Use an explicit action such as Replace my SlotDesk setup. Validate the file before replacing data. A failed validation or failed local save must leave the previous setup intact; it must not leave a half-cleared workspace.

Example: the recipient has 20 saved people and the backup contains 7. Full restore replaces the 20 with the backup's 7, including those people's settings. It does not combine the lists. If the backup's default calendar is unavailable to the recipient, explain that and require a usable replacement before creating invitations.

The Google account actually signed in remains the recipient's account. A file cannot sign the user in as its author, give calendar permissions or make a missing calendar exist. Any mismatch between the backup's own-profile marker and the receiving user must be surfaced and resolved deliberately, rather than silently retaining the previous own profile or labelling the backup author as the receiving user.

## 2. Selected person-profile export and import

Provide checkboxes and Select all for exporting saved person profiles and selecting which profiles to import. The file is readable by any SlotDesk account, including a different assistant's account.

Every exported person includes ALL of that person's saved settings, not only identity fields. This includes timezone, template/manual working schedules, usual convenience settings, ignore flags, overlap defaults, minimum notice, meeting buffers, positive availability, protected/inconvenient rules, travel, exact flights, holiday/leave exceptions, event classification and individual-event treatment. Calendar assignments are the one inclusion question the owner explicitly left open; see below.

Workspace-wide preferences belong to the complete-setup backup. Importing a selected person does not reset the rest of the recipient's SlotDesk setup. Unselected existing people remain unchanged. The duplicate-email policy is awaiting the owner's answer; replacement, skip or an explicit per-duplicate choice must not be silently assumed.

## Compatibility by named fields/columns

The importer scans the provided headers/fields and recognizes the names supported by its own version. It must not depend on fixed column positions. Reordering columns should work.

- Recognized columns: validate and import their values.
- Columns unknown to that SlotDesk version: ignore them. Do not reject a file merely because it includes settings from a newer version.
- Missing optional setting columns: alert the user and use that importing version's defaults for those fields. Do not carry over the old local values instead of the specified defaults.
- Missing base columns: fail the import with a clear message and leave current local data unchanged.

The recommended base columns are email, name and timezone; the owner has been asked to confirm them. Supported required values must also be valid. Column names and meanings need a stable export contract; renamed fields require an explicit alias/migration. Nested arrays/rules must round-trip completely rather than being shortened into a summary or lost during export.

Example: a file contains an overlap preference that an older importer does not recognize. The older importer ignores that column and reads its known columns. If a newer importer reads an older file without a meeting-buffer column, it warns and applies its default for that field. Missing a required identity column stops the import.

The compatibility rule applies to supported configuration fields in a full backup as well. A backup version marker alone is not a reason to refuse an otherwise readable file.

## Calendar assignments versus Google calendar sharing

Google sharing controls who can read or write a calendar. SlotDesk assignments tell the scheduling engine which calendar(s) to check for a saved person. These are different settings. A SlotDesk file must never change Google calendar sharing, subscribe the account to a calendar, copy calendar contents or create/modify/delete appointments.

For example, assigning Nina's profile to her work and travel calendars is a SlotDesk configuration. Another assistant may already have Google access to those same calendars, in which case portable assignments can save setup. If access is absent, an imported assignment cannot provide it. [Google sharing and access roles](https://developers.google.com/workspace/calendar/api/concepts/sharing).

Complete backups include calendar configuration under the owner's replacement requirement. For selected-person files, the recommendation is to include assignment references with the rest of the person's settings, then validate current access. Inclusion remains an explicit open choice.

## Actual restore/import problems and recommended handling

| Situation | Recommended handling |
| --- | --- |
| Saved default calendar is missing or unavailable | Explain which calendar cannot be used; leave creation unavailable until the user chooses a suitable default. Do not silently choose another calendar. |
| Saved default calendar is now read-only | Explain that it cannot receive invitations; allow supported browsing/availability while a writable default is chosen. |
| Some selected workspace calendars are inaccessible | List the affected calendars and explain that their events cannot be loaded or used. Do not report full availability from them. |
| A person's assigned calendar is unavailable | Keep the unresolved reference visible if assignments are included; mark availability unconfirmed and offer reassignment. Do not guess another source from its name. |
| The backup identifies another person as the owner | Explain the identity mismatch and ask the recipient to identify/setup their own profile while retaining the imported people as appropriate. The exact identity-reconciliation flow needs definition. |
| File has unknown optional columns | Ignore them and import supported columns. This is not an import failure. |
| File lacks optional columns | State which settings use defaults; apply importing-version defaults. |
| File lacks required columns or has invalid required data | Stop without changing saved data; identify the problem. |
| Selected-profile email already exists | Apply the explicit duplicate policy once chosen; leave unrelated profiles untouched. |
| A calendar write is unfinished | Preserve/check the original operation before any destructive local replacement; do not copy an operation to another account or erase its only recovery record. |
| Another SlotDesk window changes local data during import | Revalidate the final operation against current saved state; do not merge a full replacement into old data or allow an old window to resurrect removed settings. |

A complete setup backup concerns portable configuration. Google credentials and in-flight calendar-operation/account-registration records are operational state, not portable preferences; define their handling explicitly before implementation so another account's operation or updates choice cannot be replayed.

## No mandatory general preview

The owner questioned the proposed preview requirement. Do not require a full field-by-field preview or merge screen.

- Full restore: choose the file, validate it, show the replacement warning and any actual compatibility/access issues, then confirm replacement.
- Selected profiles: choose the file, select people with Select all, show actual missing-field/access/duplicate messages, then import.

A selection list and a destructive replacement confirmation are not an extra general preview stage. Do not add repeated approval screens where the file is valid and no additional action is needed.

## Open decisions

The owner has been asked three focused questions: required base columns, duplicate-email handling for selected profiles, and whether selected-profile files include calendar assignments. Calendar identity reconciliation and the exact file representation still need specifying. Do not represent recommendations on those points as already approved.
