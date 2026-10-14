# SlotDesk product overview

**Current version: 0.7.1 · Google Calendar first · private Chrome pilot**

SlotDesk helps executive assistants find, compare and book meeting times across calendars and timezones. Profiles represent people by email. Calendars provide availability sources and a writable organizing calendar; they are not the profile identity.

![SlotDesk workspace menu with synthetic test data](assets/workspace-menu-light.png)

## Available in the pilot

- A home menu for New meeting, Existing meetings and Manage profiles, with a separate creation confirmation that returns to the menu.
- Browsing across selected calendars and an unrestricted date range, with an adjustable display timezone, cached selection changes, SlotDesk origin tags, all-day/recurring/free meetings, guest responses and explicit incomplete/busy-only access.
- Reviewed editing of title, location, description, added/removed guests and Required/Optional roles, with retained responses and explicit removal consequences.
- Fixed dialog headings and close buttons; action-local errors and progress replace the historical status strip.

- Search saved profiles by name/email, add only attendees, and manage profiles in a separate searchable view.
- Own-profile onboarding, short participant profile creation, editable profiles and up to five suggested people from calendar appearances.
- Template or manual working schedules, optional working-day/hour enforcement, convenience ranking and a system-wide 24-hour/AM-PM preference.
- Calendar reads with pagination, recurring events, normalized visibility, explicit coverage/failure status and deduplication across sources.
- Positive availability, manual travel, confirmable non-LLM timezone clues, exact flight timing, leave/holiday exceptions and configurable radii/notice.
- Optional guests that prefer suitable times without blocking proposals; full participant-local dates and times; ordered fallback categories and explicit last-resort warnings.
- Compact proposal dates with future years only, date-specific GMT offsets, participant fit and explicit calendar-data confidence.
- Editable meeting review, copied details, fresh availability checks, new invitations to every retained attendee, Google Meet and unfinished-send recovery.
- A compact logo/Help/Settings row, connected email badge with disconnect icon, dark mode/full workspace at the top of Settings, and a privacy notice accessible through Help. Local fonts and the supplied design language are retained.

The [implemented work register](implemented.md) includes F01–F04, the original four defects, and F05–F18 follow-up features. The [UX register](ux-decisions.md) covers the later setup and booking decisions.

## Validation and work-account readiness

The project owner reports that basic live connection, setup, search and booking work. Version 0.7.1 passes 1275 synthetic checks and a focused browser flow. The disposable dense-calendar creation/export integrity check passed. The owner additionally reports working No alerts, suitable proposals, successful rescheduling and correct overlap details. Work-account access depends on the organization allowing the extension and Google permissions. See [testing](testing.md) and [security/privacy](security.md). A selected profile or timezone does not establish access to someone's calendar; unavailable data is marked unconfirmed.

## Meeting management and next work

[Meeting editing](meeting-editing.md), [reviewed rescheduling](rescheduling.md), declined-invitation alerts and overlap details are implemented. Occupied proposals favor fewer appointments to move and offer replacement actions for the OTHER meetings. No appointment moves automatically; deletion and calendar moves remain unsupported. Outlook is the accepted next calendar provider. [Optional user-key LLM assistance](llm-assistance.md) and live flight APIs remain deferred. Availability emails are an unconfirmed future feature; LLM-assisted direct appointment creation is a future request with its authorization policy still open. None is implemented in 0.7.1.

SlotDesk is part of **[Website name TBD]**, the planned parent website. Its branding and website implementation are on hold; private venture planning remains outside this repository.
