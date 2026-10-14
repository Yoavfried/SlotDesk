# Product review — 14 October 2026

Current shipped release: **0.7.1**. These notes follow the owner's testing. This record proposes the next update; none of the changes below is implemented yet. Product version, release ZIP and calendar-write behavior remain unchanged.

The owner supplied eight directions. Clear requests are recorded as planned; unresolved policy/interaction choices are identified rather than silently decided. The owner answered the first three questions during this review: require timezone confirmation before search; automatically include every profile mapped to the organizing calendar; and expand executive flexibility beyond comfort to explicitly permitted calendar overlaps. Three follow-up policy questions remain open in item 3.

## 1. Accessible travel and flights

**Planned:** add a Travel & flights action to each person's entry in Manage profiles. Open a focused editor for that person's whole-day travel, destination timezone and optional exact flight times. Offer Add travel and Add flight directly; do not make the EA find nested Advanced sections. Keep the same information accessible from Edit profile, using one shared form/data source rather than duplicate settings.

Whole-day travel remains the default. Exact flights retain the existing protected flight interval and two-hour inconvenience windows around departure/arrival. Show dates, local times and departure/arrival zones clearly. Existing validation, account separation and local persistence remain. This action changes profile scheduling rules, never calendar appointments. LLM email extraction and live flight APIs remain deferred.

## 2. Search inside timezone dropdowns

**Planned:** use one searchable, closed-choice timezone picker across profiles, search/review, browsing, availability rules, travel, flights and protected-time entry. Typing filters/suggests existing choices; it does not save arbitrary text as a timezone.

Match readable place names, IANA identifiers and supported common aliases. For example, Jerusalem finds Asia/Jerusalem; New York or Eastern offers an explicitly labelled America/New_York choice. Keep valid saved aliases and UTC. Keyboard arrows/Enter/Escape, clear labels, selected-value display and an accessible combobox/listbox are required. Do not infer a person's zone from an email, automatically adopt a clue, or represent a DST-observing zone as a permanent GMT offset.

## 3. Executive flexibility: hours and calendar overlaps

**Owner clarification:** this is broader than convenience ranking. An executive may prefer a clash in their own calendar when meeting outside guests, but not for every appointment. The owner proposes an Ignore convenience checkbox alongside Ignore working days and hours, moving both into Advanced. Per-meeting/per-profile controls are a possible direction.

**Planned:** retain separate controls for working days/hours and convenience. Move both profile checkboxes into an advanced working/availability area. Proposed meeting-specific overrides belong in a participant's Options for this meeting, visibly marked when they differ from the saved profile. Meeting overrides must not silently rewrite saved profiles. Required/Optional attendance stays separate; an executive does not become an optional guest because they accept inconvenience or clashes.

**Proposed third control:** Allow proposals that overlap this person's existing meetings. It applies to ordinary calendar clashes for that participant; it does not erase busy data, alter source meetings, treat them as already rescheduled or authorize automatic movement. Keep the existing overlap details and review warnings, and offer replacement times for the OTHER appointments. Deduplicate shared copies so one shared appointment does not count as many required moves. Protected events, flights, explicit blocks and stated availability stay governed by their existing rules unless the EA deliberately edits those rules.

Ranking needs an explicit policy, not merely zeroing a convenience score. Recommendation when a person's overlaps are enabled: rank comfort for the other ordinary-priority required guests first; among equally good times prefer fewer affected appointments/lower disruption; then compare the flexible person's remaining comfort and normal ties. Existing hard rules and known conflicts for participants without overlap permission remain intact. When overlaps are not enabled, retain the normal open-slot search and separate warned alternatives. Never infer these preferences from executive role, calendar ownership or guest domain.

Example: the EA may deliberately prefer a 10:00 guest-friendly option that clashes with one executive appointment over 07:00 that is open but inconvenient for the guest. That is a reviewed proposal; the 10:00 existing appointment remains unchanged until separately rescheduled. The two-hour flight/radius/manual inconvenience treatment is a separate question below. Hour enforcement and last-resort behavior must stay clearly explained rather than changing silently when ranking flags change.

