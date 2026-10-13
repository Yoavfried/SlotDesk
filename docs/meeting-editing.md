# Edit an existing meeting

Available in **0.7.1** through Existing meetings → View details → Edit meeting. It works for ordinary timed/all-day meetings in a writable organizing calendar, including one selected recurring occurrence. Guest copies, locked events, calendar-managed event types and whole-series edits are excluded.

## Editable details

- Meeting title, location or another video URL as location text, and description.
- Add/remove guests, with Required/Optional status. Search saved profiles or enter an email to open the short profile form and confirm timezone. The organizer is included as a guest only if explicitly selected.

The dedicated Reschedule action changes time. Edit meeting keeps dates/times, the existing Google Meet link, attachments, reminders, organizer/calendar identity and other untouched event fields. Changing conference data, attachments, reminders, recurrence rules or the organizing calendar is outside this version. Existing descriptions are displayed as escaped text; untouched formatting is not resent.

## Review and save

The review shows before/after values for changed fields, explicitly names added/removed guests and role changes, and lists fresh guest-availability warnings. Known conflicts do not silently exclude people. Removed guests are no longer invited; Google may remove their invitation from their calendars. The organizing meeting remains, even if every guest is explicitly removed.

Select **Save changes & notify guests** to ask Google to apply the reviewed changes and notify guests. Notification delivery and RSVP propagation remain provider behavior. A changed warning pauses for another confirmation. Success shows Meeting updated. The other SlotDesk window refreshes only that target entry.

## Preservation and recovery

A fresh event read checks its account, calendar/event/occurrence identity, unchanged time, organizer permission and ETag. A conditional PATCH sends only changed scalar fields and, when explicitly edited, the rebuilt complete attendee array. Retained guests keep writable RSVP/comment/resource/additional-guest data. New guests start awaiting a response. Google read-only guest properties are not sent. See [event fields](https://developers.google.com/workspace/calendar/api/v3/reference/events) and [PATCH semantics](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch).

If the complete roster is omitted, expanding asynchronously or includes unsupported data, guest changes are disabled; title/location/description still work. No DELETE, cancellation, full event replacement or calendar-move operation is added. Creation, time changes and detail changes share one account write lock.

An uncertain response keeps the immutable reviewed intent locally. **Review unfinished change** checks the same ID; if the reviewed result is already present, it completes without another PATCH. A stale version requires fresh details instead of overwriting someone else’s changes. Pending data contains new user-authored text, guest deltas, target/version/time metadata and fingerprints, not the fetched original title/description or full guest metadata. See [privacy](security.md), [validation](testing.md) and [UX57–UX60](ux-decisions.md).
