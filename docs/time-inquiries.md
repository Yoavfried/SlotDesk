# Ask about times — structured inquiries before booking

Recorded 14 October 2026. **Planned feature; not implemented in 0.7.1.** The owner wants one integrated flow covering one person/one time, one person/many times, many people/one time and many people/many times. This is an availability inquiry before creating an appointment. It is separate from an existing Calendar invitation/RSVP.

## Product direction

Use one **Ask about times** action. The EA chooses whom to ask and one or more options, reviews an email/link, and collects structured answers. Only a separate **Review & create meeting** action creates an appointment. Replies do not create, cancel, move or hold calendar entries. No email-reading LLM or free-text parsing is needed.

| People asked | Times offered | Recipient experience | EA result |
| --- | --- | --- | --- |
| One | One | Does this time work? with structured choices | One answer |
| One | Several | Answer each offered time; optionally mark a favorite | That person's available/preferred options |
| Several | One | Each person answers the same option independently | Who can attend; who has not replied |
| Several | Several | The same option list for every recipient | People-by-time response matrix and suitable options |

## Proposed EA flow

1. Start from a new meeting draft, suggested options or a manually entered exact time. Select one or more distinct options and the people to ask. A manually specified inquiry does not claim that unknown guest calendars or timezones were checked; scheduling searches still require confirmed participant timezones under the accepted product-review decision.
2. Review meeting title/purpose, recipients, dates, times, duration and timezone before sharing. Inquiry recipients and final appointment guests remain separately visible: someone not asked may still attend, and a No reply never silently removes an invitee.
3. Select **Send time inquiry** or use **Copy email/link** for manual sending. Sending is an explicit action with recipients shown. Depending on the chosen delivery design, a shared link leads to a reply form, or an email action prepares a standardized reply to the EA. Recipients do not install SlotDesk. An email-only path still needs recipient-client compatibility validation; it is not presumed to provide a universal embedded form.
4. Revisit **Time inquiries** in SlotDesk to see Awaiting replies, Replies received, Needs attention, Closed or Meeting created. Display unanswered people separately from No and Maybe. Refresh/open loads current responses; background notification behavior is a later design decision.
5. Select a time, refresh calendar availability and permissions, and use the existing final meeting review. Explicitly confirm **Create & send invitations**. A response is evidence for that option, not proof of full calendar coverage or a guarantee the time remains free later.

Use one engine/model for all four cases. One-person/one-time UI is compact; additional people/options reveal a list or matrix. Avoid four separate feature modes. Reuse the supplied VT323/lime branding, paper/dark palette, fixed modal headings and counted warnings. Keep the inquiry list separate from Existing meetings because an inquiry has no calendar event yet.

## Proposed reply controls

Use **Yes / Maybe / No** for each offered time. With several options, optionally mark a Yes as Preferred. Treat Maybe and unanswered as distinct states, not confirmed attendance. Allow multiple Yes answers. Offer None of these times works as an explicit action; never interpret lack of response as No. Free-text comments or requests for different times can be considered later; they are not required for the initial workflow.

Show full local date/time, duration and explicit timezone/date-specific offset. A recipient can change the display timezone; the underlying option is always the same UTC interval. The reply-page zone is a display choice and must not silently change their saved profile. A browser-suggested timezone is labelled and changeable, not claimed as a confirmed physical location.

Recipients can revise their answers while the inquiry is open. The EA sees latest answers and timestamps. Closing/finalizing stops further changes and shows a clear closed state. Do not expose other participants' emails or answers to recipients by default; the EA receives the matrix.

## Booking and existing safeguards

