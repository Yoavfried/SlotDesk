# SlotDesk engine API

The browser and Node use the same dependency-free UMD engine, `extension/slot-desk-engine/slotdesk-engine.js`. Browser global: `SlotEngine`; Node: `require('./slotdesk-engine')`. It evaluates supplied data and never sends, moves or deletes calendar appointments.

The [current New meeting contract](new-meeting-current-contract.md) defines automatic browser behavior. Legacy arguments are documented separately below; they do not add browser controls or permissions.

## Current automatic request

```js
const result = SlotEngine.findSlots({
  automaticAlternatives: true,
  duration: 45,
  range: {from: '2027-01-11', to: '2027-01-13'},
  anchorTz: 'Asia/Jerusalem', people, constraints: [], now: Date.now()
});
```

Dates are inclusive in the search timezone. The browser supplies `anchorTz`; standalone callers should too. Duration is 1–1,440 whole minutes. The selected New meeting range contains at most 93 dates, separately from unrestricted Existing meetings browsing.

`validate(request)` returns `errors` and `warnings`. Invalid dates, timezones, durations, duplicate participant IDs, malformed rules or no required participant prevent evaluation. Constraints for absent participants are warned about and ignored. No eligible option is distinct from a validation error.

`automaticAlternatives:true` selects `search-policy.js`: ten-/eligible-five-minute precision, automatic conflict-driven shortening and workweek-limited later alternatives. Legacy `step`, `want`, `perDay`, `minDuration`, `extendDays`, custom modes and global `allowBadHours` cannot broaden this path. Only an applicable per-person choice permits that person's outside-convenience time.

Modern working-hours selection has exactly three search-timezone groups: before noon, noon–14:00 and 14:00 onward. One-to-three-date searches retain one representative per group/date; longer ranges retain one per eligible date. Clear outside-working-hours choices are separately limited to one per date. Displayed choices and appended batches are mutually non-overlapping.

When clear in-range working-hours representatives exist, the initial list shows up to five of those. Additional results retain remaining clear working-hours representatives, eligible clear outside-work date representatives and then in-range compromises, respecting already-used groups/dates. When only clear outside-work choices exist in range, the initial list shows up to three. Requested-duration choices precede shortened choices; first/middle/last date spreading applies within each duration category, and shortening fills only remaining places. Each day has at most one clear outside-work choice. The frozen pool starts with those initial choices, then the remaining clear date representatives in duration-category/date order, then in-range compromises. Any clear in-range choice suppresses later-date alternatives. Only when no clear in-range choice exists may a single clear later choice precede up to three in-range compromises. See the current contract for exact qualification, ranking, duration floors and deadlines.

## Profiles and active rules

```js
{
  id: 'person-id', name: 'Participant', email: 'person@example.test',
  tz: 'Asia/Jerusalem', tzConfirmed: true, required: true,
  workingMode: 'template', templateDays: 'sun-thu',
  days: SlotEngine.WEEK_SUN_THU('09:00', '18:00'),
  limit: {s: '07:00', e: '20:00'}, notice: 0,
  ignoreWorkingHours: false, ignoreConvenience: false, allowOverlap: false,
  radius: {minutes: 0, mode: 'inconvenient'},
  blockers: [], eventTreatments: [], eventDetectionEnabled: false,
  keywordMatchingVersion: 1,
  ruleTerms: {leave: 'holiday, annual leave', protect: 'do not book', soft: 'hold'},
  calendar: 'detail', busy: [], markers: [], coverages: []
}
```

`workspace-model.js` derives `isOwnProfile` from the active workspace identity. It is not a portable saved privilege. Current meeting boolean overrides overlay saved `required`, `ignoreWorkingHours`, `ignoreConvenience` and `allowOverlap`. Participant order is not required-guest priority.

`profile-rules.js` owns keyword detection, blockers and ordered treatments. Blockers use `{id,label,recurring,allDay,from,to,s,e,days}` in the saved profile timezone. Treatments use `{scope,key,value,seriesKey}`: scope `occurrence`/`series`, value `auto`/`ignore`/`protected`/`leave`. Lookup is newest-first. A newer series action supersedes earlier occurrence choices; a later occurrence action changes that occurrence. `auto` restores applicable automatic/profile behavior.

Ignoring working rules removes weekday enforcement and working-hour preference. Ignoring convenience permits outside-range time; independent working-hour preference can remain. Explicit flight/manual inconvenience and radii remain separate. `allowOverlap` removes ordinary busy entries from that person's conflicts, ranking and follow-ups. Explicit Protect/Assign leave, saved flights, blockers and independent radii remain active.

Without overlap permission, own-profile automatically detected time off and readable title-based protection can become finite-cost warned alternatives (`own-leave`, `own-inferred`). Explicit protection is never relaxed. Own-leave entries do not produce instructions to reschedule a holiday; actual inferred appointments remain follow-up targets.

Legacy saved positive `availability` windows/exact starts remain supported although their old standalone editor is removed. The whole interval must fit a window, or begin at an exact specified start. They replace ordinary working/convenience restrictions while retaining notice, flights and independent protection. Optional people use the same fit model for attendance, without rejecting required-person choices.

Legacy `blocks`, `inconvenience`, `holidayExclusions`, supported finite `eventRules` expressions and event overrides remain readable. Current keyword editors use literal case-insensitive whole words/phrases. Unsupported legacy expressions are rejected. New detection defaults off and detection alone does not create saved flights.

## Timezones, trips and deadlines

`tzFor(profile,instant)` returns effective timezone/location. Modern trips contain ordered exact departure/arrival instants, timezones, connection/return flags and optional calendar links. `trips.js` owns validation, migration and the timeline. Flights block their interval; connection margins block 30 minutes after arrival and before departure. Outer two-hour buffers are inconvenience periods. Links do not modify provider events.

