# Scheduling rules review — 19 October 2026

Status: product planning. This document records confirmed directions, proposed details and open comparisons separately. Runtime behavior and the 0.9.3.5 package are unchanged by this planning record. The owner approves the resulting experience.

## What exposed the problem

The reported 27 October result starts at 17:57, labels a day-off entry as an overlapping meeting, and says 0 candidates / 0 shown above an actual fallback card. The current engine adds event-boundary starts and orders occupied slots by affected-appointment count and cost before participant comfort. That can favor an awkward boundary minute. The UI counts only its primary `open` array, omitting displayed fallback cards; `open` can also include permitted conflicts, so it is not a reliable definition of clash-free.

The redesign must separate candidate eligibility, participant preferences, calendar conflicts, precision, alternative changes and displayed variety. The [engine](../extension/slot-desk-engine/slotdesk-engine.js), [fit/warning model](../extension/slot-desk-engine/workspace-model.js) and [result renderer](../extension/prototype/app.js) currently combine some of these concepts.

## Confirmed in this review

| ID | Decision |
| --- | --- |
| R01 | Default suggested start times use 10-minute units: :00, :10, :20, :30, :40 and :50. This governs starts, not duration: a 15-minute meeting can still end at :15. |
| R02 | Finer starts require zero known conflicts. Prefer a 10-minute start over :05 when it avoids the same conflicts. Use 5-minute starts when needed to avoid conflicts; use finer whole-minute starts only when the 5-/10-minute choices cannot provide the same conflict-free fit. Unknown calendars remain explicitly unconfirmed. |
| R03 | Show results together under Meeting options; remove Other ways to make room. When no clash-free option fits the original request but alternatives exist, say: “No open options in range. Here are the best options I found.” |
| R04 | When own-profile overlap permission is enabled, the guest's working hours can outrank a clash-free option before that guest's working hours, while remaining within the own profile's convenience hours. Confirmed example: 18:00 Jerusalem / 09:00 Los Angeles with an own meeting overlap ahead of clash-free 17:00 / 08:00. |
| R05 | Required guests have equal priority. Minimize the worst affected guest before total guest inconvenience. No new higher-priority guest control is requested. |
| R06 | Prefer the requested duration and dates, then a shorter duration, then later dates. Show the changed duration/date explicitly on each relevant card. This supersedes the old fixed fallback-group ordering. |
| R07 | Own-profile title-based guesses such as Personal or Doctor may become warned overlap alternatives. Explicit protected/leave overrides, manual blocks and saved flights remain blocking. This expands the previous own automatically detected time-off exception; the expansion is planned here, not already shipped. |
| R08 | Among equally good options, use the earliest possible date and vary local times within it; morning, midday and afternoon are the main groups. Spill to the next date when that date cannot provide enough variety. Do not spread across later dates just to use more dates. |
| R09 | Show the actual conflict types and affected entries. A holiday is not an overlapping meeting. Lack of calendar access is uncertainty, not proof of a conflict or of availability. |
| R10 | If guests are equally well served, prefer an own after-work option with no overlaps over an own working-hours option with an overlap, while staying within own convenience hours. Also show the optimized overlap option as a useful different tradeoff. |
| R11 | Flight inconvenience buffers and manually marked inconvenient periods take priority over ordinary working-hour preferences. Actual flights remain hard protection. |
| R12 | Show one option per time-of-day group per date, then move to the next date. Do not fill the list with multiple evening options from the earliest date. |

## Terms and independent dimensions

| Dimension | Meaning |
| --- | --- |
| Own profile | The profile identified at onboarding. It has the confirmed own-profile fallback exceptions; it is not inferred from who owns a shared calendar. |
| Required guest | An included required participant other than the own profile. All such guests are equal unless a confirmed setting changes a particular rule. |
| Optional guest | Remains invited unless removed. Does not eliminate required-person options. Their fit helps break otherwise equal choices. |
| Working time | Saved working weekdays and hours. Nonworking days are excluded unless working rules are ignored or explicit positive availability supplies an allowed time. Outside working hours can be a warned preference compromise within permitted hours. |
| Convenience / acceptable hours | Normally 07:00–20:00, configurable by profile. The outside-hours last-resort permission remains separate from the working-hours and convenience-ranking checkboxes. |
| Explicit availability | A positive window or exact start supplied for a participant. It overrides their ordinary work/hour defaults for that availability rule, as already agreed; it does not override flights, manual blocks or protected entries. |
| Known conflict | An actual known busy interval, leave entry or other disallowed overlap. The type and provenance must remain available for explanation. |
| Unconfirmed availability | Calendar access, coverage or freshness is missing. Do not invent meetings or advertise the person as confirmed free. |
| Requested fit | Original duration and dates. Shorter/later alternatives are different requests and retain visible labels. |

