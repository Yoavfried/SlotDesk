# SlotDesk roadmap

Updated 13 October 2026. Status reflects agreed scope, not a promise of public availability. The broader website remains on hold.

## Current release

Version **0.7.0** includes [F01–F17](implemented.md), the [accepted UX](ux-decisions.md), Google reading, reviewed new-event creation, recovery, a home menu, existing-meeting browsing/RSVPs, overlap details, declined-response alerts and reviewed rescheduling, searchable participants and the supplied design treatment. The project owner reports that the basic live flow works. Source review and synthetic stress tests are recorded in [security/privacy](security.md) and [testing](testing.md).

## Next milestones, in order

| Order | Milestone | Status and completion evidence |
| --- | --- | --- |
| 1 | Finish the work-account gate | Source review, write guards and synthetic tests completed in 0.4.0. First dense-calendar creation/export comparison passed: all 1,013 original components unchanged and exactly one new event. Later invitation/Yes/No display and two-window behavior are user-reported. Remaining: the three-session live checklist (rescheduling/RSVPs/overlaps, shared/revoked permissions and updated window synchronization), one final export comparison and workplace access approval. |
| 2 | Nina's Google Workspace pilot | Nina uses Google Calendar at work. Connect after milestone 1 passes; verify delegated permissions, real recurring/all-day events, timezones, partial coverage, invitation delivery and Meet results without publishing calendar details. |
| 3 | Reschedule an existing meeting | Implemented in 0.7.0; controlled live time-change/recurring occurrence acceptance and export integrity remain required. See [rescheduling](rescheduling.md). |
| 4 | Outlook / Microsoft 365 | Accepted next provider. Add provider-specific OAuth, reading and reviewed writes behind a shared scheduling contract. Validate shared/delegated calendars, optional guests, recurrence, timezones and Teams links. Not needed to start Nina's Google pilot. |
| 5 | Wider distribution | Decide a supported installation/update route, complete Google approval and organization requirements, and publish accurate privacy/data-retention information before opening the audience. |

There are no unanswered scheduling-policy blockers in Q01–Q24. Future features have their own design questions; this does not reopen settled scheduling rules.

The [parked feedback](pending-ux-review.md) is implemented; 0.6.1 adds the revised date-range/multi-calendar cache. The owner authorized DF05 decline alerts and rescheduling in 0.7.0. Remaining acceptance is consolidated into [three live sessions and one final export](combined-live-check.md); already verified invitations are reused.

## Accepted rescheduling boundary

The existing-meeting browser is the implemented entry point. Version 0.7.0 adds the separately guarded existing-event mutation path described below. Bind each review to the account, provider, calendar, event identifier and current event version; reject a stale event rather than overwriting someone else's change. Preserve event content and recipients unless the EA explicitly edits them. Use a targeted update, with no delete-and-recreate workflow and no automatic movement of other appointments.

The accepted first version changes one recurring occurrence only; read-only/guest copies support manual coordination. Google sends updates to retained guests after explicit confirmation. Show current and proposed full local dates/times, warnings and the exact update in final review. Add recurrence, permission, stale-version and unrelated-event integrity tests before enabling writes. Reference contracts: [Google events patch](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch), [Microsoft event update](https://learn.microsoft.com/en-us/graph/api/event-update?view=graph-rest-1.0).

## Additional candidates after the pilot

These are proposals to prioritize from pilot feedback, not implemented promises:

- Profile search/management refinements based on actual large-profile usage; accessible keyboard interaction and a full copy review across error/recovery states.
- Clearer recovery from revoked sharing, expired permission, offline operation and request limits. The current reader has bounded retries and the writer preserves uncertain sends; validate these in real accounts.
- Safe profile export/import or backup, if testers need it. Constraints and contact details need a privacy design before introducing sync or a backend.
- A supported extension update channel, organization onboarding guidance and a user-visible data-retention explanation before public distribution.

Standalone free-tool integration remains an accepted future direction; obtain its source before planning migration onto the shared engine.

## Future features — deferred and non-blocking

The user explicitly requested these as work **not to develop now**.

| ID | Feature | Intended direction | Status |
| --- | --- | --- | --- |
| DF01 | Small LLM reading calendar-related emails | Suggest positive/negative availability, timezones, flights and other scheduling details from emails, with review before use. | Deferred; no email access or LLM integration |
| DF02 | Read written information inside appointments | Use descriptions and other appointment text for richer clues beyond current deterministic matching. | Deferred; extraction/review design needed |
| DF03 | Live flight updates | Possibly connect specific flights to an API for live updates. Provider, pricing and update policy are undecided. | Deferred; exploratory |
| DF06 | Search meetings by written content | Possible search by meeting name, participants, location or any written appointment information. No search/indexing UI now. | Deferred; explicitly requested 13 October |

DF04 rescheduling and DF05 decline alerts were authorized and implemented in 0.7.0; they are no longer deferred. The [accepted flow](rescheduling.md) records individual time changes, notification/refresh limits and nonautomatic collision handling. Manual travel and confirmable non-LLM clues are implemented.
