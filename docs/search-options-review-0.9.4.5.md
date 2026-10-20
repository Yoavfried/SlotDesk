# Search controls review for 0.9.4.5

Owner feedback recorded 20 October 2026. Planning only; no runtime changes. Originally part of the 0.9.5 review, this new-meeting work is now assigned to 0.9.4.5 by the owner. See the [release scope and remaining review](release-plan-0.9.4.5.md). The separate advanced-profile cleanup remains in 0.9.5 and does not block this update; scheduling rules needed by this release still need an explicit policy.

## Owner directions

- Remove **Start-time spacing**, its custom input, **Options per day** and its custom input. This supersedes retaining these UI overrides in 0.9.4; automatic ten-/five-minute generation and time-of-day variety remain scheduling rules.
- Remove **Options to show** from Advanced. The owner approved a results-level **Generate more options** action instead: append three useful choices, retain existing cards/order, hide when exhausted, and never silently broaden the agreed rules.
- Initial visible count follows the number of open options: 0 → aim for 3 alternative options; 1 → 1; 2 → 2; 3 → 3; 4 → 4; 5 or more → 5. Never manufacture duplicates or violate hard rules to fill a count.
- Do not offer overlapping suggestions as separate choices. With 13:00–14:00 free and a 40-minute meeting, show 13:00–13:40 rather than also 13:20–14:00. The example establishes that sliding starts within the same gap should not become separate displayed choices.
- Remove the paragraph explaining automatic/custom spacing and five-minute precision from the form.
- Person-specific inconvenient/protected periods belong in that participant's Options for this meeting for temporary rules, or profile advanced settings for lasting rules. Do not keep a mixed person/global constraint creator under search Advanced.
- A meeting-wide excluded time can be offered below the selected search timezone. It means this particular meeting must not occur in that interval.

## Accepted counts and additional batches

Count meaningful displayable options after duplicate, precision, overlapping-suggestion and variety rules, not every possible five-/ten-minute start. The 13:00–14:00 example therefore has one displayable option. For count purposes, an open choice fits the requested dates/duration and has no known required-person calendar conflict; allowed own overlaps remain disclosed alternatives, and missing calendar coverage is not proof of availability. Optional participants remain non-blocking and retain their per-person status.

When there are no open choices, show up to three best permitted alternatives under the already agreed request/ranking rules. If fewer than three exist, show fewer. If none exist, show the concise empty state and an applicable next action. Shortening and later dates must qualify under the automatic policies below; do not invent extra permissions or weaken a rule merely to reach three.

Agreed Generate more options behavior: append the next three useful choices, retain existing cards/order and exclude duplicates or choices overlapping any already displayed option. Hide the action when no further eligible choices exist. The automatic duration/date policies and per-person permissions apply equally to initial and additional results; the button does not itself authorize a new exception. There must be no rotations of the same meeting around one small gap. Internal batch/diversity/freshness details must support that contract without reviving removed controls.

Apply the no-overlapping-suggestions rule across the complete visible list, including shorter/later categories and later batches. Endpoints that merely touch are not overlaps. This concerns suggestions overlapping one another; it does not remove the separately approved warned alternatives that overlap existing calendar appointments. The current 0.9.4 selector only excludes mutually overlapping suggestions within the same alternative category, so the complete-list behavior needs an implementation change.

## Automatic shortening — owner direction

Remove the Shorter option / min-duration input. There is no replacement checkbox or configurable shortening target. Offer shorter variants only when they fully solve actual calendar conflicts or blocking availability rules, or when no other option is good and the shorter variant mitigates those conflicts. The owner explicitly excluded shortening solely to improve an early/late time or another soft timing preference. Do not shorten to fill the card count; unknown calendar coverage is not itself a conflict. A shorter interval can avoid a hard block, but may never intersect it merely because it improves the full-duration conflict.

Use 15-minute duration steps, trying longer eligible durations first. Meetings of 30 minutes or less are not shortened. Meetings between 60 and 90 minutes inclusive cannot shorten below 45 minutes; meetings over 90 cannot shorten below 60. Every candidate remains strictly shorter than the original.

