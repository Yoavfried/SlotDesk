# 0.9.4.8 — onboarding leads and timezone overlays

Implement the owner’s 26 October request. Every completed onboarding adds a private lead, including repeat emails; the same queued completion retries without duplication. Add the reported browser name and internal onboarding UUID. Preserve the original five values in historical leads, with browser Unknown. Keep old five-field clients compatible. Update the onboarding and privacy notices. [Contract](leads-table.md).

Replace the timezone list’s layout-consuming panel with a viewport-constrained overlay shared by profile, guest, search, booking, meeting management, blockers and travel/flight controls. A search may cover following controls; opening/typing does not resize its dialog. Clicking away, leaving focus, Escape, scrolling away, closing its dialog or resizing dismisses it. Selecting a result still uses the existing profile/meeting save behavior.

Prepare [SD and bracketed SD](../design/proposals/extension-icon/README.md) with real VT323 outlines, header lime and matching bracket colors. SVG and 16/32/48/128/1024px PNG candidates are review artifacts outside the extension package. **Do not install icons before owner selection.**

No Calendar writer, Google OAuth scope, calendar-deletion behavior, flight scheduling rules or cloud settings sync changes. Flight redesign and wider UX approval remain with the owner; 0.9.5 is not declared complete.

Validation: 2,280 application checks, 73 backend checks and 22 calendar-comparison checks. Focused synthetic browser coverage and isolated migration/production deployment results are recorded in [release evidence](validation-0.9.4.8.json). Automated accessibility checks do not replace manual review.
