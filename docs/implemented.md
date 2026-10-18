# Implemented scheduling work

## Usability and portable configuration — 0.9.2

Live profile saving, per-entry flight/travel Save/Discard, optional return-flight entry, complete setup backup/restore and selectable person-profile export/import are implemented. [File contract](export-import.md) and [screen/save flows](usability-flows.md) describe identity, replacement and compatibility behavior. Keyboard/dialog/timezone controls and initial wording have been refined; a complete copy/accessibility review remains future work.

Current code: **0.9.2**. F01–F28 are implemented; the registration service is deployed and configured in this pilot. F01–F04 are the original four reproduced defects. New-meeting booking was added in 0.3.0; reviewed rescheduling and decline alerts are implemented in 0.7.0.

| ID | Work | Accepted behavior | Status |
| --- | --- | --- | --- |
| F01 | Apply manual constraints to their actual target | Global constraints and required participants' constraints reject conflicting slots. An optional person's constraints affect that person's attendance and produce a warning, without rejecting the slot. Removing a person removes their constraint's effect. Unknown IDs produce an explicit validation result instead of silently blocking everyone. | Implemented; engine and prototype |
| F02 | Count exact minutes outside working hours | 17:55–18:15 against an 18:00 end counts 15 stretching minutes. Arbitrary working-hour boundaries and meeting durations are handled correctly. Whole-meeting hour limits remain enforced. | Implemented; engine and prototype |
| F03 | Preserve tentative event status | Both event status and attendee response are retained. A tentative event with no attendee list is scored as tentative. Cancelled events and declined invitations remain excluded. | Implemented; engine and prototype |
| F04 | Preserve visibility per event | Hidden-detail events receive the hidden-details treatment and "ask first" explanation. A private event whose details are actually available remains detailed. A genuinely untitled event is not automatically classified as hidden. | Implemented; engine and prototype |
| F05 | Make optional attendance useful and consistent | Optional guests never block a proposal. Their calendar, hours and manual constraints determine whether they can attend; proposals show the reason when they cannot. Required-person comfort ranks first: worst individual stretch, then total stretch, then timing comfort. Optional attendance breaks equal-comfort ties. The ineffective exclusion fallback is removed. | Implemented; engine and prototype |
| F06 | Add explicit last-resort bad-hour options | The normal search excludes times outside acceptable hours. Only after an explicit EA action may a last-resort search show those times, with the affected people and their local times clearly marked. This changes hour limits only; protected events, manual constraints, notice and other hard rules remain enforced. | Implemented; engine and prototype |
| F07 | Add manual whole-day travel with confirmable calendar suggestions | Whole-day date ranges are the default. The EA can enter and edit travel manually; calendar clues produce suggestions with a visible source and require confirmation. Exact flight timing is an optional advanced configuration in F12. The prototype uses synthetic clues; live clues follow the reader. | Implemented; engine and prototype |
| F08 | Show useful alternatives | When too few proposals are displayed, show one labelled list of applicable options with actual results: more chosen-date options, strictly shorter meetings, later dates and explicit occupied-slot options. Empty/invalid choices are omitted. Bad-hour options remain an explicitly enabled last resort. | Refined in 0.6.0 |
| F09 | Make positive availability a first-class constraint | The EA can enter when a participant CAN attend, with timezone: recurring weekdays, exact permitted starts or available windows, and one-off dates. Example: Tuesdays and Wednesdays at 18:00 US Eastern every week. Stated availability replaces that person's ordinary hour limits for this request, and limits their attendance to the specified times; calendar conflicts and explicit protected blocks still apply. Store recurrence locally and resolve per date. Optional guests remain non-blocking. | Implemented; engine and prototype |
| F10 | Suggest timezones deterministically and require entry when clues are absent | Use explicit zone IDs/names, saved person settings, clearly identified cities or appropriately associated calendar metadata as confirmable clues. Show the source and ask when ambiguous; never infer physical location from an email domain. The EA enters/confirms the timezone alongside positive constraints. No LLM or automatic email reading is required. | Implemented; engine and prototype |
| F11 | Block confirmed leave/holidays with per-person date/range exclusions | Use structured event/source information and editable category rules to identify leave/holidays; uncertain entries remain notes pending review. The EA can say that holiday/leave days for a particular person do not count, using a single date or date range. This affects scheduling without changing the source calendar or unrelated conflicts. Interpret blocking dates in source calendar timezone and preserve exclusive end boundaries. | Implemented; engine and prototype |
| F12 | Add optional exact flight times and two-hour inconvenience windows | The advanced travel configuration accepts exact flight times. Count overlapping minutes in the two-hour radius around departure/arrival like ordinary stretching outside working hours, with the same required-person fairness scoring and a visible warning. These windows are soft; the flight interval remains busy/protected. Merge overlapping inconvenience intervals, counting an inconvenient minute once. | Implemented; engine and prototype |
| F13 | Add profile-configured radii and notice with zero defaults | Default meeting radius/buffer is zero; default minimum notice is zero. A profile can configure a radius around meetings as either soft inconvenience or blocked time, and configure minimum notice. Explicit advanced-flight two-hour windows are a separate opt-in travel feature. Validate settings and expose them plainly. | Implemented; engine and prototype |
| F14 | Use the EA's selectable search timezone and full local proposal times | Search dates and per-day grouping use the EA's chosen timezone, visibly selectable and changeable. Results show each participant's local date, start/end times and timezone; copied proposals preserve this information. Participant ordering does not change search boundaries. | Implemented; engine and prototype |

