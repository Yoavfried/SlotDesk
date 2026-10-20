# Planning email — plain-text proposal

Requested 20 October 2026 during the 0.9.5 planning review. Not implemented. The feature request is accepted; the wording/template and detailed UX below are proposals for owner review. This does not close either mandatory [0.9.5 review](roadmap.md#095--required-owner-reviews).

## Owner requirements

- After meeting options are generated, offer one button to generate a planning email as text.
- The message is copy-pastable to all participants and includes all suggestions and their caveats.
- Do not directly mention convenience, working hours, profile settings or the concept of my profile in recipient-facing text. Treat the EA/own participant by name just like other participants.
- Keep the wording concise and useful for real recipients.

This request is distinct from the deferred [interactive availability-email feature](time-inquiries.md). This feature only prepares text for the EA to copy; it does not send mail, process replies, provide in-email response controls or create a calendar event.

## Proposed UX and scope

One **Generate planning email** action for the complete current set of displayed Meeting options, outside the individual cards. Include every displayed option in its displayed order and number them for easy replies. Internal search candidates and excluded times are not suggestions and must not be exported.

Open an editable preview with a suggested subject and message, allowing copying into the EA's email app. Keep subject and message separately copyable so the Subject line does not have to be removed from the pasted body. Generate from current option facts rather than screen text, ellipses or technical diagnostics. Subsequent profile/date/participant changes that invalidate options require a fresh search before generating a new preview. No saved email-draft lifecycle or sending integration is added by this proposal.

## Proposed email example

Subject: Time options for Partnership discussion

```text
Hi everyone,

Please let me know which options work for you. If several work,
please include all of them and indicate your preference.

1. Tue, 27 Oct · 45 minutes
   18:00–18:45 Jerusalem (GMT+2)
   09:00–09:45 Los Angeles (GMT−7)
   Yoav would need to rearrange an existing commitment.

2. Wed, 28 Oct · 45 minutes
   17:00–17:45 Jerusalem (GMT+2)
   08:00–08:45 Los Angeles (GMT−7)
   Nina, please confirm whether this time is possible.

3. Tue, 3 Nov · 30 minutes — shorter option
   18:00–18:30 Jerusalem (GMT+2)
   08:00–08:30 Los Angeles (GMT−8)

Once we agree on a time, I’ll send the calendar invitation.

Thanks!
```

Dates/offsets are example data. Actual messages use each option's exact instants, duration and effective participant timezones, including saved travel. Show each distinct relevant timezone once per option; a different local date must appear on its own line. Respect the agreed clock/date/year conventions and compute offsets for each option, especially across DST changes. Never imply that all options have the same duration or offset. A later-date alternative is visible through its actual date; a changed duration is explicit without a second repetitive warning.

## Proposed caveat translation

Every material scheduling caveat must survive as a practical condition, while technical descriptions and duplicate facts are removed. The following wording is proposed, not final owner-approved copy.

| Source fact | Recipient-facing wording |
| --- | --- |
| Actual existing busy appointment overlap | “Yoav would need to rearrange an existing commitment.” Include affected names; do not disclose other appointments' titles, calendar IDs or internal classification. |
| Actual blocking commitment for an optional participant | “Nina, who is optional, is unavailable for this option.” Use only when a known blocking commitment supports it. Do not silently remove the person from the inquiry or invitation list. |
| Timing preference, entered availability restriction or practical buffer needing flexibility | “Nina, please confirm whether this time is possible.” Do not describe profile concepts or convert a preference into a claim that the person cannot attend. |
| Availability cannot be fully checked | “Nina’s availability still needs confirmation,” where a participant-specific caveat is needed. Merge with an existing confirmation request for that person rather than repeating it. Never state that everyone is available or has accepted. |
| Several issues for the same person/option | Combine into the shortest accurate condition, preserving the need for confirmation and/or rearrangement. Do not dump the internal warning list. Distinct practical consequences must not disappear merely because the participant row shows one priority reason. |
| Shorter or later alternative | Show actual duration and dates on that option, with a concise shorter/later label when useful. No duplicate paragraph about search settings. |

Avoid revealing medical reasons, flight destinations, leave details or unrelated appointment content in the shared message. Use names and the practical scheduling consequence. This is recipient-facing content selection, not permission to omit material conflicts or change scheduling rules. A one-option message should naturally ask about that time; several options should ask recipients to reply with all numbered options they can attend. Ordinary free-text replies are handled by the EA outside SlotDesk in this feature.

## Open owner review

The final greeting/closing, caveat wording and preview/copy controls remain under review. The proposal does not authorize implementing or releasing 0.9.5 before the mandatory owner reviews and directions are complete.
