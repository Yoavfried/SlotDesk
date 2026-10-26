# SlotDesk 0.9.5

26 October 2026. Implements the accepted [trip plan](trips-0.9.5.md), live participant clocks and the selected extension icon. The owner still decides whether the resulting UX is ready.

## Delivered behavior

- Independent Trips manager from Manage profiles and each saved New meeting participant. Cog/flight actions share the existing icon language; narrow profile lists retain their accessible icon buttons.
- Date-first flight entry searches the profile's linked, selected calendars. One clear airport-route match prefills the flight; ambiguous matches need selection. Calendar times take priority over local estimates. Missing details use a bundled airport/city lookup and an editable arrival estimate.
- Ordered flights, connections and Flight back; Save/Discard owns the complete editor. Unsaved flight forms are never persisted as resumable drafts. Deleting a trip changes local SlotDesk configuration only.
- Flight intervals block meetings; connections block 30 minutes after arrival and before departure, leaving the middle available. Two-hour inconvenience buffers surround the first departure and final arrival.
- Arrival changes the effective timezone during a trip. Round trips retain the saved profile timezone afterward. A completed one-way trip updates it to the destination; later manual changes win. Reopening reconciles missed arrivals. Older flat flights and whole-day travel remain usable.
- Possible flight, changed flight and missing/cancelled/inaccessible source notices use Alerts. Detection creates no trip by itself. Saved flights remain until the user reviews a change. No automatic Calendar update/delete/move is introduced.
- Complete trip/link/history settings survive backups and selected-profile files. Receiving accounts still need their own calendar access; imports do not grant permissions.
- Participant local clocks update on minute boundaries and when the window becomes active, without replacing cards or fetching calendars. Install the selected C2 icon with bold brackets in the toolbar, extension list and page favicon.

## Estimate and matching limits

Airport data is bundled at a [pinned MIT-licensed revision](../design/airports-source.json). Lookups make no external request. The deterministic direct-flight estimate uses great-circle distance, 800 km/h plus 45 minutes, rounded up to five minutes with a 45-minute minimum. A city uses the mean coordinates of its listed airports and is labelled a city estimate. This is editable planning data, not a timetable, live status or a prediction of delays/winds. Separate connections need separate legs.

Calendar matching recognizes explicit airport routes and the profile's flight keywords. It never infers a destination from a timezone difference or silently chooses an airport for a profile timezone. Shared copies are deduplicated. A moved linked event continues to count at its new calendar time until the saved trip is reviewed.

## Review and boundaries

See [validation evidence](validation-0.9.5.json) and [testing](testing.md). Review covers trip lifecycle, timezone precedence, source changes, portable configuration, minute clocks, narrow layouts, keyboard access, escaped calendar text and existing meeting operations. Synthetic browser checks do not certify real Google delivery, every browser/OS, or manual screen-reader behavior.

The existing Calendar writer and hosted authentication/intake service are unchanged. Calendar requests still use the existing explicit confirmation boundaries. No new permission, remote script, account-registration field or hosting change is part of 0.9.5.

Next: **Outlook support**, then the [1.0.0 publication preparation](release-1.0.0-plan.md). This release does not make the repository public or claim an extension-store listing.
