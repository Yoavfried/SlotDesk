# Browser compatibility plan

Planning requested by the owner on 21 October 2026. **Proposed sequence and implementation choices for owner review; no compatibility implementation or new browser-support claim is made by this document.** Current released code is the Chrome-targeted 0.9.4.5 pilot, with the reported Vivaldi authentication failure and improved error reporting. Keep the approved Google beta audience, current calendar-write boundaries and separate advanced-profile review intact.

## Recommended direction

Start with desktop Chromium browsers, preparing the shared application for Firefox and Safari rather than maintaining separate scheduling products. Retain the current sidebar experience where a tested native panel is available. Make the full workspace tab a complete fallback and an optional user choice on every supported browser. Missing sidebar support must not prevent opening SlotDesk.

Use one scheduling/Calendar/profile core and a small browser-platform layer for authentication, opening the interface, runtime information and platform capabilities. Generate browser-specific manifests/packages from that shared source. Test each browser explicitly: being Chromium-based or exposing an API name is not sufficient evidence that the method works.

## Proposed target order

| Stage | Browser targets | Intended delivery and remaining work |
| --- | --- | --- |
| 1 | Desktop Chrome, Vivaldi and Edge | Chrome is the regression reference; Vivaldi reproduces the immediate problem; Edge has an officially documented getAuthToken incompatibility. Implement independent Google OAuth, guarded startup and the full-tab fallback. Test actual installed extensions before adding support labels. |
| 2 | Desktop Brave, then Opera/Opera GX | Use the same shared Chromium application and independent sign-in. Check identity-window behavior, privacy defaults, native panel differences, file/clipboard behavior, stable installation identity and update route. A full tab remains sufficient when a native panel is unavailable. |
| 3 | Firefox desktop | WebExtensions share much of the source. Add a Firefox manifest/identity, event-page background entry, browser API wrapper and optional native sidebar adapter. Validate Firefox OAuth redirect behavior and a signed private distribution route; this is a real port, not a Chromium ZIP renamed to XPI. |
| 4 | Safari on macOS | Share core/UI but adapt supported APIs, OAuth return flow, package/signing and Apple distribution. Apple's current App Store Connect packager can package web extensions without a Mac/Xcode, but real Safari/Apple-device testing and its applicable developer/distribution requirements remain. |
| Separate later decision | Mobile browsers, Firefox Android, Safari on iOS/iPadOS and additional desktop forks | Desktop extension support does not establish mobile support. Review UI, input, background lifecycle, authentication and installation per target. Do not promise a mobile Chromium extension based on desktop compatibility. |

Within Stage 1, Windows is the immediate reproduction environment. Validate macOS before claiming Windows/macOS support; assess Linux against the same contract when a test environment is available. Record actual tested browser/OS versions. A minimum manifest engine version is a technical load constraint, not a promise that every later browser/build is verified. Firefox ESR is a separately recorded target, not automatically covered by Firefox stable testing.

## Source-based dependency inventory

