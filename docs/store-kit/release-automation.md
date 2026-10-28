# Store update automation

The **Prepare and submit store updates** GitHub Actions workflow prepares browser-store packages from a stable release tag. Publishing a GitHub Release prepares the packages automatically. Ordinary commits, pushes and pull requests never submit store updates.

Store submission starts disabled. Preparation does not need store credentials and makes no store requests. Complete each store's initial publication, access setup and release checks before enabling its update job.

## Prepare a release

1. Set the same version in `extension/manifest.json` and `package.json`, merge the release changes into `main`, and create a matching tag such as `v1.0.1`.
2. Publish the GitHub Release, or open **Actions → Prepare and submit store updates → Run workflow**, enter the tag and leave **target** as `prepare`. Preparation may use the default `main` selection in **Use workflow from**.
3. Download the `store-release-bundle` workflow artifact after checks pass.

The tag must resolve to the checked-out commit and be part of `origin/main`. Prerelease tags, branches, dirty checkouts and mismatched versions are rejected. A GitHub Release marked as a prerelease is skipped.

The artifact contains:

- The Chrome Web Store / Microsoft Edge Add-ons ZIP with the development `key` omitted.
- The unsigned Firefox XPI with the stable Firefox identity and store-specific consent text.
- The matching Firefox source ZIP, readable build instructions and source commit.
- `release.json` and `SHA256SUMS.txt` identifying every package and its hash.

Preparation builds in a temporary copy and does not touch the repository's regular `dist` directory. It then extracts the generated source ZIP and rebuilds Firefox again. The unsigned XPI must match byte for byte before preparation succeeds. This comparison happens before Mozilla adds its signature.

For a local build from a clean, tagged checkout with `origin/main` available:

```sh
node scripts/store-release.mjs prepare --tag v1.0.1 --output /path/to/new-empty-folder
```

Existing release artifacts are never overwritten by this command. Use a new or empty output directory. This does not attach assets to GitHub Releases or change existing historical packages.

## Configure approvals before enabling a store

In **Settings → Environments**, create `chrome-web-store`, `edge-addons` and `firefox-addons`. Add the release owner as a required reviewer and restrict deployments to release tags. Availability of environment protection depends on repository visibility and the GitHub plan; verify that the intended approval rule is enforced before enabling submission. Restrict who can create or change release tags.

Put identifiers and enable flags in **Settings → Secrets and variables → Actions → Variables**. Put publishing secrets in the corresponding environment's **Environment secrets**. Never put credentials in source files, issue comments, chat messages, release notes or packages.

Each store has a separate job and credential scope. Build and test jobs receive no store credentials. Upload jobs verify package hashes, manifest versions, the expected source commit and the explicitly approved tag before any store request.

### Chrome Web Store

Complete the first Chrome publication and configure its final Google authorization return before enabling automated updates.

1. Enable the Chrome Web Store API in a Google Cloud project.
2. Create a dedicated service account and link its email in **Chrome Web Store Developer Dashboard → Account**. A publisher can currently link one service account.
3. Configure Google Workload Identity Federation for this GitHub repository and service account. Restrict trust to this repository's numeric owner/repository IDs, the `chrome-web-store` environment and the intended release workflow/tags. Both manually dispatched tag runs and release events must satisfy the trust condition. Selecting the tag only in the text input does not change GitHub's workflow ref; a manual submission must also select that tag in **Use workflow from**. The workflow requests a short-lived token with the `chromewebstore` scope; it does not store a Google private key.
4. Set repository variables:

| Variable | Value |
| --- | --- |
| `CWS_WIF_PROVIDER` | Full Google workload identity provider resource name |
| `CWS_SERVICE_ACCOUNT` | Authorized service-account email |
| `CWS_PUBLISHER_ID` | Publisher ID from Developer Dashboard → Publisher → Settings |
| `CWS_ITEM_ID` | Permanent Chrome store extension ID |
| `SLOTDESK_CHROME_ENABLED` | `true`, only after setup is complete |

The adapter uses the Chrome Web Store API **v2**, checks for policy warnings and an already pending revision, uploads the store ZIP, verifies the returned version and submits for normal review with warnings blocking submission. It does not request skipped review or change visibility/rollout settings. An asynchronous upload that does not immediately confirm the expected version stops before submission; inspect its state in the dashboard before retrying. A matching revision already pending review or staged is reported without another upload. This workflow does not publish an already staged revision.

