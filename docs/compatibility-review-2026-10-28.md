# Desktop compatibility review

Reviewed 28 October 2026, using SlotDesk 0.9.5.9 at commit `7eb54e0`.

This review exercises installed extensions in isolated Windows browser profiles. Authentication uses each browser's native extension identity flow with a local synthetic authorization service. Calendar responses and accounts are synthetic. It does not establish that production Google authorization, signed store installation or macOS compatibility has passed.

| Browser | Version | Installation used | Result |
| --- | --- | --- | --- |
| Google Chrome | 155.0.8059.41 | Unpacked extension loaded through the browser's DevTools extension installer | 14 lifecycle checks passed. Four source-version update checks and three restart/data checks also passed. |
| Microsoft Edge | 156.0.4314.50 | Unpacked extension loaded through the browser's DevTools extension installer | 14 lifecycle checks passed. Four source-version update checks and three restart/data checks also passed. |
| Mozilla Firefox | 158.0.1 | Temporary add-on installed through WebDriver BiDi | 14 lifecycle checks and eight first-run onboarding checks passed. |

## Verified behavior

All three browsers loaded the extension page and exposed the required identity, messaging, session-storage and workspace-lock APIs. Native authorization completed against the synthetic service, followed by calendar reads. Cancelled authorization left the app disconnected with feedback, and an explicit retry connected successfully.

Two synthetic Google accounts retained separate workspaces. Connecting to the second account did not display the first account's saved profiles. Switching back restored the first account's workspace. Disconnecting cleared authorization session storage. No authorization-token or verifier keys appeared in workspace local storage.

Chrome and Edge saved a profile edit through the installed extension interface. A page reload preserved the workspace and the active connection. The prior 0.9.5.8 source at commit `7d70e3f` was installed in separate profiles, edited, then replaced with 0.9.5.9 and reloaded. Both accounts' saved workspaces remained available after that update.

A complete Chrome and Edge browser restart cleared session credentials. Reloading the same temporary extension ID preserved the saved workspaces, and reconnecting restored their interface. The DevTools installation used by this test did not itself remain installed after restart; these results therefore verify data retention after reloading the temporary installation, not normal store-install persistence.

Firefox first-run onboarding required calendar selection before profile setup. The connected account's email was read-only. Optional registration sharing started unchecked, email updates remained unselected, and onboarding completed with no queued registration record or registration transmission when sharing was declined.

Calendar fixtures contained nine baseline appointments. Across these checks, all nine remained unchanged. No calendar creation, modification or deletion request occurred.

## Firefox package validation

Validation of the unmodified 0.9.5.9 Firefox package reported **zero errors, zero notices and 79 warnings**:

| Warning | Count | Disposition |
| --- | --- | --- |
| `UNSAFE_VAR_ASSIGNMENT` | 78 | All 78 assignments were traced through context encoding, generated values and constrained links; no injection was established. See [source dispositions](firefox-validation-review.md). No warning was suppressed. |
| `KEY_FIREFOX_ANDROID_UNSUPPORTED_BY_MIN_VERSION` | 1 | The package targets desktop Firefox and omits `gecko_android`. Desktop data-consent support starts at Firefox 140, matching the declared minimum. Android data-consent support starts at 142; Android support is not claimed. |

Mozilla documents the separate desktop and Android version settings and states that omitting `gecko_android` makes an extension available only on desktop. Adding Android support solely to remove this warning would expand the supported platforms without validation. [Manifest platform settings](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings), [Firefox built-in data consent](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/).

## Remaining release checks

- **Production Google authorization:** complete an approved-account sign-in, Calendar permission consent, calendar read, disconnect and reconnect with the final production packages in Chrome, Edge and Firefox. Synthetic authorization does not verify Google's audience, OAuth client configuration or consent screen.
- **Persistent installation and updates:** verify normal store/signed installation, update from an earlier signed version, saved-data retention and browser restart. The automated Chrome/Edge DevTools installs and Firefox temporary add-on are development installations.
- **Firefox signed restart:** the temporary Firefox add-on is removed at browser exit; its test data did not survive temporary removal/reinstallation. A signed installation is required to assess normal installed-data retention across restart and update.
- **Native Firefox consent prompts:** temporary WebDriver installation bypasses the normal signed-add-on installation prompt. Review required data disclosures and optional consent in the signed installation flow. In-app opt-out onboarding was verified separately.
- **macOS:** current Chrome, Edge and Firefox packages still need native macOS installation, authorization, update and restart coverage. No macOS machine was available for this review.
- **Minimum browser versions:** this review covers the listed installed versions. It does not establish runtime coverage of the declared minimum versions.

The earlier browser-extension and application unit tests complement these checks; they do not replace the remaining production and signed-installation checks.