Read-only existing-meeting browsing, guest responses and the workspace navigation are recorded in UX34–UX39. Availability normalization still excludes declined/cancelled events from busy time; browsing separately preserves declined invitations.

Validation: twelve application suites cover 1275 checks. See [testing](testing.md).

## Release 0.6.0 refinements

[F01–F14](#implemented-scheduling-work) remain implemented. Whole-week browsing, revised meeting cards/details, dropdown availability mappings, early organizing-calendar selection and window synchronization are recorded in [UX40–UX46](ux-decisions.md). Required-person ranking now includes distance from comfortable times before optional-attendance ties; known invitations provide partial, explicitly unconfirmed evidence for unmapped guests. See the [implementation record](pending-ux-review.md) and [release tests](testing.md). Decline alerts were subsequently authorized and implemented in 0.7.0.

## Release 0.6.1 refinement

[UX48–UX51](ux-decisions.md) replace calendar-week browsing with exact inclusive date ranges, multiple calendars, a display-timezone dropdown and a memory cache for all accessible sources. Date range has no fixed day count. Selection/timezone changes use cached entries; date changes and Refresh reload them. This browse cache does not change fresh booking checks or introduce event writes.

## Release 0.7.0 meeting management

| ID | Work | Accepted behavior | Status |
| --- | --- | --- | --- |
| F15 | Reviewed rescheduling | Target a single organizer-copy event/occurrence; search or choose exact times; preserve content/guests/Meet; fresh availability, account/role/version guards; time-only conditional PATCH and saved recovery. | Implemented; successful live reschedule reported 13 October |
| F16 | Declined invitation alerts | Group upcoming No replies in the bell, mark optional guests, dismiss repeated observations, offer Find another time. Update on existing reads/Refresh, with no automatic movement or polling. | Implemented |
| F17 | Overlap management | Red Overlapping label and simple expandable details for all busy displayed entries; deduplicate shared copies; rank fewer distinct appointments first and offer the OTHER appointment's rescheduling flow. Save collision follow-ups after confirmed writes. | Implemented |

The [rescheduling record](rescheduling.md) defines scope, recovery, cache/alert boundaries and deferred meeting-content search.

## Release 0.7.1 meeting editing

| ID | Work | Accepted behavior | Status |
| --- | --- | --- | --- |
| F18 | Reviewed guest and detail editing | Add/remove guests and change Required/Optional status; edit title, location and description; review each exact change, then conditionally PATCH only the selected organizer-copy event. Preserve retained responses, time, Meet, attachments and other untouched fields. Disable roster editing when the complete roster cannot be verified. | Implemented; 125 synthetic transport checks and browser verification |

See [meeting editing](meeting-editing.md) for scope and recovery. Stored object-key ordering is ignored by synchronization; real field and array changes still require review.

## Release 0.8.0 onboarding and profiles

| ID | Work | Accepted behavior | Status |
| --- | --- | --- | --- |
| F19 | Accessible travel | Focused Travel & flights action in Manage profiles, sharing existing validated data/editor. | Implemented |
| F20 | Main availability mappings | Calendar assignments in basic profile setup, explicit no-access choice and inactive-source warnings. | Implemented |
| F21 | Searchable timezones | Closed supported choices with search, aliases, keyboard navigation and shared light/dark styling throughout. | Implemented |
| F22 | Automatic mapped participants | All mapped people/team members join new drafts; calendar switches preserve manual additions and explicit removals. Existing rosters stay explicit. | Implemented |
| F23 | Email-first guests | Add email immediately; optional Create Profile and mandatory search-time timezone confirmation. Preserve temporary draft guests across reload; clear after completion/new draft. | Implemented |
| F24 | Usual convenience ignoring | Saved and meeting/search-specific preference; omit usual-hour ranking penalties while retaining working limits and other inconvenience rules. | Implemented |
| F25 | Participant-specific ordinary overlaps | Saved defaults/overrides; protected/unknown-busy boundaries, disclosed overlaps and comfort-first/fewer-affected-appointments ranking. | Implemented |
| F26 | Workspace calendar scope and onboarding | Own profile → explicit selected sources/default → optional people; scoped transport/pagination, source cleanup, existing-user confirmation and peer refresh. | Implemented |

See [onboarding and profiles](onboarding-and-profiles.md). The larger UX68 settings redesign and LLM/email candidates remain future work.


## Recovery and registration — 0.9.0 preview

| ID | Work | Behavior | Status |
| --- | --- | --- | --- |
| F27 | Recovery experience | Typed failures, read-only setup, stop loading, stale in-memory views, reconnect without sending, separate Check/Retry, acknowledged manual history and unreadable-storage recovery. | Implemented; synthetic checks/browser verification. See [recovery record](recovery-experience.md). |
| F28 | Onboarding leads | Exactly five fields, optional unchecked updates permission, durable local queue and a private insert-only intake/table. | Implemented and hosted; isolated-database and public-endpoint checks passed. First real registration from the updated extension remains to be observed. See [deployment record](registration-deployment.md). |

## 0.9.1 usability and confirmation update

Implemented: immediate Settings preferences, separate default calendar choice, stable header/logo size, five-profile pagination with live search, six equal suggestion cards with sliding cache, intentional participant-picker opening, offline calendar-change blocking and automatic read-only verification through bell alerts. See [release details](changelog.md#091--15-october-2026) and [recovery rules](recovery-experience.md). Backup/restore, selected-profile import/export and the broader profile/travel save redesign remain planned.
