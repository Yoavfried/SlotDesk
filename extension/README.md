# SlotDesk browser extension

This directory contains the shared SlotDesk application and the Chromium extension manifest. Load `extension/` as an unpacked extension, or build browser-specific packages from the repository root:

```sh
npm run package:slotdesk
```

The Chromium ZIP includes `START-HERE.html`, Help, the privacy notice and bundled assets. The Firefox package is unsigned, and the Safari archive contains source preparation only. Google connection is limited to approved beta accounts.

See [installation](../docs/install.md), [product overview](../docs/overview.md), [browser compatibility](../docs/browser-compatibility.md) and [security/data handling](../docs/security.md). Calendar changes require review and confirmation.
