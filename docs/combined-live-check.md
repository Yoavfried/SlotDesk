# SlotDesk: three live test sessions

Updated 13 October 2026 for **0.7.0**. There are **three sessions and one final export**. Session 1 makes **two confirmed time changes**. Sessions 2 and 3 use unsent drafts. No new invitation or fixture is required. A failure may need a targeted retest.

Use regular Chrome. A is the connected tester; B is a consenting test recipient using Google Calendar. B does not need SlotDesk, an OAuth setup or access to A's private calendars. An agent can compare exports locally without signing in to Google.

## Completed evidence to keep

- The first reviewed self-only invitation/export comparison preserved all 1,013 original components and added exactly one event, with the expected time and Meet link.
- Invitation 02 was delivered; A's Yes and B's No were reported visible. Reuse it; do not recreate it.
- The older two-window protection passed by user report. The changed synchronization UX still needs the session below.
- Synthetic application and recovery checks passed. They do not establish live recurrence, delivery or work-account readiness.

## Preparation

1. Close every SlotDesk panel/tab, update the installed folder to 0.7.0 and select Reload in `chrome://extensions`. Avoid running an older build alongside it.
2. Open SlotDesk and confirm the testing account. Keep confirmed changes in the existing disposable test calendar.
3. If a result becomes uncertain, check the same appointment and report the message before attempting a different change. Do not deliberately interrupt a live write.

## Test 1: rescheduling, alerts and overlaps

### Responses and dismissal

1. Locate **SlotDesk test invitation 02** in Google Calendar and note its date. In SlotDesk Existing meetings, select its calendar/date and **Refresh meetings**.
2. Open View details. Compare title, date/time, organizer, guests, Required/Optional flags and Meet link with Google. Saved profile names should resolve correctly.
3. Open the bell. B's recorded No should appear. Select **Dismiss**, then Refresh meetings: the same No remains quiet.
4. B answers **Maybe** on the existing invitation in Google Calendar. A refreshes: details show Maybe. B answers **No** again; A refreshes: details show No and a new observed-decline notice appears.

### Preview without writing

5. Select **Find another time** from that alert. Confirm the correct meeting/current time and retained roster, including declined and optional guests. Confirm missing guest timezones through short profile setup if prompted.
6. Search **9–10 November 2026**, beyond the dense fixture's busy period. Select an allowed option without known conflicts and **Review this time**.
7. Check Current/New time, timezone, duration, guests and warnings. Try **Copy new time**. Scroll if needed: heading/close stay visible.
8. Close without confirming. The appointment remains at its original time in Google Calendar.

### Overlap and OTHER-appointment preview

9. In Existing meetings, show **20 October**, only the disposable calendar, with Times shown in **Asia/Jerusalem**. Locate **SD TEST overlapping busy event**, around **11:00–11:45**. Its red Overlapping label should expand to readable other titles/times despite being created outside SlotDesk.
10. Reopen invitation 02's rescheduling. Under **Choose an exact time**, preview **20 October, 11:00**, keeping the invitation's original duration. Do not confirm.
11. If allowed rules produce a conflict proposal, open its warnings and **Plan replacement times for the other appointments**. Choose one conflict: it should open the OTHER event with its actual roster and replacement proposals that avoid the considered interval. Close without writing.
12. If protected rules block the preview, record the reason; do not weaken rules to force it. Record the OTHER action as not exercised rather than passed.

### Confirmed time change 1

13. Reopen invitation 02 and search 9–10 November again. Select an allowed option with no known conflicts; review and select **Reschedule & notify guests once**.
14. In Google Calendar verify the existing invitation moved, retaining title/content/location/guests/Meet. B checks updated invitation delivery, time and Meet. Record any Google-generated RSVP changes.
15. Record the original and new interval with timezone.

### Confirmed time change 2: one recurring occurrence

16. Show **19–21 October** and locate **SD TEST UTC daily series**. Note all three occurrences. The 20 October occurrence is **10:30–10:45 Asia/Jerusalem**.
17. Open only the 20 October occurrence and Reschedule meeting. Set timezone **Asia/Jerusalem**. Choose an exact time **11 November 2026, 13:00–13:15**, or an offered allowed interval if actual constraints block it.
18. Review and confirm once. Verify the selected occurrence moved, the 19/21 October occurrences remained unchanged, and the target retains its recurring identity. Record old/new intervals.

