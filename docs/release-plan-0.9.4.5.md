# 0.9.4.5 — new-meeting release plan

Owner scope change: 20 October 2026. All currently planned new-meeting development moves from 0.9.5 to 0.9.4.5; only advanced-profile-settings review/cleanup remains in 0.9.5. The agreed overlap-alert review screen also moves here so it is not left behind in a profile-only release. Planning only: implementation authorization and owner UX approval are still pending. Current runtime/package remain 0.9.4.

## Scope already directed by the owner

- Compact participant rows with calendar coverage icons, friendly timezone/local-time labels, one factual main status and reviewed substantive warnings; remove the card-wide calendar-data badge.
- Remove individual Copy option actions and excluded-candidate diagnostics; keep a concise Copy meeting details action in the final review.
- Remove Start-time spacing, Options per day, Options to show, entered shorter-duration/extension targets, the global outside-hours choice, the grid explanation and the search Calendar data/Refresh panel. Preserve Existing meetings refresh and fresh availability checks for Find a time and booking.
- Automatic meaningful counts, append-three Generate more options behavior and no mutually overlapping displayed suggestions, including across batches/categories.
- Automatic 15-minute shortening with the agreed floors, used only for actual conflicts or blocking rules; automatic qualifying later dates bounded by the earliest required participant's next-workweek deadline anchored to the selected search end's week. Optional guests remain non-blocking.
- Per-person Ignore usual convenience hours also permits that person's outside-range times; other participants and independent hard/soft rules retain their settings. Use existing saved defaults and meeting overrides without redesigning the profile editor.
- Meeting-wide excluded intervals below Search timezone; person-specific temporary rules belong in Options for this meeting, with profile-editor reorganization kept for 0.9.5.
- Generate planning email for all displayed suggestions, subject/message copy controls and only the approved optional-person-unavailable caveat; no email sending or interactive reply feature.
- Friendly timezone labels across the interface and copied text, retaining correct IANA scheduling and the selected city's identity.
- Review overlaps per connected group, individual appointment actions and fresh relationship checks; no automatic moves or bulk changes.

See the detailed [cards/warnings](meeting-options-review-0.9.4.5.md), [search policy](search-options-review-0.9.4.5.md), [planning email](planning-email.md), [timezone](timezone-search.md) and [overlap](rescheduling.md) records. Existing confirmed rules are not reopened merely by this release split.

## Remaining owner review and genuine policy interactions

The recommendations below are proposals, not already approved policy. Each should be settled before implementing the affected behavior.

1. **Full versus shortened choices occupying the same gap.** Example: requested 45 minutes at 13:00 overlaps an appointment from 13:30; 13:00–13:30 is clear. Requested-duration-first ordering and forbidding overlapping suggestion cards cannot retain both. Recommendation: keep the clash-free shortened choice for that gap; preserve requested-duration-first ordering for other independent choices. If neither is clear, only replace a full-duration choice with a shorter one when it genuinely reduces known conflict, not merely timing inconvenience.
2. **What counts as a perfect later-date option.** Recommendation: all required participants meet their active rules with no known calendar conflict or active timing inconvenience. Unknown calendar access remains visibly unconfirmed and does not itself forbid a later choice; an optional participant's conflict does not block it. An explicitly ignored usual-hour preference is not a remaining compromise. This must not be described as calendar-confirmed availability when sources are missing.
3. **What makes a partly improved shorter option worth showing.** Recommendation: first reduce distinct affected appointments; if equal, reduce actual overlap minutes without making another required participant worse under the agreed participant priorities. Require strict improvement over the full-duration version. Never mitigate by crossing an explicit hard block. Preserve the agreed full/shorter/later category ordering except for the single-gap choice settled in item 1.
4. **Workweek deadlines for manual schedules or ignored working rules.** Recommendation: keep the saved workweek as the horizon reference even when working-day enforcement is ignored. Define how manual weekday patterns determine the week boundary and what to use if no working days are enabled; the editor redesign can wait, but this scheduling decision cannot be silently delegated to it. A reasonable fallback is a Monday–Sunday reference week when no saved pattern provides a boundary. Mixed required deadlines still use the earliest actual instant.
5. **Final participant status, priority and warning text.** The detailed priority/source table is still a proposal; meeting-overlap-before-day-off is already agreed. Review the remaining order, one-row behavior in narrow windows, private/busy-only titles and the exact short labels. Recommendation for ignored usual hours: do not call the person unavailable or add a usual-hour warning solely for the rule they deliberately ignored; keep the actual local time visible and retain independent reasons. Extra warnings should supply actual additional facts/actions, not repeat rows or generic unknown-availability messages.

## Implementation choices Codex can make within the agreed UX

- Generate more options uses the current search snapshot and the same ranking/precision/diversity rules; it does not silently relax them or initiate a new date/duration permission. Fresh Find a time starts a new search; relevant participant/profile/request changes invalidate the old results. Booking always rechecks current availability. Additional batches must not shuffle existing cards.
- Reuse consistent date/time forms for global and per-person temporary intervals, with clear meeting-only scope. Preserve existing saved dated constraints and their semantics during migration; do not erase or silently recategorize them because the editor is changing later.
- Use an editable, temporary planning-email preview with separate subject/body copy controls. Generate from all currently displayed valid options and their factual times, not internal candidates or screen-truncated labels. The owner can refine the proposed greeting/closing during review.
- Persist optional selected-city metadata in a backward-compatible way. Existing valid IANA-only records/imports remain usable, and missing display metadata does not change meeting instants.
- The same engine rules must work for new meetings and rescheduling; preserve the original appointment identity and reviewed update flow. Keep create, reschedule and edit write protections and uncertain-result recovery.

These implementation choices are recommendations within the intended scope, not a declaration that the remaining owner review is complete.

## Verification after implementation authorization

Exercise duration boundaries (30/45/60/90 and non-multiples), full/short single-gap choices, hard-block rejection, genuine conflict reduction, required/optional and missing-calendar cases, mixed/custom/ignored workweeks, DST/travel dates, per-person outside-hours permissions, counts/diversity/non-overlap across batches, changed-input invalidation, private event details, email caveat boundaries and narrow-width keyboard-accessible cards. Verify booking and rescheduling retain fresh checks, explicit confirmation and correct original-event targeting. Synthetic checks do not certify owner UX approval or live Google behavior.
