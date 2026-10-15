# SlotDesk roadmap

Updated 15 October 2026. Status reflects agreed scope, not a promise of public availability. The broader website remains on hold.

## Current release

Version **0.9.0 preview** implements the accepted [connection/recovery experience](recovery-experience.md), including read-only setup, stale in-memory lists, separate Check/Retry, manual operation history and unreadable-storage recovery. The five-field [onboarding leads implementation](leads-table.md) has a deployed private intake and database. This preview is configured to send registrations, keeping failed submissions queued locally. [Deployment checks](registration-deployment.md) passed; first real registration from the updated extension remains to be observed. The latest published pilot remains 0.8.1.

The existing [implemented work](implemented.md), [accepted UX](ux-decisions.md), reviewed calendar writes, management, profiles and design language remain. No new real Google or email-delivery verification is claimed by this preview.

## Profile/calendar update — implemented in 0.8.0

The authorized onboarding, travel, timezone, mapping, guest and flexibility work from the [14 October product review](product-review-2026-10-14.md) is implemented; see [final behavior](onboarding-and-profiles.md). Workspace scope now replaces read-all-accessible-event behavior. The broader settings/profile layout redesign remains proposed, as do further copy/accessibility refinements and local backup.

## Availability emails — unconfirmed future feature

[Ask about times](time-inquiries.md) is parked after reviewing Gmail AMP's compatibility and sender/service requirements. It is not part of the next update. The owner is considering it only for users supplying an LLM API key, with model-assisted inquiry writing and reply interpretation. Both the BYOK-only restriction and final reply protocol are unconfirmed. No external response page is approved; a model does not solve inline controls in unsupported email clients. An inquiry response does not itself authorize booking.

## Optional LLM assistance — future direction

The owner wants [bring-your-own-key LLM assistance](llm-assistance.md), with prepared prompts and the cheapest model that performs each task reliably. Intended tasks include reading scheduling emails and appointment text, drafting availability inquiries, interpreting replies, explaining rule-aware choices and eventually creating optimized appointments directly in an explicitly authorized automation mode. Provider/model, cost controls, key/data handling, email permissions and direct-creation authorization remain open. No LLM feature or email access is implemented in 0.8.1; these ideas remain deferred.

## Next milestones, in order

| Order | Milestone | Status |
| --- | --- | --- |
| 1 | Refine profiles, calendar scope and meeting setup | Authorized scope implemented in 0.8.0; broader organization refinements remain proposed. |
| 2 | Continue the Google Calendar pilot | Basic creation/export integrity passed. The owner reports working No alerts, sensible proposals, successful rescheduling and correct overlaps. Work-account access depends on organization permissions. |
| 3 | Outlook / Microsoft 365 | Accepted next provider: OAuth, reading and reviewed writes, shared/delegated calendars, optional guests, recurrence, timezones and Teams links. Not needed for the Google pilot. |
| 4 | Wider distribution | Supported installation/update route, applicable Google and organization requirements, accurate privacy/data-retention information and a public license/visibility decision. |

Q01–Q24 scheduling policies are answered. The [parked UX feedback](pending-ux-review.md), rescheduling and decline alerts are implemented. The [validation record](testing.md) distinguishes automated coverage from actual user-reported behavior; unperformed live cases are not marked passed.

## Accepted rescheduling boundary

The existing-meeting browser is the implemented entry point. Version 0.7.0 adds the separately guarded existing-event mutation path described below. Bind each review to the account, provider, calendar, event identifier and current event version; reject a stale event rather than overwriting someone else's change. Preserve event content and recipients unless the EA explicitly edits them. Use a targeted update, with no delete-and-recreate workflow and no automatic movement of other appointments.

The accepted first version changes one recurring occurrence only; read-only/guest copies support manual coordination. Google sends updates to retained guests after explicit confirmation. Show current and proposed full local dates/times, warnings and the exact update in final review. Automated coverage includes recurrence, permission, stale-version and unrelated-event integrity checks. Reference contracts: [Google events patch](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch), [Microsoft event update](https://learn.microsoft.com/en-us/graph/api/event-update?view=graph-rest-1.0).

Version 0.7.1 adds [reviewed guest/detail editing](meeting-editing.md) as a separate narrow update path. Time changes retain their original dedicated review. Whole-series changes, conference/attachment/reminder editing and calendar moves are outside this update.

## Additional candidates after the pilot

These are proposals to prioritize from pilot feedback, not implemented promises:

- Profile search/management refinements based on actual large-profile usage; accessible keyboard interaction and a full copy review across error/recovery states.
- Recovery implementation now has synthetic coverage in 0.9.0; real-account behavior remains subject to Google and workplace access.
- Safe profile export/import or backup, if testers need it. Constraints and contact details need a privacy design before introducing sync or a backend.
- A supported extension update channel, organization onboarding guidance and a user-visible data-retention explanation before public distribution.

Standalone free-tool integration remains an accepted future direction; obtain its source before planning migration onto the shared engine.

## Future features — deferred and non-blocking

The user explicitly requested these as work **not to develop now**.

| ID | Feature | Intended direction | Status |
| --- | --- | --- | --- |
| DF01 | Optional BYOK LLM assistance | User supplies an API key; prepared prompts extract scheduling/availability/timezone/travel information and explain validated choices, using the cheapest reliable model for each task. See [LLM plan](llm-assistance.md). | Deferred future direction; provider, keys, costs and email access undecided |
| DF02 | Read written information inside appointments | Optional LLM assistance extracts clues from descriptions and other appointment text beyond current deterministic matching. | Deferred; data/extraction/review design needed |
| DF03 | Live flight updates | Possibly connect specific flights to an API for live updates. Provider, pricing and update policy are undecided. | Deferred; exploratory |
| DF06 | Search meetings by written content | Possible search by meeting name, participants, location or any written appointment information. No search/indexing UI now. | Deferred; explicitly requested 13 October |
| DF07 | Availability inquiry emails | Ask one/many people about one/many times; potentially BYOK-only, with LLM drafting and reply interpretation. Original inline form design remains recorded. | Unconfirmed future feature; parked, not a current milestone |
| DF08 | LLM-driven direct appointment creation | Create an optimized appointment with factual reasoning, subject to the full validated rule set and an explicitly enabled automation policy. | Future request; authorization/operating limits unsettled |

DF04 rescheduling and DF05 decline alerts were authorized and implemented in 0.7.0; they are no longer deferred. The [accepted flow](rescheduling.md) records individual time changes, notification/refresh limits and nonautomatic collision handling. Manual travel and confirmable non-LLM clues are implemented.
