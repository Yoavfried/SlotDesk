# Google connection

Implemented for **0.9.4.6**, with owner activation still required. The original Vivaldi failure was `The user turned off browser signin`: the old Chrome-managed token service rejected before Google opened. Signing into Gmail did not enable that browser service. The new path uses an independent account/consent window and does not require browser sign-in or Sync.

## Implemented flow

1. Connect Google asks the hosted service whether the new connection is configured.
2. The background generates a random PKCE verifier/challenge. An encrypted, ten-minute transaction binds the extension origin, exact registered return address and challenge.
3. `identity.launchWebAuthFlow` opens a hosted bootstrap, then Google's account/consent page. The bootstrap includes the extension return address for Firefox's initial redirect check. Google's actual registered callback is the hosted HTTPS address.
4. The callback validates the transaction and redirects only to its exact allowlisted extension return. That URL contains the authorization code and state, never an access/refresh token.
5. The extension verifies the return/state. The server exchanges the one-use Google code with the verifier and server-only Web application client secret. Calendar access remains the same three scopes.
6. Access tokens plus an encrypted refresh-session envelope and its verifier stay in background memory / `storage.session`, not settings, localStorage, backup files or Neon. Background restarts can reuse session storage; closing the browser clears it. Reconnect on a later browser session. A Google Testing grant is capped at seven days; the service also caps its envelope at seven days.
7. Disconnect clears the local session. It does not revoke Google's existing consent grant. Calendar account reads still determine the account-specific workspace and every write rechecks account/permissions.

The service handles authorization and registration relay only. Calendar event reads/writes continue directly between the extension and Google. It does not store credentials in the leads table or log credential payloads. The pre-existing direct registration route is retained for the native Chrome pilot. Browser origins are transport isolation, not identity proof: sensitive broker operations also require the encrypted origin-bound ticket/session and PKCE verifier. Firefox installation origins vary, so its transport permits a Firefox extension origin while restricting returns to the stable approved add-on identity.

If the hosted path is not configured, Chrome may retain its existing managed-token connection. Browsers that expose that method but cannot use it receive the owner-setup message G110. A blocked/refused ready broker does not silently switch to another account flow. No new public audience or Google scope is introduced.

## Activation and approval

All remaining owner steps are together in [Browser sign-in activation](browser-signin-setup.md). No private client secret belongs in a chat, repository or extension ZIP. The current deployment is guarded until hosting has the four required values. A real Google account/consent check remains unperformed for the new path; synthetic native-window checks do not establish Google approval.

Keep the existing Google project External / Testing and its listed test users. Current Google documentation allows up to 100 test users and gives Calendar test authorizations/refresh tokens a seven-day lifetime. Workplace administrators can separately block consent. A store listing is not required to test an unpacked extension; store review and Google OAuth production verification are separate later steps.

Sources checked 21 October 2026: [Chrome identity](https://developer.chrome.com/docs/extensions/reference/api/identity), [Google authorization code flow](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Testing audience](https://support.google.com/cloud/answer/15549945?hl=en), [Firefox identity implementation](https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/components/extensions/child/ext-identity.js), [Chrome session storage](https://developer.chrome.com/docs/extensions/reference/api/storage), [Firefox session storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/session).
