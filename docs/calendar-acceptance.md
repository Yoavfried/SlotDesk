# SlotDesk disposable-calendar acceptance kit

Prepared 12 October 2026 for SlotDesk 0.4.1; these instructions also apply to 0.4.2, 0.4.3, 0.5.0, 0.6.0, 0.6.1 and 0.7.0. This kit contains synthetic events and a local export comparator. It has no authentication or network code and does not edit or delete calendars.

## Local and live work

Codex can generate the fixtures, check scheduling, simulate failures, compare exported calendars and fix the application locally. A real Google calendar/import/permission/invitation check needs Google connectivity through the installed Chrome extension. Nina's workplace approval and controlled work-account pilot remain external requirements.

The kit contains busy-calendar.ics, reference.json and compare-calendars.mjs. The fixture covers 19 October–8 November 2026, using UTC timestamps, 1,004 dense busy entries and nine special event components. Recurring series expand into additional instances. It contains no attendees or conference requests. Do not add guests during import.

## Live setup in your regular Chrome browser

1. Use an approved personal/pilot Google account. Create a separate calendar named **SlotDesk disposable acceptance test**, with UTC as its timezone. Keep this test separate from primary/work calendars.
2. In Google Calendar Settings → Import & export, select busy-calendar.ics and explicitly choose the disposable calendar as the destination before importing. Google defaults to the primary calendar. [Google import instructions](https://support.google.com/calendar/answer/37118?hl=en).
3. Verify the import, then export only the disposable calendar. Extract its .ics file as **before.ics**. The baseline must come from Google after import because Google may normalize fields and expand/represent recurrences differently.
4. Open SlotDesk in Chrome and connect that account. On your own test profile, map only this disposable calendar, use Asia/Jerusalem as the profile timezone, and select the disposable calendar as the organizing calendar. Use custom search dates 19–20 October 2026, 45 minutes, and no last-resort override.
5. Check the known free window: **20 October 2026, 10:00–11:00 UTC** (the supplied note inside it is transparent). Confirm its local display against Google Calendar. Add **SD TEST BUSY** to protected-title rules if you want the dense entries strictly protected in fallback searches.
6. Review and create one test meeting in that window, initially inviting only your own approved test profile. Use a recognizable title such as **SlotDesk test invitation 01**. Verify its calendar, times and Meet outcome. Other recipients/optional status require consenting test participants agreed separately.
7. Export the disposable calendar again as **after.ics**. Compare the exports locally. Resolve every unexpected deletion, content/time/attendee/recurrence change, timezone change or unexpected addition before proceeding.

## Compare exports locally

Requires Node.js 18+. From the extracted kit folder:

```sh
node compare-calendars.mjs before.ics after.ics 1
```

The final number is how many reviewed new events you deliberately created. A passing result requires every original event/recurrence identity and its exported contents to remain unchanged, unchanged timezone definitions, and exactly that many additions. Exit code 1 means a comparison failed; exit code 2 means the inputs could not be safely compared.

The comparator ignores DTSTAMP, CREATED, LAST-MODIFIED and SEQUENCE metadata. It compares other exported event properties and nested components, including time, content, attendees, recurrence and alarms. It reports counts rather than printing private event text. Formatting/provider normalization can produce conservative failures that need inspection. This is evidence from two exports, not a proof about activity between them, unchanged calendars outside the export, missing exported fields, or all possible future code.

## Recorded acceptance progress — 12 October 2026

The project owner completed import, baseline export, the known-window search and one self-only creation in regular Chrome. Offline comparison of the two Google exports passed: 1,013 originals unchanged, zero removed/changed entries, unchanged timezone definitions and exactly one new event (1,014 total). The new event has the expected time, one own-profile attendee and a Meet link. The installed build was not separately confirmed. Raw exports and their receipts/report are private local evidence outside Git. Export comparison does not verify recipient delivery, RSVP or all runtime operations.

## Optional integrity analysis

This kit is a reproducible fixture and offline analysis tool, not a required user checklist. Google import does not establish invitation delivery or recipient responses. The comparator verifies creation-only before/after invariants; selected time changes need time-aware identity/content comparison instead. Provider timestamps, sequence and RSVP metadata must be assessed separately. Keep actual exports private and outside Git.

The current [validation record](testing.md) contains actual reported results. It does not mark unperformed checks as passed.

## Reproduce the kit

From the repository root:

```sh
node scripts/calendar-test/compare.test.mjs
node scripts/calendar-test/generate.mjs
```

Output: dist/SlotDesk-calendar-test/. Generating fixtures does not change the application version. The fixture uses the [iCalendar format](https://www.rfc-editor.org/rfc/rfc5545).