| Current dependency | Evidence in SlotDesk | Proposed compatibility treatment |
| --- | --- | --- |
| Chrome-managed Google tokens | `google-auth.js` calls `identity.getAuthToken`; `app.js` creates it from `chrome.identity`. The Vivaldi call exists but rejects before consent. | Implement [independent Google consent](google-connection.md) with the appropriate OAuth client, registered redirects and deliberate token/session handling. Test actual behavior, not only method presence. Keep the same approved test audience. |
| Unconditional Chrome side panel | `prototype/background.js` immediately calls `chrome.sidePanel.setPanelBehavior`, and repeats it on install. The first call can throw synchronously when sidePanel is absent, before its promise catch exists; the install callback also lacks rejection handling. | A capability-aware launcher opens a supported native panel or the full workspace tab. Handle missing APIs, synchronous exceptions and rejected promises. Do not add a closing toolbar popup as the main scheduling surface. |
| Browser-specific manifest/background | Current manifest has `side_panel`, `sidePanel`, Chrome `oauth2`, a pinned key and `background.service_worker`. | Shared manifest source with small Chromium/Firefox/Safari overlays. Preserve Chrome identity. Firefox currently requires a supported background scripts/event-page configuration. Exclude unsupported keys/permissions per target and validate final artifacts. |
| Runtime API shape and identifiers | `app.js` and owner setup use `chrome.runtime`; Firefox has browser-specific identity/redirect requirements. | Thin platform wrapper, consistent promise/error behavior and stable per-package identities. Do not scatter browser-name branches throughout product logic or assume a chrome namespace proves Chrome behavior. |
| Shared-window write/configuration locks | `navigator.locks` protects sends and local commits; the writer rejects an absent lock API. | Preserve cross-window mutual exclusion. If safe coordination is unavailable, explain the limitation and disable calendar mutations rather than removing the guard or adding an unsafe localStorage spinlock. Any alternative must prove equivalent protections. |
| Local account-specific workspace | `localStorage` plus storage events; saved drafts, configuration epochs and pending writes are local to the installed browser origin. | Keep current account separation and update/migration behavior. Same Gmail across browsers/computers does not synchronize profiles or drafts. Use the existing reviewed backup/import contract for configuration; do not transfer access tokens or unfinished calendar mutations. Cloud sync is a separate feature. |
| Clipboard and configuration files | Clipboard API already has manual copy text; files use file input/Blob/download links. | Preserve manual copy fallback, test permission-denied clipboard and file selection/download on real targets. Avoid requiring Chromium-only native file-picker APIs. |
| Forms, dialogs, dates and rendering | Native date/time inputs, dialog.showModal, Intl/timezone data, CSS, keyboard/focus and narrow sidebar layouts. | Check locale differences, 12-/24-hour and date preferences, DST instants, focus restoration, escaping, light/dark themes, zoom and narrow/full-tab layouts on each engine. A common Chromium screenshot is not Firefox/WebKit evidence. |
| Registration service origin | The leads endpoint currently accepts one exact `chrome-extension://` origin; Google scope/API calls also depend on extension host permissions/CSP. | Inventory actual package origins and update explicit approved service-origin handling for new targets. Do not use wildcard origins as a substitute for planning. Keep failed registration queued and non-blocking. Define auth service permissions separately; the leads table is not a token store. |
| Page-lifetime recovery | Readbacks/alerts operate while SlotDesk is open; state persists for reopening. | Preserve unresolved operations when tabs/panels close, browsers sleep/restart or background contexts stop. Do not introduce automatic mutation retries or promise closed-browser notifications. Recheck the same operation on return. |

The core scheduling engine, Calendar adapter, reviewed write modules, portable-file model and most UI use ordinary JavaScript/web APIs. This makes sharing practical; it does not prove complete compatibility without the targeted work above. The current extension has no content scripts or need to read arbitrary websites. Preserve that narrow access model.

## Independent sign-in contract

The user clicks Connect Google, chooses an account on Google's page, grants the existing necessary Calendar access and returns to SlotDesk with that account verified. Chrome-profile sign-in/Sync must not be a prerequisite for the new path. Define callback binding, state/PKCE where supported, cancellation, expiry/renewal, revocation/disconnection and wrong-account behavior before implementing. Register exact per-target return URLs derived from stable extension identities; provider acceptance of a Chromium redirect does not establish acceptance of Firefox/Safari's redirect.

A small hosted authorization-code callback/exchange service is the current recommended direction. Decide credential/session ownership and storage explicitly; keep client secrets out of extension packages and tokens out of logs, backup/profile files and the leads table. This introduces a new backend role, so accurately update privacy/hosting records when implemented. Google audience restrictions are enforced at project authorization; store listing is a separate distribution process. Calendar authorization in Testing remains subject to the documented test-user count, expiry and workplace restrictions.

## Proposed implementation batches

