# SlotDesk API and semantics

## 0.9.4.5 automatic policy

The browser's creation and rescheduling requests set `automaticAlternatives:true`. This selects `search-policy.js`: automatic ten-/eligible-five-minute starts, qualifying 15-minute shortening, required-participant next-workweek horizon and globally distinct/non-overlapping suggestions. See the full [policy contract](search-options-review-0.9.4.5.md). Initial `options` contains 1–5 meaningful choices according to `clearCount`, or up to three permitted alternatives when no original opening exists. `allOptions` is the frozen eligible list for append-three batches. `extended-shorter` is an additional alternative type. `openCount` remains a raw evaluation count, not a displayed count.

Legacy programmatic callers omitting this flag retain the old spacing/per-day/shorter/extension arguments and compatibility result views documented below; those controls are absent from the UI. The modern path ignores a global outside-hours bypass, including exact pre-write evaluation. A person's `ignoreConvenience` both removes usual-hour penalties and permits their outside-range times. All other independent rules still apply.

Each modern participant result retains `issues` as well as typed conflicts, timing, coverage and `statusPolicy`. `participant-status.js` follows the accepted [18-category priority table](meeting-options-review-0.9.4.5.md); secondary warning generation excludes routine unknown-coverage repeats. `tzLocation` and time-setting location metadata are optional display-only city references. Four-part application versions are compared numerically for cross-window/newer-version protection.

Updated 20 October 2026 for 0.9.4.5; the [current ranking policy](scheduling-ranking-review.md) supersedes older ranking descriptions. The scheduling semantics were agreed 8 October 2026. The browser and Node use the same UMD engine. Participant results additionally expose `inconvenientMinutes`, `availabilityReason`, `hasCalendarConflict` and `calendarConflictCount` for UI explanations; these report existing scheduling decisions. Browser globals are `SlotEngine`, `SlotGoogle` and `SlotGoogleReader`; Node uses `require()`.

## Request

```js
const result = SlotEngine.findSlots({
  duration: 45, range: {from: '2026-10-19', to: '2026-10-22'},
  anchorTz: 'Asia/Jerusalem', people, constraints: [],
  automaticAlternatives: true, now: Date.now()
});
```

Dates are inclusive in the EA/search zone. The UI requires that zone; engine callers omitting it get the runtime's local timezone. It does not depend on participant ordering. Durations/grid are integer minutes; notice is hours. New-meeting search range is at most 93 days. This is separate from the unlimited Existing meetings browser. Automatic later alternatives use the required participants’ workweek deadlines; legacy callers retain the older explicit extension limit. Validation returns `errors` and `warnings`; absent constraint targets are warned and ignored. Do not confuse an empty result with a validation failure.

## Profile

```js
{
  id: 'exec', name: 'Executive', tz: 'Asia/Jerusalem', required: true,
  ignoreWorkingHours: false,
  days: SlotEngine.WEEK_MON_FRI('09:00', '18:00'),
  limit: {s:'07:00', e:'20:00'}, notice: 0,
  radius: {minutes: 0, mode:'inconvenient'}, // or 'blocked'
  availability: [
    {days:[2,3], s:'18:00', exact:true, tz:'America/New_York'},
    // windows use s/e and exact:false; from/to bound dates inclusively
  ],
  blocks: [{day:1, s:'12:00', e:'13:00', label:'Protected lunch'}],
  travel: [{from:'2026-10-20', to:'2026-10-22', tz:'Europe/London'}],
  flights: [{departure:'2026-10-20T10:00:00+03:00', arrival:'2026-10-20T13:00:00+01:00'}],
  holidayExclusions: [{from:'2026-10-21', to:'2026-10-21'}],
  eventRules: {protect: 'flight|medical', soft:'hold|tentative', leave:'holiday|annual leave'},
  eventOverrides: {'calendar-id|event-id':'movable'},
  calendar: 'detail', busy: [], markers: [], coverages: []
}
```

Rules are case-insensitive regular-expression strings (RegExp also accepted by the engine). The UI presents comma-separated words/phrases and converts them safely. Empty UI lists disable that title category. Supported event overrides are `protected`, `soft`, `movable`, `leave`, `ignore`; identity-specific overrides take precedence over legacy plain event IDs. Explicit overrides precede default classification, including structured/all-day protection. The application derives `isOwnProfile` from its onboarding identity for both creation and rescheduling; it is not a portable saved preference. For that profile only, provider calendar leave/OOO/all-day busy entries without an explicit override classify as finite-cost `own-leave` overlap alternatives. Own readable title-rule matches without an explicit override classify as `own-inferred` alternatives. Both retain conflict warnings. Only own-leave entries are excluded from rescheduling follow-ups; own-inferred appointments remain real affected meetings. Other profiles’ leave, saved flights, explicit protected/leave overrides and manual blocks retain protection. Canceled/declined entries are omitted by the reader/adapter; use a manual block if their old times need protection.

Availability rules are alternatives. Exact starts must also satisfy the automatic five-minute floor and precision rules, or the selected custom grid; window rules require the whole meeting to fit one supplied window. A deliberate manual-time review is separate. Recurring rules resolve in the confirmed regional timezone each date. They replace ordinary hours/working weekdays for that participant, while notice, negative constraints and protected time still apply. Optional profiles use the same checks for attendance, without blocking required participants.

Whole-day travel boundaries use the profile's **home dates**, inclusive. This remains date-based even when flight instants are supplied. Exact flights do not silently switch travel zones. Overlapping travel ranges are validation errors. Flight endpoint windows, soft meeting radii, outside-working minutes and explicit inconvenience windows are merged before measuring minutes, so minutes are not counted twice. A blocked meeting radius is an explicit restriction around the event; overlap permission does not remove it. Soft radii remain explicit inconvenience rather than additional overlapping appointments.

