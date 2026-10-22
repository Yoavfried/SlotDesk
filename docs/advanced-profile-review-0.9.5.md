# Advanced profile settings — 0.9.5 owner review

Updated **22 October 2026**. This is an accepted-direction and remaining-review record, not a released implementation. Current runtime/downloads remain **0.9.4.6**. The owner has started the required advanced-profile review and answered the three questions below. Travel/flight review and the explicitly proposed details remain open. Do not declare 0.9.5 ready or publish it before the owner completes the review and authorizes implementation/release.

## Section order and wording

| Order | Section | Direction |
| --- | --- | --- |
| 1 | Working days and hours | Move before all other advanced categories. Preserve template/manual schedules. Ignore working days and hours removes that person's working schedule from eligibility, ranking, explanations and warnings. |
| 2 | Convenience hours | Rename Preferred hours; use sentence case. Remove the ranking-only explanatory paragraph. Ignore usual convenience hours removes that person's usual-hour limits, penalties and warnings. Other independently enabled rules still apply. |
| 3 | Notices and buffers | Rename Meeting rules. Remove the paragraph beginning Overlaps are disclosed before sending. Keep minimum notice and configured meeting buffers here; move the general Allow overlaps setting to Manage meetings. |
| 4 | Travel & flights | Review and fix in this same update, together with other flight-related behavior. The owner has put this section aside temporarily; its review is not complete. |
| 5 | Holiday exceptions | Replace Leave / holiday exceptions. Choose actual leave/holiday entries for this profile instead of creating free-standing manually entered date exceptions. |
| 6 | Event detection | Replace Event treatment. Master checkbox: Detect special events in calendar. When off, show only the checkbox; when on, reveal clearer matching fields with their default values. |
| 7 | Manage meetings | Include the saved general Allow overlaps setting, followed by the compact profile-specific calendar browser and Default / Ignore / Protect choices. |

Remove the two exact explanatory paragraphs specified by the owner. Keep the existing live-saving model and separate basic Availability calendars / More settings expandables. Saved values remain available when an Ignore or detection checkbox is toggled back; disabling a rule must actually bypass it, not merely hide inputs.

## Category information icons — owner-approved wording

Place a small outlined information icon to the right of each advanced-section subheader. Show the same short explanation on hover, keyboard focus or tap; interacting with the icon must not accidentally toggle the section. Keep ordinary headings and tooltip text in sentence case.

The owner accepted the earlier Working days and hours, Holiday exceptions and Manage meetings drafts. The following incorporates their revised text with minor grammar fixes (time range for radius; Use for User). These are category explanations, not replacements for individual control labels.

| Category | Tooltip |
| --- | --- |
| Working days and hours | Set this person's usual work schedule and whether SlotDesk should consider it. |
| Convenience hours | Set a time range when this person may not be working but could still consider attending meetings. |
| Notices and buffers | Require enough advance notice for meetings and set buffers around them. |
| Travel & flights | Wording remains unfinished; review and fix this tooltip with the rest of the travel/flight experience in 0.9.5. Do not treat the earlier draft as approved. |
| Holiday exceptions | Choose which holidays or days off SlotDesk should disregard for this person. |
| Event detection | Use keywords in calendar event titles to detect holidays, flexible meetings, flights and protected times. |
| Manage meetings | Control how individual calendar meetings affect this person's availability. |

The general overlap checkbox moves from Notices and buffers to Manage meetings. Its accepted full-ignore semantics and saved-default/per-meeting-override behavior remain unchanged. Place the general control above the individual-meeting browser so it is distinguished from each occurrence's Default / Ignore / Protect choice.

## Overlaps — accepted semantics

The owner explicitly confirmed: **Protect and saved flights still block; ignore other overlaps** when Allow overlaps is enabled for that person. This changes the former permission-to-show-warned-overlaps behavior.