1. **Shared platform foundation.** Define the capability/error contract, stable package identities, browser-neutral runtime access, guarded native panel startup and a complete tab launch fallback. Preserve the existing Chrome default where supported. Add build/manifest validation and missing-method/rejected-method cases.
2. **Independent Google authentication.** Settle the small service/token design, configure the matching OAuth client(s), implement account choice/consent and recovery, and verify Chrome, Vivaldi and Edge end to end. Keep closed-beta emails and calendar-write protections. This is the largest immediate compatibility dependency.
3. **Remaining Chromium verification and installation polish.** Exercise Brave and Opera/Opera GX, then document support by observed version/OS. Provide a browser-appropriate installation/update route and clear unsupported-capability messages. Review store distribution once the intended Chromium targets pass.
4. **Firefox port.** Reuse shared core/UI/platform contracts, add the required manifest/background/sidebar/redirect and signed package differences, then run the same integrity and UX scenarios on actual Firefox. Store signing/distribution is separate from Google OAuth approval.
5. **Safari assessment/port.** Assess actual supported APIs and OAuth return behavior, choose the Apple package/distribution route, then test on real Safari. Do not promise conversion success from a packaging tool alone.

Do not postpone runtime compatibility design until after store submission: choose manifests, identities, permission needs, data handling and minimum capability behavior first. Public-store rollout can follow the compatible private beta. No public store submission, new service deployment or browser port is authorized by this planning request alone.

## Evidence required before claiming support

Use a shared automated suite for core logic and browser-platform failure cases, followed by actual packaged-extension checks on each declared browser/OS. Browser-engine automation is useful for UI regressions, but Playwright Chromium/Firefox/WebKit alone does not certify a branded extension install, Google OAuth flow, native panel or store package.

For every target cover: install/update without losing profiles; launch in its supported surfaces; allowed/blocked/canceled sign-in; partial permissions; account switching and reconnection; expired/revoked credentials; search freshness and actual timezone instants; profile/files/clipboard; two simultaneous windows; browser sleep/close/reopen; one explicit creation and individually reviewed edits/rescheduling; lost-confirmation readback; unchanged unrelated appointments and no delete/move operations. Use synthetic calendar transport for most cases and a controlled approved-account check for the platform/Google integration. These are engineering validation scenarios, not a new manual test assignment to the owner.

Report support as Verified, Experimental/limited, Planned or Unsupported with the actual test scope. Keep missing data visibly unknown and expose actionable safe errors. The broader [error-reporting review](error-reporting-review.md) and owner UX review remain open.

The inventory also found a separate invalid UTF-8 separator in the no-guest summary fallback in `meeting-text.js`. Track a text-encoding correction and package text-validation check for the next implementation batch; it is unrelated to the Vivaldi sign-in failure. No runtime correction is made in this planning-only change.

## Broader reach after extension compatibility

A hosted full workspace could eventually make SlotDesk usable without any extension, with the extension acting as an optional sidebar/shortcut. This is a separate product/hosting decision requiring web-origin authentication, local-data migration, lifecycle and privacy work; it is not already delivered by opening the extension's full workspace tab. Keep the shared core adaptable, but do not expand this plan into a website build or mobile release. Parent website work remains on hold.

## Documentation checked on 21 October 2026

- [Microsoft Edge supported APIs: getAuthToken unsupported; sidePanel available](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/api-support)
- [Vivaldi's native Side Panel extension support](https://vivaldi.com/blog/vivaldi-on-desktop-6-6/)
- [Opera extension architecture and platform-specific sidebar API](https://help.opera.com/en/extensions/architecture-overview/)
- [Mozilla: porting a Chrome extension](https://extensionworkshop.com/documentation/develop/porting-a-google-chrome-extension/)
- [Mozilla: background service-worker/event-page differences](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background)
- [Mozilla: identity and redirect requirements](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity)
- [Mozilla: native sidebar API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction)
- [Mozilla: add-on signing](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox)
- [Apple: Safari web extensions](https://developer.apple.com/safari/extensions/)
- [Apple: App Store Connect web-extension packaging](https://developer.apple.com/documentation/safariservices/packaging-and-distributing-safari-web-extensions-with-app-store-connect)

These sources establish platform capabilities and differences. They are not evidence that SlotDesk has passed those platforms' integration tests.