Nonexistent DST wall times are skipped; exact input at a missing time cannot match. Repeated wall times choose the earlier occurrence. Date boundaries with a midnight DST gap use the first valid local minute within three hours. Historical skipped entire dates are outside this prototype's supported boundary semantics.

## Calendar events and confidence

Normalized events have start/end offset-bearing instants, title, type, detailsVisible, status, attendee count, external/recurring flags, calendar/event IDs, shared identity and organizer. Date-only all-day events retain exclusive end dates and source timezone. Leave exceptions subtract only the chosen dates from leave/OOO entries; unrelated events remain.

Known shared IDs use `iCalUID + original recurrence start` (or the non-recurring start); offset-equivalent instants normalize to ISO UTC. Otherwise identity is calendar ID + event ID. Without reliable identity, the engine does not merge similar titles/times. Free/busy ranges lack meeting identity and can overlap detailed sources without safe deduplication; prefer detailed sources when available.

Coverage is `{from,to,complete,fetchedAt,maxAgeMinutes,error}` per selected source. Every required source must cover the entire slot, be complete/error-free, and be fresh to call required calendars checked. The UI/reader use five-minute freshness and re-fetch on searches. Missing metadata, partial pages, unavailable calendars or stale ranges produce unconfirmed proposals; known busy blocks still count. Unknown optional calendars are noted separately.

## Results and override workflow

The UI consumes `options`, a single selected list with `alternativeType` (`requested`, `shorter`, `extended`), `alternativeRank` and `outsideHours`. `clearCount` counts original-request candidates without required-person known conflicts, independently of allowed overlaps and unknown coverage. `open`/`fallback`/`lastResort` remain compatibility views; their lengths must not be used as the visible card count.

Automatic spacing checks ten-minute starts and qualifying five-minute starts. Custom `spacingMode` uses the supplied step, which must be a multiple of five. Automatic `perDayMode` selects one option per local time group/date; custom mode caps the per-day count. For older engine callers that provide a numeric `perDay` without its mode, it remains a cap. UI migration adds explicit automatic modes so old defaults do not masquerade as custom choices.

Each participant exposes typed `conflicts`, `timing`, `fitIssue`, `usualInconvenientMinutes`, `explicitInconvenientMinutes` and `distance` alongside compatibility totals. Hard event exclusions are deduplicated in `protectedConflicts`; other exclusions are described by `rejectionDetails`. Search precision does not restrict a deliberate `evaluate(..., {exactStart})` review of a manually entered time.


`open`, `openCount`, `rejected`, `protectedConflicts`, `errors`, `warnings`, `fallback`, `lastResort`. `protectedConflicts` identifies deduplicated hard-blocking entries, affected participants and classification reasons encountered at otherwise fitting candidate times; it is empty when there are none. When too few proposals are displayed, `fallback.groups` contains only non-empty applicable groups in the order `same-dates`, `shorter`, `extended`, `occupied`. `fallback` is null when none have results. Shorter duration must be strictly below the request; extended results fall beyond the requested end date. Last-resort bad hours require `allowBadHours:true` and remain separate. Compatibility aliases `fallback.softer`, `fallback.taken` and `slot.toMove` remain.

Ranking compares normal versus explicitly enabled outside-hours choices, original/shorter/later request categories, overlap permission, explicit inconvenience, worst/total required-guest usual-hour fit, disruption and own usual-hour fit. Optional attendance, round starts and earliest-date time-group variety then select equally good choices. A useful own-hour/overlap tradeoff can remain visible in a different group. Selection does not fill a requested count with dominated candidates. Saved flights and blocked radii remain hard; usual-hour flags cannot erase explicit inconvenience. Actual seconds-bearing event boundaries are checked against real intervals rather than rounded into an event.

A slot includes full local times, exact inconvenience scores and required-calendar confidence. Occupied slots include `overrides`, `rescheduleCount`, cost, affected people, organizer/contact instructions and rescheduling action. This cost concerns the new proposal's collisions only. Old event-to-event overlaps add no standalone penalty; a proposal crossing two existing appointments does introduce a conflict with each.

The UI protects a selected proposal during replacement search and removes only the target appointment/occurrence from availability. It reads the selected existing event and its full shared roster; missing guest profiles or calendars remain unconfirmed. Timed searches retain the one-day duration bound; all-day changes use a separate date-only review. The engine never writes to calendars. The separate Google writer creates reviewed invitations; the rescheduler conditionally patches one existing event’s start/end. Calendar moves, deletes and email-reading APIs are absent. See [rescheduling](rescheduling.md).

## Google reader

`createReader({getToken,fetchImpl,now})` returns `listCalendars()` and `readCalendar(calendar,{from,to},profile)`. It normalizes both REST `items` and existing MCP `events` input, expands recurring instances, paginates with cycle detection, times out requests, and preserves partial known busy data on errors. Free/busy query POSTs are read-only queries. Tokens remain outside settings and are never logged.

Timezone clues use explicit IANA IDs, calendar metadata and a small deterministic place/region list (New York/US Eastern, London, Tokyo, Jerusalem/Tel Aviv, Singapore, Sydney). They are suggestions requiring EA review. No timezone is inferred from an email domain; a missing or ambiguous clue needs manual entry. This version reads event titles/location metadata, not email or appointment descriptions through an LLM.

## Calendar browsing range

The read-only Existing meetings range helper has no fixed date-span cap. It is separate from the scheduling search request validation above. The browse cache reads all calendars for UTC-padded exact dates, then applies the chosen display timezone and calendar selection locally. It requests event pages without a fixed page-count limit, preserving repeated-token/error guards.
