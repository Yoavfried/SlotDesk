# Styling plan for 0.9.4

Started 19 October 2026. **Planning only: no 0.9.4 implementation or release is authorized by this record.** Current shipped version remains 0.9.3. Settle the styling plan first, then return to profile advanced settings cleanup and improvement. The owner decides when the wider user experience is ready.

The [original kit](../design/reference/style-guide.html) stays unchanged. This document proposes an explicit working-app adaptation; accepted rules should become a maintained, illustrated working-interface style guide with shared implementation tokens.

## Decisions confirmed — 19 October 2026

- **DM Sans throughout ordinary interface text**: headings, body text, fields and buttons. Preserve the logo and robotic eyebrow text unchanged.
- **Sentence case throughout ordinary interface text**, including Edit profile, Create profile, Clear data and Calendar connected. Preserve proper names, brands and uppercase robotic text.
- **Page headlines at weight 400, 24px in compact/sidebar layouts and 28px in wider layouts.** The owner chose these sizes for now, with visual review later; they are provisional rather than final visual approval. Reduce the space above headlines as planned.

These answers settle the three typography/capitalization choices; they do not authorize application implementation or approve the overall styling.

## Requested direction

- Keep the New meeting plus icon's appearance.
- Use the existing outline calendar icon for Existing meetings, without its connection-status cross.
- Use an outline people icon for Manage profiles.
- Mention rescheduling in the Existing meetings description and adding flights in the Manage profiles description.
- Replace navigation-arrow characters in all three menu choices, Continue unfinished meeting and return-to-workspace actions with a consistent drawn arrow.
- Review capitalization and define font sizes/weights by their purpose, including the visual distinction between ordinary copy and text actions.
- Reduce the large space above page headlines and consider smaller headlines.
- Use the confirmed DM Sans and regular-weight page-headline direction above; visually review the provisional sizes later.
- Preserve the current robotic eyebrow text and wordmark styling.

## Observations from current source

The working app uses a system UI font stack, not DM Sans. Common headings use weight 640. Size tokens include 30px page titles and 26px section headings, but individual components add overrides. The two page-heading patterns differ: `.intro` has 54px top padding on wide screens and 36px on narrow screens, whereas `.view-heading` has its own margins. Some headlines contain forced line breaks.

Main-menu navigation uses Unicode glyphs for icons/arrows. Existing meetings and Manage profiles use symbols that do not clearly represent calendars and people. Ordinary buttons generally use weight 600, but their sizes vary by component. Capitalization mixes sentence case with labels such as Edit Profile, Create Profile, Choose Calendars, Clear Data and Calendar Connected. Some of these were explicitly requested in earlier fixes; the new consistency review should reconcile them intentionally.

## Menu proposal

| Action | Icon | Description |
| --- | --- | --- |
| New meeting | Keep plus appearance | Find a time, review the details and send invitations. |
| Existing meetings | Outline calendar | View, edit and reschedule meetings, and check responses. |
| Manage profiles | Outline two-person group | Add people, update timezones and availability, and add flights. |

Keep the icon, title/description and forward-arrow positions consistent across all three choices. Long text may wrap without moving the arrow into the description or changing its icon size.

## Arrow and icon proposal

Use inline SVG icons with a shared 24-unit drawing grid, 1.75-unit strokes, rounded ends and joins. Use a real arrow with a shaft and open arrowhead for forward/back navigation, rather than a text character or a bare chevron. Forward points right; returning points left. A down chevron means expand; an up-right arrow means open an external destination.

Menu icons display at 24px; action arrows display at 18px. Align arrow and text vertically with a consistent 8px gap. Keep arrows in a fixed trailing column on menu choices. Keep arrows outside accessible text and ensure the control's label explains its action.

Arrows indicate navigation or progression, including Continue unfinished meeting and review/continue actions. Save, Discard, Remove and similar direct actions do not need a forward arrow. Audit navigation glyphs in generated content as well as static HTML; do not blindly replace arrows used as appointment/date data.

## Typography — accepted family, proposed role scale

Use **DM Sans** for normal working-interface text, with locally bundled font files and their license. Retain the current VT323 wordmark, robotic eyebrow/step-label typography, case and letter spacing. Do not apply a font replacement to those components. Existing terminal-style handoff material remains outside this working-app proposal.