Official references: [API guide](https://developer.chrome.com/docs/webstore/using-api), [service accounts](https://developer.chrome.com/docs/webstore/service-accounts), [GitHub workload identity federation](https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines).

### Microsoft Edge Add-ons

The Update API cannot create the first public product. Finish the initial publication in Partner Center, then open **Microsoft Edge → Publish API → Create API credentials** and use the current API-key experience.

| Setting | Location | Value |
| --- | --- | --- |
| `EDGE_PRODUCT_ID` | Repository variable | `927da0c6-6bc0-409c-8405-de8fb781ef97` for the recorded SlotDesk listing |
| `EDGE_FIRST_PUBLICATION_COMPLETE` | Repository variable | `true` after the first Edge publication |
| `EDGE_CLIENT_ID` | `edge-addons` environment secret | Client ID from Publish API |
| `EDGE_API_KEY` | `edge-addons` environment secret | API key from Publish API; monitor its expiry |
| `SLOTDESK_EDGE_ENABLED` | Repository variable | `true`, only after setup is complete |

The adapter uploads the store ZIP, waits for the upload operation to succeed, submits the draft for certification and checks that the submission operation succeeded. Submission success means certification was requested; it is not a claim that the update is publicly available. The API does not update listing descriptions or other metadata.

Only one operator should edit the listing during a release. In particular, do not modify the draft in Partner Center while its automation job is running. The API does not expose a package-hash comparison or an atomic compare-and-submit operation, so this workflow cannot rule out a concurrent manual draft replacement.

Official reference: [Edge Update API](https://learn.microsoft.com/en-us/microsoft-edge/extensions/update/api/using-addons-api).

### Firefox Add-ons

Keep the first Firefox submission manual so its listing, data declarations, reviewer access and source requirements are settled before automation. Generate credentials from [AMO API credentials management](https://addons.mozilla.org/en-US/developers/addon/api/key/).

| Setting | Location | Value |
| --- | --- | --- |
| `AMO_API_KEY` | `firefox-addons` environment secret | JWT issuer from AMO |
| `AMO_API_SECRET` | `firefox-addons` environment secret | Matching JWT secret |
| `SLOTDESK_FIREFOX_ENABLED` | Repository variable | `true`, only after setup is complete |

The adapter uses AMO API v5 and the existing stable extension ID. It uploads the XPI to the `listed` channel, waits for successful validation at the expected version, and creates a version with its matching source ZIP attached. Existing versions are not overwritten or deleted. If a version already exists, check its AMO status manually instead of assuming it was approved. Listing metadata and reviewer notes remain managed in AMO; each source ZIP includes the exact build instructions and source commit.

Official references: [AMO API](https://mozilla.github.io/addons-server/topics/api/addons), [API authentication](https://mozilla.github.io/addons-server/topics/api/auth.html), [source submission](https://extensionworkshop.com/documentation/publish/source-code-submission/).

## Submit an approved update

After the initial publications and credentials are ready:

1. Open **Actions → Prepare and submit store updates → Run workflow**.
2. In **Use workflow from**, select the release tag, such as `v1.0.1`. Enter that same tag in **tag**, select the enabled store or `all`, and type the tag again in **confirm_tag**. A run started from `main` or another branch can prepare packages but is rejected before submission, even when the tag text inputs are correct.
3. Inspect the prepared artifact and approve the corresponding environment job.
4. Check the workflow result and the store dashboard for review/certification outcome.

Unset enable flags skip store jobs without failing the preparation run. Choosing `all` submits only the stores whose enable flags are `true`; verify which jobs were skipped. Approval is a real release action: submission can make the update public after approval under each store's publication settings.

Once this manual process has been verified, setting repository variable `SLOTDESK_STORE_AUTO_SUBMIT` to `true` also queues **enabled** store jobs when a stable GitHub Release is published. Required environment approvals still apply. Leave this variable unset to keep release publication build-only. A normal push never queues a submission.

Store-installed copies receive updates through their browser after publication. GitHub commits do not update browser installations directly. Unpacked beta installations still require a manual update.

## Failure handling and validation limits

The uploader never automatically repeats a failed write request. A lost response can mean an upload or submission succeeded even though the workflow could not confirm it. Inspect the dashboard before retrying. Polling is bounded and only repeats read requests. Credentials and raw server response bodies are not printed.

Run the isolated release tests with:

```sh
node --test scripts/store-release.test.mjs
```

Tests cover release gates, offline preparation, preservation of existing artifacts, exact Firefox source rebuilds, checksum rejection and mocked request sequences for all three stores. They do not replace a real authenticated store test. No real uploads have been made by the implementation or its tests. Store credentials, enforced approval settings, initial publications and a real first update remain owner-controlled setup steps.
