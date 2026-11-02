# Configure browser-independent Google sign-in

SlotDesk connects Google accounts through its hosted authorization service. This guide is for service maintainers; people installing SlotDesk do not need to configure a Google Cloud project.

## Google OAuth client

The Google Web application client uses this authorized redirect URI:

```text
https://slotdesk-leads.vercel.app/api/google?op=callback
```

The callback exchanges the authorization code on the server. Client secrets must remain in hosting settings, never in the extension or repository. The existing Chrome Extension OAuth client is separate from this cross-browser connection. Keep the production audience External / In production and request only the approved Calendar scopes.

## Production environment

Configure these variables in the **slotdesk-leads** Vercel project, scoped to **Production**. Preserve the existing database configuration and registration origin.

| Name | Value |
| --- | --- |
| `GOOGLE_WEB_CLIENT_ID` | Google Web application client ID |
| `GOOGLE_WEB_CLIENT_SECRET` | Its client secret |
| `SLOTDESK_AUTH_SECRET` | 64 hexadecimal characters generated from 32 cryptographically random bytes |
| `SLOTDESK_AUTH_RETURN_URLS` | JSON array of exact authorized extension returns |

The deployed return list includes the unpacked Chromium installation, Firefox and the published Chrome installation:

```json
["https://blpliafbiiidhcffegochddjhagkhhip.chromiumapp.org/google","https://37d48a39143e7524b1b43d70397319c090cb855d.extensions.allizom.org/google","https://ajilefcckipghmgcljllklamipjjecim.chromiumapp.org/google"]
```

The Chrome store return was added and the service redeployed on 2 November 2026. Edge's store return remains pending; see [store identities](store-kit/store-identities.md).

Store credentials and the encryption secret as Secret variables. Changing the encryption secret invalidates existing broker sessions and requires users to reconnect. Adding a return does not require rotating that secret or changing Google's callback.

The broker derives allowed Chromium origins from the exact return list. Firefox installation origins contain a varying UUID; its stable HTTPS return, encrypted origin-bound sessions and PKCE proof constrain authorization. Never replace exact returns with a wildcard. Preserve existing entries when adding a new store identity.

## Deploy and verify

Environment changes take effect in a new deployment. Redeploy the current production service, then run:

```sh
npm run check:auth-service
```

This checks service readiness, preflight access and authorization startup for the published Chrome, unpacked Chromium and Firefox identities. It also checks that unrelated origins remain rejected. It does not open Google, exchange credentials, register users or change calendars.

The [status endpoint](https://slotdesk-leads.vercel.app/api/google?op=status) returning `ready:true` only confirms general configuration. It does not prove that a particular store identity is admitted. Every distributed identity must pass its own origin and return checks, followed by a real installed-browser connection and calendar-list check. Help → Connection details provides diagnostics without tokens or calendar contents.
