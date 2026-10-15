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

Every exported person includes ALL of that person's saved settings, not only identity fields. This includes timezone, template/manual working schedules, usual convenience settings, ignore flags, overlap defaults, minimum notice, meeting buffers, positive availability, protected/inconvenient rules, travel, exact flights, holiday/leave exceptions, event classification and individual-event treatment. Calendar assignments are included. Flag assignments unavailable to the receiving account; retain the references without implying access or complete availability.

Workspace-wide preferences belong to the complete-setup backup. Importing a selected person does not reset the rest of the recipient's SlotDesk setup. Unselected existing people remain unchanged. Match existing people by normalized email. After one overwrite warning, replace each matching profile with the imported profile settings; leave unrelated profiles unchanged. Missing optional imported fields use importer defaults rather than retaining the previous profile values.

## Compatibility by named fields/columns

The importer scans the provided headers/fields and recognizes the names supported by its own version. It must not depend on fixed column positions. Reordering columns should work.

- Recognized columns: validate and import their values.
- Columns unknown to that SlotDesk version: ignore them. Do not reject a file merely because it includes settings from a newer version.
- Missing optional setting columns: alert the user and use that importing version's defaults for those fields. Do not carry over the old local values instead of the specified defaults.
- Missing base columns: fail the import with a clear message and leave current local data unchanged.

The required base columns are email and timezone. Name is optional: if its column or value is missing/blank, use the normalized email as the display name. Missing optional setting columns produce the agreed warning/default behavior; missing or invalid email/timezone stops the import without applying changes. Column names and meanings need a stable export contract; renamed fields require an explicit alias/migration. Nested arrays/rules must round-trip completely rather than being shortened into a summary or lost during export.

Example: a file contains an overlap preference that an older importer does not recognize. The older importer ignores that column and reads its known columns. If a newer importer reads an older file without a meeting-buffer column, it warns and applies its default for that field. Missing a required identity column stops the import.

The compatibility rule applies to supported configuration fields in a full backup as well. A backup version marker alone is not a reason to refuse an otherwise readable file.

## Calendar assignments versus Google calendar sharing

Google sharing controls who can read or write a calendar. SlotDesk assignments tell the scheduling engine which calendar(s) to check for a saved person. These are different settings. A SlotDesk file must never change Google calendar sharing, subscribe the account to a calendar, copy calendar contents or create/modify/delete appointments.

For example, assigning Nina's profile to her work and travel calendars is a SlotDesk configuration. Another assistant may already have Google access to those same calendars, in which case portable assignments can save setup. If access is absent, an imported assignment cannot provide it. [Google sharing and access roles](https://developers.google.com/workspace/calendar/api/concepts/sharing).

Complete backups include calendar configuration under the owner's replacement requirement. Selected-person files also include assignment references with all other person settings. Validate current access and flag unavailable calendars. An accessible calendar excluded from the recipient's workspace selection remains inactive until the recipient chooses it in Settings; importing a person does not silently expand the global selection.

## Actual restore/import problems and recommended handling

| Situation | Recommended handling |
| --- | --- |
| Saved default calendar is missing or unavailable | Explain which calendar cannot be used; leave creation unavailable until the user chooses a suitable default. Do not silently choose another calendar. |
| Saved default calendar is now read-only | Explain that it cannot receive invitations; allow supported browsing/availability while a writable default is chosen. |
| Some selected workspace calendars are inaccessible | List the affected calendars and explain that their events cannot be loaded or used. Do not report full availability from them. |
| A person's assigned calendar is unavailable | Keep the included unresolved reference visible; flag it, mark availability unconfirmed and offer reassignment. Do not guess another source from its name. |
| The backup identifies another person as the owner | Explain the identity mismatch and ask the recipient to identify/setup their own profile while retaining the imported people as appropriate. The exact identity-reconciliation flow needs definition. |
| File has unknown optional columns | Ignore them and import supported columns. This is not an import failure. |
| File lacks optional columns | State which settings use defaults; apply importing-version defaults. |
| File lacks required columns or has invalid required data | Stop without changing saved data; identify the problem. |
| Selected-profile email already exists | Show one overwrite warning, then replace the matching profile with its imported settings. Leave unrelated profiles untouched. |
| A calendar write is unfinished | Preserve/check the original operation before any destructive local replacement; do not copy an operation to another account or erase its only recovery record. |
| Another SlotDesk window changes local data during import | Revalidate the final operation against current saved state; do not merge a full replacement into old data or allow an old window to resurrect removed settings. |

A complete setup backup concerns portable configuration. Google credentials and in-flight calendar-operation/account-registration records are operational state, not portable preferences; define their handling explicitly before implementation so another account's operation or updates choice cannot be replayed.

## No mandatory general preview

The owner questioned the proposed preview requirement. Do not require a full field-by-field preview or merge screen.

- Full restore: choose the file, validate it, show the replacement warning and any actual compatibility/access issues, then confirm replacement.
- Selected profiles: choose the file, select people with Select all, show actual missing-field/access/duplicate messages, then import.

A selection list and a destructive replacement confirmation are not an extra general preview stage. Do not add repeated approval screens where the file is valid and no additional action is needed.

## Confirmed import policies

The owner answered all three questions on 15 October 2026:

- Require email and timezone; use email when name is missing.
- Replace matching-email profiles after one overwrite warning.
- Include calendar assignments and flag unavailable calendars.

