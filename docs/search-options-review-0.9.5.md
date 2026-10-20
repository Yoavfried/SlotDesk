# Search controls review for 0.9.5

Owner feedback recorded 20 October 2026. Planning only; no runtime changes. This is part of the required owner review of When would you like to meet? Advanced options. The advanced profile review and overall 0.9.5 release gate remain open.

## Owner directions

- Remove **Start-time spacing**, its custom input, **Options per day** and its custom input. This supersedes retaining these UI overrides in 0.9.4; automatic ten-/five-minute generation and time-of-day variety remain scheduling rules.
- Remove **Options to show** from Advanced. The owner proposes a results-level **Generate more options** action instead.
- Initial visible count follows the number of open options: 0 → aim for 3 alternative options; 1 → 1; 2 → 2; 3 → 3; 4 → 4; 5 or more → 5. Never manufacture duplicates or violate hard rules to fill a count.
- Do not offer overlapping suggestions as separate choices. With 13:00–14:00 free and a 40-minute meeting, show 13:00–13:40 rather than also 13:20–14:00. The example establishes that sliding starts within the same gap should not become separate displayed choices.
- Remove the paragraph explaining automatic/custom spacing and five-minute precision from the form.
- Person-specific inconvenient/protected periods belong in that participant's Options for this meeting for temporary rules, or profile advanced settings for lasting rules. Do not keep a mixed person/global constraint creator under search Advanced.
- A meeting-wide excluded time can be offered below the selected search timezone. It means this particular meeting must not occur in that interval.

## Suggested interpretation of counts — owner review pending

Count meaningful displayable options after duplicate, precision, overlapping-suggestion and variety rules, not every possible five-/ten-minute start. The 13:00–14:00 example therefore has one displayable option. For count purposes, an open choice fits the requested dates/duration and has no known required-person calendar conflict; allowed own overlaps remain disclosed alternatives, and missing calendar coverage is not proof of availability. Optional participants remain non-blocking and retain their per-person status.

When there are no open choices, show up to three best permitted alternatives under the already agreed request/ranking rules. If fewer than three exist, show fewer. If none exist, show the concise empty state and an applicable next action. Do not automatically opt into shorter duration, later dates or very early/late times merely to reach three.

Proposed Generate more options behavior: append the next three useful choices, retain existing cards/order and exclude duplicates or choices overlapping any already displayed option. Do not simply slide a 40-minute suggestion around the same one-hour gap. Keep the existing requested dates/duration and explicit fallback permissions. Hide the action when no further eligible choices exist. How later batches relax the one-per-time-group diversity rule or move through lower-ranked quality tiers, and the stale-calendar refresh behavior, remain owner-review details rather than silently settled policy.

Apply the no-overlapping-suggestions rule across the complete visible list, including shorter/later categories and later batches. Endpoints that merely touch are not overlaps. This concerns suggestions overlapping one another; it does not remove the separately approved warned alternatives that overlap existing calendar appointments. The current 0.9.4 selector only excludes mutually overlapping suggestions within the same alternative category, so the complete-list behavior needs an implementation change.

## What the current fallback controls actually do

**Shorter option (minutes):** a single alternative duration. If 45 minutes is requested and the field is 30, the engine can offer exactly 30-minute meetings as alternatives after the original request. It is not an automatic change to the requested meeting, nor a search over every duration from 30 to 45. When the requested duration is 15 and the field is 30, it must not offer a longer meeting as a shorter choice.

**Extend search by (days):** optionally allows later alternatives beyond the selected end date. For example, through 27 October plus five days allows dates through 1 November. It does not extend meeting duration, shift the selected start date or change already booked events. The reader fetches extra date padding; its technical read-through date is not the same as the selected result range.

Suggested replacements, pending owner decision:

- An explicit checkbox **Also try a shorter meeting**, revealing **Also try [30] minutes**. The alternative must be shorter than the request and is labelled on its card.
- An explicit checkbox **Also look beyond these dates**, revealing **Up to [5] extra days**. Later alternatives retain their actual dates and a clear label.

Whether these fallbacks remain automatic defaults or become opt-in is not decided by asking what the old controls mean. Do not change those permissions until the owner settles them.

## Meeting-wide excluded times — proposed UX

Below Search timezone, show **+ Exclude a time**. Open a short form with start date/time and end date/time, using the selected search timezone, with Add and Discard. Once added, show a compact removable entry such as `Tue, 27 Oct · 14:00–16:00 [remove]`, followed by **+ Exclude another time**.

These are hard exclusions for this meeting only. Any suggestion intersecting the excluded interval is rejected, not just suggestions starting inside it. They do not create calendar events, alter anyone's profile or affect later unrelated meetings. Preserve the actual excluded instants and convert their visible times if the search display timezone changes.

Current implementation gaps: state.constraints is stored at account/workspace scope and can target one person or everyone. It survives ordinary meeting creation; it is not already a clean meeting-only exclusion model. Temporary person-specific periods are not fully implemented merely because the three per-meeting preference checkboxes exist. New storage/scope boundaries and the treatment of existing saved dated constraints need deliberate migration; do not silently turn old entries into permanent profile rules or delete them as if they were empty. Profile advanced UX remains owner-led pending work.

## Outside-hours permission — current meaning and proposal

The current checkbox allows additional last-resort suggestions outside a person's configured acceptable-hour range, normally 07:00–20:00 in that person's effective local timezone. For example, a 23:00 local option normally excluded can appear with a clear warning when permission is enabled. It does not unlock actual flights, protected appointments/manual blocks or stated-availability restrictions. It is distinct from ordinary 09:00–18:00 work preferences.

Suggested UX: an explicit results-level **Include very early or late times** action rather than an unexplained checkbox before the search. A short explanation must reference the actual per-person ranges where they differ from the default; no silent enabling through Generate more options. Label, placement and whether it is offered only after other useful options are exhausted remain owner-review decisions.

## Calendar data panel — proposed removal

The current Calendar data / Refresh calendars panel reports fetch coverage, source names, detail/busy-only access and event counts. It is diagnostic; 339 busy entries is not a meeting-fit explanation. Find a time already performs a fresh calendar read, with another fresh availability check before creation.

Recommendation pending owner agreement: remove this panel and its separate Refresh calendars button from new-meeting search. Use the per-person calendar icon for meaningful source/coverage issues and Find a time to retry. Preserve the separately required Refresh meetings action in Existing meetings. Internal read logic and error detection remain; technical counts are not required in the main flow.

## Remaining owner decisions

Settle the shorter/later fallback controls and their defaults; the placement/wording of explicit outside-hours permission; more-options batch/diversity/freshness behavior; and the exact excluded-time form. This document records explanations and proposals, not completed UX approval or permission to release 0.9.5.
