# Relative-date search regression — 0.9.5.4

Reported on 28 October 2026: a 45-minute search with a participant in Accra and This week stayed on “Settings updated / Find a time with your updated participants and settings.”

## Reproduction and cause

The browser reproduction reused a workspace whose persisted dates were 20 October while its saved preset was This week. Rendering recomputed the visible current-week dates and mutated the in-memory state before the save baselines were recorded. The next three-way save compared that derived baseline with the older persisted dates and interpreted the difference as a remote edit. `applySharedView` invalidated the results, then rendering silently recomputed the dates again. Calendar-read alert saves could repeat the cycle after results had been rendered.

The new browser regression failed on the old source with this exact lost-results condition before the implementation changed. Previous fresh-onboarding checks used dates computed and saved in the same session, so they did not cover reopening a preset with older persisted dates.

## Fix

- Render relative date presets without mutating saved workspace state or its synchronization baseline. Only an explicit date choice or reading the submitted search persists the range.
- Resolve This week / Next week again on submission so an open workspace handles a new day correctly.
- Preserve explicit custom dates on reopening instead of silently replacing expired dates with another range. Exclude a time starts on the displayed search date.
- Replace the generic Settings updated placeholder with Meeting options / Select Find a time to see suggestions.
- Retain invalidation for actual search changes from another window. Ranking, conflict permissions and provider writes are unchanged.

## Validation

[relative-search.js](../scripts/accessibility/relative-search.js) checks older saved This week and Next week presets, Ghana as a participant and search timezone, 45-minute searches, results surviving background saves, a day change while open, explicit custom dates, exclusion defaults and a genuine remote edit. It runs against synthetic Google services in installed Chrome and Edge on Windows. The preceding profile lifecycle and calendar/guest hotfix regressions also run again.

All nine baseline synthetic appointments remain unchanged with zero Calendar writes. Native macOS and the user's live Google Calendar are not accessed by these checks. See [validation](validation-0.9.5.4.json). The separate 1.0.0 readiness review remains open.