- Required/Optional status remains independent from poll answers. Highlight options with Yes from all required respondents, and display optional attendance, preferences and missing/Maybe/No responses clearly.
- Keep the EA in control when some responses are missing or negative. If they deliberately proceed, disclose those responses in final review and retain everyone still selected for invitation.
- Recheck fresh calendar data and the currently permitted workspace calendar scope before booking. Warn if the chosen option now conflicts or no longer fits profile constraints; a prior Yes is not a calendar lock.
- Retain the current validated payloads, account/permission checks, stable event IDs, shared send locks and same-event uncertain-response recovery. One inquiry cannot be finalized into competing duplicate meetings by concurrent clients. A hosted version needs a server-side booking reservation/idempotency record because browser Web Locks do not coordinate different devices. An email-only first version must explicitly define its supported device/browser scope and validate event-level idempotence; Gmail threads are not an atomic cross-device booking lock. Do not promise cross-device single finalization without a proven coordination design.
- Do not claim Meeting created or close the inquiry as booked before Calendar creation is confirmed. Retain a Recover booking state if the outcome or completion save is uncertain.
- Editing published times/recipients needs a new explicit inquiry revision. Answers bind to immutable option IDs/intervals and the relevant recipient/revision; moving an option does not carry an old Yes to the new time. Old links/submissions must not silently answer an obsolete option.

Initial scope is inquiries for new meetings. The same response model can later support proposed rescheduling; finalization would use the original event's separately reviewed PATCH rather than create a replacement event. That extension is not silently included in the first delivery.

## Architecture decision — pending

SlotDesk 0.7.1 is a local Chrome extension without a response server or Gmail/Forms access. Calendar scopes do not send emails or provide a shared inquiry mailbox. People must be able to respond while the EA's browser is closed, so answers need a reachable shared destination. The initial question offered only a branded page or Google Forms. The owner correctly asked whether answers could simply live in email. They can: the EA's mailbox is already a shared, remotely reachable response destination. A SlotDesk response server is not inherently necessary. Response storage and the interface used to compose a structured response are separate decisions. No path has yet been selected:

| Path | Advantages | Changes and limits |
| --- | --- | --- |
| Branded SlotDesk response page + small cloud service | Unified experience, mobile layout, per-recipient links, localized times and response matrix; greatest control over revisions/closing/recovery | Requires hosting, verified EA authentication, scoped response access, storage/retention design and updated privacy information. It introduces shared inquiry data beyond today's local-only settings. |
| Email replies + Gmail API | Answers remain in the EA's inbox; Gmail accepts mail while SlotDesk is closed and the extension can read inquiry threads when open | Needs authorized email reading plus optional sending. Standardized reply codes/link-generated reply drafts require compatibility and parsing/identity/revision validation. Multi-option replies are less smooth than a form. Gmail is not a universal embedded poll UI or atomic booking-reservation store. |
| Google Forms integrated with SlotDesk | Google hosts forms and responses; the extension can build structured questions and read results while open, without a SlotDesk response server | Requires separate Google Forms permissions/API configuration. Forms design, timezone localization and response identity/revision behavior are more limited and need validation. Workspace publication/recipient restrictions may apply. |

Google's documented API supports [creating forms](https://developers.google.com/workspace/forms/api/reference/rest/v1/forms/create), [adding questions/settings](https://developers.google.com/workspace/forms/api/reference/rest/v1/forms/batchUpdate), [publishing/closing response acceptance](https://developers.google.com/workspace/forms/api/reference/rest/v1/forms/setPublishSettings) and [reading paginated responses](https://developers.google.com/workspace/forms/api/reference/rest/v1/forms.responses/list). This establishes an integration path, not a tested implementation or a claim that every desired interaction is available through those APIs. Verify respondent identity, guest access, edit/revision controls and publication settings against the chosen account before building around them.

## Email delivery is separate from response storage

A first version can prepare an email/link for the EA to send manually, without Gmail access. Direct send can use an explicitly authorized Gmail integration: Google's [sending guide](https://developers.google.com/workspace/gmail/api/guides/sending) and [scope reference](https://developers.google.com/workspace/gmail/api/auth/scopes) document message sending and a send-only permission. Sending does not require reading inbox contents or enabling the deferred email-reading LLM.

Calendar write access, an organizing-calendar choice or a profile mapping does not authorize sending email as that person. Show the actual authorized sender; a delegated From alias would need its own verified Gmail capability. Review recipients/subject/body before a send; keep recovery for uncertain email delivery so the app does not blindly duplicate inquiries. No real message is sent by this planning work.