| Requested duration | Eligible shorter durations, longest first |
| --- | --- |
| 30 or less | None |
| More than 30 through 45 | 30 |
| More than 45, below 60 | 45, 30 |
| 60 | 45 |
| More than 60 through 75 | 60, 45 |
| More than 75 through 90 | 75, 60, 45 |
| Over 90 | Every lower 15-minute step down to 60; e.g. 100 → 90, 75, 60; 120 → 105, 90, 75, 60 |

Boundary interpretation: the explicit 60–90 minimum of 45 takes precedence at exactly 60 over the earlier overlapping 45–60 range description. Thus 60 → 45, not 30. Exactly 45 → 30 and exactly 90 has a 45-minute floor. This interpretation is stated for owner correction if intended otherwise.

At a given start, retain the longest eligible shortened duration that fully resolves the applicable conflicts. If 45 minutes solves them, do not also show 30 minutes at that start; if 45 fails and 30 fully solves them, retain 30 where the duration floor allows it. If no eligible duration fully resolves them and no good alternative exists, only a genuinely mitigating variant can qualify. Accepted on 20 October: mitigation first reduces distinct affected appointments, then actual overlapping minutes while respecting participant priorities and not worsening another required participant. Require strict improvement; never weaken a hard constraint.

Accepted single-gap exception: when the full-duration and shorter choices would overlap one another, retain the clear shorter choice for that gap rather than the overlapping full-duration choice. Requested-duration-first ordering still applies to other independent choices. If neither is clear, only substitute a shortened choice that strictly improves actual conflict under the mitigation rule above.

The complete-list non-overlap rule also prevents same-start full/shorter or different-start overlapping cards from multiplying one interval. All flights, manual exclusions, stated availability and other hard rules are evaluated for the actual shorter interval. A shorter option is not permitted to cross a hard block merely because it is an alternative. Display actual duration and a concise shorter-option label.

## Automatic later-date alternatives — owner direction

Remove Extend search by and its five-day target; do not replace them with an opt-in checkbox or another fixed day count.

1. Never show later dates when an original-duration opening exists inside the selected range.
2. If there is no original-duration opening in range, later original-duration suggestions can appear only when at least one zero-conflict, perfect option exists within the applicable current/next-workweek horizon. Only qualifying clear later choices are eligible; do not expand merely to find later overlaps.
3. A shortened option beyond the range is permitted only if there is no original-duration opening in range **and no qualifying shortened version in range**, and a qualifying clear shortened opening exists within that workweek horizon. The duration floors and preference for longer successful shortened variants still apply. This can permit a later shortened choice even when there is no later full-duration choice.
4. The horizon comes from participants' actual workweeks, not a fixed number of days or a timezone-only country assumption. Sunday–Thursday and Monday–Friday schedules must be treated separately. Resolve local date boundaries using each participant's actual timezone, including travel/DST where applicable.
5. Keep actual later dates visible on cards and in copied text. These rules apply to both initial results and Generate more options. They do not move or create appointments automatically.

Accepted horizon: anchor to the week containing the selected search end date, not the real-world current week when scheduling far in the future. Determine the end of each required participant's following workweek in their effective local timezone; the earliest of those deadlines bounds the extended search. Compare actual instants, not weekday names or date strings. An optional participant's workweek never shortens that horizon; their fit is still evaluated and disclosed. The whole suggested meeting must fit before the deadline. On 20 October the owner also accepted using the saved workweek as the horizon reference even if working-day enforcement is ignored, and a Monday–Sunday reference week when no usable saved workweek exists. Resolve manual schedules from existing saved workweek/weekday data; the 0.9.5 editor redesign does not block this policy.

Accepted perfect-fit test: all required participants meet their active rules with no known calendar conflict or active timing inconvenience. Unknown calendar access does not itself disqualify a later choice, but coverage remains visibly unconfirmed; optional participants' conflicts do not block it. An explicitly ignored usual-hour preference is not a remaining compromise. “Perfect” is an internal qualifying test, not a claim that unshared calendars were checked or the person accepted the invitation.

Historical note: 0.9.4 currently tries one entered shorter duration (default 30) and extends by the entered day count (default five). Those controls and behaviors are superseded by the planned rules above, not already changed in runtime.

