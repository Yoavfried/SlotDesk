# 0.9.4.7 — advanced profile settings

Implemented following the owner's 22 October authorization to release the agreed work as **0.9.4.7**. The [decision record](advanced-profile-review-0.9.5.md) retains the full discussion. Travel/flight entry, scheduling, detection, settings and helper-text redesign remain pending owner review; existing travel functionality is retained. This release does not declare the wider UX ready.

| Area | Implemented behavior |
| --- | --- |
| Sections | Working days and hours, Convenience hours, Blockers, Notices and buffers, Travel & flights, Event detection, Manage meetings. Approved sections have separate accessible information controls. |
| Independent rules | Ignore working time removes its day/hour rules. Ignore convenience removes its usual range and penalties. Each preserves the other enabled rules and its saved values. |
| Overlaps | Saved and meeting-specific Allow overlaps ignore that person's nonprotected meeting conflicts, including warnings, ranking and follow-ups. Explicit Protect, Assign leave, saved flights, blockers, notice and independently configured buffers retain their force. Other people retain their own conflicts. Factual Existing meetings overlap labels remain. |
| Blockers | Named or unnamed one-off/recurring entries, dates, weekdays, all-day or clock times, optional recurring end date and overnight recurrence. All use the profile timezone. Add/edit ends with Save or Discard; saved bubbles edit on click or remove immediately with X. No Undo or persistent form draft. Past one-off dates cannot be newly assigned; completed entries leave the active list. |
| Event detection | New profiles start off. Existing profiles retain detection and custom legacy matching. Enabling reveals Leave, Flexible meetings and Protected time keyword bubbles. Add/Enter and X save live. Edited categories match whole words/phrases, ignoring case; an empty list disables that category. Existing airport-route handling remains pending the separate flight review. |
| Manage meetings | Reuses calendar/date/timezone filtering, cached reads, details, physical overlaps and 50-item expansion from Existing meetings, restricted to the profile's linked selected calendars. Default, Ignore, Protect and Assign leave affect this profile locally. Known recurrence offers This occurrence by default or Entire series. Last action wins; a later series action replaces earlier exceptions, and a later occurrence action changes only that instance. |
| Removed sections | Standalone timezone clues and separate leave exceptions. Ignore an actual leave entry in Manage meetings. New saved positive-availability rules are removed; existing rules and partial leave exceptions remain effective and portable rather than being silently deleted. |
| Compatibility | New fields persist locally, synchronize through the existing conflict handling, and travel in full backups/selected-profile files. Older files preserve legacy detection defaults and warn about missing optional columns. |

No Google OAuth scope, Calendar writer, hosted authentication or registration service changes. Profile operations read calendars and save local configuration; they do not update Google appointments. Existing create/edit/reschedule operations still require their own explicit review.

Validation is recorded in [testing](testing.md) and [the release evidence](validation-0.9.4.7.json). Automated and synthetic browser checks are separate from real account testing and the owner's UX approval.