The active trip controls scheduling until the last arrival. A final non-return arrival updates the saved timezone; after a return, the saved profile value applies. Later manual changes win after the trip. Legacy date-based `travel` ranges and flat `flights` remain supported, but flat flights alone do not invent a destination-timezone timeline. Date-based travel uses its saved home-date range inclusively.

The later-date deadline is the earliest required participant's following-workweek end, anchored to the selected end's week. Optional workweeks do not constrain it. Template mode retains its selected reference week. Manual mode starts after the longest disabled-weekday break, with Monday–Sunday tie-breaking; all-day/no-enabled-day schedules use Monday–Sunday. Inactive templates cannot move manual deadlines. Resolve the actual timezone/date transition at the boundary, including late arrivals and date-line jumps. The complete meeting must finish before it.

Missing DST wall times are skipped; automatic repeated times use the earlier occurrence. Midnight gaps use the first real local minute within three hours. Historical skipped entire dates are unsupported. `evaluate(request,{exactStart})` checks a deliberate instant without the automatic grid, while retaining person/protection rules and the modern outside-hours contract.

## Calendar normalization and confidence

`google-adapter.js` exports `SlotGoogle`; `google-reader.js` exports `SlotGoogleReader`. Normalized busy entries retain exact start/end instants, readable type/title facts, response/status, attendee count, recurrence identity, organizer and calendar/event IDs. Date-only all-day intervals retain exclusive end dates and source timezone. Free all-day notes do not automatically become busy. Cancelled/declined/free/non-meeting entries follow provider and local treatment semantics.

Shared occurrence identity uses `iCalUID + original recurrence start`, with equivalent offsets normalized to UTC; otherwise calendar/event ID. Similar titles/times alone do not establish identity. Free/busy intervals lack distinct appointment identities; mixed detailed/free-busy sources cannot safely establish exact meeting counts.

Coverage is `{from,to,complete,fetchedAt,maxAgeMinutes,error}` per source. All linked sources must cover the complete slot, load successfully and remain fresh before checked availability is asserted. The browser uses five-minute freshness and fresh reads per search. Partial/error/stale data retains known commitments while coverage remains unconfirmed. Accepted/tentative invitations without mapped coverage do not prove full availability.

`createReader({getToken,fetchImpl,now,...})` provides `listCalendars()`, `readSource(calendar,range,{signal})`, `normalizeSource(source,profile)` and `readCalendar(calendar,range,profile)`. Reads expand recurring instances, paginate with cycle/limit guards, support timeout/cancellation and preserve partial data on failure. Free/busy POST is a read-only query. Credentials stay outside saved settings.

## Modern results and presentation

- `options`: initial representatives.
- `allOptions`: frozen eligible ordered pool for append-three batches.
- `deadline`: exact later-date boundary.
- `errors`, `warnings`, `rejected`, `rejectionDetails`, `protectedConflicts`: validation/diagnostic facts.
- `open`, `openCount`, `clearCount`: summary/compatibility views, not displayed card counts. Use `options.length` and the displayed slice. `openCount` is raw base evaluation; `clearCount` describes retained clear representatives in the current selection branch.

Slots retain start/end instants, duration, local search date/minute, people, quality and applicable overrides/disruption. `alternativeType` is `requested`, `shorter`, `extended` or `extended-shorter`; `outsideWorkingHours` labels applicable selected choices. Labels must reflect actual request changes.

Each person retains local dates/times/zones, required status, coverage, typed conflicts, `issues`, `fitIssue`, `timing` and usual/explicit inconvenience. `participant-status.js` chooses one primary factual reason using the [priority table](meeting-options-review-0.9.4.5.md#accepted-second-row-categories-sources-and-priority). Display priority does not change eligibility. Routine unconfirmed coverage stays out of extra warnings; the calendar icon and final review retain the disclosure.

`meeting-text.js` generates concise review summaries and planning email. Planning email includes displayed suggestions and only the known-unavailable optional-person caveat, omitting internal conflicts, unknown coverage and working/convenience rules. Copying does not send or book.

## Fresh review and writes

Material changes invalidate a displayed request snapshot; unrelated persistence does not. Generate more consumes that snapshot without another read or hidden broadening. Before creation, the browser rechecks access and availability against the current review. Creation and rescheduling have separate reviewed writer paths. Replacement search removes only its target occurrence and may protect a chosen proposal during follow-ups. Other appointments change only through their own review. See [rescheduling](rescheduling.md).

## Legacy programmatic compatibility

Callers omitting `automaticAlternatives:true` retain older `findSlots` behavior. This section does not describe current browser controls.

- `want` sets a result maximum. `step` with `spacingMode:'custom'` sets a five-minute-multiple grid. Custom `perDay` caps daily results; old numeric `perDay` without a mode also acts as a cap.
- The legacy ranking selector has five bands: morning, midday, afternoon, evening, night. The modern browser has exactly three groups.
- `minDuration` is one entered shorter duration; `extendDays` is a fixed extension. Neither is the modern automatic duration ladder/workweek policy.
- Global `allowBadHours:true` can request legacy outside-hours views, while retaining hard protection. Modern automatic requests ignore it, including exact reviews.
- `fallback.groups` can expose same-date/shorter/extended/occupied groups. `fallback.softer`, `fallback.taken`, `lastResort`, and `slot.toMove` are compatibility views/aliases, not extra browser result sections.
- Legacy proposal text contains diagnostics; the browser uses `meeting-text.js` and participant-status/warning rendering instead.

New browser rules belong in the automatic policy and current contract. Changing an unused legacy argument does not change browser behavior.
