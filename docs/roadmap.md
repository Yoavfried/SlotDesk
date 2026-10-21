# SlotDesk roadmap

Updated 20 October 2026. Status reflects agreed scope, not a promise of public availability. The broader website remains on hold.

## Current release

Version **0.9.4.6** adds the [desktop compatibility implementation](release-plan-0.9.4.6.md), with [activation](browser-signin-setup.md), per-target evidence and [remaining store work](extension-stores.md) documented. The prior **0.9.4.5** implements the authorized [new-meeting update](release-plan-0.9.4.5.md): automatic alternatives and batching, compact factual rows, friendly zones, planning-email text and grouped overlap review. The existing onboarding, profile/calendar scope, live configuration, backup/import, connection recovery and reviewed calendar writes remain. The five-field onboarding leads service is deployed and configured for the private pilot. See [version history](changelog.md) and [validation](testing.md).

The existing [implemented work](implemented.md), [accepted UX](ux-decisions.md), reviewed calendar writes, management, profiles and design language remain. No new real Google or email-delivery verification is claimed by this update.

## Profile/calendar update — implemented in 0.8.0

The authorized onboarding, travel, timezone, mapping, guest and flexibility work from the [14 October product review](product-review-2026-10-14.md) is implemented; see [final behavior](onboarding-and-profiles.md). Workspace scope now replaces read-all-accessible-event behavior. The next selected direction is the [usability review](usability-review.md): profile/Settings/travel organization, keyboard/accessibility, a first wording pass and local backup with selectable profile export/import. The backup/import contract is settled. On 18 October the owner settled [profile/flight saving](usability-flows.md): valid profile settings save live; each flight has Save/Discard, with optional two-flight return entry. The former save-policy blockers are resolved. The accepted live-saving, flight/travel forms, backup/import, initial wording and keyboard improvements are implemented in 0.9.2. The wider user-experience review remains open and requires the owner’s approval. Accessibility engineering is a separate active workstream.

## Next work item

The [19 October scheduling/ranking review](scheduling-ranking-review.md) is implemented in **0.9.4**: 10-minute base starts, eligible 5-minute refinements, a universal five-minute minimum, one truthful result list, required-guest/own-profile priorities, explicit conflict types and earliest-date/time-band variety. Historical 0.9.4 spacing/per-day overrides are removed from the 0.9.4.5 UI in favor of the accepted automatic policy.

The owner authorized the [styling direction](styling-0.9.4.md) and basic profile/calendar cleanup as **0.9.3.5**. It implements DM Sans, sentence-case normalization, including the personal/More settings headings, provisional regular page titles, drawn arrows, compact spacing and stable scrollbar layout. The profile changes and field-level boundaries are documented in the [validation inventory](profile-validation.md).

## 0.9.4.5 — new-meeting update

On 20 October, the owner moved the complete new-meeting development previously planned for 0.9.5 into **0.9.4.5**, leaving only advanced-profile-settings cleanup in **0.9.5**. The owner then explicitly authorized implementation; the update is implemented. This does not declare the wider UX ready. See the [scope, remaining decisions and implementation checks](release-plan-0.9.4.5.md).

The [Meeting options participant-row and warning review](meeting-options-review-0.9.4.5.md) records the owner's accepted 18-category table: factual data sources, row wording and first-applicable display priority. Responsive first-row handling and detailed warning presentation remain subject to owner UX review. The accepted status table is no longer an outstanding decision.

The [search-controls review](search-options-review-0.9.4.5.md) covers removal of spacing/per-day/count fields and the explanatory spacing paragraph; the accepted initial counts, mutually non-overlapping suggestions and Generate more options batches; meeting-only exclusions; automatic conflict/blocking-only shortening and workweek-based later dates; and removing the global outside-hours control while expanding per-person Ignore usual convenience hours to permit that person's outside-range times. Existing hard protections and independent settings remain in force.

