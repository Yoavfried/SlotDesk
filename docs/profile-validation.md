# Profile editing and validation — 0.9.3.5

Updated 19 October 2026. This maps the current controls and validators; the individual advanced-setting UX remains for 0.9.4.

## Basic profile fields

| Field | Can ordinary input be invalid? | Current behavior |
| --- | --- | --- |
| Email | Yes: blank/malformed address, or another saved profile's email. This checks syntax and local uniqueness, not whether the mailbox exists. | Existing profile: restore its last saved email when leaving the field or closing, with an account-local bell alert explaining the restoration. New profile: show a field error and prevent creation until valid. Own-profile email is disabled and cannot change. |
| Name | Blank is supported; arbitrary text is allowed. | Use the email as the saved name when no name is given. |
| Timezone | Ordinary choices come from the closed searchable list. A missing choice is invalid; a fabricated/unsupported identifier is rejected by validation. | Require a valid timezone before creating/saving. |
| Availability calendars | The Add selector contains only selected workspace calendars and excludes already linked choices. Leaving it empty is supported. | A temporary empty choice does not create a mapping or an error. Leaving the profile with no mapping returns to the no-access state. |
| No-access and leave/holiday checkboxes | Boolean controls cannot contain malformed user text. | Checking no access removes mappings and hides the entire add/list area. Leave treatment applies only to the linked calendar. |

## Advanced fields that can accept invalid input

| Control/location | Invalid situation checked |
| --- | --- |
| Working days and hours → Define manually, each day's start/end | Missing/malformed clock value or start at/after end. A complete seven-day schedule is required internally, including kept values for nonworking days. |
| Preferred hours → Preferred from / Preferred through | Missing/malformed clock value or start at/after end. |
| Meeting rules → Minimum notice | Missing/nonfinite number, below 0 or above 720 hours. |
| Meeting rules → Time before and after meetings | Missing/nonfinite number, below 0 or above 720 minutes. Treatment must be one of the closed-list choices. |
| Available times → weekdays | No weekday selected or an unsupported weekday value. |
| Available times → timezone and times | Missing/invalid timezone/start, start at 24:00, or a window whose end is missing or not after its start. Exact-start rules do not require a window end. |
| Available times → optional first/last dates | Invalid date or first date after last date. Blank optional dates are supported. |
| Travel dates → first/last dates and destination | Invalid/missing dates, first after last, invalid timezone, or overlapping travel date ranges. |
| Add/edit flight → departure/arrival dates, clocks and zones | Missing/invalid field, nonexistent DST clock time, unchosen repeated-time occurrence, or arrival not after departure as actual instants. |
| Return flight | Return departure before the outbound arrival, in addition to the individual flight checks. |
| Leave / holiday exceptions → first/last dates | Invalid/missing date or first date after last date. |
| Event treatment → matching text | Unusually long generated event-matching expressions (over 10,000 characters) are rejected; malformed expressions in imported configuration are rejected. Normal entered phrases are escaped by the editor. |

Closed template, timezone, treatment and per-event dropdowns constrain normal input. Saved/imported configuration is also checked for unsupported values, duplicate calendar IDs and leave-calendar IDs that are not linked. These are validation defenses, not additional editable free-text fields.

Advanced errors remain specific inline errors and retain last saved configuration; no generic Not saved / Use saved values control remains. Storage, account-change and concurrent-edit errors are operational failures rather than invalid field values and remain visible when they occur. The email restoration is performed on leaving/closing, not while the user is partway through typing.

## Calendar removal boundary

Saving calendar selection, including during onboarding, removes calendar links outside that selection from profiles and guest profiles, including stored labels and leave-calendar associations. Other linked calendars remain. With no links left, the no-access checkbox is checked when that profile is opened. A temporary calendar-read/network failure does not erase mappings. Calendar events and Google sharing permissions are untouched. Portable-file imports continue to validate/flag unavailable references; the next explicit calendar-selection Save reconciles assignments to the chosen set.

## Saving boundary

Existing profiles continue saving valid changes live. New profiles use an explicit Create profile action; invalid email/timezone cannot be persisted as a new profile. Unchecking no access or opening Add calendar is temporary UI state until a calendar is chosen, with no resumable mapping draft. Own-profile onboarding retains Continue. Flights retain their independent Save/Discard boundary.

The same-version loading/profile hotfix removes routine Saving/Saved indicators. Validation errors and persistence failures remain visible. The actual cases that can prevent a profile change from being saved are:

- Invalid values or combinations in the tables above. Existing invalid/duplicate email edits are restored with an alert; other invalid settings retain their previous saved values and show the relevant field error.
- A conflicting edit in another SlotDesk window, a replaced/reset workspace or a workspace last saved by a newer build. The current window must resolve the conflict or reload the applicable setup.
- Local browser storage is unavailable, full or unreadable, or the browser cannot coordinate the write between windows. The editor keeps entered values and reports the failure; closing the profile retries and stays open if saving still fails.
- The connected account changes or disconnects while a save is queued. That edit is not written into a different account's workspace.
- An email change while an invitation or meeting change remains unconfirmed. Resolve that pending change first so the participant's identity remains consistent.
- The entire app window closes or the browser/device crashes before a queued write finishes. Typing is debounced by 450ms; field changes and normal profile-dialog closing flush the save, but a process interruption cannot guarantee the last edit was persisted.

An internet connection is not normally needed for these local profile/settings writes. Blank names use the email rather than failing validation. Closed-list choices and checkbox values do not create normal free-text validation errors.
