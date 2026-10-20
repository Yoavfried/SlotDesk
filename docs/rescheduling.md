# Rescheduling and meeting follow-up

Accepted and implemented 13 October 2026 in **0.7.0**. The EA reviews every individual time change. A guest answering No, an overlap marker or a proposed alternative never moves an appointment automatically.

## Choose and review a new time

Open Existing meetings → View details → Reschedule meeting, or use Find another time in Meeting alerts. The app reads the latest organizer copy before opening the search. The existing duration is the starting point. Search the chosen dates, or enter exact start/end dates and times. The advanced timezone uses the closed list; outside-acceptable-hours choices require an explicit checkbox. Search retains the engine's 93-day bound, distinct from unrestricted Existing meetings browsing.

The invitation list comes from the original meeting, including guests who answered No and optional guests. The organizer is not silently added as an attendee. The organizing calendar is checked as an occupied resource if it is not already a required guest's mapped source. Existing profiles supply their confirmed timezones, working hours, positive availability, travel and event rules. Guests without a confirmed profile remain visibly unconfirmed; their timezone is not inferred from another guest or the organizer. A short profile action lets the EA confirm the missing timezone. Known accessible invitations can supply partial busy evidence without pretending to reveal the guest's entire calendar.

The target appointment alone is removed from availability calculations, including shared copies of the same occurrence. Neighboring recurring occurrences remain busy. Open options come first. Occupied options rank the number of distinct appointments requiring rescheduling first, then their disruption cost and affected people, followed by the existing comfort ranking. Optional guests never block a proposal.

Final review shows Current time and New time, calendar, organizer, retained guest responses and one expandable warning list. Copy new time supports manual coordination. Reschedule & notify guests is a separate explicit action. Fresh availability changes pause the operation for another review. All-day appointments use inclusive UI dates and Google's exclusive end date; they remain date-only. Their review checks busy/protected intervals, notice, manual blocks and positive constraints, without applying timed working-hour limits to a whole-day appointment.

## One appointment, one conditional change