Unknown calendars must not make the engine prefer a person or imply that they have a clearer calendar. Apply their confirmed timezone, profile and explicit availability normally, label the uncertainty, and use only known commitments as calendar constraints.

## Candidate generation and precision

1. Generate actual 10-minute starts throughout the chosen local dates, rather than merely sorting the old 30-minute grid. Preserve duration, real event boundaries, travel timezone changes and DST validity.
2. Add 5-minute and finer event/window-boundary candidates only as potential ways to find a zero-known-conflict fit. Never return 17:57 simply to shave a few minutes off a still-conflicting proposal.
3. Prefer 10, then 5, then finer whole-minute starts when they solve the same availability problem. Do not show neighboring :00/:05/:10 as three diverse options. An explicit exact availability window must still fit; do not silently round it into an unavailable time.
4. The required-versus-optional fine-start edge case is with the owner below. Never describe a proposal as conflict-free for everybody when an optional person has a known clash, even if the required participants are clear. Missing calendar coverage remains visibly unconfirmed.
5. Saved notice, hard radii/blocks and explicit availability still apply to finer candidates. Do not round through a meeting boundary or invent second-level starts. Manual entry/review of an exact time is separate from automatic suggestion precision.
6. Roundness is measured in the visible search timezone. Another participant's local minutes can differ in a quarter-hour-offset timezone; display their real local time. Never distort an instant to make all clocks round.

The exact comparison between fine starts and equally suitable coarse starts must be covered by fixtures, including a free gap that only fits at :05, a gap that only fits at :03, and a dense calendar where :57 still overlaps something and must not be suggested.

## Settings contract

Saved profile defaults are copied into a meeting; an explicit per-meeting override wins for that meeting only. A later profile edit cannot silently reorder participants or remove them from invitations.

| Control or rule | Effect on eligibility/ranking | What stays in force |
| --- | --- | --- |
| Required / Optional | Required people determine feasibility and primary fairness; optional people do not block required people. | Invitation list is controlled explicitly. |
| Ignore working days and hours | Remove the working-week/day/hour requirement and usual work preference for that person. | Their convenience/acceptable hours, explicit availability, known conflicts, flights and other independent rules. |
| Ignore usual convenience | Remove that person's ordinary time-of-day ranking penalty. | Flight buffers, configured inconvenient periods/radii, calendar conflicts, hard protections and explicit availability. It must not silently enable outside-hours last resorts. |
| Allow overlaps with other meetings | Ordinary known meeting overlaps for that participant can compete with clash-free options under the confirmed preference rules. It does not force an overlap. | Conflict warnings, hard protections, attendee list and deliberate booking review. Other participants do not inherit this permission. |
| Overlaps not enabled | Keep ordinary clashes as clearly warned fallback choices rather than treating them as normal free availability. | Prioritize ordinary feasible choices; never turn an unapproved hard protection into a booking. |
| Enable outside-hours last resort | Explicitly make additional candidates outside acceptable hours eligible, with per-person local-time warnings. Keep them visibly identified. | Flights, hard protections, positive availability and other independent blocks. |
| Positive availability | Use the exact/window/date/weekday rule instead of ordinary working/hour defaults for that participant. | Other independent protections; do not invent availability beyond the supplied window. |
| Meeting radius: inconvenient | Count only the affected portion as explicit inconvenience; disclose it separately from ordinary out-of-office hours. | Ordinary meeting conflicts are still separate. |
| Meeting radius: blocked | Treat the configured radius as a user-set block. Proposed interpretation: overlap permission for an appointment does not silently disable this independently configured hard radius. | Owner may explicitly change the radius/rule. This interaction needs an implementation regression because current extended busy intervals are classified like their underlying meeting. |
| Leave/holiday date exception | Remove the specified person's leave restriction on those dates only. | Other appointments, flights, timezones and date ranges. No calendar entry is changed. |
| Event-specific treatment | Explicit ignore/protected/leave/soft/movable beats automatic title classification. | Own-profile automatic-title exception does not override explicit protection. |

