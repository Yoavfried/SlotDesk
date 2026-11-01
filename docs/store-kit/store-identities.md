# Store identities

Publication status checked 1 November 2026. Firefox is public; Chrome and Edge publication has not yet been confirmed. The Edge identifiers below were recorded from its submission on 28 October 2026.

## Firefox Add-ons

| Field | Value |
| --- | --- |
| Public listing | [SlotDesk on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/slotdesk/) |
| Listing slug | `slotdesk` |
| Add-on ID | `3110869` |
| Extension GUID | `{39c56104-958b-43a6-bcfe-5e9db811c74b}` |
| Published version | `1.0.0` |
| Publication checked | 1 November 2026 |

The [public Mozilla API](https://addons.mozilla.org/api/v5/addons/addon/slotdesk/) reports public add-on and version-file status, with the add-on enabled. Mozilla provides the signed package through the listing. This confirms Firefox publication only; it does not establish publication in another store or complete the three-store launch.

## Microsoft Edge Add-ons

| Field | Value |
| --- | --- |
| Store ID | `0RDCKCL4LM2V` |
| CRX ID | `kmackhppfgogbajpgpocmacbjhpleche` |
| Product ID | `927da0c6-6bc0-409c-8405-de8fb781ef97` |
| Public-key SHA-256 | `ac02a7ff56e6109f6fe2c02197fb4274de157cb8718ebe82d1c4564f56d97634` |

The supplied public key decodes correctly and its SHA-256-derived extension ID matches the CRX ID. The key is public signing identity material, not an authentication secret. The unpacked beta keeps its existing development key and identity.

SlotDesk calls `identity.getRedirectURL('google')`. The expected Edge return is:

```text
https://kmackhppfgogbajpgpocmacbjhpleche.chromiumapp.org/google
```

Before distributing the Edge package, confirm that return through the installed store identity and append it to the deployed `SLOTDESK_AUTH_RETURN_URLS`, preserving existing authorized returns. This configuration change has not been deployed. The Google web client's callback remains the hosted `/api/google?op=callback` endpoint; the extension return is the broker's final destination, not a replacement Google callback. [Identity return format](https://developer.chrome.com/docs/extensions/reference/api/identity#method-getRedirectURL).

The broker derives allowed Chromium origins from its return list. Keep `SLOTDESK_ORIGIN` unchanged: the existing Chrome beta's direct registration path and the broker's registration relay use it. Store ID and Product ID are listing metadata and must not be used as the extension OAuth identity.

## Chrome store identity

Chrome's store-issued item ID has not yet been recorded. Do not substitute the unpacked Chromium beta ID for a store-issued identity. See [owner publication steps](owner-steps.md).

## Store email-updates scope

The next generated `chromium-store` and `firefox` packages limit the separate optional email-updates choice to SlotDesk. Both registration labels read: “You may email me occasional updates about SlotDesk. I can opt out at any time.” Their bundled privacy notice uses “optional SlotDesk-updates box” and states: “If you opted in, the owners may use your address for occasional updates about SlotDesk; you can opt out at any time by emailing” the support address. Registration collection, product analysis and the private leads table remain unchanged. The ordinary unpacked `chromium` beta and `safari-source` retain the existing broader project-updates wording.

This is a packaging transform for the next final store build. Existing version 0.9.5.9 outputs and uploaded drafts have not been rebuilt or replaced. Replace the affected draft uploads after preparing and checking the next final store packages, and publish the corresponding generated store privacy notice at the store listing's privacy-policy URL.
