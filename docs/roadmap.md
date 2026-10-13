# SlotDesk roadmap

Updated 13 October 2026. Status reflects agreed scope, not a promise of public availability. The broader website remains on hold.

## Current release

Version **0.7.1** includes [F01–F18](implemented.md), the [accepted UX](ux-decisions.md), Google reading, reviewed new-event creation, recovery, a home menu, existing-meeting browsing/RSVPs, overlap details, declined-response alerts, reviewed guest/detail editing and rescheduling, searchable participants and the supplied design treatment. The project owner reports that the basic live flow works. Source review and synthetic stress tests are recorded in [security/privacy](security.md) and [testing](testing.md).

## Next milestones, in order

| Order | Milestone | Status |
| --- | --- | --- |
| 1 | Continue the Google Calendar pilot | Basic creation/export integrity passed. The owner reports working No alerts, sensible proposals, successful rescheduling and correct overlaps. Work-account access depends on organization permissions. |
| 2 | Outlook / Microsoft 365 | Accepted next provider: OAuth, reading and reviewed writes, shared/delegated calendars, optional guests, recurrence, timezones and Teams links. Not needed for the Google pilot. |
| 3 | Wider distribution | Supported installation/update route, applicable Google and organization requirements, accurate privacy/data-retention information and a public license/visibility decision. |

Q01–Q24 scheduling policies are answered. The [parked UX feedback](pending-ux-review.md), rescheduling and decline alerts are implemented. The [validation record](testing.md) distinguishes automated coverage from actual user-reported behavior; unperformed live cases are not marked passed.

## Accepted rescheduling boundary

The existing-meeting browser is the implemented entry point. Version 0.7.0 adds the separately guarded existing-event mutation path described below. Bind each review to the account, provider, calendar, event identifier and current event version; reject a stale event rather than overwriting someone else's change. Preserve event content and recipients unless the EA explicitly edits them. Use a targeted update, with no delete-and-recreate workflow and no automatic movement of other appointments.

The accepted first version changes one recurring occurrence only; read-only/guest copies support manual coordination. Google sends updates to retained guests after explicit confirmation. Show current and proposed full local dates/times, warnings and the exact update in final review. Automated coverage includes recurrence, permission, stale-version and unrelated-event integrity checks. Reference contracts: [Google events patch](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch), [Microsoft event update](https://learn.microsoft.com/en-us/graph/api/event-update?view=graph-rest-1.0).

Version 0.7.1 adds [reviewed guest/detail editing](meeting-editing.md) as a separate narrow update path. Time changes retain their original dedicated review. Whole-series changes, conference/attachment/reminder editing and calendar moves are outside this update.

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