**Follow-up question 1:** should overlap permission start Off in every new meeting and be chosen per participant for that meeting, or also have a saved profile default with a per-meeting override? Recommendation: meeting-only, default Off.

**Follow-up question 2:** when overlaps are explicitly enabled for the executive, should a comfortable time for the other required guests outrank a clash-free time that is inconvenient for those guests? Recommendation: Yes; among equally good guest times minimize affected appointments and disruption. Alternative: always rank clash-free options first.

**Follow-up question 3:** should Ignore convenience remove only usual time-of-day comfort from ranking, while retaining flight buffers, meeting radii and manually marked inconvenient periods, or ignore all soft inconvenience rules? Recommendation: usual hours only. Working-day/hour enforcement remains its own checkbox and protected time remains protected.

## 4. Availability calendars in main profile setup

**Planned:** move Availability calendars out of Advanced into the main profile form, beside identity and timezone. Use selected source rows/closed searchable choices and Add another. Show exact-email matches and confirmed owner suggestions clearly; retain explicit EA confirmation for ambiguous shared calendars. All choices must respect the workspace calendar scope in item 6.

Provide an explicit I do not have access to this person's calendar choice. Saving such a profile is allowed, with Calendar availability unconfirmed rather than a false promise of full knowledge. A mapping means these sources are used for that person's availability; it does not grant access or prove every relevant calendar has been linked. Coverage is complete only for selected linked sources that actually loaded the requested interval successfully. Missing/unavailable/excluded sources must remain visible as limits.

The same availability mappings drive automatic participation when that source is chosen as the organizing calendar (item 7), including all mapped people. Do not overwrite or erase saved mappings when a source becomes unavailable or excluded globally.

## 5. Add email first; profile creation is optional

**Planned direction:** adding a valid email puts that person into the appointment's guest list immediately. Deduplicate by normalized email. If a saved profile exists, resolve its name, timezone and Edit profile button. Otherwise show the email and a Create profile button in the same place. Creating a profile pre-fills known details and keeps the guest in the same draft; cancelling profile creation must not remove the guest.

Use this behavior consistently in new invitations and existing-meeting edits. An email-only guest is not a saved profile. Unknown calendar coverage/timezone remains visible; no organizer timezone or guessed working schedule may be presented as that person's verified rules. Existing-event edits still require explicit review and retain guest-removal safeguards.

**Agreed:** timezone confirmation is required before searching. Offer a meeting-only timezone choice for an email-only guest, without forcing a saved profile; Create profile remains optional. Do not substitute the organizing calendar's timezone. A reviewed guest update at an already fixed meeting time can still retain an email-only guest with visibly unconfirmed availability; it does not require a scheduling search or saved profile.

## 6. Relevant calendars during onboarding

**Planned:** add an explicit Calendars used by SlotDesk selection during onboarding, editable later under Settings → Calendars. Preserve own-profile-first setup. Use a searchable checkbox list of accessible calendars and explain: Events from calendars you leave out will not appear in SlotDesk or affect its scheduling suggestions. Calendar metadata can still be listed to let you choose sources and verify the connected account; excluded calendars' events/free-busy data must not be fetched.

This workspace-wide selection defines eligible event sources for browsing, availability checks, contact/profile suggestions, clues, alerts and overlaps. The Existing meetings calendar picker becomes a view filter within that scope: hiding a relevant calendar from the list does not silently stop its mapped availability from being checked. Date changes/Refresh cache all relevant calendars, instead of all accessible calendars. Calendar/date filters within that cache remain local.

Restrict organizing-calendar and profile-source choices to included, accessible calendars. Removing a calendar from the workspace leaves Google's events untouched, clears its loaded/derived session data and invalidates affected proposals/reviews. Keep affected mappings visibly inactive and require a deliberate replacement if the default organizing calendar is excluded. Do not silently change the default or erase mappings. Do not permit excluding the target calendar of an unresolved write before same-event recovery is completed; explain that dependency.

