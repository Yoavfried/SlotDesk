# Trips and flights — 0.9.5 plan

Owner direction: **26 October 2026**. Target implementation: **0.9.5**. This planning record expands the remaining flight/travel work for that release and does not change the current **0.9.4.9** application, packages or calendar data. Wider UX approval remains with the owner.

A **trip is an ordered series of flights and timed timezone changes for one saved profile**. Flight intervals are meeting blockers. Destination stays determine the timezone used by scheduling. A trip can end with a flight back or stay open-ended.

## Accepted product direction

| Area | Owner direction |
| --- | --- |
| Manager | Travel & flights opens a separate profile-specific popup containing a list of Trips and an Add trip action. Remove Travel & flights from Edit profile’s advanced settings. This is a standalone manager, not another main-workspace tile. |
| New trip | Add trip opens a flight-sequence editor. Add flight starts with the departure date only, then searches calendars even when automatic event detection is unavailable/off. Ask only for missing details if no matching event supplies them; estimate an editable arrival from the confirmed route and departure time. |
| Calendar clues | No LLM. Use information exposed in accessible calendar events to prefill values when identifiable; the user can edit them. Do not require a calendar match to enter a flight manually. |
| Arrival and matching | Switch to the destination timezone on arrival. Auto-link one clear calendar match; require confirmation for uncertain or multiple matches. Calendar classification stays local to SlotDesk. |
| Connections | Add further flights to represent a journey with connections or additional destinations. Every saved flight contributes its own blocker interval and destination-timezone transition. At a connection, block 30 minutes after arrival and 30 minutes before the next departure. The remaining layover gap can be used for meetings under the other profile rules; do not block the whole layover. |
| Flight back | Offer Flight back to finish the trip. Its destination timezone is already known, so the user should not need to select it again. Exact home/origin semantics below are a recommendation, not an extra owner decision. |
| No return flight | Saving is allowed. At the last flight’s arrival, change the profile timezone to that destination. Warn that it stays there until manually changed or changed by later travel. Flight timezone changes during the trip do not change the timezone field shown in Edit profile. |
| Active-trip profile notice | While a trip is active before its final arrival, explain near the profile timezone that changes there will not override the active trip. Remove that notice after the last flight, whether the trip returns home or stays open-ended. Manual changes after the last arrival take priority. |
| Linked flight changes | If refreshing calendars finds changed flight details, alert the user and ask for confirmation before updating the saved trip. Keep confirmed/manual values until reviewed. |
| Saved trips | List saved trips, let the user revisit/edit them, and always allow deletion of a trip. Deletion must concern SlotDesk’s trip settings, never the underlying calendar appointment. |
| New meeting actions | For a saved participant, replace Edit profile’s text button with a cog icon and add a flight icon alongside it to open that person’s trip manager. |
| Manage profiles actions | Add a cog to Edit and a flight icon to the travel/trip action. Keep words beside icons where they fit; show icons alone in a very narrow panel, with accessible names and full labels on hover/focus. Retain the existing stacked action order unless revised. |

## Proposed flow for review

1. Open **Trips · [person]** from the person’s flight action. Show saved trip summaries and **Add trip**.
2. Add trip opens a focused form, with an optional trip name and its first flight.
3. Enter the departure date only. Search using the departure location’s local date, with the profile’s effective timezone or previous leg as the editable origin suggestion; do not assume the connected assistant’s timezone.
4. Search only that profile’s linked workspace calendars within a bounded window around that local date. Auto-link one clear flight match; ask the user to choose/confirm uncertain or multiple matches. An unavailable calendar does not erase entered information.
5. Prefill departure/arrival times, route and destination timezone only when the event supports them. For missing information, ask only for the departure time and departure/destination cities or airports that are still needed; prefill origin from the profile/previous leg for confirmation. Offer an editable estimated arrival. Show whether a value came from the calendar, was entered by the user or is an estimate. Never invent an exact departure time from the date alone.
6. Confirm the leg, then choose **Add flight** for another leg, **Flight back** for the final leg home, or finish without a return.
7. **Save** commits the complete trip. **Discard** abandons that trip edit. Follow the established rule: no persistent/resumable flight or trip form draft; exiting an incomplete add/edit form requires Save or Discard. Previously saved trips and unrelated live-saved profile settings remain intact.
8. Return to the trip list after saving/discarding. Show each saved trip’s route/date summary, return/open-ended status and edit/delete actions.

Recommended Flight back behavior: prefill the trip’s recorded origin timezone/location as its destination; departure comes from the previous destination. Use the same date-first calendar matching and missing-details/estimated-arrival flow. A return with connections can use Add flight for its intermediate legs, then Flight back for the final home leg. Do not assume home is Asia/Jerusalem or the connected assistant’s timezone.

### Example

Jerusalem → London → New York → Jerusalem:

- Add flight to London; arrival changes the effective timezone to London.
- Add flight to New York; arrival changes it again.
- Flight back preselects Jerusalem as the final destination.
- Without the last leg, New York remains effective after the final arrival until a later deliberate timezone change or trip transition.

## Accepted timing and matching decisions — 26 October

