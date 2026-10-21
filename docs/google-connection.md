# Google connection: closed-beta direction

Recorded 21 October 2026. The owner asked whether SlotDesk can show Google's normal account/permission flow independently of Chrome's browser profile and whether that requires a Chrome Web Store release. This document answers feasibility and records a proposed direction; the new authentication flow and Cloud changes are not implemented or deployed.

## Current implementation and observed failure

The extension uses `chrome.identity.getAuthToken`, its pinned extension identity and a Chrome Extension OAuth client. Chrome obtains/caches tokens through its account integration. Chrome can use its signed-in profile account or the first Google web account; enabling Chrome Sync is not a prerequisite. The dependency is availability of the browser-managed Google identity service. The owner's Vivaldi call immediately rejected with `The user turned off browser signin`, before an account/consent window opened. This identifies the current failing stage; it does not prove a Google test-user rejection or require a new PC-specific audience entry.

The [error-reporting hotfix](error-reporting-review.md) explains this case. Browser-independent sign-in still needs implementation and a real Vivaldi validation; installing the extension in a Chromium browser alone does not establish complete compatibility.

## Desired experience

1. Click Connect Google in SlotDesk.
2. A Google-hosted window lets the user choose or sign in to their Google account, independently of the browser's profile account.
3. Google checks the beta audience and asks for the Calendar permissions. Keep the project in External/Testing and retain its explicitly approved test emails.
4. Return to SlotDesk with the selected account verified against its Calendar account. Account switching must retain the existing separation of local workspaces and unfinished writes.
5. Handle cancellation, partial consent, expiry, reconnection and disconnection clearly. No meeting is created or changed by signing in.

## Technical direction to implement next

Use an extension-managed OAuth window such as `launchWebAuthFlow` with correctly registered Google authorization/redirect configuration. A recommended design is Google's authorization-code flow with a small hosted callback/exchange component and deliberate token/session handling; keep client secrets out of the extension. Final redirect binding, one-time state/PKCE as supported, token ownership/storage/renewal/revocation, account binding and failure behavior must be specified before implementation. The existing leads database is not a proposed token store. Do not assume the current Chrome Extension client can simply be reused for an arbitrary web redirect; create the matching client configuration in the existing project as needed.

The user's requested outcome is ordinary Google account choice and Calendar consent. It does not require signing into Chrome or enabling browser Sync. Keeping the existing Google project lets its project-level test-user audience continue applying to the new client. Retain current Calendar scope needs unless a separately justified change is reviewed.

## Store publication and Google approval

Chrome Web Store publication is not a prerequisite for implementing/testing this OAuth flow with a manually loaded beta extension. Distribution/store review and Google OAuth verification are separate processes. Testing does not remove Google's applicable OAuth/security requirements or workplace restrictions.

Google's current Testing mode allows up to 100 listed test users. Calendar scopes do not qualify for the basic-profile-only exception: test authorizations expire after seven days, including refresh tokens when issued. Make reconnection understandable during the beta. Public production access and store distribution need their own later preparation; neither is authorized by this discussion.

Checked against primary documentation on 21 October 2026:

- [Chrome identity: account choice, getAuthToken and launchWebAuthFlow](https://developer.chrome.com/docs/extensions/reference/api/identity)
- [Google project audience, Testing users and seven-day expiry](https://support.google.com/cloud/answer/15549945?hl=en)
- [Google web-server authorization code flow and client-secret handling](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google OAuth policy and secure redirects](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance)