These choices are settled. The following audit identifies the remaining user-facing choices and the implementation details that can be handled without another product decision. Implementation remains planned.

## Completion audit — remaining product choices

Three focused questions were presented to the owner after the confirmed import policies:

| Choice | Recommended behavior | Status |
| --- | --- | --- |
| Own profile after cross-account full restore | Match an imported person's email to the connected Google account. If no match exists, ask the user to set up their own profile. Retain all other imported people, including the backup author; do not preserve old local profiles outside the replacement. | Awaiting answer |
| Unsent meeting drafts in a full backup | Back up configuration only. A full restore clears the current unsent draft and does not import the source's draft. Already-sent uncertain calendar operations are never portable and must be resolved before applying import/restore. | Awaiting answer on unsent-draft scope |
| Recovery after choosing an unwanted backup | Offer optional Download current backup before replacement; do not keep a hidden previous setup. Alternative presented: one previous setup retained locally for Undo restore. | Awaiting answer |

Do not reopen the required email/timezone, missing-name fallback, duplicate replacement or included calendar-assignment decisions. Once these three choices are answered, the backup/import product contract is ready for implementation; later code discoveries should be handled against the contract, escalating only a material new user-visible tradeoff.

## Implementation decisions and edge-case defaults

These details do not require the owner to choose parsing algorithms or internal storage design:

- Use local, versioned JSON files with distinct complete-backup/profile-file type markers. Represent the exported people as named columns and rows; nested rule/schedule/travel values remain complete JSON values. This implements the requested named-column compatibility without flattening away complex settings. Include creating app version and export time as metadata; do not reject otherwise readable data solely on that version.
- Keep a stable public column name for timezone even though the current internal property is `tz`. Email normalization and missing-name fallback apply consistently before duplicate matching. Never depend on property/column order or copy imported internal revisions into the receiving workspace.
- Selected-person export includes person-specific protected/inconvenient constraints even where the current application stores them outside the profile object. Rebind their person references on import. Workspace-wide Everyone constraints belong to the full backup, rather than silently becoming rules for unrelated people during a selected-person import.
- Preserve every supported saved schedule/rule field, including the inactive manual/template schedule and existing dated travel/history of rules. Do not silently discard past-dated configuration or replace it with a summary. Future unsupported columns are ignored under the confirmed compatibility rule.
- Missing optional fields use importing-version defaults. A present but malformed supported value is a validation error, rather than a reason to silently discard a protected-time or availability rule. Identify the person/field and leave current data unchanged.
- For selected-person import, validate the selected rows before applying any changes. An invalid selected row prevents that application of the import. Unselected rows are not imported. Missing required headers, ambiguous duplicate headers or conflicting duplicate-email rows must receive a clear error rather than arbitrary last-row wins.
- Collect compatibility/default/access messages into one readable summary, rather than a popup per field/person. Matching-email replacements use the already agreed single overwrite warning for the import batch. No field-by-field preview is required.
- Validate current calendar metadata/access where possible without reading or changing appointments. Preserve unmatched calendar references as inactive/unconfirmed; never substitute another calendar by its name. A temporarily failed access check means Not checked yet, not Calendar deleted or No access.
- If live access checks are temporarily unavailable, allow valid local configuration to be restored with pending calendar verification. Subsequent calendar use still requires normal fresh permission/scope checks; an unverified default cannot authorize sending. Restoring local data never grants Google permissions or makes network writes.
- Apply replacement/import to the explicit receiving account under the shared workspace lock. Recheck account, revision and outstanding calendar operations before saving. Account switching or concurrent changes must not redirect a pending import into another account.
- Stage and validate the candidate before replacing saved data. A failed save must preserve the prior setup. Handle interrupted persistence of workspace and browser display preferences consistently; do not leave a half-restored setup. Other windows must invalidate old cached proposals/drafts as appropriate rather than merging deleted records back into a full replacement.
- Complete backups include theme, clock and date preferences. These are currently browser-wide, so restoring them affects display in other SlotDesk windows too; it does not replace those other accounts' saved profiles.
- Keep the receiving Google sign-in and actual account registration state with that account. Do not replay another person's queued lead record or update permission from a configuration file. In-flight writes cannot be transferred to another account. The draft-scope question above does not change this boundary.
- A corrupt existing local workspace can be recovered from a valid backup through the existing saved-data recovery entry point. Preserve the original until replacement is explicitly confirmed and successfully saved; retain the existing warning/check for potentially unfinished calendar actions when their state cannot be read.
- Full restore should be reachable during initial setup after identifying the receiving account, so a user need not manually recreate all profiles first. Selected-person import belongs in Manage profiles and can be linked from Settings. Routine future screen organization is defined in the broader usability review.

## Local verification before shipping

Use synthetic files and calendars for full replacement, selected-profile round trips, all profile fields and person-specific constraints, reordered/unknown/missing columns, malformed values, both duplicate types, current-user identity reconciliation, unavailable/read-only/excluded sources, offline verification, cross-account use, unsent-draft policy, pending-write refusal, concurrent windows and interrupted/failed saves. Compare mocked calendar transports before/after to establish zero calendar mutations from import/restore. Verify keyboard-only selection, Select all, confirmation, warnings and error recovery. Do not add another real-calendar checklist for the owner.
