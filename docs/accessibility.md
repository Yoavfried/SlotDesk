# Accessibility

SlotDesk includes keyboard navigation, visible focus indicators, named controls, searchable timezone choices and responsive layouts. Both light and dark themes are available in Settings.

## Keyboard use

| Task | Controls |
| --- | --- |
| Move between controls | Tab and Shift+Tab. The first **Skip to workspace** link bypasses the top bar. |
| Activate a focused button | Enter or Space. |
| Expand or collapse a settings section | Focus its heading and press Enter or Space. |
| Choose a profile suggestion | Type in the profile search, use Up/Down arrows, then Enter. Escape or Tab closes suggestions. |
| Choose a timezone | Open the timezone control, type a city/country/timezone, use Up/Down arrows and Enter. Escape closes the list. |
| Close a popup | Use its named close button or Escape where closing is allowed. Required onboarding and unsaved trip forms use their available completion or discard actions. |

Dialog headings identify the current task. Focus stays within modal dialogs and returns to the originating control when it remains available. Nested popups return to their parent. Required-field errors appear beside the relevant fields; hidden settings sections open when needed to expose an error.

Meeting invitations are sent through the explicit confirmation button. Pressing Enter in a meeting-review text field does not send the invitation.

## Display and status information

- Light/dark themes, visible input boundaries and focus outlines support different display preferences.
- Narrow layouts reflow, and long names can be truncated with the full value available through the relevant control or detail view.
- Controls expose names and selected/expanded/error states. Progress and errors use status or alert messages where appropriate.
- Calendar-status details can be opened with keyboard focus or activation as well as a pointer.
- Browser zoom and operating-system contrast settings can be used; their behavior can vary by browser.

## Known limits and reporting

SlotDesk does not currently claim WCAG conformance or complete screen-reader support. Native assistive-technology evaluation, including NVDA and VoiceOver, remains incomplete. Automated scans cannot assess every label, interaction, reading order or visual condition. Some recorded checks require manual review.

Report an accessibility issue to [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com) or use the repository's bug-report template. Include the SlotDesk version, browser/OS, assistive technology if relevant, the affected screen and steps to reproduce. Use synthetic or redacted information instead of private calendar details.

## Contributor checks and evidence

The accessibility suite covers keyboard access, focus containment/return, required errors, named controls, contrast checks, forced colors and layout at several widths. Historical reports include [0.9.3](accessibility-results.json), [0.9.3.5](accessibility-results-0.9.3.5.json) and the [0.9.4.5 follow-up](validation-0.9.4.5.json). Each report applies to its recorded source and environment; it is not a certification of the current release. Incomplete axe results remain recorded as incomplete.

For local checks, use the synthetic fixture and an isolated test browser profile:

```sh
node scripts/accessibility/fixture.cjs
npm install --prefix .a11y-tools --no-save --ignore-scripts --package-lock=false axe-core@4.14.0
```

The fixture serves the current extension at `http://127.0.0.1:8893/?case=ready` with synthetic accounts and events. Run the function in [journeys.js](../scripts/accessibility/journeys.js) through Playwright CLI's `run-code` command. Other focused journeys are in [scripts/accessibility/](../scripts/accessibility). The checker and fixtures are development tools excluded from extension packages; no real Google credentials are needed.

Use the W3C [dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) patterns, [focus visibility](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) and [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) when reviewing changes. Record manual findings separately from automated results.
