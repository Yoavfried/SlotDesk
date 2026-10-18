# Accessibility engineering

Started 18 October 2026 against 0.9.2. This work records technical findings and checks. The owner-led overall UX, buttons, layouts at different screen widths and wording review remains open; only the owner decides its readiness.

## Scope

- Keyboard access to profiles, participant search, calendars, flights/travel, meeting details/editing/rescheduling and local files.
- Named dialogs/controls and contextual repeated actions; selected/expanded/error/busy states.
- Initial focus, containment, parent/child return and recovery when a focused control is replaced.
- Text contrast, visible focus, forced colors and layout/reflow checks.
- Required/custom validation with visible, associated messages and access to hidden advanced fields.

Use the [W3C dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [focus visibility guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) and [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) as references. Automated scans use the local development-only [axe-core](https://github.com/dequelabs/axe-core) checker. It is not packaged in the extension and sends no calendar data.

## Findings addressed in this pass

Secondary text had insufficient contrast in both supplied themes. Light muted text is now #625e56; dark muted text is #a39e95. Keep the original lime header, wordmark, fonts and palette structure. Input boundaries, focus outlines and native color-scheme behavior are clearer. Increased target spacing and a skip link improve keyboard/pointer access.

Profile suggestions now expose listbox options and an active choice while retaining typing focus. Arrow keys/Enter/Escape/Tab do not send invitations. Timezone controls retain text-editing keys, expose contextual flight/return-flight labels and required/error information, and leave the parent form open when closing their popup.

Dialogs expose their headings and receive a safe context focus on opening or after their focused content is replaced. Return to a surviving control or its replacement after a child closes. Track actual open order for nested dialogs rather than DOM order. Flight Save/Discard remains its only normal exit; no resumable flight form is added.

Native required errors are rendered beside fields and linked programmatically. Hidden advanced sections open for profile errors. Repeated live-save messages are not reassigned when unchanged, and busy/error status is communicated separately.

## Evidence and limits

Verified for 0.9.3 using axe-core 4.14.0 and Chromium with synthetic calendars: 20 screen states had no automated violations, and 36 keyboard/focus/reflow assertions passed. Covered light/dark Settings, calendar selection, profile lists/advanced forms, return flights, profile export, participant choices, new meeting/review, existing meeting list/details/editing, alerts and rescheduling. Keyboard checks include contextual focus, active suggestions, required errors, flight containment, nested profile/reschedule return, deliberate send, forced colors and 320/390/1280px layouts. A 2x CSS zoom check at a 640px viewport passed; it is not a substitute for every browser zoom/text setting. Original synthetic appointments were unchanged and no event writes were sent.

Some axe checks return Incomplete rather than Pass/Fail, including hidden-control relationships, label/content matching and color overlap cases. These are recorded in the [structured report](accessibility-results.json); they are not relabelled as passes.

This is not a claim of WCAG conformance or complete screen-reader support. Actual assistive-technology testing (including NVDA/VoiceOver), user evaluation and further review of future screens remain separate. Owner UX acceptance stays open regardless of technical results.

## Repeating the local browser check

The fixture is scripts/accessibility/fixture.cjs; it uses only synthetic accounts/events and serves the actual extension source on localhost:8893. It does not use real Google credentials. Start it from the repository root with node scripts/accessibility/fixture.cjs. Install the development-only checker with npm install --prefix .a11y-tools --no-save --ignore-scripts --package-lock=false axe-core@4.14.0.

Open http://127.0.0.1:8893/?case=ready with Playwright CLI. Run the function in scripts/accessibility/journeys.js using the CLI run-code command from the repository root. It returns a structured report and fails on violations or failed journey assertions. Run in a separate test browser profile. The checker, fixture, journeys and report are excluded from extension packages.
