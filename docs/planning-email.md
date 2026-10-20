# Planning email — local text preview

Requested 20 October 2026 during the original 0.9.5 planning review; now assigned to 0.9.4.5 with the new-meeting work. Implemented in 0.9.4.5 after explicit owner authorization. The template and wider UX remain open to owner feedback. See the [0.9.4.5 plan](release-plan-0.9.4.5.md).

## Owner requirements

- After meeting options are generated, offer one button to generate a planning email as text.
- The message is copy-pastable to all participants and includes every displayed suggestion. The only availability caveat is a known unavailable optional participant: “[Name] is unavailable for this option.” Do not describe them as optional in the shared message.
- Do not mention unconfirmed availability, overlaps, rearranging commitments, convenience, working hours, profile settings or my profile in recipient-facing text. Do not reveal that the executive has overlaps. These internal facts remain visible to the EA inside SlotDesk.
- Keep the wording concise and useful for real recipients.

This request is distinct from the deferred [interactive availability-email feature](time-inquiries.md). This feature only prepares text for the EA to copy; it does not send mail, process replies, provide in-email response controls or create a calendar event.

## Implemented UX and scope

One **Generate planning email** action for the complete current set of displayed Meeting options, outside the individual cards. Include every displayed option in its displayed order and number them for easy replies. Internal search candidates and excluded times are not suggestions and must not be exported.

Open an editable preview with a suggested subject and message, allowing copying into the EA's email app. Keep subject and message separately copyable so the Subject line does not have to be removed from the pasted body. Generate from current option facts rather than screen text, ellipses or technical diagnostics. Subsequent profile/date/participant changes that invalidate options require a fresh search before generating a new preview. No saved email-draft lifecycle or sending integration is added by this proposal.

## Email example

Subject: Time options for Partnership discussion

```text
Hi everyone,

Please let me know which options work for you. If several work,
please include all of them and indicate your preference.

1. Tue, 27 Oct · 45 minutes
   18:00–18:45 Jerusalem, Israel (GMT+2)
   09:00–09:45 Los Angeles, CA (GMT−7)

2. Wed, 28 Oct · 45 minutes
   17:00–17:45 Jerusalem, Israel (GMT+2)
   08:00–08:45 Los Angeles, CA (GMT−7)
   Tal is unavailable for this option.

3. Tue, 3 Nov · 30 minutes — shorter option
   18:00–18:30 Jerusalem, Israel (GMT+2)
   08:00–08:30 Los Angeles, CA (GMT−8)

Once we agree on a time, I’ll send the calendar invitation.

Thanks!
```

Dates/offsets are example data. Actual messages use each option's exact instants, duration and effective participant timezones, including saved travel. Show each distinct relevant timezone once per option; a different local date must appear on its own line. Respect the agreed clock/date/year conventions and compute offsets for each option, especially across DST changes. Never imply that all options have the same duration or offset. A later-date alternative is visible through its actual date; a changed duration is explicit without a second repetitive warning.

## Approved email caveat boundary — 20 October correction

The owner rejected the previous caveat translation. The shared email must not mention overlaps or the need to rearrange existing commitments, even indirectly; those facts could reveal the executive's calendar to outside guests. Do not mention unconfirmed availability or add person-specific confirmation requests based on internal timing/coverage rules. The greeting can still ask all recipients to reply with the options that work for them.

The only availability caveat is **“[Name] is unavailable for this option.”** It applies to a participant who is optional in the meeting's effective participant list and is known to be unavailable for that specific option. Never include “who is optional” or otherwise reveal the participant's optional designation in that sentence. Do not infer unavailability merely from missing calendar access, stale/partial coverage or an ordinary timing preference. Actual dates and durations remain explicit option facts, including shorter options; they are not explanations of internal constraints.

Calendar conflicts, all other warning categories, unknown calendar coverage, rules and internal reasoning stay in SlotDesk's EA review and are not exported into this message. This content rule does not alter candidate eligibility/ranking, remove invitees or suppress internal warnings. There is no promise in the email that every proposed option is conflict-free or already confirmed.

Recipient-facing timezones follow the [friendly label direction](timezone-search.md#friendly-display-labels--0945-owner-direction): City, Country; US City, State code; a non-city choice such as UTC keeps its simple name. No raw IANA paths, slashes or underscore-separated city names appear in the shared email.

## Implementation and continuing review

The preview and separate copy controls are implemented in 0.9.4.5. It includes all currently displayed valid options, uses each person's effective timezone and enforces the approved caveat boundary. It is editable only for the current preview: no saved email draft, sending integration or reply collection is added. The greeting/closing can be revised by the EA and remains open to owner feedback. Interactive inquiries and BYOK LLM assistance remain separate deferred features.
