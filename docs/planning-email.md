# Planning email

After generating meeting options, choose **Generate planning email** to create editable text for your email app. The preview has separate **Copy subject** and **Copy message** actions. Copying does not send email or create an appointment.

## Included information

The message follows this reference:

```text
Hi everyone,
Would any of these 30-minute slots work for you?

• Mon, Nov 2: 19:10 Israel / 12:10 ET / 17:10 GMT
• Tue, Nov 3: 16:00 Israel / 09:00 ET / 14:00 GMT

Please share all options that work and your preference, and I’ll send an invite.
Best,
Nina
```

Each displayed option is one line, in order, with its date and every participant's local start time. Your own timezone comes first and sets the line's date; a timezone already on another day shows its weekday, for example `23:30 BST (Thu)`. Each distinct local time appears once, including timezone changes caused by saved trips. Dates and times follow your date-format and clock preferences.

Timezones use short names: ET, CT, MT and PT in North America, GMT or BST in the UK, UTC, and otherwise the country or city, such as Israel, Japan or Sydney. When all options share a duration it appears once in the opening line; otherwise each line ends with its own duration. The sign-off uses the first name of your own profile.

The subject and message can be edited before copying. This preview is not a saved email draft.

## Availability details

The only participant-availability caveat included is:

> [Name] is unavailable for this option.

It applies when an optional participant is known to be unavailable for that option. The message does not identify the person as optional. Missing calendar access or an ordinary timing preference does not count as known unavailability.

Internal calendar overlaps, unconfirmed coverage, working/convenience rules, profile settings and ranking explanations stay inside SlotDesk. They are not included in the generated message. The message does not claim that recipients have confirmed a time.

## Refreshing the preview

The preview uses the displayed options rather than hidden search candidates. **Generate more options** adds choices to the set used by a newly generated preview. Participant or search-setting changes that invalidate results require a new search before generating another message.

This feature does not read replies, provide interactive email controls or choose a final time. Those are separate [future inquiry concepts](time-inquiries.md).
