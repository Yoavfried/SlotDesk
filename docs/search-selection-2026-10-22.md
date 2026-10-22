# Search selection and fallback order

Owner direction and final count clarification: **22 October 2026**, implemented as a same-version **0.9.4.6** hotfix. This supersedes previous initial counts, five time groups, later-date ordering and perfect-working-hours-only fallback descriptions. Advanced-profile review remains owner-led and reserved for 0.9.5.

## Feasibility and time groups

A good option has no known conflict for required participants and fits their active availability and permitted usual-hour rules, normally 07:00–20:00. It can be outside preferred working hours. Optional guests remain non-blocking; missing calendar access remains visibly unconfirmed. Soft flight/radius/manual inconvenience still affects quality and warnings. Flights themselves, explicit blocks, protected entries, working-day enforcement and positive availability retain their hard boundaries. Saved and per-meeting Ignore flags retain their meaning.

Use exactly three groups in the search timezone: **before 12:00**, **12:00–14:00**, and **14:00 onward**. Evening/night do not create extra groups. Personal hour rules still determine eligibility.

For one to three selected calendar dates, choose at most one representative per group/date. For longer ranges, choose one representative per eligible date. Omit dates with no feasible candidate rather than violating a hard rule to fill the list. Keep displayed suggestions mutually non-overlapping across categories and appended batches.

Choose the earliest start among equally suitable candidates; unused surrounding margin must not push 09:00 to 10:00. Preserve required-person/disruption/optional-attendance priorities, the ten-minute base and eligible five-minute refinements, never finer automatic starts. Existing requested-duration and conflict-driven shortening rules remain; ordinary timing preference alone does not authorize shortening.

## Initial list and further choices

| Situation | Result |
| --- | --- |
| Good working-hours choices exist in the selected dates | Initially show only good in-range representatives, up to five; one representative means one card. Generate more appends remaining good choices, then eligible in-range compromises. No later dates. |
| No good working-hours choice in range; a good later working-hours choice exists | Feature exactly one best later working-hours choice first. Never offer further later-date choices, including in subsequent batches. |
| No good working-hours choice in range; a good outside-working-hours choice exists inside the dates | Feature exactly one such in-range choice, after the later working-hours choice if present. |
| Neither independent featured choice exists | Feature one combined later-date/outside-working-hours choice if possible. Do not add a combined choice when either independent category exists. |
| After the zero/one/two featured cards | Show the first three in-range compromises from the nearest eligible dates/groups. Generate more appends up to three further representatives until exhausted, preserving existing cards/order/expanded warnings and scroll position. |

The final owner clarification explicitly allows **both** one later working-hours choice and one in-range outside-working-hours choice when there is no good working-hours choice in range. This refines the earlier broad statement that any clear in-range time would suppress later dates. A clear outside-working-hours card and a working-hours compromise may share a date/time group, provided their intervals do not overlap; they are the two explicitly requested categories.

With enough compromises, an initial fallback list therefore has **three to five cards**. A range of up to three dates can use all three groups per date; a longer range uses one compromise per eligible date. Generate more never introduces additional later-date choices.

The single outside-working-hours choice uses the earliest eligible date, then the closest collective working-time fit for required participants and the earliest equally suitable start. Retain explicit inconvenience priorities and accepted duration preference. The single later working-hours choice uses the earliest eligible date/start after existing suitability priorities; extra surrounding margin is not a tie-breaker.

The horizon remains the earliest required participant's next-workweek end, anchored to the selected end date's week, using saved workweeks/effective timezones. Sunday–Thursday includes Sunday. Optional workweeks do not shorten the deadline; the entire meeting must fit before it. Only the single featured clear later choice can appear beyond the selected dates; later conflicts never qualify.

## Scroll stability

Remove unconditional scrolling on every focus event. Keep native keyboard focus and deliberate validation/navigation scrolling, honoring preventScroll during focus restoration. Apply the sticky-header offset once: 130px page padding and a small control margin, instead of two 130px offsets. Timezone arrows scroll their list itself. Opening/selecting/dismissing it does not force the page to move. Retain the existing append-only Generate more behavior.

## Evidence

The 61 focused engine checks cover three groups, normal/one/two/combined fallbacks, initial versus appended choices, short/long ranges, Sunday and occupied-Sunday/Monday, optional/unknown sources, shortening, hard rules and non-overlapping batches. The browser journey reproduces the November pattern and ten-date append case with stable pointer/keyboard scrolling. Private exported calendar contents are not stored here. No real Calendar write or fresh live Google read is claimed.
