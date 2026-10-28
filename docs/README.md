# SlotDesk documentation

SlotDesk is a closed-beta Google Calendar scheduling extension. Start with the user guides below. Downloads are available from [GitHub releases](https://github.com/Yoavfried/SlotDesk/releases); the [installation guide](install.md) explains manual installation and browser-package limits.

## User guides

| Topic | Guide |
| --- | --- |
| Features and setup | [Product overview](overview.md), [installation and updates](install.md) |
| People and calendars | [Onboarding and profile reference](onboarding-and-profiles.md) |
| Scheduling | [Current New meeting rules](new-meeting-current-contract.md), [planning email](planning-email.md) |
| Existing meetings | [Editing details and guests](meeting-editing.md), [rescheduling and alerts](rescheduling.md) |
| Local files | [Backup, restore and selected-profile import/export](export-import.md) |
| Data and support | [Privacy notice](../extension/privacy.html), [security/data handling](security.md), [accessibility](accessibility.md) |
| Browser support | [Compatibility and known limits](browser-compatibility.md) |
| Releases | [Release notes](releases/README.md), [product changelog](changelog.md), [repository changelog](../CHANGELOG.md) |

## Contributor and technical references

| Topic | Reference |
| --- | --- |
| Contributions | [Contributing](../CONTRIBUTING.md), [security reporting](../SECURITY.md) |
| Architecture | [Application architecture](architecture.md), [engine API](engine-api.md), [backend setup](../backend/README.md) |
| Interface design | [Design guide](../design/README.md), [working style guide](../design/style-guide.html) |
| Verification | [Validation record](testing.md), [optional calendar comparison kit](calendar-acceptance.md), [New meeting review](new-meeting-review-0.9.5.5.md) |
| Distribution | [Store submission kit](store-kit/README.md), [store requirements](extension-stores.md), [release-readiness review](release-readiness-review.md) |
| Project plans | [Roadmap](roadmap.md), [1.0.0 release plan](release-1.0.0-plan.md) |
| Future concepts | [Optional LLM assistance](llm-assistance.md), [availability inquiries](time-inquiries.md) |

## Design decisions and history

Decision records explain the reasons behind changes and may describe superseded behavior. Use the current guides and [scheduling contract](new-meeting-current-contract.md) for implemented behavior.

- [UX decisions](ux-decisions.md) and [scheduling decisions](scheduling-decisions.md).
- [Meeting-option statuses and data sources](meeting-options-review-0.9.4.5.md).
- [Advanced profile settings](advanced-profile-review-0.9.5.md) and [trip design](trips-0.9.5.md).
- [Search controls and fallback decisions](search-options-review-0.9.4.5.md).
- [Connection recovery](recovery-experience.md) and [error-reporting review](error-reporting-review.md).

A planned or proposed feature is not an available feature. Validation reports apply to the version and environment they identify. Browser packages do not imply store approval.

Made by **[Speedy](https://buildwithspeedy.com), [Nina Banai](https://github.com/ninabanai-maker) and [Yoav Fried](https://github.com/Yoavfried)**. Support: [support@buildwithspeedy.com](mailto:support@buildwithspeedy.com).
