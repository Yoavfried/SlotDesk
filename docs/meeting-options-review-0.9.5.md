# Meeting options review for 0.9.5

Owner review started 20 October 2026. This is a planning record, not an implementation or readiness decision. The [0.9.5 owner-review gate](roadmap.md#095--required-owner-reviews) remains in force. The owner must review and specify the final wording, UX and advanced-option changes before implementation.

## Owner directions already given

- Remove the Calendar data incomplete bubble below the proposed meeting date. Participant-level calendar icons carry coverage information instead of a card-level badge.
- Each participant has one identity/time row: name, hoverable calendar icon, location/timezone label and their local meeting time. Keep these on one row.
- The next row shows one main status/reason only. A known meeting overlap takes precedence over a day-off reason.
- Review the extra warnings. Do not add a standalone “Nina Banai: Availability unconfirmed” item there.

## Proposed first row — owner decision pending

Example: `Nina Banai [calendar icon] · Los Angeles GMT−7 · 09:00–09:15`.

Use the effective profile timezone for the actual meeting instant, including a saved travel timezone. A timezone's display city is a timezone label, not proof of physical location. A flight's arrival location must not become the person's location before arrival. Keep the profile's Optional context accessible without treating it as an availability reason.

To retain one row in a narrow sidebar, keep the icon and time readable and allow the name and timezone/city label to truncate with ellipses. Full text must be available by hover, keyboard focus and tap. Never truncate the time or silently shrink text below the shared readable style. If the participant's date differs from the card date, expose that date beside the time; date/offset/zone changes within the meeting also need an honest compact representation and full detail.

The icon has three proposed states: checked coverage; linked but incomplete/stale/unavailable coverage; no linked availability calendar. Its popup explains the actual sources and current search coverage, including busy-only data. “Connected” alone never means “available.” Known invitations can still reveal a clash without a linked availability calendar. Every selected required availability source must cover the entire slot, load completely and be fresh before the participant can be labelled Available.

## Proposed second-row priority — owner decision pending

First matching applicable row wins. Priority is for presentation, not search eligibility or ranking. A required person's hard block continues to exclude a candidate; the same conflict can appear for an optional person or in an explicit-time review. Other reasons remain available as substantive detail. Only meeting-overlap-over-day-off precedence is already explicitly confirmed by the owner.

| Priority | Proposed text | Factual source and exact condition |
| --- | --- | --- |
| 1 | Unavailable · Flight to London | A saved flight whose departure–arrival interval actually intersects the slot. Use arrivalLocation only when entered; otherwise the saved flight label or simply Flight. Calendar-title guesses alone do not establish a flight. |
| 2 | Unavailable · Blocked time: Lunch | Explicit user-set recurring profile block or dated global/person constraint in blocked mode, intersecting the slot; use its entered label when present. |
| 3 | Unavailable · Protected appointment: Board review | Explicit protected event treatment, or an enforced protection rule for that person; actual intersecting event, with private details withheld. Own-profile title guesses allowed as warned overlaps stay meeting overlaps. |
| 4 | Unavailable · Blocked time around Budget review | The configured blocked meeting radius intersects the slot before/after its source event. No default radius is invented. This is separate from overlap with the event itself. |
| 5 | 1 meeting overlap · Budget review / 2 meeting overlaps · Budget review (+1) | Actual busy meeting intervals from selected calendars or known invitation copies, deduplicated by reliable event/occurrence identity. Free, canceled, declined-self and explicitly ignored entries do not count. Busy-only/redacted data uses Details unavailable rather than inventing a title or event count. |
| 6 | Unavailable · Day off: Annual leave | Structured out-of-office data, the configured leave-calendar treatment, or the profile's leave classification/explicit leave override, after that person's date exclusions. An all-day entry or regional timezone alone is not proof of a holiday. |
| 7 | Unavailable · Outside stated availability | The effective positive availability windows/exact starts entered for the person do not contain the meeting. No inference from email prose. |
| 8 | Unavailable · Nonworking day | The local weekday is disabled in the effective work schedule, unless Ignore working days/hours or a matching positive availability rule removes this restriction. |
| 9 | Unavailable · Less than 2 hours' notice | The slot is inside that person's explicitly configured notice period. Default notice is zero. |
| 10 | Inconvenient · Outside acceptable hours | The meeting falls outside the person's configured acceptable-hour range and the explicit last-resort permission allows the displayed candidate. Without that permission, a required-person candidate is excluded. Positive availability retains its separately agreed behavior. |
| 11 | Inconvenient · Flight buffer | The slot intersects the configured two-hour vicinity of a saved departure/arrival, outside actual flight time. Distinguish the actual flight (priority 1). |
| 12 | Inconvenient · Marked time: School pickup | An explicitly entered inconvenient interval intersects the slot; use its entered label. |
| 13 | Inconvenient · Time around Budget review | An explicitly configured inconvenient meeting radius intersects the slot. A blocked radius uses priority 4. |
| 14 | Inconvenient · Outside working hours | Some of the meeting falls outside the effective enabled working-hour windows, while the time is otherwise permitted. Do not show when the relevant working/convenience preference has been explicitly ignored or replaced by positive availability. |
| 15 | Availability unconfirmed | No linked availability source, missing access, incomplete pages, stale data or insufficient time-range coverage, and no higher-priority known reason. The icon carries the precise coverage reason even when another status wins. |
| 16 | Available | Entire-slot calendar coverage is confirmed and no applicable known conflict, hard rule or enabled inconvenience rule applies. This is availability based on known sources, not an RSVP or a guarantee about unshared calendars. |

For several facts in one category, show the count where meaningful and one source title/label, with the full list in detail. Proposed tie-break: greatest actual overlap duration, then earliest event/period start, then stable identity. Do not count holiday entries as meetings or fabricate an event count from free/busy intervals. For mixed detailed and unidentified busy data, use “Calendar overlap · Details partly unavailable” unless the exact distinct meeting count can be established.

Past/expired candidates, invalid timezones, invalid durations and malformed profile rules are search/card validity errors rather than normal participant statuses. They must not become an Available fallback. Travel dates normally change timezone; they do not alone imply unavailability. Free all-day notes and a guest's previous RSVP do not independently become unavailability reasons for a new proposal.

The current profile has one convenience/acceptable range, normally 07:00–20:00. With work hours ignored, falling outside that range already uses Outside acceptable hours (priority 10) when last-resort permission allows it. Do not invent a separate Outside usual convenience hours state unless the owner later approves separate ranges.

## Warnings proposal — owner decision pending

- Remove routine unconfirmed-availability entries and their generated generic notes from the extra warning list. Keep coverage reasons in the participant calendar popup and status, and retain truthful availability disclosure in the final booking review.
- Retain substantive detail: actual conflicting appointment titles/times and affected participants, additional lower-priority reasons, explicit flight/manual/radius intervals, and any independently necessary review action.
- A summary row may have full supporting detail in the expandable; do not repeat a label with no additional information.
- Deduplicate the same shared appointment across participant/calendar copies and explain who it affects. Never expose calendar IDs or hidden titles as user-facing substitutes.
- Keep shorter duration/later date labels on the option itself. Do not repeat them as generic warnings. Put travel-zone/date/DST transitions in readable time detail, with an additional warning only if a meaningful consequence remains.
- Count distinct substantive warning entries, not repeated summaries or generic availability notes. When none remain, hide the expandable.

## Data work needed before implementation

The current engine exposes typed conflicts, timing facts, fitIssue and source coverage, but fitPerson returns at the first hard failure. It does not yet provide a complete simultaneous-fact set for the proposed presentation order. Evaluation must retain all applicable display facts without weakening hard exclusions. Flight destination fields and explicit block/radius source labels also need to reach the participant result; the renderer must not reconstruct them from prose or event-title guesses. The current calendar icon tests linking only and must be adapted to actual per-slot coverage before replacing the badge.

The proposed priorities, exact text, one-row truncation/date handling and warning contents remain open for the owner's review. This record does not authorize implementing or releasing 0.9.5.