Current `ignoreWorkingHours` can allow outside-07:00–20:00 candidates without the separate bad-hours flag. The revised implementation must enforce the previously agreed outside-hours permission consistently. Current hour metrics also combine usual work, flight buffers and manual inconvenience; those components must be retained separately before ranking or explanation.

## Comparison pipeline

Use explicit comparison stages with an explanation, rather than opaque weighted sums. A later stage cannot compensate for violating an earlier hard rule.

1. **Eligibility:** valid date/time and timezone, future time/notice, required participants' explicit availability, working-day policy, flights, protected blocks and applicable last-resort permission.
2. **Normal hours before outside-hours last resort:** permitted night/outside-hours candidates stay behind normal-hours alternatives. The user's original duration/date preference does not silently bypass this independent last-resort policy.
3. **Request category:** original duration/dates, then a genuinely shorter option, then additional dates. No empty alternative categories; no Shorten to 30 for a 15-minute request. Preserve a label for every changed request.
4. **Permission category:** clash-free fits and overlaps explicitly allowed for all affected profiles can compete on guest fit. Ordinary overlaps for profiles without that permission remain disclosed fallback choices behind otherwise feasible candidates in the same request/hour category. Permission is not borrowed from another profile, and no ordinary permission overrides a hard block.
5. **Explicit soft inconvenience, then guest fit:** avoid flight buffers and manually marked inconvenient periods before ordinary working-hour preferences. Among these explicit soft compromises, minimize the worst required-person burden before total burden, including the own profile. Then minimize the worst required guest's ordinary-hour compromise before the total guest compromise. Ignore a metric only when its specific confirmed control disables it.
6. **Overlap disruption, then own ordinary hours:** when guests are equally well served, prefer the clash-free fit before improving own working-hour fit. Among otherwise equally suitable conflicts, favor fewer distinct affected appointments, then lower disruption and fewer affected people. Count a shared event once and separate a day-off warning from an actual meeting needing replacement. Retain the optimized own-working-hours overlap as an explicitly labelled tradeoff when it is useful, as required by R10.
7. **Precision and ordinary tie-breaks:** use the confirmed 10/5/finer policy, preserve optional attendance preference, and prefer :00/:30 over other 10-minute starts only when the actual fit is equivalent. Do not let a round clock bypass a hard constraint or fixed availability.
8. **Display variety:** select distinct useful choices from equally good candidates, using the earliest date and time-of-day bands. Do not spend worse guest fit or a new conflict merely to produce a different-looking card.

The order between original-request overlap and changed-request clash-free choices follows R06. Inside an original request, permitted own overlap versus guest working-hours follows R04; an unnecessary own overlap when guests are equally served follows R10. Explicit soft inconvenience precedes ordinary-hour preferences under R11. Core comparisons are now answered; implementation details below remain a proposed design for owner review, not shipped behavior.

A participant's explicitly supplied positive availability is an independently authorized window, as already agreed. It can override that person's usual working/acceptable-hour defaults and counts as normally permitted availability for this comparison, rather than pretending the global last-resort checkbox was enabled. Keep that provenance in the explanation. With no own profile included or with it optional, do not invent a required-own-hour burden. A flexible executive saved as another required profile remains an equal guest, with their specific Ignore usual convenience/overlap settings changing those rules rather than introducing an undocumented executive role.

## Case families and expected experience

These cases combine through the pipeline; there is no separate arbitrary rule for every pair of people. “Free” below means zero known conflicts with any uncertainty still labelled.

