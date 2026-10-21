# Browser and desktop compatibility

**0.9.4.6 · 21 October 2026.** The owner authorized implementation after approving the compatibility plan. Shared runtime adapters, independent Google consent, safe launch fallback and per-browser packaging are implemented. Hosting activation and some target validation remain. This matrix describes evidence, not blanket certification of every browser/version.

| Target | Delivered | Evidence and remaining boundary |
| --- | --- | --- |
| Chrome desktop | Existing pinned identity/client; Chromium package; independent sign-in when activated | Existing owner-reported Chrome pilot works. New flow passes installed Chromium reference tests. Actual Chrome 155 automation refused the unpacked extension despite a returned load ID; do not count that attempt as a pass. A regular-browser new-flow check remains. |
| Edge desktop on Windows | Same Chromium package; native side-panel adapter and full-tab workspace; independent sign-in | Actual Edge 155.0.4283.62 installed-extension native OAuth-window, Calendar browsing, two-tab connection reuse, 320/514/1280px reflow, disconnect/session cleanup and reconnect pass with synthetic provider/Calendar transport. Real Google consent awaits activation. |
| Vivaldi desktop on Windows | Same Chromium package; guarded panel/full-tab launch; independent sign-in | Actual Vivaldi 8.2.4133.84 installed extension successfully completes its native OAuth window without browser sign-in and loads calendars with the background token. Its CDP automation has limitations; broader multi-tab/responsive journey is not claimed complete. Real Google consent awaits activation. |
| Brave / Opera / Opera GX | Shared Chromium runtime and package prepared | Not installed here; target-native identity windows, privacy defaults, side-panel behavior, clipboard/download and update flow need verification. Full-tab fallback covers unavailable panel APIs, not every possible browser defect. |
| Firefox desktop | Separate unsigned XPI; stable add-on ID; background scripts/event page; native sidebar adapter; Firefox return-address support and data declarations | Source/unit/package checks only. Actual Firefox not installed. Mozilla signing is required for normal release-channel installation; temporary development loads are not a user update channel. Consent/registration policy and the Google bootstrap need real Firefox review. |
| Safari macOS | Separate preparation ZIP with incompatible Chrome manifest fields removed | Source only, not installable or functional sign-in. Safari lacks the WebExtensions identity flow used here: needs an Apple-specific authentication bridge, packaging/signing and actual Safari/device tests. |
| macOS / Linux | Shared portable web UI/core | No device validation in this Windows session. Browser/OS, date inputs, clipboard/files, locks, sleep/wake and update behavior remain to test before claiming support. |
| Mobile / hosted no-install workspace | Not delivered | Separate product, authentication, input/lifecycle and distribution work. A full extension tab is not a hosted web app. |

## Shared implementation

`browser-platform.js` selects the browser API namespace, reports capabilities, mediates background messages and installs the launcher. Missing, synchronously throwing or rejected sidebar methods fall back to a full extension tab. Firefox uses its native sidebar API when available. The full workspace remains available in Settings. Missing Web Locks fails closed with B103 for configuration/calendar changes; no unsafe spinlock or guard removal is used.

`web-auth.js` owns one background session and serializes token requests across SlotDesk windows. `backend/google-auth.mjs` implements state/PKCE, hosted callback/code exchange, bounded refresh and authenticated registration relay. See [Google connection](google-connection.md) and [one owner activation guide](browser-signin-setup.md). No broader Google scopes, content scripts, arbitrary-site access, remote application scripts, calendar delete or calendar move operation is added.

Browser memory-only `storage.session` needs the new `storage` permission. Profiles/settings/drafts remain local to that installed browser and Google account, without automatic cross-browser/device sync. Existing [configuration backups](export-import.md) exclude tokens and unfinished mutations. A browser restart clears the new Google session, so reconnect; it keeps local workspace configuration. Existing Chrome-managed identity is retained as a guarded legacy fallback while the service is inactive.

Help → Connection details reports safe capability/build/return-address information. It does not send a report or include the account email, tokens or appointments. The separate [system-wide error review](error-reporting-review.md) remains open.

## Build and install

`npm run package:slotdesk` deterministically builds three artifacts plus `SHA256SUMS.txt` and `package-targets.json`. All share one scheduling/calendar/profile/UI core. `scripts/browser-targets.mjs` defines their small manifest differences and stable identities. Tests/fixtures are excluded. Development folders are `dist/chromium`, `dist/firefox` and `dist/safari-source`.

- `SlotDesk-0.9.4.6.zip`: manually loaded Chromium desktop beta.
- `SlotDesk-0.9.4.6-Firefox-unsigned.xpi`: unsigned Firefox development port, not a normally installable signed release.
- `SlotDesk-0.9.4.6-Safari-source.zip`: source preparation only.

Chrome ID remains `blpliafbiiidhcffegochddjhagkhhip`. Firefox ID is `{39c56104-958b-43a6-bcfe-5e9db811c74b}`. Store signing can change target identities; register/retest exact generated return addresses before release. Keep the original installed Chromium folder/identity for in-place updates. See [installation](install.md) and [store readiness](extension-stores.md).

## Evidence and remaining work

See [validation](testing.md) and the [release scope](release-plan-0.9.4.6.md). Synthetic providers verify native browser plumbing without signing into Google or sending real invitations. They do not establish provider approval, store approval, workplace permission, actual mail delivery or owner UX readiness. Native panel capability detection/unit coverage is separate from a manual toolbar/sidebar lifecycle check.

The original malformed UTF-8 summary separator is corrected and extension text now receives strict UTF-8 validation. Reviewed create/reschedule/detail-update transports remain unchanged. Lost-confirmation recovery, account checks and shared-window locks remain required on all platforms.

Next: activate hosting; check real consent in the owner's normal browser; verify Brave/Opera and Firefox; finish per-store policy/assets/signing work; implement/test Safari's separate auth bridge. Mobile and the parent website remain outside this release. Advanced profile settings still require the owner's 0.9.5 review and directions.

Primary capability sources checked 21 October 2026: [Chrome identity](https://developer.chrome.com/docs/extensions/reference/api/identity), [Edge API support](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/api-support), [Vivaldi side panels](https://vivaldi.com/blog/vivaldi-on-desktop-6-6/), [Firefox background differences](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background), [Firefox identity](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity), [Firefox built-in consent](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/), [Safari identity support data](https://raw.githubusercontent.com/mdn/browser-compat-data/main/webextensions/api/identity.json), [Apple packaging](https://developer.apple.com/documentation/safariservices/packaging-and-distributing-safari-web-extensions-with-app-store-connect).
