# Install and update SlotDesk

SlotDesk is currently a closed beta for approved Google test accounts. Store installation is not yet available. Download packages from [GitHub releases](https://github.com/Yoavfried/SlotDesk/releases). Browser-specific limits are listed in [browser compatibility](browser-compatibility.md).

## Chromium browsers

The Chromium ZIP is used for manual installation in Chrome, Edge and compatible desktop Chromium browsers. Chrome 116 is the manifest minimum; it is not a guarantee that every later browser/OS combination has been tested.

1. Download the Chromium ZIP and extract the entire archive into a permanent folder.
2. Open the browser's extension manager: `chrome://extensions` in Chrome, `edge://extensions` in Edge, or `vivaldi://extensions` in Vivaldi.
3. Enable **Developer mode**, choose **Load unpacked**, and select the extracted folder containing `manifest.json`.
4. Open SlotDesk from the browser's Extensions menu. Use **Settings → Open full workspace** for a larger tab. Browsers without a supported side panel use a full-tab workspace.
5. Choose **Connect Google**, select an approved account and grant the requested access. If Google blocks access, contact [support](mailto:support@buildwithspeedy.com); workplace policy may also restrict the extension or permissions. Beta users do not need to create a Google Cloud project.

The ZIP contains `START-HERE.html`, Help, the privacy notice and bundled fonts/assets. When installing from source, select the repository's `extension/` folder instead of its root.

## First setup

1. Select the workspace calendars SlotDesk may use. At least one accessible calendar is required. Unselected calendars do not provide events or availability for scheduling, suggestions or alerts.
2. Confirm your profile's name, timezone and availability-calendar links. Your connected email identifies your own profile.
3. Add suggested profiles if useful, then complete setup and the registration choices shown for your browser.

A default invitation calendar can be selected later in Settings. Each new meeting requires a writable organizing calendar, which can be chosen in the meeting form. Read-only calendars can still be used for browsing and availability.

Setup restarts at calendar selection if SlotDesk closes before all steps are complete. Saved values remain available to prefill. Completed setup does not repeat on each start.

## Firefox and Safari artifacts

The Firefox XPI is an **unsigned development package**. For temporary testing, extract it and open `about:debugging` → **This Firefox** → **Load Temporary Add-on**, then select its manifest. Temporary installations disappear after a restart; normal release-channel installation requires Mozilla signing. Use the Firefox package rather than the Chromium manifest.

The Safari ZIP contains **source preparation only**. It is not an installable Safari app. Apple packaging, authentication, signing and device validation are still required.

## Update an existing installation

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