| ID | Question | Owner decision | Status |
| --- | --- | --- | --- |
| F95-01 | Require departure **and arrival** dates/times as initial manual fields? | No. Start with departure date only and try calendar identification first. If details remain missing, ask only for departure time and departure/destination cities or airports, then offer an editable estimated arrival. Do not require the user to type a known arrival manually. | Accepted, including the researched fallback follow-up |
| F95-02 | At what moment does the destination timezone take effect? | On arrival. The departure-to-arrival interval is blocked; the destination timezone applies from the instant of arrival. An estimated arrival remains identified as estimated. | Accepted |
| F95-03 | When can a manually entered flight be linked to a calendar event automatically? | Automatically link one clear match; ask the user to choose/confirm multiple or weak candidates. Classification is local to SlotDesk, never a Google event edit. | Accepted |
| F95-04 | Should connecting layovers be blocked in full? | No. Block 30 minutes after arrival and 30 minutes before the next departure; the remaining gap can be used for meetings if the other rules allow. | Accepted |
| F95-05 | Should changed linked calendar flight details update a trip automatically? | No. Alert and confirm before changing saved trip details. | Accepted |
| F95-06 | How do manual profile timezone changes interact with trips? | Active trip transitions take priority until the last arrival. Flight changes do not change the profile timezone field during the trip. A final non-return arrival changes that profile field; a return trip does not change it automatically. Manual changes after the last flight take priority. Show the active-trip notice only before the final arrival. | Accepted; remaining persistence/deletion edge cases listed below |

## Duration fallback research and proposed implementation

The owner approved asking only for missing departure time and route details, then estimating an editable arrival. **Timezone differences cannot determine flight duration.** A timezone covers many locations; it supplies clock-conversion rules, not a flight route. A date alone also cannot establish the flight’s starting instant. Do not silently choose a departure time, an airport or a representative city for a timezone.

Research checked on 26 October 2026:

