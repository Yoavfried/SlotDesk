# Next usability update — scope and proposed experience

Started 15 October 2026 after the 0.9.0 registration activation. This is a review and implementation proposal, not a shipped-feature record.

The owner selected keyboard/accessibility improvements, the beginning of a wording review, and a UX review of Manage profiles, Settings, advanced profile editing and travel/flight entry as the next direction. The owner explicitly chose support for selecting individual profiles during local export/import, in addition to a complete profile/settings backup. The backup/import contract is now settled, including own-profile protection. Layout and save boundaries remain proposals. The [concrete task walkthroughs](usability-flows.md) distinguish current behavior from proposed improvements and record the two unanswered save-policy decisions.

## Current observations

- Basic profile editing already contains email, name, timezone and availability calendars. Keep that short setup.
- Advanced profile options currently contains scheduling preferences, timezone clues, working schedules, convenience/radius/notice, positive availability, travel/flights, leave/holiday exceptions, classification rules and individual-event treatment. The nesting makes unrelated controls hard to find.
- Travel & flights is a focused mode of the same profile editor. Its save action still commits the profile draft, so adding a row and saving persistent changes need clearer separation.
- Labels such as Meeting radius and Notice (hours) do not explain their effect. Convenience hours, radius and notice share one heading despite serving different purposes.
- Timezone pickers already implement search and several keys. Review their accessible names, required/error state, selected-option focus and preservation of normal search-field editing. This is further refinement rather than a claim that keyboard support is wholly absent.
- Some dialogs have explicit accessible title associations while others do not. Review naming and focus consistently, including nested calendar information and timezone popups.

## Proposed screen organization

| Screen | Proposed experience |
| --- | --- |
| Manage profiles | Keep search, Add profile and familiar-profile suggestions. Keep the own profile first/protected. Give each row stable Edit and Travel & flights actions, readable timezone and a concise availability-source status. Distinguish no calendar linked from a linked calendar that is currently unavailable. |
| Edit profile | Keep email, name, timezone and Availability calendars as the basic form. Put the remaining settings behind clearly named sections; do not restore a long list of unrelated controls on the basic screen. |
| Working time | Working-day/hour template or manual schedule, the existing ignore-working-time preference and preferred hours. Keep template/manual exclusivity and show when controls are disabled by an override. |
| Availability | Positive availability windows and protected/inconvenient periods. Explain whose timezone each rule uses and whether it applies once or repeatedly. |
| Flexibility and meeting rules | Separate usual-hour ranking, ordinary-overlap permission, meeting buffers and minimum notice. Show saved defaults as defaults; meeting-specific changes remain on that meeting. |
| Special dates and event treatment | Holiday/leave date exceptions, title classification and individual-event rules. Explain precedence and the affected person/date or event. |
| Travel & flights | A focused list of trips/flights with Add, Edit and Remove. Start a new entry by choosing Travel dates or Exact flight. Keep whole-day travel simple and place exact flight details in their own form. |
| Settings | Group Display, Calendars, Local data & backups, and Recovery. Keep profile editing/suggestions in Manage profiles. Place destructive local clearing apart from routine backup/import actions. |

Use consistent fixed headings/action bars and explicit Save/Discard behavior. Returning from a nested editor should return to its parent with the relevant item visible and keyboard focus restored. Changes must not disappear merely because another information popup was opened. Keep the supplied fonts, wordmark, lime header and light/dark tokens.

## Situations to resolve in the UX pass

| Situation | Recommended experience |
| --- | --- |
| Many profiles or a long email/name | Search remains usable; row actions stay aligned; full identity is available without breaking sidebar layout. |
| No availability calendar access | Saving the profile remains possible and the limit is stated plainly. Do not turn missing access into a false free-time result. |
| Calendar linked but excluded/unavailable | Keep the assignment visible with the reason and a relevant action. Do not erase it or silently include a new calendar. |
| A saved flexibility default differs for this meeting | Clearly distinguish the current meeting's choice from the saved profile default. |
| Ignore working hours is enabled | Working days are ignored too; disabled schedule controls have an adjacent explanation. Other constraints keep their existing meanings. |
| Ignore usual convenience is enabled | Explain that usual preferred hours stop affecting ranking while flight buffers and other inconvenience rules remain. |
| Add a trip | Person, destination timezone and inclusive dates are visible. Show a concise summary before saving. |
| Add an exact flight | Show departure date/time/timezone and arrival date/time/timezone separately. Explain the protected flight interval and existing two-hour inconvenience windows. |
| Flight crosses midnight or the date line | Validate actual instants and show both local dates/zones. Do not assume arrival must have a later wall-clock reading. |
| Ambiguous or nonexistent local time | Explain the exact field/problem and require a valid, unambiguous choice rather than silently changing it. |
| User leaves an edited form | Consistent explicit save/discard behavior preserves the entered values until the user chooses. A nested picker closes before its parent form. |
| Invalid field below a collapsed section | Open the relevant section, retain other input, identify the field and move focus to the problem. |