## Email-only clarification

**The inbox can store replies.** The [Gmail thread API](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/get) can return a known thread's message bodies with an appropriate read permission. SlotDesk could retain inquiry/recipient/option IDs locally, fetch only its known inquiry conversations operationally, and deterministically recognize standardized answer messages. No arbitrary email-understanding LLM is required.

One candidate UX is a Yes/Maybe/No email action that opens a pre-filled reply with inquiry/version/option IDs; the recipient still reviews/sends that email. Replies are ordinary mail and remain in the EA's inbox. For many options, this could mean multiple answer emails or one fixed-format response, so interaction across desktop/mobile and Gmail/Outlook/other recipient clients needs a prototype before claiming the desired smooth experience. Free-form or edited replies must be marked Needs review rather than guessed or treated as an automatic calendar command. Preserve unanswered/Maybe/No distinctions, version binding, latest valid per-option answers and explicit EA booking.

The read permission is broader than a provider-enforced restriction to SlotDesk messages: [Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes) distinguish send-only, header metadata and message-body read access. Operationally fetching only inquiry threads does not narrow the OAuth grant itself. Gmail reading would be a new explicit opt-in feature, separate from current Calendar access; no email-read permission or real message has been requested here. Raw inbox contents must not be copied to a SlotDesk server merely to parse these replies.

Interactive controls that submit within the email itself are a separate technology. Google documents [AMP for Gmail](https://developers.google.com/workspace/gmail/ampemail) and sender registration; it is not an automatic consequence of storing ordinary replies in Gmail. Do not assume all email clients provide a universal direct Yes/No submission protocol. A web response page or Forms gives a controlled multi-option input interface; email-only avoids a SlotDesk response server but has different interaction and authorization tradeoffs.

## Hosted implementation requirements

These are engineering boundaries for the branded path, not new deployed permissions:

- Publish only inquiry-authored title/purpose, offered intervals/duration and the minimum recipient/response metadata needed. Do not upload raw calendars, private overlap details, other profiles or Calendar tokens.
- Verify the EA identity and authorize each inquiry/account operation server-side; never trust a posted email as proof of ownership.
- Use a distinct, unguessable, revocable recipient link scoped to that person's inquiry answers. Link possession is not proof of authenticated email identity; forwarded links can be used by their holder. A later verified-email mode is a separate UX decision.
- Email security scanners and browser prefetch must not record a reply: viewing a link is read-only; only an explicit submitted response changes state.
- Check recipient, inquiry revision and open/closed state on every response. Prevent a recipient token from listing other inquiries/recipients or booking calendar events. Apply request limits and keep tokens/private data out of logs, analytics and public indexing.
- Document retention/closure/removal behavior before deployment. Separate local account data clearing from remotely stored inquiry cleanup. Give the EA an explicit way to close/revoke inquiry access; no automatic Calendar deletion is involved.

## Delivery plan

1. Choose the email-only, hosted or Forms path and establish recipient/access/retention requirements. Email auto-send versus manual draft/link is a separate delivery decision; neither is presumed authorized for real mail.
2. Build the shared inquiry/option/recipient/answer model and synthetic fixtures for all four combinations, including multiple Yes, No/Maybe/unanswered, timezone/DST, revised options, closed links and duplicate submissions.
3. Add EA inquiry composition/management, the reply interface and matrix, keeping unanswered and Calendar RSVP distinct.
4. Integrate final review and duplicate-safe booking without any calendar write during inquiry creation or responses.
5. Validate access boundaries and account/revision/concurrency/recovery behavior; update Help/privacy and version logs when implemented. Hosting deployment, real email sending and new OAuth grants are later concrete actions, not performed by this document.

The earlier eight product improvements remain planned. The broader website remains on hold; this feature belongs to the separate SlotDesk product. See [product review](product-review-2026-10-14.md), [roadmap](roadmap.md), [architecture](architecture.md), [UX decisions](ux-decisions.md) and [security/privacy](security.md).
