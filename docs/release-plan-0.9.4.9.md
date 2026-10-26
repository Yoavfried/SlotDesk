# 0.9.4.9 — profile meeting controls

Implement the owner’s 26 October calendar-list and meeting-treatment notes.

| Area | Behavior |
| --- | --- |
| Linked calendars | All assigned, selected workspace calendars start checked when entering a profile’s Manage meetings. Adding/removing mappings updates the available/selected list and loads new sources when the section is open. |
| Filters | A deliberate selection is preserved while refreshing or changing dates. Reopening Manage meetings starts with all assigned calendars; choosing calendars filters cached meetings. |
| Calendar rows | Shared checkbox/name layout remains horizontal. Long names use ellipses; hover reveals complete text. Apply to profile management, Existing meetings and workspace calendar selection. Native calendar choices/timezone triggers also expose full selected labels. |
| Treatment | One single-choice dropdown replaces the four mutually exclusive buttons. Choices remain Default, Ignore, Protect and Assign leave. An inherited Default displays its effective automatic classification, such as Default — leave. |
| Live updates | Keyword detection and calendar all-day leave rules update the displayed automatic state after local save. Choosing Default returns to automatic behavior; an explicit manual treatment takes precedence. Automatic display never saves an override. |
| Recurrence/compatibility | Retain This occurrence as the default and existing last-action-wins series semantics. Legacy flexible/movable rules stay visible and can be replaced through normal choices. |

Automatic state uses the same Google normalization and event classifier as scheduling, including free/declined entries and all-day notes. Scheduling precedence, Calendar writes, auth/hosting, leads and flight logic are unchanged. Icons remain proposals awaiting owner selection. Wider UX/flight review remains with the owner.

Validation: 2,299 app checks, 73 backend checks, 22 calendar-comparison checks and 82 browser assertions, including live mapping/detection changes and 280–1280px row checks. Five axe scans report no automated violations; manual/incomplete review remains. Nine original synthetic appointments remain unchanged with no Calendar writes. [Evidence](validation-0.9.4.9.json).
