# SlotDesk validation record

Current product: **0.7.0**. Automated evidence and user-reported live behavior are recorded separately. No formal manual acceptance checklist remains.

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
| Proposal display | 66 | Date/year/DST formatting, coverage and consolidated warnings |
| Calendar view | 42 | Date ranges, events, RSVP display and source handling |
| Upgrade/synchronization | 67 | Stored-state migration and concurrent-window behavior |
| Multi-calendar cache | 48 | All-source reads, cached filters and partial coverage |
| Meeting management | 457 | Overlap oracle, No transitions, identities and follow-up metadata |
| Rescheduling | 112 | Time-only conditional writes, permissions, identity/version and recovery |
| **Application total** | **1,146** | Synthetic data and transports |
| Export comparator | 22 | Offline creation/export integrity comparison |

The 112 rescheduling, 70 booking and 69 safety checks were rerun after the latest live report: **251 passed**, with no real Google request or invitation. All source network entry points were reread; see the [write-boundary record](security.md#focused-calendar-write-recheck--13-october-2026).

## Synthetic browser evidence

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
