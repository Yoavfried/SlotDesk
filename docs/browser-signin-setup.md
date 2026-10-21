# Activate browser-independent Google sign-in

Owner configuration for **0.9.4.6**. Testers do not perform these steps. The code is deployed in Vercel deployment `dpl_32tLxkfrtKXPmetpJiuMCRvqeHzQ`; its status is READY and public auth readiness is false until these settings are entered. The release preserves the existing Chrome pilot while this service is inactive. No Chrome Web Store listing is needed for this closed-beta setup.

## 1. Add one Google Web application client

Open the existing SlotDesk project in Google Cloud → Google Auth Platform → Clients → Create client. Choose **Web application**. Add exactly this Authorized redirect URI:

```text
https://slotdesk-leads.vercel.app/api/google?op=callback
```

No Authorized JavaScript origin is needed for this server exchange. Keep the existing Chrome Extension client, existing Calendar scopes, External / Testing audience and approved test emails. Copy the new public Client ID and Client secret for entering directly into Vercel. Do not send the secret to anyone or add it to the extension.

## 2. Enter four Vercel environment variables

Open the existing **slotdesk-leads** project → Settings → Environment variables. Add these to **Production**. Preserve existing `DATABASE_URL` and `SLOTDESK_ORIGIN`.

| Name | Value |
| --- | --- |
| `GOOGLE_WEB_CLIENT_ID` | The new Web application Client ID |
| `GOOGLE_WEB_CLIENT_SECRET` | Its client secret, entered directly here |
| `SLOTDESK_AUTH_SECRET` | 64 hexadecimal characters generated from 32 random bytes |
| `SLOTDESK_AUTH_RETURN_URLS` | The complete JSON array below |

Generate the random secret locally with Node and copy it directly into Vercel:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

```json
["https://blpliafbiiidhcffegochddjhagkhhip.chromiumapp.org/google","https://37d48a39143e7524b1b43d70397319c090cb855d.extensions.allizom.org/google"]
```

Set secret values as Sensitive where the hosting UI supports it. Changing the encryption secret invalidates current broker sessions; users can reconnect. The app origin allowlist derives from these exact returns. A later store-generated ID may differ: add its exact return, rebuild/review the package and retest before distributing. Never replace this list with a wildcard.

## 3. Redeploy and check

Environment changes apply to a new deployment. Redeploy the latest **slotdesk-leads** deployment from its dashboard. Open [connection service status](https://slotdesk-leads.vercel.app/api/google?op=status). It must return `"ready":true` and `"version":"0.9.4.6"`. A false status reveals no secrets and means configuration is incomplete.

Load/reload the 0.9.4.6 Chromium package in your regular Vivaldi, Edge or Chrome browser. Connect Google should open Google's own account choice and permission window. Choose an already approved test email. Check that your calendar list loads; signing in does not create an invitation. If it fails, Help → Connection details provides a safe report without tokens or account/calendar contents.

The agent's hosting connection could read this Vercel project but could not manage its environment variables; its CLI account also lacked access. Therefore private values and Google Cloud setup are left for the owner together here. No additional database/table configuration is needed. Firefox still needs real-browser validation and signing; Safari authentication is not implemented by these settings.
