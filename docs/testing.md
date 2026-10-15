# SlotDesk validation record

Current code: **0.9.0 preview**; latest published pilot: **0.8.1**. Automated evidence and user-reported live behavior are recorded separately. No formal manual acceptance checklist remains.

## Reported live progress — 13 October 2026

The owner reports:

- The No response from the existing invited guest appeared as an alert.
- Replacement-time suggestions made sense.
- An actual reschedule completed successfully.
- Overlapping labels appeared and their details were correct.

This report covers the behavior actually observed. It does not independently verify recipient update delivery, recurring/all-day live changes or post-reschedule integrity across the entire calendar. Other edge cases currently have source/automated coverage; they are not labeled live-tested.

## Automated checks

From the repository root:

```sh
npm test
npm run test:backend
npm run test:calendar-kit
npm run check
```

| Suite | Checks | Scope |
| --- | --- | --- |
| Engine | 47 | Core scheduling semantics |
| Regression | 90 | Constraints, optional guests, travel, comfort and fallback rules |
| Calendar pilot | 78 | Profiles, timezone handling and reader normalization |
| Booking | 70 | Reviewed new invitations and duplicate-safe recovery |
| Safety/scale | 69 | Account isolation, write guards, dense reads and unchanged unrelated meetings |
| Proposal display | 76 | Date/year/DST formatting, coverage and consolidated warnings |
| Calendar view | 42 | Date ranges, events, RSVP display and source handling |
| Upgrade/synchronization | 71 | Stored-state migration and concurrent-window behavior |
| Multi-calendar cache | 48 | All-source reads, cached filters and partial coverage |
| Meeting management | 457 | Overlap oracle, No transitions, identities and follow-up metadata |
| Rescheduling | 112 | Time-only conditional writes, permissions, identity/version and recovery |
| Meeting editing | 125 | Narrow detail/guest writes, preserved metadata, stale/permission guards and recovery |
| Onboarding/scope/guests/flexibility | 71 | Selected-source transports, migration/recovery, draft guests and independent scheduling rules |
| Recovery/registration | 64 | Typed outcomes, quota, cancellation, stale/access loss, read-only setup, exact leads, manual history and collision evidence |
| **Application total** | **1,420** | Synthetic data and transports |
| Export comparator | 22 | Offline creation/export integrity comparison |

