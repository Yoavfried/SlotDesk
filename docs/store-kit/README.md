# SlotDesk store submission kit

Prepared 26 October 2026 for Chrome Web Store, Microsoft Edge Add-ons and Firefox AMO. These are review drafts, not live listings. The installed beta remains Google-only; Outlook follows 1.0.0.

Upload `SlotDesk-VERSION-Chromium-store.zip` to Chrome and Edge. It omits the development `key` field rejected by store upload validation. The ordinary `SlotDesk-VERSION.zip` keeps the unpacked beta identity and is for manual installations. Firefox uses the separate `Firefox-unsigned.xpi`. Store-issued IDs and Google return configuration remain release gates.

- [Listing copy](listing.md)
- [Shared product language](../product-language.md)
- [Permissions and data declarations](declarations.md)
- [Reviewer instructions](reviewer-instructions.md)
- [Owner publication steps](owner-steps.md)
- [Recorded store identities](store-identities.md)
- [Adopted MIT license](license-proposal.md)

Use the approved C2 icon in [the icon assets](../../design/assets/icons/README.md), the real wordmark and synthetic-data screenshots. Never upload private calendars or screenshots showing real personal data. Store screenshots must match the submitted build. Use [buildwithspeedy.com](https://buildwithspeedy.com) as the approved website. Do not invent listing URLs.

Support is [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com), and the website is [buildwithspeedy.com](https://buildwithspeedy.com). The owner confirmed all three publisher registrations and completed the product UX review on 26 October 2026. The exact public privacy URL, store-issued extension identities, Google public OAuth verification and signed/native-browser validation remain open. The 28 October source review found no new confirmed vulnerability; earlier issues are addressed. Native Windows synthetic checks passed in all three browsers; real Google, persistent signed installation and Mac checks remain open. See [review evidence](../release-readiness-review.md).

## Media

`media/01-workspace.png`, `02-profiles.png`, `03-existing-meetings.png` and `04-meeting-options.png` are 1280×800 RGB screenshots captured on 28 October 2026 from the actual 0.9.5.9 interface with example calendars and profiles. No real account connection or Calendar write was used. Suggested upload order: meeting options, workspace, profiles, existing meetings. `media/store-logo-128.png` and `store-logo-512.png` are unchanged copies of the approved icon. Refresh the screenshots when preparing the final 1.0.0 build.

Chrome accepts 1–5 screenshots at 1280×800; Edge accepts up to six, including this size. Firefox listing images can reuse the captures where the resulting Firefox UI matches. [Chrome listing guidance](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Edge listing guidance](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension).

`media/small-promo-440x280.png` and `media/marquee-promo-1400x560.png` are RGB promotional tiles without transparency, using the approved wordmark, lime background, DM Sans and shared product language. Their editable source is `media/promo-tiles.html`; render each tile at its specified native dimensions with the bundled fonts loaded. The video field can remain empty until a real promotional video exists.