These are UX acceptance targets; an observed implementation defect should be reproduced before being reported as a confirmed bug.

## First wording pass

Review the named screens and their validation, empty, loading, success and error states together. Use one term for the same concept, short action labels and explanations beside controls with non-obvious consequences. Keep user-facing text directed at the assistant using SlotDesk.

Initial examples for review:

| Current wording | Proposed direction |
| --- | --- |
| Notice (hours) | Minimum notice, with an explanation such as How far ahead a meeting must start. |
| Meeting radius (minutes) | Time around meetings, with Before and after existing meetings and the selected blocked/inconvenient treatment explained. Keep zero as the default. |
| Convenience hours, radius and notice | Separate Preferred hours, Time around meetings and Minimum notice. |
| When they CAN attend | Available times, with a short explanation of what the entered windows restrict. |
| Event rules — you have full control | Event treatment, with concrete labels for protected events, flexible holds and leave. |
| Advanced: exact flights | Exact flight, as an entry type in Travel & flights. |

Final wording must match verified rule behavior. This is the beginning of the copy review; meeting creation, management, alerts and recovery can receive the subsequent broader pass.

## Keyboard and accessibility

Include keyboard behavior while designing each screen, then verify complete keyboard-only journeys. Check tab order, visible focus, accessible names and selected/expanded/disabled states; keyboard-operable search/results; error association and useful status announcements; and readability/controls at narrow widths and increased zoom in both themes. Labels and text must communicate status alongside color.

For dialogs, review initial focus, focus containment, return focus and parent/child navigation. Escape should first close the active picker or dismissible child; preserve the agreed mandatory onboarding steps and explicit handling of unsaved edits. Enter in a search or ordinary field must not unexpectedly confirm an import or send a meeting. The deliberate confirmation button must remain operable by keyboard.

Use the [W3C modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) as implementation references. Do not claim full accessibility conformance from a static review or automated scan alone.

## Local backup/restore and selected-profile import/export

The owner clarified two distinct operations: portable complete-setup backup with full local replacement on restore, and portable selected-person files containing every supported setting for each selected person. Select all is required. Named columns drive cross-version compatibility: ignore unknown columns, warn/default missing optional columns, and fail for missing base columns. Full field-by-field previews are not required.

The [detailed export/import contract](export-import.md) supersedes the original combined proposal, records calendar-access edge cases, and records the confirmed import choices: required email/timezone, email as a missing name, replacement of matching-email profiles after one warning, and included calendar assignments with unavailable sources flagged. Full restore replaces local configuration except for the explicit own-profile protection: update own-profile data only for a matching email; otherwise keep it unchanged. Selected-person imports containing the own email apply nothing and show an alert. Backups contain profiles/settings, clear the current unsent draft on full restore, and offer an optional current-backup download before replacement. Neither operation changes Google calendar data or sharing. The backup/import contract is settled for implementation.

## Delivery and evidence

Review the [task-based screen flows](usability-flows.md) first. The owner has not yet chosen the profile or travel save model; do not infer approval. Then implement wording and keyboard behavior alongside the final layout, and local export/import under the settled contract. Verify with synthetic profiles, travel, mixed calendar access, duplicate-email conflicts, invalid files, save failure and cross-window changes. Use focused local browser checks without Google sign-in or invitations; do not assign another real-calendar test checklist for these changes.

Keep all new work labelled planned until implemented and verified. Update Help, privacy, version logs and the package when it ships. The broader website, Outlook, LLM/email work and extension-store distribution remain separate workstreams.
