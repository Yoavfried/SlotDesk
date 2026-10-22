# Advanced profile settings — 0.9.5 owner review

Updated **22 October 2026**. This is an accepted-direction and remaining-review record, not a released implementation. Current runtime/downloads remain **0.9.4.6**. The owner has started the required advanced-profile review and answered the three questions below. Travel/flight review and the explicitly proposed details remain open. Do not declare 0.9.5 ready or publish it before the owner completes the review and authorizes implementation/release.

## Section order and wording

| Order | Section | Direction |
| --- | --- | --- |
| 1 | Working days and hours | Move before all other advanced categories. Preserve template/manual schedules. Ignore working days and hours removes that person's working schedule from eligibility, ranking, explanations and warnings. |
| 2 | Convenience hours | Rename Preferred hours; use sentence case. Remove the ranking-only explanatory paragraph. Ignore usual convenience hours removes that person's usual-hour limits, penalties and warnings. Other independently enabled rules still apply. |
| 3 | Meeting rules | Remove the paragraph beginning Overlaps are disclosed before sending. Keep the remaining notice and configured-radius controls. Revise overlap semantics as specified below. |
| 4 | Travel & flights | Review and fix in this same update, together with other flight-related behavior. The owner has put this section aside temporarily; its review is not complete. |
| 5 | Holiday exceptions | Replace Leave / holiday exceptions. Choose actual leave/holiday entries for this profile instead of creating free-standing manually entered date exceptions. |
| 6 | Event detection | Replace Event treatment. Master checkbox: Detect special events in calendar. When off, show only the checkbox; when on, reveal clearer matching fields with their default values. |
| 7 | Manage meetings | Replace How to treat individual meetings with a compact profile-specific calendar browser and Default / Ignore / Protect choices. |

Remove the two exact explanatory paragraphs specified by the owner. Keep the existing live-saving model and separate basic Availability calendars / More settings expandables. Saved values remain available when an Ignore or detection checkbox is toggled back; disabling a rule must actually bypass it, not merely hide inputs.

## Overlaps — accepted semantics

The owner explicitly confirmed: **Protect and saved flights still block; ignore other overlaps** when Allow overlaps is enabled for that person. This changes the former permission-to-show-warned-overlaps behavior.

- Exclude that person's nonprotected meeting overlaps from candidate rejection, availability failure, ranking cost, affected-meeting counts, warnings, review confirmation and rescheduling follow-ups. Do not just hide a warning while continuing to penalize the candidate.
- Explicit per-event Protect and separately saved flights remain hard blocks. A title-based guess alone must not bypass the accepted ignore-other-overlaps rule.
- A physical overlap ignored for person A can still matter for person B. Shared event identity must not erase B's independent conflict or protection. Retain per-profile provenance before deduplicating genuinely actionable conflicts.
- This does not remove another participant, their invite, their own independent rules or accurate calendar-coverage status. It does not move, cancel, delete or reschedule the original appointment.
- Saved profile defaults and the existing per-meeting override use the same semantics. Turning an override off restores the active meeting conflicts for that person in that search.
- Explicit manually blocked periods, configured meeting radii, flight buffers and notice remain independent controls. Ignore an individual meeting removes its derived radius as well; simply allowing overlaps does not turn off a separately configured radius. Review any ambiguous combined case visibly before implementation rather than inventing an exception.
- Ensure ignored conflicts do not reappear in immediate post-booking alerts/follow-ups. The treatment of calendar-wide factual Overlapping labels and subsequent preference changes needs an explicit implementation boundary: those labels describe actual event intersections, whereas this setting governs participant scheduling and warnings. Do not silently alter the existing management screen's factual overlap detection while implementing a profile preference.

## Independent working and convenience rules

Each checkbox removes its corresponding rule completely. Current source combines usual working-time and convenience penalties in places; the implementation must separate them.

| Ignore working days and hours | Ignore usual convenience hours | Rules still used |
| --- | --- | --- |
| Off | Off | Working schedule and convenience hours. |
| On | Off | Convenience hours, across all days; no working-day/hour penalty, exclusion or warning. |
| Off | On | Working schedule; no convenience-hour exclusion, penalty or warning. Do not accidentally suppress the working schedule because convenience is ignored. |
| On | On | Neither usual schedule; independent flights, explicit time rules, protection, notice and configured radii retain their settings. |

Ignoring one rule must remove it from all candidate selection and fallback classifications, not just the participant's visible status. Keep other participants' active rules. No warning may be synthesized from a rule the user chose to ignore.