- Exclude that person's nonprotected meeting overlaps from candidate rejection, availability failure, ranking cost, affected-meeting counts, warnings, review confirmation and rescheduling follow-ups. Do not just hide a warning while continuing to penalize the candidate.
- Explicit per-event Protect and separately saved flights remain hard blocks. A title-based guess alone must not bypass the accepted ignore-other-overlaps rule.
- A physical overlap ignored for person A can still matter for person B. Shared event identity must not erase B's independent conflict or protection. Retain per-profile provenance before deduplicating genuinely actionable conflicts.
- This does not remove another participant, their invite, their own independent rules or accurate calendar-coverage status. It does not move, cancel, delete or reschedule the original appointment.
- Saved profile defaults and the existing per-meeting override use the same semantics. Turning an override off restores the active meeting conflicts for that person in that search.
- Explicit manually blocked periods, configured meeting radii, flight buffers and notice remain independent controls. Ignore an individual meeting removes its derived radius as well; simply allowing overlaps does not turn off a separately configured radius. Review any ambiguous combined case visibly before implementation rather than inventing an exception.
- Ensure ignored conflicts do not reappear in immediate post-booking scheduling alerts/follow-ups. The owner explicitly confirmed that factual Overlapping labels and their actual-intersection details remain in Existing meetings, even when the saved profile preference or a per-meeting override ignores those overlaps for scheduling. Keep these factual labels distinct from warnings, ranking and automatic rescheduling follow-ups.

## Independent working and convenience rules

Each checkbox removes its corresponding rule completely. Current source combines usual working-time and convenience penalties in places; the implementation must separate them.

| Ignore working days and hours | Ignore usual convenience hours | Rules still used |
| --- | --- | --- |
| Off | Off | Working schedule and convenience hours. |
| On | Off | Convenience hours, across all days; no working-day/hour penalty, exclusion or warning. |
| Off | On | Working schedule; no convenience-hour exclusion, penalty or warning. Do not accidentally suppress the working schedule because convenience is ignored. |
| On | On | Neither usual schedule; independent flights, explicit time rules, protection, notice and configured radii retain their settings. |

Ignoring one rule must remove it from all candidate selection and fallback classifications, not just the participant's visible status. Keep other participants' active rules. No warning may be synthesized from a rule the user chose to ignore.

## Timezone clues to confirm — removal accepted

The owner confirmed removal of this standalone advanced section after reviewing its use case. Keep the main searchable timezone selector. The old helper used manually typed text, calendar timezone and already loaded event title/location clues to offer a suggestion for confirmation; this was redundant with city search for known locations and did not reliably establish the person's usual location. Travel-specific clues remain part of the pending Travel & flights review.

## Availability and recurring profile blockers — direction reopened

Earlier in this review the owner agreed to remove new recurring Available times from saved settings while retaining explicit positive availability for individual meetings. They have now questioned the meeting-specific use case and proposed **constant blockers per profile** instead. Do not implement a new positive per-meeting availability form as an already settled 0.9.5 requirement.

The current direction to develop is recurring profile blocks, for example Every Tuesday, 13:00–14:00, with their timezone, scheduling effect and editor still to be reviewed. This is a saved-profile rule, distinct from working/convenience hours and existing one-off meeting exclusions. The owner has not yet approved a new blocker form, field set or section placement.

Previously saved positive availability rules must remain visible and effective until deliberately removed or explicitly migrated. Do not silently erase them, reinterpret them as negative blockers, or lose them through upgrade, export/import or restore. Existing temporary meeting/person time rules remain available; the new positive meeting-only form is under reconsideration.

## Holiday exceptions — calendar-backed selection

Accepted direction: show existing leave/holiday entries for the profile and let the user choose which to disregard. Read only the person's linked calendars that are selected for SlotDesk. Explain missing access or partial loading; a failed/empty read must not fabricate dates or imply that no leave exists.

Data can come from Google out-of-office entries, a linked calendar explicitly marked as leave/holidays, enabled leave-title detection, and supported existing per-event leave overrides. An ordinary all-day note is not automatically a day off. Detection being off must not erase explicit Google metadata or the user's leave-calendar assignment.

Proposed compact flow, to refine with the owner:

1. Choose a date range, load/refresh that person's leave entries, then show title, actual dates and calendar.
2. Choose the leave/holiday to ignore; show existing exceptions in the same list so they can be restored.
3. Preserve the earlier accepted per-day/part-of-leave use case by offering dates within the selected entry, defaulting to the whole entry. This replaces unrelated free-text date entry, not the ability to ignore only part of a long leave.

