# Install the SlotDesk pilot

Current release: **0.7.1**. Chrome 116 or later. The configured build uses an existing owner-managed Google OAuth client; approved testers do not need to create a Google Cloud project.

## Prepare the package

From the repository root, using Node.js 18+:

```sh
npm run package:slotdesk
```

Give the tester `dist/SlotDesk-0.7.1.zip`. It includes the extension, local fonts, handoff guide, general Help and the privacy notice. Source tests and repository documentation are excluded. Do not include credentials or calendar exports.

## Tester setup

1. Extract the entire ZIP into a permanent folder and open `START-HERE.html`.
2. In Chrome, open `chrome://extensions`, enable Developer mode, click Load unpacked, and select the extracted folder containing `manifest.json`.
3. Open SlotDesk from the Extensions menu. For a larger tab, open Settings from the gear icon, then Open full workspace.
4. Use Connect Google with the intended Chrome profile and grant the requested Calendar permissions. If blocked, ask the owner to check the approved test-user audience and scopes; organization policy may also apply.
5. Save your own email, name and confirmed timezone. Choose a writable default invitation calendar. Optionally set up suggested familiar faces, then Continue to workspace.
6. Choose New meeting from the workspace menu. Search saved profiles by name or email, add the people attending, confirm their timezones, search, and review a proposal. Use Copy meeting details for manual creation or Create & send invitations for a real new event.

Use Existing meetings to choose any accessible calendar and a timeframe, then View details for guest responses and calendar/video links. Manage profiles has searchable saved people, Add profile and familiar-face suggestions. Existing installations retain profiles and open directly at the menu.

Sending from a connected workspace creates a real event and sends invitations. Use a test calendar and consenting participants for acceptance. For a work account, the organization must allow the extension and requested Google access; see [work-account use](security.md#work-account-use).

Help is available from the question-mark icon before and after connection. The account email with a green dot shows the connection; the exit icon beside it disconnects. Dark mode is at the top of Settings. Read Help → Privacy notice for storage and data-removal details.

## Updating

Replace the contents of the existing installed folder with the new package and click Reload on its Chrome extension card. Keep the installed path and pinned identity. Saved account-specific profiles remain in the browser. Loading a second separate copy is not the normal update route.

From source, load `extension/`, not the repository root. The pinned extension ID is `blpliafbiiidhcffegochddjhagkhhip`. Owner OAuth configuration and access limitations are described in [architecture](architecture.md).
