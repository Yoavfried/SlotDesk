# Trips and flights — 0.9.8 plan

Owner direction: **26 October 2026**. Target implementation: **0.9.8**. This planning record does not change the current **0.9.4.9** application, packages or calendar data. The owner moved the remaining flight/travel redesign out of the historical 0.9.5 plan. Wider UX approval remains with the owner.

A **trip is an ordered series of flights and timed timezone changes for one saved profile**. Flight intervals are meeting blockers. Destination stays determine the timezone used by scheduling. A trip can end with a flight back or stay open-ended.

## Accepted product direction

| Area | Owner direction |
| --- | --- |
| Manager | Travel & flights opens a separate profile-specific popup containing a list of Trips and an Add trip action. Remove Travel & flights from Edit profile’s advanced settings. This is a standalone manager, not another main-workspace tile. |
| New trip | Add trip opens a flight-sequence editor. Add flight starts with date/time, then the destination timezone. Try to find a matching calendar event in the background even when automatic event detection is unavailable/off. |
| Calendar clues | No LLM. Use information exposed in accessible calendar events to prefill values when identifiable; the user can edit them. Do not require a calendar match to enter a flight manually. |
| Connections | Add further flights to represent a journey with connections or additional destinations. Every saved flight contributes its own blocker interval and destination-timezone transition. |
| Flight back | Offer Flight back to finish the trip. Its destination timezone is already known, so the user should not need to select it again. Exact home/origin semantics below are a recommendation, not an extra owner decision. |
| No return flight | Saving is allowed. Warn that after the last entered flight the profile will continue using its destination timezone; the user must add a return flight or change the timezone manually in Edit profile if needed. |
| Saved trips | List saved trips, let the user revisit/edit them, and always allow deletion of a trip. Deletion must concern SlotDesk’s trip settings, never the underlying calendar appointment. |
| New meeting actions | For a saved participant, replace Edit profile’s text button with a cog icon and add a flight icon alongside it to open that person’s trip manager. |
| Manage profiles actions | Add a cog to Edit and a flight icon to the travel/trip action. Keep words beside icons where they fit; show icons alone in a very narrow panel, with accessible names and full labels on hover/focus. Retain the existing stacked action order unless revised. |

## Proposed flow for review

1. Open **Trips · [person]** from the person’s flight action. Show saved trip summaries and **Add trip**.
2. Add trip opens a focused form, with an optional trip name and its first flight.
3. Enter departure date/time. Prefill its timezone from the profile’s effective timezone at that point, or from the previous leg for a connection.
4. Search only that profile’s linked workspace calendars around the entered time. Show a bounded matching/loading result inline; an unavailable calendar does not erase the manually entered flight.
5. Prefill matching arrival/date/time and a destination timezone only when the available information supports them. Keep every inferred field editable. Show where a prefill came from.
6. Confirm the leg, then choose **Add flight** for another leg, **Flight back** for the final leg home, or finish without a return.
7. **Save** commits the complete trip. **Discard** abandons that trip edit. Follow the established rule: no persistent/resumable flight or trip form draft; exiting an incomplete add/edit form requires Save or Discard. Previously saved trips and unrelated live-saved profile settings remain intact.
8. Return to the trip list after saving/discarding. Show each saved trip’s route/date summary, return/open-ended status and edit/delete actions.

Recommended Flight back behavior: prefill the trip’s recorded origin timezone as its destination; departure comes from the previous destination. The user still supplies departure/arrival dates and times. A return with connections can use Add flight for its intermediate legs, then Flight back for the final home leg. Do not assume home is Asia/Jerusalem or the connected assistant’s timezone.

### Example

Jerusalem → London → New York → Jerusalem:

- Add flight to London; arrival changes the effective timezone to London if arrival-based transitions are approved.
- Add flight to New York; arrival changes it again.
- Flight back preselects Jerusalem as the final destination.
- Without the last leg, New York remains effective after the final arrival until a later deliberate timezone change or trip transition.

## Three timing/matching decisions currently asked

| ID | Question | Recommendation | Status |
| --- | --- | --- | --- |
| F98-01 | Require departure **and arrival** dates/times per leg, prefilling from a calendar match when available? | Yes. A start alone cannot establish the blocker’s end or a reliable destination transition. Require both increasing real instants before saving. | Awaiting owner answer |
| F98-02 | At what moment does the destination timezone take effect? | On arrival. The departure-to-arrival interval is blocked; the destination timezone applies from the instant of arrival. | Awaiting owner answer |
| F98-03 | When can a manually entered flight be linked to a calendar event automatically? | Automatically link one clear match; ask the user to choose for multiple/weak candidates. Classification is local to SlotDesk, never a Google event edit. | Awaiting owner answer |

## Calendar matching and timezone evidence

This manual-entry matching is independent of the general Event detection switch: entering a flight is already an explicit user action. Automatic discovery of flights the user has not entered is a separate part of this review.

Use stable event/calendar/occurrence identifiers and bounded reads. Date/time agreement narrows candidates but is not sufficient by itself to classify an ordinary meeting as a flight. Route/airport/city text, recognizable flight identifiers and available event fields may provide deterministic corroboration. Match no arbitrary event merely because it starts at the same time. With no clear match, retain the manual entry without an event link. Multiple matches must not silently pick the first result. Deduplicate shared copies of one event.

