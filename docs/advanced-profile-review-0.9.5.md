# Advanced profile settings — 0.9.5 owner review

Updated **22 October 2026**. This is an accepted-direction and remaining-review record, not a released implementation. Current runtime/downloads remain **0.9.4.6**. The owner has started the required advanced-profile review and answered the three questions below. Travel/flight review and the explicitly proposed details remain open. Do not declare 0.9.5 ready or publish it before the owner completes the review and authorizes implementation/release.

## Section order and wording

| Order | Section | Direction |
| --- | --- | --- |
| 1 | Working days and hours | Move before all other advanced categories. Preserve template/manual schedules. Ignore working days and hours removes that person's working schedule from eligibility, ranking, explanations and warnings. |
| 2 | Convenience hours | Rename Preferred hours; use sentence case. Remove the ranking-only explanatory paragraph. Ignore usual convenience hours removes that person's usual-hour limits, penalties and warnings. Other independently enabled rules still apply. |
| 3 | Blockers | Add recurring and one-off profile blockers through Add blocker. Saved entries become compact bubbles with an X to remove. One-off entries cannot be assigned to past dates and leave the active list once their date has passed. |
| 4 | Notices and buffers | Rename Meeting rules. Remove the paragraph beginning Overlaps are disclosed before sending. Keep notice and meeting-buffer controls here; the overlap setting belongs in Manage meetings. |
| 5 | Travel & flights | Review and fix in this update, including its helper text and other flight-related behavior. Owner review remains unfinished. |
| 6 | Event detection | Replace Event treatment. Master checkbox reveals the keyword fields only when enabled. New profiles start off; existing behavior/custom terms are preserved. |
| 7 | Manage meetings | Include the saved overlap preference and Default / Ignore / Protect / Assign leave controls. Support one-occurrence or recurring-series scope when recurrence is identifiable. Leave/holiday entries can be ignored here; no separate Leave exceptions category. |

Remove the two exact explanatory paragraphs specified by the owner. Keep the existing live-saving model and separate basic Availability calendars / More settings expandables. Saved values remain available when an Ignore or detection checkbox is toggled back; disabling a rule must actually bypass it, not merely hide inputs.

## Category information icons — owner-approved wording

Place a small outlined information icon to the right of each advanced-section subheader. Show the same short explanation on hover, keyboard focus or tap; interacting with the icon must not accidentally toggle the section. Keep ordinary headings and tooltip text in sentence case.

The owner accepted the earlier Working days and hours and Manage meetings drafts. The later decision removes the separate leave-exception section; its tooltip is therefore removed. Blockers is a new category whose tooltip is still proposed. The following incorporates their revised text with minor grammar fixes (time range for radius; Use for User). These are category explanations, not replacements for individual control labels.

| Category | Tooltip |
| --- | --- |
| Working days and hours | Set this person's usual work schedule and whether SlotDesk should consider it. |
| Convenience hours | Set a time range when this person may not be working but could still consider attending meetings. |
| Notices and buffers | Require enough advance notice for meetings and set buffers around them. |
| Travel & flights | Wording remains unfinished; review and fix this tooltip with the rest of the travel/flight experience in 0.9.5. Do not treat the earlier draft as approved. |
| Blockers | Proposed: Add recurring or one-off times when this person cannot attend meetings. |
| Event detection | Use keywords in calendar event titles to detect holidays, flexible meetings, flights and protected times. |
| Manage meetings | Control how individual calendar meetings affect this person's availability. |

The general overlap checkbox moves from Notices and buffers to Manage meetings. Its accepted full-ignore semantics and saved-default/per-meeting-override behavior remain unchanged. Place the general control above the individual-meeting browser so it is distinguished from each occurrence's Default / Ignore / Protect / Assign leave choice.

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

## Blockers — accepted shape and entry lifecycle

The owner replaces the unresolved new availability form with **Blockers**, third within More settings after Working days and hours and Convenience hours. Provide both recurring and nonrecurring blockers.