| Case | Expected result |
| --- | --- |
| Everyone fits working hours and has no known busy entries | Round 10-minute options; use the earliest date and varied time bands. |
| Own profile fully booked; required guest has no known commitments | With own overlaps enabled, prioritize guest working hours within the own permitted convenience range; prefer less disruptive own overlaps among equally good guest times. |
| Same case, guest calendar not connected | Same timezone/profile-based search, with Availability unconfirmed; do not say their calendar is fully open. |
| Own profile has clear times before guest working hours and allowed overlaps during guest working hours | Choose the latter under the confirmed 18:00 / 09:00 example. |
| Guest working hours are entirely outside own acceptable hours | First seek a compromise inside both people's acceptable/convenience windows. Only show an outside-hours option after the EA enables that last resort. |
| No shared acceptable interval and last resort disabled | Explain the incompatible hours and which specific rule can be changed; do not silently propose a night call. |
| Working hours differ, but both have overlapping convenience windows | Show the best compromise with per-person Outside working hours explanations; fairness among required guests, own fit separately. |
| Multiple guests cannot all get working hours | Equal required-guest treatment: minimize the worst guest compromise, then total compromise. Never use participant order as a priority. |
| Three guests, one can only do an explicitly supplied window | Enforce the window, then optimize within it; do not silently drop that guest or extend their availability. |
| Optional guest cannot attend | Keep them invited unless removed; show their reason. Required-person fit takes priority. |
| Optional guest can attend an otherwise equal option | Prefer that option. It must not beat a clearly better required-person result merely by adding attendance. |
| Own profile is not included | Apply no own-person hour or preference penalty; treat the included required guests equally. Do not silently add the user back. |
| Own profile is optional | Treat own conflicts/constraints like another optional attendee for feasibility; keep the invitation unless removed and disclose their fit. |
| Every included participant is optional | Ask the EA to identify at least one required participant before searching, matching the existing valid-request boundary. Do not silently change their selections. |
| Organizing calendar is checked as a resource | Keep resource conflicts distinct from people's identities; calendar ownership alone does not mean the EA attends. Deduplicate shared event copies. |
| One required guest allows ordinary overlaps | Apply permission only to their conflicts; other guests' permissions are independent. Their usual hours still matter unless separately ignored. |
| Executive guest ignores usual convenience and permits overlaps | Optimize the other required guests' usual-hour fit without adding an ordinary-hour penalty for that executive. Their explicit soft periods, flights and protection still apply. |
| Overlaps enabled but a comparable clash-free time serves guests equally well | Prefer the clear option, even after own working hours within convenience hours; also offer the optimized working-hours overlap as a useful alternative. |
| Own all-day holiday/day off detected automatically | Warn specifically about the day off and allow an own-profile alternative; keep the entry and do not propose rescheduling the holiday. |
| Own Personal/Doctor protected only by a title guess | Planned R07: explain the detected title rule and allow warned own-profile fallback. Do not falsely call it a confirmed medical appointment/flight based only on words. |
| Other required person's protected leave or title-rule block | Retain that profile's protection; explain the specific entry and the relevant rule/override. |
| Explicitly protected event or manual blocked period | Exclude the overlap even when ordinary overlaps are enabled. Show the block and a specific way to review it. |
| Saved flight itself | Exclude the interval; name the flight. Working-hour/convenience/overlap flags do not permit flying and meeting simultaneously. |
| Guest has no connected calendar but has a saved flight or manual availability | Enforce those known rules, while calendar coverage remains unconfirmed. No calendar mapping does not erase separately entered constraints. |
| Two-hour flight inconvenience window | Keep it separate from the flight and ordinary work hours; prioritize avoiding it ahead of improving ordinary working hours. |
| Configured inconvenient meeting radius | Report time before/after the named meeting and affected minutes; do not call it an overlapping meeting when it only crosses the radius. |
| Configured blocked radius | Keep as an explicit block under the proposed interpretation above; do not hide it under the underlying appointment's ordinary classification. |
| Nonworking day with normal working rules | Exclude for a required profile and identify Nonworking day. Explicit availability or Ignore working days and hours can change this. |
| Ignore working rules enabled | Ignore both weekdays and office-hour preference; retain remaining convenience/protection rules and show why the chosen time fits those settings. |
| Ignore usual convenience enabled | Remove only the ordinary hour preference; never remove flights, explicit soft constraints or independent hard restrictions. |
| One person travelling on selected whole dates | Use their confirmed travel timezone for that date; show local date/time and apply rules in that zone. Location change alone is not a calendar conflict. |
| Meeting crosses a timezone/DST/travel boundary | Evaluate the entire interval, not only the start; display the actual dates and offsets. Nonexistent local times are not suggestions. |
| Meeting crosses midnight | Apply both local dates' relevant rules and show the date change; preserve original duration. |
| Actual gap only fits at :05 | Show it ahead of a conflicting 10-minute alternative, with any unknown availability still disclosed. |
| Actual gap fits at :00 or :10 as well as :05 | Prefer the 10-minute option; :05 is not another useful diverse choice. |
| Actual gap only fits at :03 | Allow the finer whole-minute option only because it avoids all known conflicts and no 5-/10-minute choice provides that fit. |
| Odd boundary start still conflicts | Do not suggest :57 to reduce a still-present conflict; use the 10-minute base options. |
| Normal grid misses explicit exact availability | Consider the stated exact time if all other rules fit and the precision/conflict policy permits it; otherwise explain the exact constraint. |
| Explicit positive availability says 23:00 despite a usual 20:00 limit | Respect that participant's explicitly authorized availability, keeping other participants' applicable windows and all protections. Explain stated availability; do not claim a global last-resort switch was enabled. |
| Shared appointment appears through several calendars/people | Deduplicate the occurrence, preserve each affected participant and count one affected appointment. |
| Recurring appointment | Treat the actual occurrence as the conflict; never imply that replacing this one time changes the whole series. |
| Existing appointments already overlap each other | Penalize conflicts introduced by this proposed meeting, not unrelated existing calendar overlaps. |
| Transparent/free event, ignored event, or declined invitation | Do not count it as a busy meeting. Preserve provider semantics and explicit local treatment. |
| Tentative/hold versus ordinary/external meeting | Explain the actual type and use disruption ordering among equally suitable proposals; a hold is still a known occupied interval. |
| Redacted busy entry | Report Busy appointment and exact visible time; do not fabricate the title, attendees or category. |
| Partially loaded/stale calendar | Retain known blocks, disclose incomplete coverage and do not claim a confirmed free slot. Fresh checks before booking remain mandatory. |
| Original request overlaps; shorter request is clear | Original request first under R06; label the shorter card with its actual duration. |
| Only extra dates are clear | Show their actual dates with a clear outside-request label, after original/shorter alternatives. |
| No eligible candidate exists in any allowed category | Explain the actual reasons and relevant controls. Do not say “Here are the best options” above an empty list. |
| Calendar changes after suggestions | Recheck before sending; if conflicts/rules change, show updated details and require review. Searching, ranking and choosing a card never change existing events. |