Scope exceptions to the selected entry/occurrence and person so another event on the same dates remains effective. Deduplicate the same occurrence across calendars. Existing date-only exceptions need a deliberate migration/display rule; preserve them until resolved, without applying them to unrelated appointments. Explicit Protect and a saved flight do not become ignored merely because they share the chosen holiday date.

## Event detection — accepted control and proposed clearer fields

Master checkbox: **Detect special events in calendar**. New profiles start **off**. Existing profiles retain their current effective behavior on upgrade; stored custom matching terms remain intact. Off hides all matching fields and bypasses title/airport-route guesses in both adaptation and scheduling. It must not merely hide the editor while default regexes continue to run.

When enabled, show existing defaults/custom values with clearer labels. Proposed wording:

| Field | Matches |
| --- | --- |
| Protected events | Titles matching the protected-word list. |
| Flexible meetings | Titles matching hold/tentative/focus/preparation phrases. |
| Holidays and leave | Matching leave/holiday titles in the appropriate all-day-event context. |
| Detect airport routes | Recognized routes such as TLV > JFK. |

Remove Edit the starting rules or override any individual event below. Use comma-separated words or phrases. Keep concise field-specific guidance only where its input format would otherwise be unclear. Empty lists must mean no text matches, not match every title or secretly restore defaults. Provider-supplied event metadata, calendar leave assignment, separately saved flights and explicit per-event choices are independent from keyword detection. Explain actual protection precedence consistently with the accepted overlap setting.

## Manage meetings — accepted choices and proposed browser

The saved general overlap checkbox belongs here, above the individual-meeting browser; it is removed from Notices and buffers. The owner requires Default / Ignore / Protect. Proposed presentation follows Existing meetings within the profile dialog: one-row From/Through controls, linked-calendar selection, compact count and nearby Refresh, then date-ordered meeting rows with a treatment control. Keep the enclosing profile popup/fixed heading and width behavior stable. Browse only this person's linked selected calendars; changing a filter must not expose unrelated calendars. Reuse range/source caching and pagination/error handling rather than depending on the New meeting date range or dumping all previously loaded events.

| Choice | Scheduling behavior for this person |
| --- | --- |
| Default | Remove this person's override for this occurrence; apply active profile settings and detection. It is not an instruction to force the event to block. |
| Ignore | Treat this calendar occurrence as absent for this person, including conflicts, title classification, its derived radius and warnings. Keep invitations and Google data unchanged. |
| Protect | Block its exact event interval, like the flight interval, without automatically adding a buffer. It wins over Allow overlaps. Separately configured radius rules remain independently configured. |

Use stable per-occurrence identity, deduplicate shared copies, and show only one row per occurrence. Proposed initial scope is one occurrence, not an entire recurring series; the UI must make that clear. Do not expose inaccessible details or offer a fabricated event-specific choice from an anonymous merged free/busy interval. With no linked calendars, explain that meetings cannot be loaded for local treatment.

Legacy flexible/movable/leave overrides need an explicit preservation/migration treatment before reducing the selector to three choices. Default must not silently erase a previous rule during an unrelated live save. These are SlotDesk settings; this browser does not edit appointment titles, guest lists or dates in Google.

## Remaining owner review and implementation checks

Settled by the owner's answers: explicit Protect/flights win over allowed overlaps; new detection defaults off and existing behavior is preserved; the standalone timezone-clue section is removed; factual Existing meetings overlap labels remain even for ignored overlaps. Preserve previously saved availability until deliberately removed; the proposed new availability UI is reopened around recurring profile blockers.

Still open: travel and flight UX/logic and helper text (required in 0.9.5), recurring profile blocker design, the concrete calendar-backed holiday/meeting browser and recurrence/migration details, non-flight detection field wording, and final review/authorization. Do not treat this record as owner approval of every proposed detail.

When implementation is authorized, cover each Ignore combination, required/optional/own participants, shared event copies, protection versus ignored overlaps, detection on/off with defaults/custom/empty lists, source failures, partial leave exceptions, recurring occurrence identity, legacy overrides/availability, import/export/full restore, live-save/window conflicts, keyboard focus and narrow/wide layouts. New settings and scoped overrides must remain portable under the existing backup/profile-file contract. Recheck that no profile operation calls a Calendar create/PATCH/delete/move transport. Wider UX readiness remains the owner's decision.
