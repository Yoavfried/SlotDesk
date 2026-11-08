# Install and update SlotDesk

SlotDesk 1.0.0 is available on the [Chrome Web Store](https://chromewebstore.google.com/detail/slotdesk/ajilefcckipghmgcljllklamipjjecim), [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/slotdesk/kmackhppfgogbajpgpocmacbjhpleche) and [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/slotdesk/). Manual packages are available from [GitHub releases](https://github.com/Yoavfried/SlotDesk/releases). Google Calendar connection is available to Google accounts that grant the requested access, subject to account and organization policies. Browser-specific limits are listed in [browser compatibility](browser-compatibility.md).

## Chrome store installation

1. Open [SlotDesk on the Chrome Web Store](https://chromewebstore.google.com/detail/slotdesk/ajilefcckipghmgcljllklamipjjecim) in desktop Chrome.
2. Choose **Add to Chrome** and confirm the browser prompts.
3. Open SlotDesk from the Extensions menu, then choose **Connect Google** and grant the requested access.
4. Complete [first setup](#first-setup) below.

Chrome manages updates to the store installation. Developer mode and loading unpacked files are not required. The store version has a different installation identity from the manually loaded development version. Export a backup before switching, then import it into the store installation to transfer supported profiles and settings; credentials and pending calendar operations do not transfer.

## Edge store installation

1. Open [SlotDesk on Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/slotdesk/kmackhppfgogbajpgpocmacbjhpleche) in desktop Edge.
2. Choose **Get** and confirm the browser prompts.
3. Open SlotDesk from the Extensions menu, then choose **Connect Google** and grant the requested access.
4. Complete [first setup](#first-setup) below.

Edge manages updates to the store installation. If you already use an unpacked copy in Edge, export a backup and import it into the store copy to transfer supported profiles and settings. Credentials and pending calendar operations do not transfer.

## Firefox store installation

1. Open [SlotDesk on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/slotdesk/) in desktop Firefox.
2. Choose **Add to Firefox** and confirm the browser prompts.
3. Open SlotDesk from the Extensions menu or Firefox sidebar, then choose **Connect Google** and grant the requested access.
4. Complete [first setup](#first-setup) below.

Mozilla supplies the signed installation package, and Firefox manages its updates. Developer mode and temporary add-on loading are not required for the store version. Back up your settings before moving from a separate development installation; do not assume its data will transfer automatically.

## Manual Chromium installation

The Chromium ZIP is used for manual installation in Chrome, Edge and compatible desktop Chromium browsers. Chrome 116 is the manifest minimum; it is not a guarantee that every later browser/OS combination has been tested.

1. Download the Chromium ZIP and extract the entire archive into a permanent folder.
2. Open the browser's extension manager: `chrome://extensions` in Chrome, `edge://extensions` in Edge, or `vivaldi://extensions` in Vivaldi.
3. Enable **Developer mode**, choose **Load unpacked**, and select the extracted folder containing `manifest.json`.
4. Open SlotDesk from the browser's Extensions menu. Use **Settings → Open full workspace** for a larger tab. Browsers without a supported side panel use a full-tab workspace.
5. Choose **Connect Google**, select your Google account and grant the requested access. If Google blocks access, contact [support](mailto:support@buildwithspeedy.com); workplace policy may also restrict the extension or permissions. You do not need to create a Google Cloud project.

The ZIP contains `START-HERE.html`, Help, the privacy notice and bundled fonts/assets. When installing from source, select the repository's `extension/` folder instead of its root.

## First setup

1. Select the workspace calendars SlotDesk may use. At least one accessible calendar is required. Unselected calendars do not provide events or availability for scheduling, suggestions or alerts.
2. Confirm your profile's name, timezone and availability-calendar links. Your connected email identifies your own profile.
3. Add suggested profiles if useful, then complete setup and the registration choices shown for your browser.

A default invitation calendar can be selected later in Settings. Each new meeting requires a writable organizing calendar, which can be chosen in the meeting form. Read-only calendars can still be used for browsing and availability.

Setup restarts at calendar selection if SlotDesk closes before all steps are complete. Saved values remain available to prefill. Completed setup does not repeat on each start.

## Firefox development and Safari source packages

The Firefox XPI attached to GitHub releases or generated locally is an **unsigned development package**, separate from the signed Firefox Add-ons installation above. For temporary testing, extract it and open `about:debugging` → **This Firefox** → **Load Temporary Add-on**, then select its manifest. Temporary installations disappear after a restart. Use the Firefox package rather than the Chromium manifest.

The Safari ZIP contains **source preparation only**. It is not an installable Safari app. Apple packaging, authentication, signing and device validation are still required.

## Update an existing installation

For Chrome, Edge and Firefox store versions, use the browser's normal extension update controls. The remaining steps apply to manually installed Chromium packages.

Replace the files in the existing installed folder with the new package, then click **Reload** on its extension card. Close and reopen older SlotDesk windows. Keep the same folder and installation identity to retain local profiles and settings.

Do not uninstall as an update step: uninstalling can remove local data. Loading a second copy creates a separate installation. Consider downloading a backup before updating; see [backup and import/export](export-import.md).

Using the same Google account in another browser or computer does not synchronize settings. Transfer configuration with a backup or selected-profile file. Credentials and pending calendar operations are not transferred by those files.

## Connect, disconnect and get help

The question-mark icon opens Help before or after connection. The exit icon beside the connected email disconnects Google. Disconnect keeps saved settings; **Settings → Clear data** removes the local account workspace after any uncertain calendar operation is resolved. Neither action deletes Google appointments. Read the [privacy notice](../extension/privacy.html) for storage, registration and removal details.

The independent Google connection does not require signing into the browser itself. Its browser session ends when the browser closes, so reconnection may be needed. For support, use **Help → Connection details** and [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com). Connection details exclude account emails, tokens and calendar content.

## Build packages from source

Use Node.js 22, matching CI, and run from the repository root:

```sh
npm run package:slotdesk
```

Packages are written to `dist/` with the current manifest version. Packaging excludes source tests, developer tools and repository-only documentation. Service configuration is described in [backend setup](../backend/README.md).

Use `SlotDesk-VERSION.zip` for unpacked Chromium beta installations. Use `SlotDesk-VERSION-Chromium-store.zip` for Chrome Web Store or Microsoft Edge Add-ons uploads. The store package omits the development `key` field; each store assigns its own identity. Keep the unpacked package for existing manual installations so their identity and local settings remain accessible. Store-issued Google return addresses must be configured before distribution.