[Google’s event resource](https://developers.google.com/workspace/calendar/api/v3/reference/events) exposes title, description, location, start/end and optional IANA timezones. Its documented event types do not include a dedicated flight type; `fromGmail` identifies an event imported from Gmail, not a guaranteed flight. Consequently, “assign as flight” is SlotDesk classification, and inferring a destination from an event’s formatting timezone alone is not justified. Readable descriptions are treated as data; no scripts or instructions in event text are executed.

Suggested timezone evidence order:

1. An explicit, unambiguous destination airport or city in a clear route/location, resolved using a licensed deterministic lookup.
2. An explicit IANA timezone clearly associated with the destination in the event’s information.
3. Otherwise ask the user using the existing searchable timezone control.

Do not treat the calendar’s default timezone or `fromGmail` alone as destination evidence. Never overwrite a field the user already edited when a delayed calendar lookup completes. Dataset choice, ambiguous airport/city names, explicit confirmation display and confidence thresholds remain implementation/planning work; no LLM or live-flight API is implied.

## Effective timezone and manual correction

Saving future travel must not immediately change the timezone used for today. Use a chronological timezone history/timeline for scheduling, not a timer that rewrites the permanent profile field whenever SlotDesk happens to be open. The same instant must yield the same effective timezone after a restart or in another SlotDesk window.

Important edge case: changing the profile timezone manually after an open-ended trip must actually work. Merely changing a base timezone while an indefinite trip continues to override it would violate the owner’s request. Recommendation: record a deliberate timezone change effective from that edit, ending the previous open-ended destination effect while retaining its flight history. Decide how that manual change interacts with later already-saved legs and return destinations before implementation.

The origin/home timezone should be recorded for the trip, with its friendly location label. Do not silently reinterpret saved flight instants if a profile’s usual timezone later changes. Calendar/display timezone and destination timezone are separate concepts.

Recommended open-ended notice, with actual dates/place filled in:

> No return flight added. After [date and time], [name] will use [destination timezone]. Add a return flight or change their timezone in Edit profile if needed.

Wording is proposed for review; “after” will use the timing decision above.

## Entry-point audit and icon behavior

| Existing route | Proposed 0.9.8 treatment |
| --- | --- |
| Manage profiles → Edit | Cog + Edit text; icon-only at narrow width. Opens the ordinary profile editor. |
| Manage profiles → Travel & flights | Independent trip-list popup, rather than `openProfile(..., 'travel')`. Flight icon + action text, icon-only when narrow. |
| New meeting → saved participant → Edit profile | Cog icon, alongside a flight icon for that same profile’s trips. Neither removes/reorders the participant or discards the meeting draft. |
| New meeting → email-only guest → Create profile | Retain the distinct Create profile action. Recommendation: expose saved-trip management once a persistent profile exists; do not turn Create profile into an Edit cog. |
| Onboarding → own profile / suggested people | Continue the current setup/create flow. Do not add a new compulsory trip step. |
| Rescheduling → missing guest → Create profile | This is another current profile-form entry point. Retain creating/returning to the reschedule flow. Do not silently add a new trip requirement. |
| Sync-conflict recovery | Can reopen the existing profile form programmatically. Preserve the prior context; do not route it to trips automatically. |

Use the existing drawn SVG icon language, sentence case, minimum usable button targets, keyboard focus and hover/focus labels such as “Edit profile for [name]” / “Trips for [name]”. Icon-only actions must remain distinguishable from the calendar-coverage icon. The user’s icon proposal choice for the extension itself remains unrelated and unimplemented.

## Remaining behavior to settle before implementation

The three primary decisions above are pending. Additional details are not silently approved:

- **Flight buffers:** retain/revise the existing two-hour inconvenience radius around departure/arrival, its configuration location and helper text. Flights stay independent of Ignore convenience/ordinary-overlap permissions.
- **Connections and stopovers:** whether layover gaps themselves are blocked or only flight intervals plus configured buffers; how an overnight/long stopover differs from a connection. Do not quietly block an entire multi-day destination stay.
- **Manual timezone correction:** exact interaction between an open-ended trip, a later Edit profile change, another trip and an already planned return.
- **Trip edits and deletion:** recompute only that trip’s derived blockers/timezone changes, preserve independent blockers and calendar events, and specify which prior manual/detected event classifications are restored. No Undo feature is implied.
- **Matched calendar changes:** whether changed/cancelled/deleted/inaccessible linked events update the trip after confirmation or produce a review notice while retaining the user’s saved values. Do not silently move a manually confirmed flight.
- **Matched flight display:** show that a calendar entry belongs to a saved flight/trip and avoid counting it twice. Preserve the existing boundary: ignoring a calendar copy does not erase the independently saved trip flight. The exact dropdown label and route back to Edit trip need review.
- **Automatic flight discovery:** matching an entered flight is approved direction; rules for discovering unentered flights, detection controls/defaults and how these become trips still need review.
- **Validation:** DST missing/repeated local times, date-line crossings, overlapping legs/trips, duplicate shared copies and missing arrival/destination information. Chronology compares actual instants, not local clock order.
- **Migration/portable files:** preserve existing flat flights and date-based travel entries. Do not invent exact arrival times from whole-day legacy travel. Carry all new trip/timezone-link settings in full backups and selected-profile exports, preserving unavailable-calendar warnings and the existing import identity rules.
- **Settings/helper wording:** finish the independent manager’s notices, matching feedback, buffers, detection, timezone explanations and empty/error states with the owner.

## Implementation boundaries

Trip creation, editing, local flight classification and deletion affect the saved SlotDesk configuration. They are not instructions to create/delete/move a Google appointment. Actual calendar writes keep the existing explicit reviewed operations. Keep selected-calendar scope, independent profile rules, guest invitations, backups and cross-window consistency intact. No hosting change, email reader, LLM key flow, live flight status service or background lead collection is part of this plan.

When implemented, verify effective timezone before/during/after each leg and return; open-ended persistence/manual correction; connections and DST/date-line cases; flight conflicts/buffers and Ignore settings; matching absent/ambiguous/stale calendar data; migration/exports; keyboard and responsive icon-only states; and zero accidental calendar writes. Tests document coverage; only the owner approves the UX.
