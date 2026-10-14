# Optional LLM assistance — future direction

Recorded 14 October 2026. **Future direction; not implemented in 0.8.0 and not part of the next product update.** The owner wants users to be able to supply their own LLM API key. SlotDesk would provide prepared prompts and use the lowest-cost model that performs the task reliably. Providers, model choices, key handling and automation controls remain undecided.

The owner is also considering making availability emails available only within this optional LLM integration. That restriction and the availability-email feature itself are **unconfirmed**, not an accepted release commitment. See [availability inquiries](time-inquiries.md).

## Intended capabilities

| Capability | Intended behavior | Status |
| --- | --- | --- |
| Read relevant email | Extract scheduling requests, positive availability, exclusions, participant identity, timezone clues, travel and flight information from authorized messages. For example, recognize Tuesdays and Wednesdays at 18:00 Eastern as positive availability rather than needing a list of every excluded time. | Deferred DF01; BYOK direction requested |
| Read appointment text | Extract useful scheduling/travel clues from authorized appointment descriptions and other written details. | Deferred DF02 |
| Prepare availability inquiries | Write an email asking one/many people about one/many candidate times, with clearly displayed dates, duration and timezone. Candidate times come from SlotDesk's validated search or explicit user input. | Unconfirmed DF07; possibly BYOK-only |
| Read inquiry replies | Relate a reply to its inquiry/options and propose available, unavailable, conditional or unresolved answers. Keep nonresponse separate from No, and retain the source wording for the EA. | Unconfirmed DF07; reply protocol not chosen |
| Explain scheduling choices | Give a concise, factual explanation using actual rule-engine results: participant fit, calendar coverage, comfort, travel and any disclosed overlaps. Explain tradeoffs and missing information. | Future LLM direction |
| Create optimized appointments directly | In a future explicitly enabled automation mode, select a suitable validated option, prepare the appointment and create it, with an explanation of why that choice was made. | Requested future behavior; authorization and operating policy unsettled, DF08 |

Current SlotDesk remains usable without an LLM key. Entering a key is not consent to read every email, send messages or create appointments automatically. Those capabilities need separate controls. This record authorizes documentation only, not a provider connection, email send or Calendar write.

## Prepared prompts and model selection

Prepare versioned task prompts for extraction, inquiry drafting, reply interpretation and scheduling explanations. Prompts should include the relevant task context, explicit output fields and uncertainty handling. Require structured results where later code needs to interpret them, such as participant emails, local dates/times, IANA timezones, proposed constraint changes and inquiry/option references. Missing information stays unknown; do not invent an email address, timezone or acceptance.

The cost objective is **the cheapest model that still works for the task**. Evaluate a set of supported models against representative cases, including ambiguous positive constraints, travel/timezones, contradictory replies and malformed outputs. Select by reliability and measured total task cost, including retries; a smaller model that repeatedly fails is not automatically the cheapest useful choice. Recheck provider availability/pricing when choosing models rather than hard-coding a timeless cheapest-model claim. No provider, model or quality threshold is selected here.

Limit input to the messages/context needed, avoid re-reading unchanged threads, and reuse extracted facts only while their source/version remains valid. Plan visible model/provider selection, per-task cost estimates where supportable, usage tracking, spending limits and an explicit choice before upgrading to a more expensive model. These are proposed controls; exact budgets, fallback and caching policies remain open. Any future requests use the user's selected provider/account; verify and explain that provider's billing before enabling requests. No current feature incurs LLM charges.

## Scheduling rules remain authoritative

The LLM should translate requests, propose actions and explain validated results. SlotDesk's deterministic scheduling engine still generates/checks candidates and enforces the effective full rule set: confirmed participant timezones, selected calendar scope and coverage, positive availability, working days/hours, convenience settings, travel/flight protection and buffers, configured meeting radii/notice, protected/explicit blocks, attendance roles, per-profile/per-meeting flexibility and overlap policy.