Migration needs explicit attention: existing users must see and confirm their scope, with their currently used/default/mapped calendars shown as initial suggestions. New calendars do not silently join the scope. Scope/account revisions and pending recovery must coordinate across windows. Scope checks must cover every event/free-busy read, including direct detail reads and peer updates, rather than only filtering rendered rows. No OAuth access expansion or provider-side sharing change is proposed.

## 7. Automatic attendance from organizing-calendar mappings

**Owner decision:** automatically include **every profile mapped to the selected organizing calendar**. A source may represent several people's commitments; all those people should join, including the whole team when that calendar is mapped to their profiles. Do not introduce a separate Meeting owner field or a special shared-calendar exception. A mapping expresses the EA's intended relationship; completeness still depends on accessible, successfully loaded data.

Track automatic versus manual inclusion in each meeting draft. On a calendar switch, remove the old calendar's automatically included profiles and add the profiles mapped to the new one, deduplicated by email. Preserve anyone explicitly selected independently. Explicitly removed auto-included people remain removed if the same calendar is revisited in that draft; a new draft restores defaults. Someone already manually present stays manual, with explicit Required/Optional and meeting-specific flexibility choices preserved. Show automatic inclusion visibly, and show the final invitation list in review.

This default affects new drafts and deliberate organizing-calendar changes. Opening/editing/rescheduling an existing meeting must not silently change its established roster. If no profile is mapped to a calendar, do not invent a profile or substitute the EA; show that no participant was added from this calendar. Saved mappings to excluded/unavailable calendars do not make them usable organizing-calendar choices. Removing a guest remains an explicit recipient decision, separate from calendar access and organizer identity.

## 8. Settings and profile organization

**Proposed structure for review:**

| Area | Contents |
| --- | --- |
| Main profile form | Email, name, searchable timezone and availability calendars, with explicit no-access status |
| Profile actions | Edit profile and Travel & flights; the travel form is also reachable from the profile |
| Working time | Advanced: Ignore working days and hours and Ignore convenience; exclusive template/manual schedules and convenience hours alongside their explanations |
| Availability and travel | Positive availability rules, travel/flight entry, protected/inconvenient rules with an explicit person and timezone |
| Advanced profile rules | Meeting radius, minimum notice, leave/holiday exceptions, classification terms and individual event treatment |
| Workspace Settings | Dark mode/full workspace shortcuts; clock/appearance; relevant calendars and default invitation calendar; own-profile link; local data controls |
| Meeting controls | Required/Optional, explicit participant-specific hour/convenience/overlap overrides, attendee removal, automatic mapping-based inclusion, organizing calendar and search choices |

Do not combine unrelated concepts into one long advanced section. Do not duplicate global scope, profile mappings, invitation-calendar choice and browsing filters under the same ambiguous Calendars heading. Keep current template/manual exclusivity, zero-default radius/notice, editable travel, fixed modal headings and the supplied design language. A controls inventory should precede the UI rearrangement; all current saved settings must remain reachable and preserved.

## Delivery order and verification

1. Agree the three questions; settle the controls inventory and migration behavior.
2. Implement the calendar scope and calendar/profile mappings first because they affect onboarding, mapping choices and automatic attendance.
3. Implement email-only guests and temporary versus saved profile state, including reload/shared-window drafts and final invitation review.
4. Apply profile organization, travel shortcuts and the shared timezone picker. Add convenience ranking after its policy is confirmed.
5. Update packaged Help/privacy and version records when behavior ships. Keep the broader website on hold.

Use automated/source and synthetic browser validation for excluded-source reads/derived-data removal, partial coverage, multiple mapped people/team calendars, explicit guest removal/manual retention, switched calendars, unknown timezones, ranking/hard constraints, shared-window conflicts and unchanged calendar-write protections. No new live-account checklist is imposed by this planning record. Unperformed live cases must not be marked passed. Existing deletion/cancellation/calendar-move exclusions remain.