Record functional failures separately from UX issues such as unclear wording, repeated warnings, cramped layout or hard-to-find actions. Read-only/foreign-organizer changes must not become writable; existing synthetic guards remain separately recorded.

## Test 2: shared, read-only and revoked access

1. B creates an **empty secondary calendar**, **SlotDesk permission test**. In Settings and sharing → Shared with, add A's email with **Make changes and see event details** (or the older equivalent event-editing permission). A accepts the emailed calendar link. [Google sharing instructions](https://support.google.com/calendar/answer/37082?hl=en).
2. In SlotDesk New meeting → Advanced options → Calendar data, **Refresh calendars**. In Manage profiles, note B's original mappings and temporarily map B only to the empty calendar under Advanced profile options → Availability calendars; save.
3. This temporary mapping tests coverage, not B's real schedule. Invitation responses do not require B's private calendar.
4. Start an unsent **SlotDesk permission probe**, with A only, test calendar as organizer, custom date **10 November**, duration **15 minutes**. Find an unoccupied option, open review, turn Meet off. Do not send.
5. B changes A's sharing to **See event details** / **See all event details**. Once Google applies it, A changes the review start by one minute and back, then **Check updated availability**. Expect an actionable writing-permission error and sending unavailable. Close review.
6. Refresh calendars and start another unsent draft: the read-only calendar must not be offered as a writable organizer. Use A's original disposable calendar, include B, and search 10 November. Accessible mapped empty-calendar coverage should be complete.
7. B removes A's sharing. A searches again with the mapping unchanged. Expect **Calendar data incomplete / Availability unconfirmed**, not verified empty availability.
8. B restores read-only sharing. A accepts the link if needed, refreshes/searches: mapped coverage returns complete.
9. B checks the permission-test calendar remains empty. Restore B's original mappings; inaccessible real sources remain unconfirmed.

## Test 3: side panel and full workspace

1. In the connected panel create an unsent **SlotDesk window check** draft: A only, original disposable organizer, **10 November**, **15 minutes**. Find an unoccupied option and open review.
2. Settings → **Open full workspace**. The tab adopts the same account automatically; merely opening it leaves the panel's checked review valid.
3. In the tab select **Continue unfinished meeting** if needed. Details match; this surface requires fresh availability checking.
4. Change title to **SlotDesk window check updated** and move start/end forward **15 minutes** in the tab. The panel updates and disables sending until **Check updated availability** succeeds.
5. Run that check in the panel. Both surfaces show matching details. Do not send.
6. Disconnect with the exit icon in either surface. Both clear loaded calendar/review data and show disconnected state.
7. Reconnect in one surface using regular Chrome. The other adopts the session; saved profiles and unfinished user-entered details remain. Close the unsent review.
8. Optional same-session UX check: open the same profile editor in both surfaces before saving. Enter different temporary names and save each. Expect an in-place choice of changes, no logout, and the selected result visible in both. Restore the original name.

## One final export and result sheet

After all sessions, export only A's disposable calendar: Google Calendar → My calendars → its three-dot menu → Settings and sharing → Calendar settings → **Export calendar**. [Google export instructions](https://support.google.com/calendar/answer/37111?hl=en).

Provide the ICS/ZIP and both approved old/new intervals. Compare locally against the previously supplied exports, allowing invitation 02's known addition and the two selected time changes. Require retained original identity/content/guests/Meet and no deleted/unrelated changed appointments. A recurring exception may add an exported component: raw counts alone are insufficient. Record provider-generated version/timestamp/sequence/RSVP differences separately. The creation-only comparator alone cannot accept a selected time change; use a time-aware comparison for this result. Keep raw exports outside Git.

```text
Test 1: PASS / FAIL / NOT EXERCISED
Invitation 02 old -> new:
Recurring occurrence old -> new:
Recipient received update:
OTHER appointment preview exercised:
UX issues / exact errors:

Test 2: PASS / FAIL
Failed step, if any:

Test 3: PASS / FAIL
Failed step, if any:
```

Workplace approval is separate before a work-account pilot. No acceptance step changes that gate automatically.