A proposed override must come from an actual user setting or explicit authorized instruction, not from a model's opinion that another meeting matters less. Calendar overlap permission remains separate from late-hour comfort. Existing overlapping appointments remain in place; their cancellation or rescheduling is a separate action. No LLM-only route to deletion, cancellation, arbitrary event patches or calendar moves is proposed.

Before creation, resolve required missing information and perform fresh account, access, event/availability and rule checks through the same validated writer paths. Reuse stable event IDs, duplicate prevention and uncertain-result recovery; never blindly retry a timeout by creating a new appointment. The explanation must reflect checked facts and real tradeoffs, not claim complete availability from partial calendars or prove global optimality beyond the search performed.

## Direct creation and user control

The owner's desired future behavior includes **direct appointment creation**, not only drafting a suggestion. It would be an explicitly enabled automation mode, with its allowed calendars, participants, time ranges, overlap/inconvenience treatment and other limits defined before implementation. Whether authorization is per request, per session or a saved bounded policy is still open. Buying/supplying an API key or receiving an email is not that authorization.

The current reviewed creation flow remains the baseline. A future automatic mode must validate that the complete intended action fits the user's granted policy, otherwise return it for clarification/review. Record the created event and factual rationale for inspection. Defaults, action notifications, review exceptions and supported unattended operation remain design questions; this document does not silently select them. Calendar integrity requirements also apply to automatic creation.

## Availability-email relationship

The owner considers Gmail AMP's compatibility and sender setup unattractive and has parked availability emails as an unconfirmed future feature. One possible direction is to combine LLM-authored inquiries and interpreted replies under BYOK. The model can help compose/read messages; it cannot add working interactive controls to unsupported email clients, approve a sender or remove the need for email permissions/delivery infrastructure.

The existing no-external-response-page requirement remains recorded. Whether an LLM variant would use ordinary email replies instead of the earlier inline Yes/No and checkbox form is **undecided**; free-text replies are not quietly treated as an approved replacement. Keep the original interactive concept's requirements in [time inquiries](time-inquiries.md), without promising that it will ship.

## Keys, data and permissions

Design key entry, validation, removal and optional persistence before implementation. Never put user keys into prompts, source control, exports, calendar entries, messages, telemetry or error logs. A remembered key needs an explicitly chosen protected storage design; do not add it to today's plaintext workspace settings by default. Browser-bundled shared provider secrets are not an alternative to BYOK. Direct provider calls versus a service relay is undecided; a relay would need a separately disclosed key/data handling design.

Explain which selected email, appointment or profile information will leave the device for the user's chosen model provider, and establish that provider's applicable retention/data-use terms before enabling it. Minimize data and keep Calendar/Gmail OAuth tokens outside model context. Workplace permission to use an LLM is separate from Google Calendar access.

Email reading and sending require their own authorized integrations; an LLM API key grants neither. Define mailbox scope and user controls before requesting access. Treat email bodies and appointment descriptions as untrusted task data: embedded instructions cannot change tool permissions, reveal secrets or authorize sends/writes. Validate structured outputs and resolve ambiguous identity, dates, timezones, reply revisions and quoted/forwarded replies before using extracted facts.

## Open design decisions

- Supported LLM providers/models, evaluation criteria and model-upgrade/spending controls.
- Key storage/removal, direct calls versus relay, and provider/workplace data policy.
- Selected-message/thread processing versus background mailbox monitoring, email permissions and delivery sender.
- Whether availability emails are BYOK-only; their final recipient reply experience and compatibility scope.
- How extracted constraints are accepted/edited and how ambiguous or changed replies reach the EA.
- The exact authorization, operating limits, notifications and execution environment for direct creation.

These are future design questions, separate from the implemented [0.8.0 profile/calendar/setup improvements](onboarding-and-profiles.md) and remaining UX proposals. No LLM client, key field, email integration, prompt implementation, model benchmark or autonomous Calendar write is implemented in 0.8.0. See [roadmap](roadmap.md), [architecture](architecture.md), [security/privacy](security.md) and [UX decisions](ux-decisions.md).