## Result cards and conflict categories

Use one Meeting options list and a truthful visible option count. Zero `open` array entries must not produce 0 shown when fallback cards are visible. “No open options” refers to the original duration/date request having no zero-known-conflict choice; permitted overlaps do not become clash-free merely because they are allowed.

For each person, show compact actual categories, potentially more than one, rather than replacing everything with Calendar conflict:

| Category | Example compact text | Expanded detail, once in Warnings |
| --- | --- | --- |
| Meeting overlap | 1 overlapping meeting | Named meeting, its local start/end, overlap portion, tentative/ordinary/external/hidden status when known, and who must coordinate. |
| Leave / holiday | Day off | Actual entry title and dates; whether explicitly set or automatically detected; own-profile fallback warning. Never count it as a meeting. |
| Flight | Flight | Saved flight and exact interval; actual flight protection versus pre/post-flight inconvenience. |
| Nonworking day | Nonworking day | Day/date, profile rule and the control/availability exception that would be needed. |
| Outside working hours | Outside working hours | Actual local start/end and relevant preferred working window. |
| Outside acceptable hours | Outside acceptable hours | Actual local time and explicit last-resort permission; clearly stronger than ordinary working-hour stretch. |
| Manual protected block | Protected time | The user's label, interval and affected participant. |
| Flight buffer / meeting radius / other soft period | Inconvenient period | Source, exact affected interval and minutes; do not merge it into anonymous “inconvenient minutes.” |
| Calendar unavailable/incomplete | Availability unconfirmed | Missing source/coverage/freshness where known. It is not an event conflict. |
| Positive availability does not fit | Outside stated availability | The supplied window/exact-start constraint. Required people cannot be silently invited as if their explicit availability fitted. |

An example card can therefore say “1 meeting overlap · Day off” for the own profile and “Availability unconfirmed” for the guest, instead of incorrectly saying “2 overlapping meetings.” Full detail remains in one expandable Warnings section; do not restore giant repeated warning bubbles. An excluded required person's flight/day-off/nonworking-day case appears in the explanation of missing options, not as a selectable proposal that violates an unchanged hard rule. Optional participants' corresponding conflicts can appear on a proposal with clear individual warnings and their invitation retained.

## Variety proposal