## Timezone clues to confirm — explanation and recommendation

Current source: the separate Show suggestions action calls the deterministic Google adapter helper. It combines manually typed clue text, already loaded linked-calendar event titles/locations/office labels, and a linked calendar's timezone. It recognizes explicit IANA names and a small fixed list such as New York/US Eastern, London, Tokyo, Jerusalem/Tel Aviv, Singapore and Sydney. It does not read emails or use an LLM. Choosing a suggestion changes the profile timezone only after the user clicks it.

This helper predates the broader searchable city/timezone picker. Recommendation, **not yet an owner-confirmed removal**: remove the redundant standalone advanced section; keep the main searchable timezone field. A calendar timezone is only a clue about a calendar and must not be claimed to prove a person's location. Travel-specific suggestions belong to the pending travel/flight review and are not automatically removed with this section.

## Available times — accepted removal from saved settings

The owner confirmed: **remove recurring Available times from saved profile settings; retain explicit availability for an individual meeting**. The existing use case, such as a guest available only Tuesdays/Wednesdays at 18:00 Eastern for a particular request, remains supported at meeting scope.

- Do not offer creation of recurring availability rules in the saved-profile advanced settings.
- Previously saved availability rules remain visible and active until the user deliberately removes them; do not silently discard them on opening a profile, upgrading, exporting, importing or restoring.
- A conditional previously-saved-rules area can expose those rules and their removal without bringing back Add availability for ordinary profiles. This is migration UX, not a new default section.
- Meeting-specific availability needs an explicit positive choice, separate from blocking/inconvenient periods, with an explicit timezone and clearly bounded dates/weekdays/window or exact start. Retain its accepted authorization semantics and keep it with the existing per-person Options for this meeting controls.
- Review the concrete meeting-scope form and legacy-rule presentation before implementation; do not silently reinterpret old rules as a person's working schedule.

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

The owner requires Default / Ignore / Protect. Proposed presentation follows Existing meetings within the profile dialog: one-row From/Through controls, linked-calendar selection, compact count and nearby Refresh, then date-ordered meeting rows with a treatment control. Keep the enclosing profile popup/fixed heading and width behavior stable. Browse only this person's linked selected calendars; changing a filter must not expose unrelated calendars. Reuse range/source caching and pagination/error handling rather than depending on the New meeting date range or dumping all previously loaded events.

| Choice | Scheduling behavior for this person |
| --- | --- |
| Default | Remove this person's override for this occurrence; apply active profile settings and detection. It is not an instruction to force the event to block. |
| Ignore | Treat this calendar occurrence as absent for this person, including conflicts, title classification, its derived radius and warnings. Keep invitations and Google data unchanged. |
| Protect | Block its exact event interval, like the flight interval, without automatically adding a buffer. It wins over Allow overlaps. Separately configured radius rules remain independently configured. |

Use stable per-occurrence identity, deduplicate shared copies, and show only one row per occurrence. Proposed initial scope is one occurrence, not an entire recurring series; the UI must make that clear. Do not expose inaccessible details or offer a fabricated event-specific choice from an anonymous merged free/busy interval. With no linked calendars, explain that meetings cannot be loaded for local treatment.

Legacy flexible/movable/leave overrides need an explicit preservation/migration treatment before reducing the selector to three choices. Default must not silently erase a previous rule during an unrelated live save. These are SlotDesk settings; this browser does not edit appointment titles, guest lists or dates in Google.

## Remaining owner review and implementation checks

Settled by the owner's answers: explicit Protect/flights win over allowed overlaps; new detection defaults off and existing behavior is preserved; recurring saved availability is removed while meeting-specific availability and deliberately retained legacy rules remain.

Still open: travel and flight UX/logic (required in 0.9.5), confirming removal of the standalone timezone-clue section, the concrete calendar-backed holiday/meeting browser and migration details, and final review/authorization. Do not treat this record as owner approval of every proposed detail.

When implementation is authorized, cover each Ignore combination, required/optional/own participants, shared event copies, protection versus ignored overlaps, detection on/off with defaults/custom/empty lists, source failures, partial leave exceptions, recurring occurrence identity, legacy overrides/availability, import/export/full restore, live-save/window conflicts, keyboard focus and narrow/wide layouts. New settings and scoped overrides must remain portable under the existing backup/profile-file contract. Recheck that no profile operation calls a Calendar create/PATCH/delete/move transport. Wider UX readiness remains the owner's decision.