[Planning emails](planning-email.md) include every displayed option and only the approved known-unavailable optional-participant caveat, without exposing optional status, overlaps or internal availability reasoning. [Friendly timezone labels](timezone-search.md#friendly-display-labels--0945-owner-direction) use City, Country or US City, State code throughout ordinary UI and copied text; non-city selections such as UTC keep their simple name.

The agreed overlap-alert screen also moves to 0.9.4.5: each connected group of actual overlaps offers **Review overlaps**, showing each appointment once with its date/time, calendar, exact overlapping appointments and an individual Reschedule action. Keep unrelated groups separate, require individual review/confirmation and clear only resolved relationships after fresh checks. See [rescheduling](rescheduling.md).

This release may apply the agreed scheduling semantics to existing saved defaults and per-meeting overrides without redesigning the advanced-profile editor. The separate profile review does not block 0.9.4.5. All targeted policy decisions were accepted and implementation was authorized. That new-meeting release was 0.9.4.5; current runtime/packages are 0.9.4.6. The owner expects to continue appointment-logic and issue review after this update; do not auto-start the advanced-profile review or infer final UX approval.

## 0.9.5 — advanced profile settings

Reserved only for a complete owner-led **wording, UX and logic review of Edit profile's advanced settings**, including every More settings section, followed by the specified fixes. Do not begin that review-driven cleanup or release 0.9.5 until the owner performs the review and gives directions; release also requires their approval. Codex must not infer readiness or substitute source/tests for the owner's review.

## Browser compatibility — 0.9.4.6 implemented foundation

The owner approved and authorized the [compatibility implementation](browser-compatibility.md). Shared platform/authentication, separate packages and store-readiness documentation are delivered. [Owner activation](browser-signin-setup.md), real-provider verification, Brave/Opera/Firefox/Apple/other-OS validation, Firefox signing and Safari's separate authentication bridge remain. No public store submission is made. Mobile and a hosted no-install workspace remain separate decisions.

## Error reporting — system-wide review required

Owner direction, 21 October: review explanations, next actions and presentation throughout the system. The first same-version 0.9.4.5 hotfix classifies Google sign-in failures, including unsupported/disabled browser identity. The [full review inventory](error-reporting-review.md) remains open; this is separate from the advanced-profile review reserved for 0.9.5. [Browser-independent Google consent](google-connection.md) is feasible in the approved-email closed beta without Chrome Web Store publication; its authentication code is implemented in 0.9.4.6; hosting activation and real-provider verification remain.

## Current review work

| Workstream | Status | Completion authority |
| --- | --- | --- |
| Overall UX, buttons, layout at different widths and wording | Open; owner review required. Do not mark Ready or Mostly ready based on source or tests. | Owner decides when the experience is ready. |
| Accessibility engineering | First technical pass implemented in 0.9.3: keyboard/focus, labels, contrast, errors and reflow. Screen-reader/manual review remains open; see the accessibility record. | Engineering checks document coverage; they do not certify complete accessibility or approve the overall UX. |

## Availability emails — unconfirmed future feature

[Ask about times](time-inquiries.md) is parked after reviewing Gmail AMP's compatibility and sender/service requirements. It is not part of the next update. The owner is considering it only for users supplying an LLM API key, with model-assisted inquiry writing and reply interpretation. Both the BYOK-only restriction and final reply protocol are unconfirmed. No external response page is approved; a model does not solve inline controls in unsupported email clients. An inquiry response does not itself authorize booking.

## Optional LLM assistance — future direction

The owner wants [bring-your-own-key LLM assistance](llm-assistance.md), with prepared prompts and the cheapest model that performs each task reliably. Intended tasks include reading scheduling emails and appointment text, drafting availability inquiries, interpreting replies, explaining rule-aware choices and eventually creating optimized appointments directly in an explicitly authorized automation mode. Provider/model, cost controls, key/data handling, email permissions and direct-creation authorization remain open. No LLM feature or email access is implemented in 0.8.1; these ideas remain deferred.

## Next milestones, in order

| Order | Milestone | Status |
| --- | --- | --- |
| 1 | Refine profiles, calendar scope and meeting setup | Authorized scope implemented in 0.8.0; the accepted profile/travel/files refinement shipped in 0.9.2. |
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

- Owner-led review of the overall user experience: flows, controls/buttons, screen-width flexibility, layout and wording across setup, profiles, scheduling, management, alerts and recovery. Only the owner decides when this is ready; implementation or automated checks do not establish UX approval.
- Recovery implementation now has synthetic coverage in 0.9.0; real-account behavior remains subject to Google and workplace access.
- Local profile/settings backup and selectable profile export/import are implemented in 0.9.2. The [settled contract](export-import.md) covers file selection, real warnings, email conflicts, current-account calendar assignments and local-only application, without a mandatory field-by-field preview.
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
| DF10 | Region-based holiday suggestions | Optionally suggest relevant holidays from a separately confirmed country/region, with date/person exceptions. A timezone alone does not establish a person’s holiday jurisdiction or availability. No automatic regional holiday feed or election-day knowledge is implemented. | Deferred; source, coverage and UX need planning |
| DF09 | Developer issue reporting | Consider reporting repeatedly unconfirmed calendar writes to the developers, with a separately agreed data/consent design. No reporting is sent now. | Deferred |
| DF08 | LLM-driven direct appointment creation | Create an optimized appointment with factual reasoning, subject to the full validated rule set and an explicitly enabled automation policy. | Future request; authorization/operating limits unsettled |

DF04 rescheduling and DF05 decline alerts were authorized and implemented in 0.7.0; they are no longer deferred. The [accepted flow](rescheduling.md) records individual time changes, notification/refresh limits and nonautomatic collision handling. Manual travel and confirmable non-LLM clues are implemented.