Rank quality first. On the earliest equally suitable local date, select a strong representative from each feasible time-of-day band before selecting near-duplicates. Proposed fixed bands in the visible search timezone: morning 06:00–12:00, midday 12:00–14:00, afternoon 14:00–18:00, evening 18:00–22:00 and night 22:00–06:00. Evening/night support international work; the hour/protection policies still determine eligibility.

If several candidates in a band are interchangeable, prefer a round clock and avoid duplicate overlapping proposals. The confirmed rule is one option per band/date, then spill to the next date. If only evenings fit, choose the best evening on the first date, then the next equally good evening on the next date. Morning/noon/afternoon are variety opportunities, not a requirement to suggest unusable times. The requested option count is a maximum, not a reason to invent poor alternatives.

The R10 clear-versus-own-working-hours-overlap pair is a meaningful tradeoff, not another near-identical time. Proposed presentation: reserve space for both when there is a genuine own-hour benefit and overlaps are enabled; ordinary time variety fills the remaining positions. If the pair would occupy the same band/date, the explicitly requested tradeoff takes precedence over decorative variety, and is labelled. If a user sets only one displayed option, keep the best and offer an explicit Show overlap alternative action. Do not add a dominated clash solely to satisfy this pairing when ignoring own usual hours removes its benefit.

Existing Start-time spacing and Options per day controls would otherwise contradict R01/R12. Proposed implementation: automatic search always uses the 10-minute base and one-per-band policy; remove those obsolete controls, migrate/ignore their legacy values without breaking portable-file compatibility, and retain Options to show plus the applicable shorter/extra-date settings. Do not let an old 30-minute grid hide a valid :10 option, or an old one-per-day default prevent morning/noon/afternoon choices.

## Comparison decisions completed with the owner

| ID | Concrete comparison | Confirmed decision | Status |
| --- | --- | --- | --- |
| O01 | Guest is equally well served; own working-hours option clashes, own after-work option is clear and within convenience hours. | Prefer the clear option, and also show the optimized overlap alternative. | Confirmed 19 October; R10 |
| O02 | Guest working-hours option falls in the own profile's flight inconvenience buffer; an earlier guest time avoids that buffer. | Prioritize explicit flight/manual inconvenience before ordinary working-hour preferences. | Confirmed 19 October; R11 |
| O03 | Earliest date has good options only in one time band, e.g. 18:00–20:00. | One option per time-of-day group, then move to the next date. | Confirmed 19 October; R12 |

The main comparisons above have answers. The combined-case review exposed three further interaction questions now with the owner:

| ID | Interaction | Recommendation | Status |
| --- | --- | --- | --- |
| O04 | Only a 5-minute start clears required participants; an optional guest is busy. | Show it with the optional clash disclosed and their invitation retained; do not describe everybody as free. | Asked; awaiting answer |
| O05 | Useful clear-versus-own-working-hours-overlap tradeoffs share one date and time band. | Show both, clearly distinguished; useful tradeoff beats decorative variety. | Asked; awaiting answer |
| O06 | Old spacing/per-day controls contradict the new fixed policy. | Remove those controls, migrate legacy values and retain Options to show/duration/date choices. | Asked; awaiting answer |

Band boundaries and the exact screen design remain reviewable implementation proposals. This is not a claim that every possible UX edge case has been approved.

## Engineering checks required after approval

- Table-driven fixtures for the case families above and paired comparisons that change only one input. Include both new invitations and rescheduling.
- Deterministic results regardless of participant/profile source order; own profile identified explicitly; equal required guests; optional guests non-blocking.
- Precision examples with :00/:10 versus :05/:03, real event seconds, arbitrary durations, exact availability and missing calendar coverage.
- Individual flags and their combinations: working/convenience/overlap/required, with saved defaults, meeting overrides, restore/import and profile updates.
- Preserve separate usual-hour, explicit-inconvenience and event-type facts; test accurate meeting/leave/flight/radius counts and warnings without duplicate blocks.
- Shared occurrences deduplicate; existing unrelated overlaps do not create extra penalties; hidden data stays hidden; partial data remains unconfirmed.
- Verify earliest-date/time-band diversity never substitutes a worse permission or conflict class simply for variety.
- Fresh booking/rescheduling checks use the same rule model and preserve explicit confirmation; no automatic event movement, deletion or invitation sending.

Automated checks will document the implemented rules. They will not establish owner approval of the overall UX.