The 112 rescheduling, 70 booking and 69 safety checks were rerun after the latest live report: **251 passed**, with no real Google request or invitation. All source network entry points were reread; see the [write-boundary record](security.md#focused-calendar-write-recheck--13-october-2026).

## Synthetic browser evidence

### 0.8.1 settings and calendar polish

Local synthetic browser checks verified sidebar calendar rows/count, metadata dialog, fixed footer under scrolling, identical Settings/calendar bounds, save and discard returning to Settings, retained unsaved date choice, removed duplicate actions and own-profile-first/removal protection. First setup hides close/discard, blocks Escape and refuses empty selection; valid scope continues to optional people. Date-order checks include both orders, AM/PM, midnight, future-year rollover and warning/copy labels. Long identity and calendar names are checked for truncation without horizontal overflow. No real Google account, invitation or event mutation is used.


### 0.8.0 onboarding and profiles

The focused local fixture exercised own-profile-first setup, searched timezone choice, explicit calendar scope/default, optional familiar-person skip, main calendar mappings, direct focused travel access, multiple profiles on a team source, saved defaults/per-meeting overrides, manual additions/removals during calendar switches, unsaved email guests, mandatory timezone confirmation and reload continuation. No event reads occurred before scope confirmation; excluded guest/busy sources were not requested.

One reviewed synthetic invitation was created in the chosen team calendar for exactly Alpha, Nina and the unsaved email guest. All eight original appointments remained unchanged; zero PATCH, DELETE, full replacement or move requests occurred. A second open workspace cleared an excluded team's events, refreshed the remaining source and preserved inactive profile mappings. Existing-meeting guest addition reached review without forcing a saved profile. Rescheduling blocked source reads until an unsaved guest’s timezone was confirmed, then produced options without saving a profile or writing a change. An isolated upgrade fixture preserved all 50 saved profiles and excluded mappings, with zero event reads before explicit scope confirmation. A final fresh setup produced no phantom draft, and a second synthetic booking cleared temporary guests and meeting rules after completion. Across both bookings, two insertions and no existing-event mutations were recorded; all eight originals remained unchanged. No real account, message or invitation is involved.


The 0.7.1 fixture used 50 saved profiles and eight original appointments. It exercised searchable guest selection, short profile setup for a new email, Required/Optional changes, explicit guest removal, field comparison, known-conflict/unconfirmed warnings and a combined details/guest save. One event changed; seven unrelated appointments, its times and protected metadata remained unchanged. Retained RSVP values survived and a newly added guest had needsAction status.

A second title-only edit deliberately lost both the PATCH response and initial readback. Reload recovered the saved intent by reading the same ID, without another PATCH. The other open window updated its cached title through an ID-only completion notification. Across these flows, the fixture recorded two PATCH requests, zero insertions and zero deletion/full-replacement/move requests. No Google account or real invitation was used. These editing flows have not been labeled live-tested. At 420px the review had no horizontal overflow and retained a visible fixed heading/close control.

![Meeting editing review with synthetic data](assets/edit-meeting-v071.jpg)

### Earlier 0.7.0 browser evidence

The 0.7.0 browser fixture used 50 profiles and eight original appointments. It exercised alerts/dismissal, missing profiles, overlap details, OTHER-appointment planning, all-day dates, a single recurring occurrence, concurrency and reload recovery.

The main fixture made six time-only PATCH requests across four explicitly selected original appointments and one new-event insertion. It made zero delete/full-replacement/calendar-move requests. Selected non-time fields and the other four original appointments remained unchanged, including a neighboring recurring occurrence. Concurrent confirmations produced one PATCH. A separate lost-response fixture recovered the same event after reload with one PATCH and no duplicate write. These are mocked outcomes, not observations of a real Google account.

At 420px, date inputs remained on one row, heading/close stayed fixed, and the VT323 wordmark used the full lime header without horizontal overflow.

![Overlap details with synthetic data](assets/overlaps-v070.png)

[Synthetic before/after review](assets/rescheduling-v070.png).

Earlier fixtures covered 6,000 paginated events, 2,000 unchanged unrelated meetings, 54-calendar browsing, cached filtering and multiple-window synchronization. Recorded product releases retain their historical validation counts in the [changelog](changelog.md).

## Previously recorded live evidence

- The initial dense-calendar comparison independently preserved all **1,013 original components**, with exactly one new event and the expected own-profile attendee, time and Meet link.
- Delivery of invitation 02 and visible Yes/No responses were reported by the owner.
- The older stale-window protection behaved as expected by user report; newer synchronization has synthetic coverage.

No post-reschedule export has been supplied. The initial creation comparison is not relabeled as evidence for later writes. Calendar exports and private evidence stay outside Git. The [optional offline comparison kit](calendar-acceptance.md) remains available for reproducing integrity analysis, without a required user checklist.

## Source and package evidence

The standalone migration passed syntax/link/asset/manifest checks and all application/comparator suites. A fresh checkout reproduced the existing 0.7.0 ZIP exactly, preserving the extension/OAuth identity and fonts. [Migration record](migration.md).

The focused source review and synthetic outcomes are not a guarantee against every future bug or browser/account condition. They establish the current explicit write boundaries and tested cases; work-account access remains subject to organization permissions.


## 0.9.0 preview verification — 15 October

All 1,420 application checks, six server-intake test cases and 22 export-comparison checks passed. Focused mocked browser checks at 390 px verified read-only onboarding, both optional update choices, registration payload/status, stale meeting retention, access-loss purging, same-account reconnection, read-only Check result, acknowledged manual resolution/history and corrupt-storage preservation. Transport statistics showed zero calendar POST/PATCH/delete/move calls in these recovery/setup checks and eight original events unchanged. Expected injected HTTP failures and the fixture favicon were distinguished from application exceptions; the missing read-only explanation element found during the check was fixed before completion.

The private database schema has exactly five columns, and SQL privilege inspection confirms the intake role can INSERT but cannot SELECT, UPDATE or DELETE. Server handler tests use synthetic inputs and do not insert test contacts into the live leads table. Live endpoint/database round-trip verification is pending Vercel environment-variable access; central submission is not claimed active.