## Meeting-wide excluded times — accepted UX

Below Search timezone, show **+ Exclude a time**. Open a short form with start date/time and end date/time, using the selected search timezone, with Add and Discard. Once added, show a compact removable entry such as `Tue, 27 Oct · 14:00–16:00 [remove]`, followed by **+ Exclude another time**.

These are hard exclusions for this meeting only. Any suggestion intersecting the excluded interval is rejected, not just suggestions starting inside it. They do not create calendar events, alter anyone's profile or affect later unrelated meetings. Preserve the actual excluded instants and convert their visible times if the search display timezone changes.

Current implementation gaps: state.constraints is stored at account/workspace scope and can target one person or everyone. It survives ordinary meeting creation; it is not already a clean meeting-only exclusion model. Temporary person-specific periods are not fully implemented merely because the three per-meeting preference checkboxes exist. New storage/scope boundaries and the treatment of existing saved dated constraints need deliberate migration; do not silently turn old entries into permanent profile rules or delete them as if they were empty. Profile advanced UX remains owner-led pending work.

## Outside-hours control — removal and per-person semantics accepted

Remove the global Enable last-resort times outside acceptable hours checkbox. Do not add the proposed results-level Include very early or late times action. The owner considers per-person/per-meeting control sufficient.

Historical/current-code distinction: in 0.9.4 each participant's Ignore usual convenience hours flag only removes the usual ranking penalty. It does **not** authorize proposals outside their acceptable-hour range, normally 07:00–20:00. The separate global allowBadHours flag enables those times. That is the released behavior, not the new contract below.

Accepted for 0.9.4.5: expand **Ignore usual convenience hours** so it both removes that person's usual time-of-day convenience ranking penalty and permits proposals outside that person's usual acceptable-hour range. Use the saved profile default with the existing per-meeting override. This is one per-person choice, with no global replacement or additional outside-hours checkbox. Permission for one person never permits outside-range times for another required person. With it off, the usual range remains enforced unless that person's separately authorized positive availability permits the time.

Working-day/hour rules and ordinary-overlap permission remain separate controls. Flights, manual blocks, explicit event protections, positive availability restrictions and other independent hard rules remain in force. Flight buffers, manually marked inconvenient periods and configured inconvenient meeting radii still count; this checkbox does not ignore all inconvenience. The actual local meeting time must remain visible. The exact status/warning wording for an outside-range time under this permission belongs to the still-open participant-row/profile review; changing eligibility does not approve a new warning design.

## Calendar data panel — removal accepted

The current Calendar data / Refresh calendars panel reports fetch coverage, source names, detail/busy-only access and event counts. It is diagnostic; 339 busy entries is not a meeting-fit explanation. Find a time already performs a fresh calendar read, with another fresh availability check before creation.

Agreed: remove this panel and its separate Refresh calendars button from new-meeting search. Use the per-person calendar icon for meaningful source/coverage issues and Find a time to retry. Preserve the separately required Refresh meetings action in Existing meetings. Internal read logic and error detection remain; technical counts are not required in the main flow.

## Remaining owner decisions

The owner agreed to the unannotated parts of the previous review: initial counts, distinct suggestions, Exclude a time form/scope, removal of the spacing note, and removal of the search Calendar data/Refresh panel while retaining Refresh meetings. Generate more options appending three was explicitly approved.

All three targeted questions are answered: shortening addresses only actual conflicts or blocking rules; the earliest required-participant next-workweek deadline bounds later dates, anchored to the selected search end; and Ignore usual convenience hours also permits outside-range times for that person. Optional guests remain non-blocking.

The owner has also accepted the single-gap full/shorter choice, mitigation comparison, perfect-fit test and ignored/missing-workweek reference described above, followed by the full participant-status/category/source/wording/priority table. The [0.9.4.5 plan](release-plan-0.9.4.5.md) records these as accepted decisions. Responsive and detailed warning UX remain subject to owner review. Advanced-profile-editor cleanup remains separate for 0.9.5. No review-driven implementation or 0.9.4.5 release is authorized by this record.