- Use **Add blocker**, a focused details form, then a compact saved-entry bubble with an **X** to remove that blocker. Summaries must remain readable at sidebar widths; the removal button has an accessible name.
- Recurring blockers describe repeated unavailable periods. One-off blockers describe a specific future/current date or interval; past-date entry is rejected.
- Keep a one-off blocker visible through its applicable end date, then omit it from the active list after that date passes in its applicable timezone. Expired blockers must not constrain future searches. Visibility expiry does not authorize broad local-data deletion or any Google mutation.
- Blockers are explicit unavailability, independent of the working/convenience Ignore controls and Allow overlaps. They are not calendar meetings or ranking-only preferences.
- The exact details layout can use the established date, weekday, time and timezone controls. A saved-entry Add/Remove pattern may also be useful for flights and other repeated settings; flight form details still require their own review.
- Entry completion follows the existing distinction: ordinary saved profile settings save live; an incomplete add-entry form is completed or discarded and is not a resumable flight/profile draft. Retain existing meeting drafts.

Previously saved positive availability must not silently disappear or be inverted into blockers. Preserve it until deliberately removed or safely migrated, including through backups and selected-profile files. The earlier proposal for a new positive meeting-specific availability form is superseded; existing temporary meeting/person exclusions remain available.

## Leave handling — merged into Manage meetings

The owner has removed **Leave exceptions** entirely, superseding its separate search/three-per-page list and partial-day exception UI. Do not retain a separate section, category helper or duplicate leave browser.

Show leave/holiday entries within this person's **Manage meetings** browser alongside other events. They can be classified from provider out-of-office metadata, an explicitly assigned leave calendar, enabled title matching, or **Assign leave**. Choose **Ignore** on a leave entry to disregard it for this person. Choose **Default** to return to the active automatic/profile behavior. Manual assignment does not require keyword detection to be enabled.

Preserve actual event dates/times: assigning a timed event as leave must not silently expand it to a full day. Keep ignored entries visible and their current treatment identifiable so Ignore can be reversed. A treatment is local to this person's scheduling and never edits Google appointments.

The previous separate date-part exception plan is withdrawn with that category. Existing stored partial/date-based exceptions still require safe compatibility handling; removing a UI is not permission to lose existing rules on upgrade or unrelated live saves. Do not add a replacement partial-event editing workflow without reviewing it.

## Event detection — approved controls, keywords and matching

Master checkbox: **Detect special events in calendar**. New profiles start **off**. Existing profiles retain their current effective behavior on upgrade; stored custom matching terms remain intact. Off hides all matching fields and bypasses title/airport-route guesses in both adaptation and scheduling. It must not merely hide the editor while default regexes continue to run.

The owner approved the following non-flight fields, starting keywords, helper text, keyword bubbles and matching rules on 22 October. This approval is for the 0.9.5 plan; runtime is unchanged. Preserve existing custom terms rather than replacing them with these new-profile defaults.

| Field | Starting keywords | Helper text |
| --- | --- | --- |
| Leave | holiday; vacation; annual leave; sick leave; parental leave; OOO; out of office | Matching all-day events are treated as leave. |
| Flexible meetings | hold; tentative; placeholder; TBC; TBD; focus; prep | Matching meetings have lower priority when comparing conflicts. |
| Protected time | do not schedule; do not book; do not move; doctor; dentist; medical; personal | Matching events are treated as protected time. |
| Flights | Pending flight review | Pending flight review. |

Structured provider metadata and Assign leave can identify timed leave independently. Flexible meetings retain real conflict/attendance facts and receive a lower disruption cost when comparing unavoidable conflicts. Title-based protection does not silently become explicit manual Protect; the accepted Allow overlaps precedence still applies.

Approved input UX: each keyword/phrase is a small removable bubble, with Add keyword and Enter support, reusing the saved-entry pattern. Prefill defaults on enable for a genuinely new profile; keep existing custom terms intact. Clearing all terms for a category disables its text matches and must not match every title or restore defaults secretly.

Approved matching: case-insensitive whole words/phrases; hold should not match shareholder. The current broad matching expressions are implementation history, not a requirement to keep false positives. Only actually accessible event titles are checked. Remove the old general comma-separated-words paragraph and use the approved field-specific helper text above. An empty list disables that category; keyword defaults remain editable.