| Source | Useful material | Limits and planned use |
| --- | --- | --- |
| [mwgg/Airports](https://github.com/mwgg/Airports) and its [MIT license](https://github.com/mwgg/Airports/blob/master/LICENSE) | Searchable airport codes/names/cities, coordinates and IANA timezone identifiers in a public JSON dataset. | Candidate for a bundled lookup with required attribution and a pinned dataset revision. It does not supply flight schedules or durations. Review data/update provenance before vendoring. |
| [OurAirports open data](https://ourairports.com/data/) | Public-domain airport coordinates and identifiers. | Alternative/reference source for route lookup. It does not provide a flight timetable or IANA timezone field in its airport CSV. |
| [geolib distance calculation](https://github.com/manuelbieh/geolib/blob/master/src/getDistance.ts) and [MIT license](https://github.com/manuelbieh/geolib/blob/master/LICENSE) | Great-circle distance from two coordinate pairs. | A reusable geographic building block, not a flight-duration prediction model. No library has been added by this planning update. |
| [American Airlines Flight-Engine](https://github.com/AmericanAirlines/Flight-Engine) and its [generator](https://github.com/AmericanAirlines/Flight-Engine/blob/main/src/Generator.ts) | Demonstrates converting route distance and aircraft speed into duration, then calculating destination-local arrival. | Explicitly generates mock flights, including randomness. It is not a source of real schedules or validated estimates; do not copy its random-duration behavior into SlotDesk. |
| [Cirium/FlightStats schedules API](https://developer.flightstats.com/api-docs/scheduledflights/v1) | Actual scheduled departure/arrival lookup by carrier, flight number and date. | Separate service integration requiring credentials/terms/coverage review. Not selected for 0.9.5 and not necessary for the local fallback. |

Recommended first implementation: bundle the route lookup and compute a deterministic direct-leg estimate locally from geographic distance, an explicit cruising-speed assumption and a takeoff/landing/ground allowance. No paid service or per-lookup API request is required for this approach. The formula parameters, rounding and representative short/medium/long route checks still need engineering calibration; research does not establish an accuracy guarantee. Winds, aircraft, route changes and delays remain unknown. Each connection is a separate leg, not part of a single guessed direct duration.

When calendar times are complete, retain them instead of replacing them with a geographic estimate. A date-only/all-day event is not complete flight timing. For missing values, obtain or confirm the actual route endpoints; city-level input may support a coarser estimate, while bare UTC/offset/IANA-zone input is insufficient. Allow the user to edit duration or arrival instead of accepting the estimate. Preserve the source of each saved value and recompute dependent estimates when its inputs change, without overwriting user-entered values after a delayed lookup.

Compute arrival as departure instant plus estimated elapsed duration, then display it in the destination timezone with the applicable DST/date-line conversion. An estimate may end on another date. The accepted arrival transition uses this saved estimated instant when the user accepts the estimate; it must not be described as an observed actual landing. Complete resolved departure/arrival instants are still necessary internally before saving the trip, although the user does not have to enter both.

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

Saving future travel must not immediately change the timezone used for today. Use a chronological timezone timeline for scheduling, with an active trip running from the first departure through the final arrival. The same instant must yield the same effective timezone after a restart or in another SlotDesk window.

Accepted precedence and profile display:

- During an active trip, saved flight transitions control the effective scheduling timezone. Editing the ordinary profile timezone does not override the trip before its final arrival.
- Flight-driven timezone changes are not reflected in the profile timezone field during the trip. Show a short notice beside that field only while the trip is active: proposed wording, “An active trip controls this person’s timezone until [date and time]. Changes here won’t apply during the trip.” Final wording remains for review.
- On a round trip, flights do not automatically change the saved profile timezone. Flight back retains its recorded destination; the original trip origin must not be rewritten by a later profile edit.
- On the last arrival of a trip without Flight back, update the saved profile timezone to that destination. The active-trip notice then disappears. This is the only flight-driven change to that field.
- A manual timezone change made after the final arrival takes priority, whether the trip had a return or not. A finished trip must not reassert its destination over that newer manual edit. A later trip still has its own timed transitions.

Implement the final non-return update using its effective arrival timestamp, not the time the browser next happens to open. Reconcile overdue changes deterministically when reading/saving state; do not require SlotDesk to have been open at landing. Do not overwrite a later manual change when reconciling, importing or synchronizing windows. This is an implementation approach, not a new requirement for a continuously running background timer.

Still settle whether a manual base-timezone edit saved during a round trip becomes the ordinary profile value after the trip finishes, and how edits/deletion of a completed one-way trip interact with an already-applied final profile change. The accepted rule is that such an edit cannot take priority over active flight transitions.

Record the trip origin/home timezone and its friendly location label. Do not silently reinterpret saved flight instants if a profile’s usual timezone later changes. Calendar/display timezone and destination timezone are separate concepts.

Recommended open-ended notice, with actual dates/place filled in:

> No return flight added. After [date and time], [name]’s profile timezone will change to [destination timezone]. Add a return flight or change their timezone in Edit profile if needed.

Wording is proposed for review; “after” will use the timing decision above.

## Entry-point audit and icon behavior

| Existing route | Proposed 0.9.5 treatment |
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

The timing/matching decisions, missing-details fallback, connection margins, calendar-change review and active-trip timezone precedence above are accepted. Additional details are not silently approved:

- **Flight buffers:** connections have accepted 30-minute hard margins. Settle how the existing two-hour inconvenience radius applies at trip departure/final arrival and whether it applies within connections, its configuration location and helper text. Flights stay independent of Ignore convenience/ordinary-overlap permissions.
- **Connection entry and stopovers:** finalize how the form identifies a connection versus a destination stay. The gap is not blocked in full. For arrival at 12:00 and next departure at 16:00, connection margins leave 12:30–15:30 available subject to the other rules. An insufficient gap leaves no meeting opening. Do not quietly block a multi-day stay.
- **Manual timezone persistence:** resolve base edits made during a round trip and completed-trip edits/deletion as described above; preserve the accepted trip-before-final/manual-after-final precedence and profile display rules.
- **Trip edits and deletion:** recompute only that trip’s derived blockers/timezone changes, preserve independent blockers and calendar events, and specify which prior manual/detected event classifications are restored. No Undo feature is implied.
- **Matched calendar changes:** changed flight details require an alert and confirmation before updating the saved trip. Finalize the review screen and cancelled/deleted/inaccessible-event cases while retaining saved values until review. Do not silently move a manually confirmed flight.
- **Matched flight display:** show that a calendar entry belongs to a saved flight/trip and avoid counting it twice. Preserve the existing boundary: ignoring a calendar copy does not erase the independently saved trip flight. The exact dropdown label and route back to Edit trip need review.
- **Automatic flight discovery:** matching an entered flight is approved direction; rules for discovering unentered flights, detection controls/defaults and how these become trips still need review.
- **Validation and estimation:** DST missing/repeated local times, date-line crossings, overlapping legs/trips, duplicate shared copies, missing arrival/destination information, incomplete calendar matches and unsupported routes. Chronology compares actual instants, not local clock order. Calibrate the local duration model and agree concise estimated-arrival wording; never imply actual schedule accuracy.
- **Migration/portable files:** preserve existing flat flights and date-based travel entries. Do not invent exact arrival times from whole-day legacy travel. Carry all new trip/timezone-link settings in full backups and selected-profile exports, preserving unavailable-calendar warnings and the existing import identity rules.
- **Settings/helper wording:** finish the independent manager’s notices, matching feedback, buffers, detection, timezone explanations and empty/error states with the owner.

## Implementation boundaries

Trip creation, editing, local flight classification and deletion affect the saved SlotDesk configuration. They are not instructions to create/delete/move a Google appointment. Actual calendar writes keep the existing explicit reviewed operations. Keep selected-calendar scope, independent profile rules, guest invitations, backups and cross-window consistency intact. No hosting change, email reader, LLM key flow, live flight status service or background lead collection is part of this plan.

When implemented, verify effective timezone before/during/after each leg and return; open-ended persistence/manual correction; connections and DST/date-line cases; flight conflicts/buffers and Ignore settings; matching absent/ambiguous/stale calendar data; migration/exports; keyboard and responsive icon-only states; and zero accidental calendar writes. Tests document coverage; only the owner approves the UX.