Use three normal-interface weights: 400 for reading, 500 for labels/section structure, and 600 for actions/strong identifiers. Avoid arbitrary intermediate weights such as 640. Heading weight 400 applies to page and dialog titles; section headings have a separate proposed role below.

| Role | Proposed size | Weight | Purpose |
| --- | --- | --- | --- |
| Page title | 24px compact / 28px wide, accepted provisionally | 400 | Orient the user to the current screen; visual review remains pending |
| Dialog title | 22px | 400 | Name the current task |
| Section heading | 20px | 500 | Divide a screen into meaningful areas |
| Card/menu title or person name | 16px | 600 | Identify an item or destination |
| Body text and field values | 14px | 400 | Main readable content |
| Button and text-action label | 14px | 600 | Identify an interactive action |
| Form label | 13px | 500 | Name a control |
| Supporting details and metadata | 13px | 400 | Email, timezone, dates and explanatory details |
| Minor caption | 12px | 400 | Nonessential supporting detail; never shrink critical warnings or appointment details into this role |
| Robotic eyebrow/step text | Preserve current treatment | Preserve current treatment | Existing brand accent |

Page titles use line height 1.2; normal text uses 1.5. Controls inherit their defined type role. Normal browser text zoom remains available. Use tabular figures for displayed dates/times. Do not shrink a button label merely because the window becomes narrow; adjust layout and allow suitable wrapping instead.

Typography alone must not be the only indication of interactivity. Filled/outlined buttons have their button surface, hover and visible keyboard focus. Text navigation actions consistently use weight 600 and a drawn direction arrow. Ordinary explanatory text stays weight 400 and has no arrow, pointer cursor or button hover treatment. Inline links retain an identifiable link treatment.

## Capitalization — accepted

Use **sentence case** for ordinary interface headings, buttons, labels, options, tooltips and messages. Capitalize the first word, proper names and established acronyms. Examples: New meeting, Manage profiles, Edit profile, Create profile, Choose calendars, Clear data, Calendar connected.

Keep brand names and proper spellings, including SlotDesk, Google Calendar, Google Meet and Outlook. Preserve people's names, calendar titles, timezone identifiers and user-entered content. Preserve the uppercase wordmark and robotic eyebrows as deliberate exceptions. Do not use a blanket CSS text transform to fix mixed source wording.

Functional headings and action labels do not end in a period. Supporting sentences use normal punctuation. Review the large editorial headlines separately: use one deliberate punctuation rule across them rather than accidental differences. Proposed default: keep a sentence's punctuation in editorial copy, with consistent application.

## Page spacing proposal

Replace the separate intro/view-heading spacing recipes with one page-header pattern:

| Gap | Proposed value |
| --- | --- |
| Bottom of top bar to first page control/content | 24px |
| Back-to-workspace row to eyebrow, when present | 16px |
| Eyebrow to page title | 8px |
| Page title to supporting sentence | 8px |
| End of heading block to first main content | 24px |

These are gaps between visible elements, not additive default paragraph margins. A back action remains a separate row where needed. Remove hard-coded line breaks from page titles so the same words wrap naturally at the available width. Preserve a stable wordmark/header size; do not enlarge it to fill a wider window.

## Scope and review boundary

The styling pass covers the main menu, shared page headers, common controls, navigation arrows, capitalization and ordinary typography in both themes. It should include representative onboarding, New meeting, Existing meetings, Manage profiles and dialogs to expose inconsistencies. It does not redesign profile advanced settings yet or change scheduling/calendar behavior.

After the owner settles the proposed choices, implementation should consolidate shared type/spacing/icon roles rather than add another set of isolated CSS overrides. The maintained guide should illustrate ordinary copy versus text actions, all type roles, menu icons/arrows, capitalization exceptions, focus/hover/error states and compact/wide layouts. Technical checks should cover text zoom, wrapping, focus, contrast and clipping, but do not establish owner approval of the styling.

## Choices still to settle

- Review the remaining type roles, arrow/icon details, final menu description wording and exact page-header spacing together. The DM Sans family/scope, sentence case and provisional page-headline scale are settled above.
- Visually evaluate the 24px/28px page headlines later; only the owner can approve their final appearance.
