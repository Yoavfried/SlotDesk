# Store identities

Version 1.0.0 is public on Chrome, Edge and Firefox. The dates below record when each listing was checked.

## Firefox Add-ons

| Field | Value |
| --- | --- |
| Public listing | [SlotDesk on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/slotdesk/) |
| Listing slug | `slotdesk` |
| Add-on ID | `3110869` |
| Extension GUID | `{39c56104-958b-43a6-bcfe-5e9db811c74b}` |
| Published version | `1.0.0` |
| Publication checked | 1 November 2026 |

The [public Mozilla API](https://addons.mozilla.org/api/v5/addons/addon/slotdesk/) reports public add-on and version-file status, with the add-on enabled. Mozilla provides the signed package through the listing.

## Microsoft Edge Add-ons

| Field | Value |
| --- | --- |
| Public listing | [SlotDesk on Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/slotdesk/kmackhppfgogbajpgpocmacbjhpleche) |
| Published version | `1.0.0` |
| Publication checked | 8 November 2026 |
| Store ID | `0RDCKCL4LM2V` |
| CRX ID | `kmackhppfgogbajpgpocmacbjhpleche` |
| Product ID | `927da0c6-6bc0-409c-8405-de8fb781ef97` |
| Public-key SHA-256 | `ac02a7ff56e6109f6fe2c02197fb4274de157cb8718ebe82d1c4564f56d97634` |

The listing and published version were confirmed without signing in. The public signing key recorded at submission on 28 October 2026 decodes correctly and its SHA-256-derived extension ID matches the CRX ID. The unpacked beta keeps its existing development key and identity.

SlotDesk calls `identity.getRedirectURL('google')`. The expected Edge return is:

```text
https://kmackhppfgogbajpgpocmacbjhpleche.chromiumapp.org/google
```

This exact return was added to the production `SLOTDESK_AUTH_RETURN_URLS` on 3 November 2026, preserving the existing Chrome, unpacked Chromium and Firefox returns. Live preflight and authorization-startup checks admit all four identities and reject unrelated origins. A real Google connection and calendar-list check in the Edge store build remain unverified in this record. The Google web client's callback remains the hosted `/api/google?op=callback` endpoint; the extension return is the broker's final destination, not a replacement Google callback. [Identity return format](https://developer.chrome.com/docs/extensions/reference/api/identity#method-getRedirectURL).

The broker derives allowed Chromium origins from its return list. Keep `SLOTDESK_ORIGIN` unchanged: the existing Chrome beta's direct registration path and the broker's registration relay use it. Store ID and Product ID are listing metadata and must not be used as the extension OAuth identity.

## Chrome store identity

| Field | Value |
| --- | --- |
| Public listing | [SlotDesk on the Chrome Web Store](https://chromewebstore.google.com/detail/slotdesk/ajilefcckipghmgcljllklamipjjecim) |
| Store-issued extension ID | `ajilefcckipghmgcljllklamipjjecim` |
| Published version | `1.0.0` |
| Publication checked | 1 November 2026 |

The public listing and version were confirmed while signed out. The store-issued ID differs from the unpacked Chromium beta ID; treat them as separate installations when configuring authorization or transferring saved settings. See [installation](../install.md) and [owner publication steps](owner-steps.md).

Its exact authorization return is `https://ajilefcckipghmgcljllklamipjjecim.chromiumapp.org/google`. This return was added to the production service on 2 November 2026, preserving the existing unpacked Chromium and Firefox returns. Live checks confirmed preflight access and authorization startup for all three identities, with unrelated origins rejected. Use `npm run check:auth-service` after configuration changes; a general `ready:true` status does not verify access for a store identity.

## Store email-updates scope

The `chromium-store` and `firefox` packages limit the separate optional email-updates choice to SlotDesk. Both registration labels read: “You may email me occasional updates about SlotDesk. I can opt out at any time.” Their bundled privacy notice uses “optional SlotDesk-updates box” and states: “If you opted in, the owners may use your address for occasional updates about SlotDesk; you can opt out at any time by emailing” the support address. Registration collection, product analysis and the private leads table remain unchanged. The ordinary unpacked `chromium` beta and `safari-source` retain the existing broader project-updates wording.

This packaging transform was introduced for the 1.0.0 store build. Keep the generated notice aligned with the privacy-policy URL for future store updates.
