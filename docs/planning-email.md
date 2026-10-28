# Planning email

After generating meeting options, choose **Generate planning email** to create editable text for your email app. The preview has separate **Copy subject** and **Copy message** actions. Copying does not send email or create an appointment.

## Included information

The message includes every currently displayed option, in order, with its date, duration and relevant participant-local times. Each distinct timezone appears once per option. Different local dates and date-specific GMT offsets are included when needed, including timezone changes caused by saved trips.

Shorter suggestions show their actual duration. Later suggestions show their actual date. City labels use readable names such as City, Country or US City, State code; non-city choices such as UTC retain their simple names.

The greeting asks recipients to identify the options that work for them. The subject and message can be edited before copying. This preview is not a saved email draft.

## Availability details

The only participant-availability caveat included is:

> [Name] is unavailable for this option.

It applies when an optional participant is known to be unavailable for that option. The message does not identify the person as optional. Missing calendar access or an ordinary timing preference does not count as known unavailability.

Internal calendar overlaps, unconfirmed coverage, working/convenience rules, profile settings and ranking explanations stay inside SlotDesk. They are not included in the generated message. The message does not claim that recipients have confirmed a time.

## Refreshing the preview

The preview uses the displayed options rather than hidden search candidates. **Generate more options** adds choices to the set used by a newly generated preview. Participant or search-setting changes that invalidate results require a new search before generating another message.

This feature does not read replies, provide interactive email controls or choose a final time. Those are separate [future inquiry concepts](time-inquiries.md).
