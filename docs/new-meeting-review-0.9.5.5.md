# New meeting review — 0.9.5.5

Reviewed 28 October 2026. The review covered the live browser controller and automatic scheduling policy, with independent source reviews of each area. Confirmed defects were fixed in this update. No unresolved product decision was identified in the reviewed New meeting flow. This is a bounded review, not a claim that every possible browser or calendar state is bug-free.

The [current contract](new-meeting-current-contract.md) defines the implemented behavior. Historical decision records and the engine's legacy compatibility interface are not alternative browser rules.

## Scope

| Area | Reviewed behavior |
| --- | --- |
| Participants | Saved profiles, email-only guests, required/optional status, timezone confirmation, profile promotion, removal and organizing-calendar automatic inclusion. |
| Time and calendars | Relative/custom dates, search timezone, selected calendar scope, availability coverage, DST, profile rules and travel timezone transitions. |
| Scheduling | Working/convenience hours, explicit blockers, protected events, ordinary overlap permissions, optional attendance, 10-/5-minute precision, shortening and next-workweek fallback. |
| Results | Three time groups, earliest useful dates, one-per-day long ranges, non-overlapping options, initial counts, append-three generation, factual statuses and consolidated warnings. |
| Invitation review | Edited time/calendar/attendees, fresh availability before sending, renewed confirmation when facts change, duplicate prevention and reserved operation identity. |
| Recovery and state | Uncertain sends, retry with email-only guests, offline handling, cancellation, saved drafts, profile changes and cross-window invalidation. |
| Planning email | Editable subject/message, visible options only, friendly timezone names, optional-attendee caveats, exclusion of internal conflict or convenience information and clipboard fallback. |

## Fixed findings

| Finding | Correction |
| --- | --- |
| The loading cancel control floated over unrelated content. | Normal outlined button in the results section; equivalent inline controls in review/rescheduling dialogs. |
| Copy message touched the message field. | Consistent 14px gap, with separate subject/message groups. |
| Duration changes left old options actionable and could be overwritten by unrelated form refreshes. | Valid input saves immediately; every edit invalidates existing options. |
| Pending-invitation retry lost temporary guests' identities. | Recovery resolves both saved and email-only participants and preserves their confirmed timezones and original invitation ID. |
| Changed overlap details could bypass renewed confirmation when their count stayed unchanged. | The review fingerprint includes conflict intervals, factual reasons and optional-guest conflicts, while ignoring fetch timestamps and equivalent ordering. |
| Calendar-selection copy promised to retain links that saving would remove. | The warning now describes the actual removal behavior. |
| Cancel did not interrupt the initial calendar-list read. | The cancellation signal reaches that read as well as event reads. |
| An inactive workweek template could extend a manual schedule's fallback by an extra week. | The horizon follows the active weekday schedule. |
| A flight near the fallback deadline could resolve that deadline in the wrong timezone. | Resolve the actual date transition in the effective timezone, including travel/date-line changes and older saved travel rules combined with newer trips. |
| Generate more could offer overlaps while omitting a clear after-work option. | Keep one eligible clear after-work representative before compromises in appended results, while preserving initial working-hour choices and diversity rules. |

## Verification

- Complete automated suite: 2,520 checks passed, including 27 controller regressions and 87 selection/fallback checks.
- Chrome and Edge: cancel during initial calendar access, retry a search after cancellation, duration invalidation, inline cancellation in invitation review and rescheduling, and planning-email spacing at 320px, 514px and 1280px.
- Chrome: relative/custom dates, Ghana timezone searches, real remote-edit invalidation, fresh onboarding, suggested/manual profiles, timezone history repair and restart.
- Edge: email-only guest creation, required timezone, invitation review, promotion without duplication, no-default-calendar onboarding and unfinished invitation resumption.
- Edge: initial option counts, append-more stability without extra reads, planning-email content/editability, per-meeting exclusions and participant rows at 320–1280px.
- The browser scenarios issued no calendar writes. All nine baseline synthetic appointments remained unchanged.

## Remaining boundaries

- No real Google authorization, invitation delivery or Google Calendar write was performed for this review. Native macOS and Firefox interaction were not exercised in this update.
- Missing calendar coverage remains unconfirmed rather than a guarantee of availability; optional attendees remain invited unless removed.
- Search evaluation runs synchronously after calendar loading. Cancel stops calendar loading; it does not interrupt a calculation already running on the browser thread.
- Legacy fields and programmatic engine options remain for saved-data/API compatibility. They are not shown as current New meeting controls and do not replace the automatic browser policy.
- Visual preference and release-readiness approval remain with the product owner.