Manual per-event choices win over title guesses. If non-flight keyword categories collide, use Leave before Protected time before Flexible meetings; flight-category precedence remains part of the flight review. Disabling detection hides the fields and disables title/airport guesses in both adaptation and scheduling. Provider event metadata, explicit leave-calendar assignment, saved flights, manual blockers and individual meeting choices remain independent. The master defaults remain off for new profiles, with existing profiles' effective behavior preserved on upgrade.

## Manage meetings — accepted choices and proposed browser

The saved general overlap checkbox belongs here, above the individual-meeting browser; it is removed from Notices and buffers. The owner requires Default / Ignore / Protect and has added **Assign leave** as a fourth choice. Proposed presentation follows Existing meetings within the profile dialog: one-row From/Through controls, linked-calendar selection, compact count and nearby Refresh, then date-ordered meeting rows with a treatment control. Keep the enclosing profile popup/fixed heading and width behavior stable. Browse only this person's linked selected calendars; changing a filter must not expose unrelated calendars. Reuse range/source caching and pagination/error handling rather than depending on the New meeting date range or dumping all previously loaded events.

| Choice | Scheduling behavior for this person |
| --- | --- |
| Default | Remove this person's override for this occurrence; apply active profile settings and detection. It is not an instruction to force the event to block. |
| Ignore | Treat this calendar occurrence as absent for this person, including conflicts, title classification, its derived radius and warnings. Keep invitations and Google data unchanged. |
| Protect | Block its exact event interval, like the flight interval, without automatically adding a buffer. It wins over Allow overlaps. Separately configured radius rules remain independently configured. |
| Assign leave | Treat this calendar entry as leave for this person. It stays in Manage meetings and can be changed to Ignore there. Preserve actual dates/times; keyword detection is not required. |

The precedence of manually assigned leave versus the saved/per-meeting Allow overlaps preference remains to be settled; do not silently equate Assign leave with explicit Protect or ordinary meetings. Use stable event/series identities, deduplicate shared copies, and show each occurrence once. The owner approved configurable recurring meetings when identifiable: allow This occurrence or Entire series when applying a treatment, with the scope clear before applying it. Hide series scope when recurrence cannot be established. Store series-wide local rules with per-occurrence overrides so one later exception need not rewrite every occurrence; explicit individual treatment wins over its series default. Do not expose inaccessible details or offer a fabricated event-specific choice from an anonymous merged free/busy interval. With no linked calendars, explain that meetings cannot be loaded for local treatment.

Legacy flexible/movable overrides need an explicit preservation/migration treatment before reducing the selector to four choices; existing leave overrides map to Assign leave. Default must not silently erase a previous rule during an unrelated live save. These are SlotDesk settings; this browser does not edit appointment titles, guest lists or dates in Google.

## Remaining owner review and implementation checks

Settled by the owner's answers: explicit Protect/flights win over allowed overlaps; new detection defaults off and existing behavior is preserved; the standalone timezone-clue section is removed; factual Existing meetings overlap labels remain even for ignored overlaps. Preserve previously saved availability until deliberately removed; Blockers is now accepted as the third section, with recurring/one-off entry bubbles; Leave exceptions is removed and leave can be ignored in Manage meetings. Recurring-series treatment is accepted when identifiable.

Still open: travel and flight UX/logic and helper text (required in 0.9.5), flight-specific Event detection defaults/logic, the Blockers helper text and detailed form wording, any remaining Manage meetings layout details, Assign leave versus Allow overlaps precedence, and final review/authorization. The category order, blocker pattern, leave-category removal, configurable occurrence/series scope and non-flight Event detection fields/keywords/helpers/matching are accepted. Migration/backup preservation and technical validation remain implementation responsibilities. Do not treat this record as owner approval of every proposed detail.

When implementation is authorized, cover each Ignore combination, required/optional/own participants, shared event copies, protection versus ignored overlaps, detection on/off with defaults/custom/empty lists, source failures, compatibility with legacy partial leave exceptions, recurring occurrence/series identity, legacy overrides/availability, import/export/full restore, live-save/window conflicts, keyboard focus and narrow/wide layouts. New settings and scoped overrides must remain portable under the existing backup/profile-file contract. Recheck that no profile operation calls a Calendar create/PATCH/delete/move transport. Wider UX readiness remains the owner's decision.
