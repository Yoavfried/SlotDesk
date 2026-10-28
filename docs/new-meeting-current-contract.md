# New meeting: current behavior

This is the current contract for the automatic New meeting flow. Historical plans and older programmatic engine options do not override it. Technical request and result fields are documented in the [engine API](engine-api.md).

## People and calendars

- Setup requires at least one selected, accessible workspace calendar. A default invitation calendar is optional; each meeting needs a writable organizing calendar before searching and creating.
- Selecting an organizing calendar automatically includes its linked saved profiles. Explicitly added participants remain when that calendar changes; an explicitly removed automatic participant stays removed for the meeting.
- Saved profiles and email-only guests can participate. Email-only guests appear as cards, need a confirmed timezone and can be saved as profiles without duplication. Every included person, including optional guests, needs a confirmed timezone before searching.
- At least one participant must be required. Optional guests do not block required participants' options and remain invited unless removed.
- Saved profile settings supply defaults. Per-person meeting options override Required/Optional, Ignore working days and hours, Ignore usual convenience hours, and Allow overlaps for this meeting only.
- Each search reads fresh data from selected workspace calendars. Unselected calendars are not read. All linked sources must cover the interval completely and freshly for checked availability. Missing access or mapping produces unconfirmed availability, not an invented conflict or automatic rejection.
- Accessible invitations answered Yes or Maybe can establish known commitments without a linked availability calendar; they do not establish complete coverage. A declined invitation does not block that person's time.

## Independent rules

| Rule | Behavior |
| --- | --- |
| Working days | Disabled weekdays block required participants unless working rules are ignored or a retained explicit availability rule permits the time. |
| Working hours | Outside-hours options remain possible within the person's permitted convenience range, with their corresponding timing cost/status. |
| Convenience hours | Normally 07:00–20:00, configurable per profile. Outside the range is blocked unless that person's Ignore usual convenience hours setting or explicit availability permits it. |
| Ignore working days and hours | Removes weekday enforcement and working-hour preference. Convenience hours and independent restrictions remain. |
| Ignore usual convenience hours | Permits earlier/later times for that person. Independent working-hour preference, flight buffers, manual inconvenience and meeting buffers remain. |
| Allow overlaps with other meetings | Ignores ordinary overlaps in scheduling, warnings and follow-ups. Explicit Protect/Assign leave, saved flights and independent blockers/buffers remain. Existing meetings still shows factual overlap labels. |
| Minimum notice | Requires the start to be at least the configured number of hours from now. Past starts are excluded. |
| Blockers/excluded times | Saved recurring or dated blockers and meeting-only exclusions are hard restrictions. The whole interval must avoid them. Saved profile blockers use the profile timezone. |
| Meeting buffers | Blocked buffers reject intersecting times; inconvenient buffers add a separate timing cost. Ordinary overlap permission does not remove them. |
| Retained explicit availability | The whole meeting must fit an allowed window, or start at its exact specified time. These rules replace ordinary work/convenience restrictions, while flights, notice and independent protection remain. |

Event detection is off for new profiles. When enabled, literal whole-word/phrase keywords classify leave, protected time and flexible meetings in that order. Individual/series treatments take precedence; the latest action wins at its scope. Automatically detected time off or readable title-based protection on the user's own profile can become warned alternatives. Other required participants' protection remains blocking unless its applicable overlap rule ignores it. A flight word in a title is not a saved flight.

## Trips and timezones

Saved flight intervals block meetings. Connections add 30-minute blocks after arrival and before departure; a longer layover can contain a meeting. Two-hour inconvenience buffers apply before the trip's first departure and after its final arrival.

Each arrival changes the effective scheduling timezone. The active trip timeline takes priority until its final arrival. A final non-return arrival changes the saved profile timezone; after a return trip, the saved value applies again. Later manual edits take priority after the trip. Calendar flight changes require review rather than silently updating a saved trip.

The complete proposed interval is checked against effective zones, dates, DST and active rules. Missing DST wall times are skipped; automatic repeated times use the earlier occurrence. Searching does not modify calendar data.

## Dates, starts and quality

- Duration is 1–1,440 whole minutes. The selected New meeting range is inclusive in the search timezone and limited to 93 dates; Existing meetings has a separate unrestricted browser range.
- This week starts today and ends with the search timezone's calendar week. Next week selects the following calendar week. Jerusalem uses Sunday–Saturday; other search zones use Monday–Sunday. Saved working weekdays independently determine attendance.
- Starts normally use 10-minute units. Five-minute starts qualify when needed to avoid required-person conflicts, or improve optional attendance without worsening required fit. Partial reduction of an optional clash is insufficient. Automatic starts never use finer units; deliberate manual-time review is separate.
- Required people determine feasibility. Explicit flight/manual/buffer inconvenience ranks before ordinary working-hour preference. Required guests have equal priority: worst burden, then total burden. Own-profile usual-hour fit is separate. Disruption and affected appointments matter; optional attendance breaks otherwise comparable ties.
- Exactly three groups apply in the search timezone: before 12:00, 12:00–14:00, and 14:00 onward. Evening/night are not additional groups.
- Working-hours representatives use at most one choice per group/date for one to three selected dates, or one per eligible date for longer ranges. Clear outside-working-hours choices have a separate limit of one per eligible date. Within the applicable category, use the best fit and earliest equally suitable start. Omit dates without feasible candidates.
- Displayed options never overlap one another, including across durations/categories/batches. Touching endpoints are allowed. This is separate from a suggestion overlapping an existing appointment.