The update targets the selected calendar and event ID. It sends only `start` and `end` through Google `events.patch`, with `sendUpdates=all`; title, descriptions, recipients, responses, location, reminders, attachments and conference fields are omitted. SlotDesk does not deliberately change them; Google controls RSVP and system metadata when applying invitation updates. There is no delete-and-recreate, calendar move or series-wide update. A recurring selection changes **only this occurrence**. The original occurrence identity remains bound to the review. [Google patch contract](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch), [recurring instances](https://developers.google.com/workspace/calendar/api/guides/recurringevents).

The app requires write access to the organizing copy. Read-only/guest copies offer suggestions to copy, with an explanation; locked or calendar-managed types (focus time, out of office, birthdays and working location) cannot be changed through this path. Ordinary timed and all-day meetings are supported. Every read/write validates the connected account. The final GET compares the event identity, previous times and version; PATCH uses `If-Match` and rejects a concurrent edit with HTTP 412. [Google resource versions](https://developers.google.com/workspace/calendar/api/guides/version-resources).

A shared send lock coordinates creation, rescheduling and detail/guest edits across SlotDesk windows. Before PATCH, the workspace lock verifies profile/constraint versions and reserves a validated time-only record. Ordinary saves cannot erase an unfinished change. A lost response is checked by reading the same appointment: if the reviewed new times are present, completion is confirmed without another PATCH. Otherwise the saved operation remains available for checking; the EA must not start a different change until it is resolved. A definitive version rejection requires refreshing the meeting's details. This is optimistic concurrency, not a lock on other calendar clients or an atomic transaction covering every attendee's calendar.

## Reschedule the other appointments

A collision proposal exposes Plan replacement times for the other appointments. Each action opens the actual conflicting event, reads its full accessible roster and protects the selected new meeting's interval during replacement search. It does not create a duplicate replacement invitation.

After a confirmed creation or reschedule introduces known collisions, Existing meetings lists Appointments to reschedule, with a matching bell alert that opens the list. Follow-ups do not appear on the main menu. A time change queues newly introduced or increased overlaps; pre-existing overlaps that stay the same or shrink remain visible warnings without generating new persisted work. Pending operations retain minimal collision IDs and intervals so this follow-up survives an uncertain response and reload. The active queue stores only calendar/event IDs, protected intervals and source appointment IDs; several new meetings affecting the same appointment combine their intervals. Each appointment needs its own review and confirmation. A successful replacement removes its follow-up; the EA may dismiss an item after coordinating elsewhere. Existing overlaps elsewhere in the calendar do not create this queue.

## Existing overlap labels

Existing meetings displays a red **Overlapping** label on busy meetings that intersect other busy entries in the currently displayed calendars, regardless of who created them. Overlap details lists the other meeting's title and its times in the selected display timezone. Touching endpoints, cancelled/free entries, birthday/working-location entries and the account's declined guest copies do not count. Busy-only calendars can show a generic Busy interval. Shared copies of the same invitation/occurrence at the same interval do not conflict with themselves. Long detail lists are disclosed in bounded groups. Hidden or unloaded calendars cannot establish additional conflicts.

## Guest answers No

The bell groups upcoming declined invitations by organizer-copy meeting, with names and Required/Optional context. Find another time opens the flow above. Dismiss suppresses the same observed No; an observed change away from No and then back to No can produce a new notice. Accepted replies, cancellations and ended meetings clear the relevant active notice. Confirming a reschedule acknowledges the old decline; it does not rewrite the guest's response.

Alerts update during normal calendar/contact/availability reads and explicit Refresh meetings. Calendar selection and display-timezone changes remain local cache operations. There is no polling, push service, operating-system notification or automatic rescheduling. Missing event access or an omitted guest list limits what can be observed. Only response/acknowledgement metadata, guest emails, occurrence identity and expiry are retained locally; fetched titles and descriptions stay in memory.

## Not implemented

**DF06: meeting search by name, participants, location or written content** is documented as a possible future feature. No meeting-search UI or content index is added now. Guest/content editing is available through the separate [Edit meeting](meeting-editing.md) action in 0.7.1. Whole-series edits, Outlook, background alerts and bulk automatic conflict resolution also remain outside this release.

See [testing](testing.md), [security/privacy](security.md), [UX decisions](ux-decisions.md) and [roadmap](roadmap.md). The owner reports successful live rescheduling, working No alerts and correct overlap details. Automated coverage and the scope of those reports are recorded in testing.

## Overlap alert actions — 0.9.4 hotfix

The bell explains how many existing appointments overlap the SlotDesk-created appointment and offers **Reschedule old appointment** and **Reschedule SlotDesk appointment**. A single known target opens its rescheduling review; several targets require an explicit choice. No appointment is changed by opening an action. Unavailable-calendar targets cannot be changed.

Confirmed creation, rescheduling and lost-response recovery attach the new appointment’s calendar/event IDs to each affected interval. Legacy follow-ups without that reference can be linked using successfully loaded organizing copies with a valid SlotDesk creation marker and exactly matching times. An unmarked or differently timed appointment is never guessed to be the source. Ambiguous matches stay separate choices; an unidentified source gets an explanation.

Successful calendar reads recheck both sides. A follow-up clears when the old or source appointment no longer overlaps, is canceled or is shown as free; disappearance requires complete coverage. Partial/unavailable reads retain unresolved work. Follow-up metadata contains no fetched appointment titles or descriptions.

The alert footer is **Last update:** followed by the latest successful alert-data scan time. It advances for successful calendar alert reads and pending-write confirmation checks; failed reads do not claim a fresh update. Opening the bell alone does not advance it.

## Accepted next UX — 0.9.5, not implemented

Agreed 20 October: replace the two general old/SlotDesk actions with **Review overlaps** per connected group of actual overlaps. Open a dedicated screen showing each appointment once, its name, date/time, calendar, actual overlap relationships and an individual **Reschedule** action. Keep unrelated groups separate; Back to alerts returns to the alert list. Handle one-to-one, one-to-many and many-to-many relationships without implying every appointment overlaps every other one. One change still requires its own review and confirmation; fresh data removes only resolved relationships. The [0.9.5 owner-review gate](roadmap.md#095--required-owner-reviews) remains in force.
