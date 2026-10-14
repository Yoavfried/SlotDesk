# Ask about times — structured inquiries before booking

Recorded 14 October 2026. **Unconfirmed future feature; parked, non-blocking and not implemented in 0.7.1.** After reviewing Gmail AMP compatibility and sender/service requirements, the owner does not consider it a good current solution. Availability emails are outside the next product update. One integrated flow would cover one person/one time, one person/many times, many people/one time and many people/many times, before creating an appointment and separately from an existing Calendar invitation/RSVP.

The owner is considering availability emails as part of optional [LLM assistance using the user's API key](llm-assistance.md). The LLM could prepare inquiries and interpret replies. BYOK-only access and the final reply protocol are unconfirmed. The original interactive concept below is preserved for future consideration; no external response page is approved, and an LLM does not remove inline-email compatibility or submission-service requirements.

## Original interactive concept — recipient requirements

**All selection and submission must work inside the email.** The owner explicitly rejects redirecting recipients to a response page, including Google Forms. A page link, free-text reply, separate email per checkbox or nonfunctional HTML preview does not satisfy the feature. If the required in-email interaction cannot work for the intended recipients, do not ship it.

| People asked | Times offered | Recipient experience inside the email | EA result |
| --- | --- | --- | --- |
| One | One | Does this time work? with Yes / No | One answer |
| One | Several | Select every offered time that works, then submit once | That person's available options |
| Several | One | Each person answers Yes / No independently | Who can attend; who has not replied |
| Several | Several | The same checkbox list and submission for every recipient | People-by-time response matrix and suitable options |

The EA reviews the recipients, options and email before explicitly sending. Only a separate **Review & create meeting** action creates an appointment. Replies do not create, cancel, move or hold calendar entries. This original structured-response concept does not need an email-reading LLM; a possible LLM-assisted variant is now documented separately. Future direct appointment creation under an explicit automation policy is a separate LLM proposal, not automatic booking caused by a reply.

## Proposed EA flow

1. Start from a new meeting draft, suggested options or a manually entered exact time. Select distinct options and the people to ask. A manually specified inquiry does not claim that unknown guest calendars or timezones were checked; scheduling searches still require confirmed participant timezones under the accepted product-review decision.
2. Review title/purpose, recipients, dates, times, duration and displayed timezones before sending. Inquiry recipients and final appointment guests remain separately visible: someone not asked may still attend, and a No reply never silently removes an invitee.
3. Select **Send time inquiry** after reviewing the actual sender and recipients. Recipients answer inside their supported email app without installing SlotDesk or opening a response page. The sending integration and supported recipient scope must be proven before this action is implemented; an ordinary copied email is not presumed to preserve interactive controls.
4. Revisit **Time inquiries** in SlotDesk to see Awaiting replies, Replies received, Needs attention, Closed or Meeting created. Display unanswered people separately from explicit No. Refresh/open loads current responses; background notification behavior is a later design decision.
5. Select a time, refresh calendar availability and permissions, and use the existing final meeting review. Explicitly confirm **Create & send invitations**. A response is evidence for that option, not proof of full calendar coverage or a guarantee the time remains free later.

Use one inquiry model for all four cases. One-person/one-time UI is compact; additional people/options reveal a list or matrix. Reuse the supplied VT323/lime branding, paper/dark palette, fixed modal headings and counted warnings where the email platform permits. Keep the inquiry list separate from Existing meetings because an inquiry has no calendar event yet.

## Reply controls and meaning

**Owner decision:** one offered time uses **Yes / No**, regardless of how many people are asked. Several offered times use **Select all times that work for you**, with checkboxes and one explicit submission. Offer **None of these times works** as a separate deliberate action; do not accidentally submit an empty initial selection as No to every option.

Before submission, all options are unanswered. After a complete submitted multi-select response, selected options mean Yes and unselected offered options mean No; explain that meaning beside the controls. Partial, invalid, failed or missing submissions remain unanswered/Needs review. Missing responses never mean No. Maybe/favorite/comment controls are outside the agreed initial UI.

Show full local date/time, duration and explicit timezone/date-specific offset inside the email, using the confirmed recipient timezone where known and a clearly named reference timezone otherwise. Each option binds to an immutable UTC interval. A recipient display-timezone switch is optional only if it can be implemented and validated inside the email; do not assume arbitrary browser scripts or timezone detection are available. A display choice must not silently change a saved profile.

Recipients should be able to revise answers while the inquiry is open, with latest valid answers and timestamps shown to the EA. The inline submission service must enforce the open/closed state even for an old email. Successful submission, failed submission and closed inquiry each need a clear in-email result; do not send the recipient to a page to explain them. Do not expose other participants' emails or answers by default; the EA receives the matrix.

## Booking safeguards

- Required/Optional status remains independent from inquiry answers. Highlight options with Yes from all required respondents, and display optional attendance and missing/No responses clearly.
- Keep the EA in control when responses are missing or negative. If they deliberately proceed, disclose those responses in final review and retain everyone still selected for invitation.
- Recheck fresh calendar data and the permitted workspace calendar scope before booking. Warn if an option now conflicts or no longer fits profile constraints; a prior Yes is not a calendar lock.
- Retain validated payloads, account/permission checks, stable event IDs, shared send locks and same-event uncertain-response recovery. Define and validate the supported finalization scope before promising duplicate prevention: browser Web Locks do not coordinate different devices, and an inbox is not an atomic booking lock. Cross-device single finalization needs a proven coordination/idempotency design.
- Do not claim Meeting created or close an inquiry as booked before Calendar creation is confirmed. Retain a Recover booking state if the outcome or completion save is uncertain.
- Changing published times/recipients needs a new explicit inquiry revision. Answers bind to immutable option IDs/intervals and the recipient/revision; moving an option does not carry an old Yes to the new time. Old email submissions must not silently answer an obsolete option.

Initial scope is inquiries for new meetings. The response model could later support proposed rescheduling; finalization would use the original event's separately reviewed PATCH. That extension is not included in the initial proposal. Neither inquiry replies nor the response service automatically write to Calendar.

## Inline email feasibility — not yet proven

SlotDesk 0.7.1 is a local Chrome extension with Calendar access, no inquiry submission service and no Gmail permissions. **Email can store answers, but inbox storage does not make checkbox submission work inside email.** A reachable submission service can receive an inline answer while the EA is offline without showing the recipient a web page. The owner's prohibition is on redirecting recipients, not on such a service.

Candidate technologies require investigation, not an assumption of universal support:

| Candidate | What the primary documentation establishes | Remaining proof |
| --- | --- | --- |
| Gmail AMP email | Google documents interactive email, sender registration and forms submitting to an HTTPS endpoint. | Actual sender approval, delivery, single-time Yes/No, multi-select submission, revisions, failure/closed states and supported account/client behavior. |
| Outlook Actionable Messages | Microsoft documents supported in-email actions and provider-specific mailbox/client requirements. | Whether the required selection/submission UI is supported in the intended clients, sender registration/authentication, delivery and service integration. No Outlook implementation is selected. |

Primary references: [AMP for Gmail](https://developers.google.com/workspace/gmail/ampemail), [sender registration](https://developers.google.com/workspace/gmail/ampemail/register), [AMP email forms](https://go.amp.dev/documentation/components/email/amp-form), [Outlook Actionable Messages](https://learn.microsoft.com/en-us/outlook/actionable-messages/).

Google documents [fallback to ordinary HTML/text](https://developers.google.com/workspace/gmail/ampemail/debugging-dynamic-email), including unsupported accounts/platforms, disabled dynamic email and other delivery conditions. That fallback does **not** satisfy the required inline form. Do not label unsupported recipients as supported, put fake working controls into ordinary HTML, redirect them to a page or silently switch to free-text replies. Establish an explicit support scope that covers the intended users; if it cannot meet this requirement, leave the feature unimplemented.

No hosting provider, mail provider, sender domain, storage design or new permission has been chosen. No live interactive email has been delivered or validated by this planning work. Sending through Gmail and delivering registered AMP email are separate capabilities.

## Sending and storing answers

Show the actual authorized sender and review subject/body/recipients before sending. Calendar write access, organizing-calendar selection and profile mappings do not authorize emailing as those people. A delegated sender would require its own verified capability. Preserve uncertain-send recovery rather than blindly sending duplicate inquiries.

Google's [sending guide](https://developers.google.com/workspace/gmail/api/guides/sending) and [scope reference](https://developers.google.com/workspace/gmail/api/auth/scopes) document sending permissions, but do not themselves provide the required inline interaction. Sending does not require an email-reading LLM or inbox reading.

The submission service could store structured answers or send a structured receipt to the EA's inbox; that design remains undecided. Answers are not automatically saved as email merely because the inquiry was emailed. If SlotDesk later reads inbox receipts, the [Gmail thread API](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get) supports reading known threads with an appropriate permission. Body-read access is broader than a provider-enforced restriction to SlotDesk messages; fetching only known inquiry threads operationally does not narrow the OAuth grant. Such access would be a separate explicit opt-in. Raw inbox contents must not be uploaded merely to parse inquiry receipts.

## Submission service and data boundaries

These are proposed engineering requirements, not a deployed service or completed security assessment:

- Transfer only inquiry-authored title/purpose, offered intervals/duration and minimum recipient/response metadata. Do not upload raw calendars, private overlap details, other profiles or Calendar tokens.
- Verify EA identity and authorize inquiry/account operations server-side; a posted email address is not proof of ownership.
- Bind each answer to its intended recipient, inquiry and revision using the provider's validated authentication and scoped, revocable credentials. Document forwarding and bearer-token limitations; possession alone is not verified email identity.
- Email scanners and prefetch must not record answers. Read requests remain read-only; only an explicit valid submission changes a response. Follow the chosen platform's authentication and cross-origin requirements.
- Enforce revision and open/closed state on every submission. Prevent credentials from reading other recipients/inquiries or booking Calendar events. Apply request limits and keep tokens/private data out of logs, analytics and public indexing.
- Define retention, closure and removal before deployment. Local workspace clearing and remotely stored inquiry cleanup are separate. Let the EA close/revoke an inquiry; no Calendar deletion follows.
- Even if answer receipts live in the EA's inbox, define the service metadata needed for validation, revisions, closure and duplicate submission handling. Do not claim that email storage removes the need for an inline submission endpoint.

## If this feature is revisited

This is no longer an immediate delivery plan. First confirm whether to pursue the original interactive approach or an LLM-assisted inquiry/reply design and define its recipient experience. The possible BYOK-only restriction is still under consideration. For the original interactive concept:

1. First prove actual interactive email delivery and submission for single-time Yes/No and several-time checkboxes with explicit None in the intended desktop/mobile account/client scope. Verify sender registration/authentication and in-email success/error/closed states. An HTML preview or a web response page is not evidence of this flow. If the intended scope fails the inline requirement, stop at a documented unimplemented candidate.
2. If that gate passes, finalize sending, service, storage, recipient access and retention design. Build the inquiry/option/recipient/answer model with synthetic coverage for all four combinations, unanswered states, failures, repeated submissions, timezone/DST, revisions and closed inquiries.
3. Add EA inquiry composition/management and the reply matrix, keeping unanswered and Calendar RSVP distinct.
4. Integrate separately reviewed, duplicate-safe booking without Calendar writes during inquiry creation or replies.
5. Validate access, account/revision/concurrency and recovery boundaries; update Help/privacy and version logs when implemented. Deployment, real email sending and new OAuth grants are later concrete actions, not performed by this document.

The earlier eight product improvements remain planned. The broader website remains on hold; this candidate belongs to SlotDesk. See [product review](product-review-2026-10-14.md), [roadmap](roadmap.md), [architecture](architecture.md), [UX decisions](ux-decisions.md) and [security/privacy](security.md).