## Initial options and Generate more

A clear option has no known required-person conflict and satisfies active hard rules. Missing coverage stays visibly unconfirmed. A clear working-hours option also avoids active ordinary working-hour inconvenience; independent soft periods still affect quality/warnings.

| Situation | Display behavior |
| --- | --- |
| Clear working-hours options exist in range | Initially show only those representatives, up to five. Generate more appends remaining clear working-hours representatives, eligible clear outside-working-hours date representatives, then in-range compromises. Appended choices respect groups/dates already used by the normal choices. No later dates. |
| No clear working-hours option, but clear outside-working-hours options exist in range | Initially show up to three clear choices on different eligible dates, at most one per day. Requested-duration choices take priority over shortened choices. Spread dates within that duration category; shortening fills only remaining initial places. Generate more appends the remaining clear date representatives, then in-range compromises. No later dates. |
| No clear option exists in range | Feature at most one clear later working-hours option, followed by up to three in-range compromises. If no later working-hours choice qualifies, the single featured choice may instead be a clear later outside-working-hours choice. |
| More retained options exist | Generate more appends up to three representatives, preserving existing cards/order/expanded warnings. It never adds another later option or broadens permissions. |

With sufficient compromises and no clear in-range option, the initial list has three or four cards. When a clear in-range option exists, compromises remain behind Generate more. Show fewer cards when fewer choices qualify; never manufacture cards to reach a count.

Each outside-working-hours date representative uses the closest collective working-time fit and earliest equally suitable start, preserving duration and explicit-inconvenience priorities. An eligible date is the local date in the selected search timezone, after applying weekdays, leave, flights and other active restrictions. Within each duration category, three initial places use first/middle/last dates; two places use first/last; one uses the earliest. For an even number of dates, the middle choice uses the earlier middle date. Remaining clear dates retain requested-duration-before-shortening order, then chronological order within each category, ahead of compromises. No retained choices overlap. Requested duration normally precedes shortening, subject to the clear-shortening exception below.

## Shortening

Shorten only to remove or strictly reduce actual conflicts or blocking availability rules. Ordinary timing preference or missing coverage alone does not authorize shortening. No shorter alternative may cross a hard block.

| Requested duration | Permitted shorter durations |
| --- | --- |
| 30 minutes or less | None |
| More than 30 and below 60 | Lower 15-minute steps down to 30 |
| 60–90 | Lower 15-minute steps down to 45 |
| More than 90 | Lower 15-minute steps down to 60 |

At one start, keep the longest duration fully resolving the applicable conflict. If nothing is clear, shortening must strictly reduce affected appointments or actual overlapping minutes. When a clear shorter choice and conflicting full-duration choice occupy the same gap, retain the clear shorter choice. Do not show multiple overlapping shortened variants.

## Later-date deadline

Later dates qualify only when there is no clear in-range choice, including clear outside-working-hours or shortened choices, and must have no known required-person conflict. Later shortening additionally requires no qualifying shortened option inside the dates. Later conflicting alternatives are never offered.

Anchor to the week containing the selected search end. Stop at the earliest required participant's following-workweek end; optional guests do not shorten it. Ignoring working rules retains the saved reference workweek. Template schedules retain their chosen Sunday- or Monday-based reference. Manual schedules start after their longest disabled-weekday break; ties favor the earliest weekday in Monday–Sunday order. All-day/no-enabled-day schedules use Monday–Sunday.

Resolve the actual effective timezone/date transition at the boundary, including late arrivals and date-line jumps. The whole meeting must finish before it. Retain only one clear later choice across all batches.

## Cards, shared text and creation

Participant rows show identity, calendar coverage, location/timezone and actual local time. One prioritized factual status explains the main reason. The [status table](meeting-options-review-0.9.4.5.md#accepted-second-row-categories-sources-and-priority) defines the categories; the calendar icon explains coverage. Extra warnings retain substantive lower-priority facts without routine unconfirmed-availability repetition. Overlap warnings show the actual intersecting interval.

Planning email uses the displayed options. Its only availability caveat is that a known unavailable optional participant is unavailable for an option. It omits internal overlaps, unknown coverage and working/convenience rules. Copying does not send email or book.

Review & create opens an unsent review. Permissions and current availability are checked again before creation; changed details require review. All explicitly retained attendees receive invitations. Searching, copying, selecting an option and saving profiles do not move, delete or send calendar appointments. Other meetings are rescheduled only through separately reviewed actions.

## Deliberate limits

- Missing access cannot establish complete availability; known rules/commitments still support unconfirmed proposals.
- Group/date selection summarizes continuous availability. Generate more does not expose every possible start within a group.
- The automatic five-minute floor can omit finer gaps.
- Material participant/rule/date/duration/organizing-calendar changes invalidate suggestions. Background persistence alone must not invalidate an unchanged search.
- Automated checks/source review establish tested behavior, not a guarantee against every future bug or native-browser difference. Account permissions, invitation delivery and each browser/OS retain their applicable release checks.
