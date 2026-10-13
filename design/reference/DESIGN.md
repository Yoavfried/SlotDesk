# Slot Desk: Design Guide

This guide documents the complete visual design of Slot Desk. It covers two surfaces that deliberately look different from each other:

1. **The landing page** (`pages/slot-desk-landing.html`): a loud, lime green "terminal" poster that introduces the tool and offers the download.
2. **The app** (`pages/slotdesk-app.html`): a calm, warm neutral working tool with light and dark themes.

The exact stylesheets are in `css/landing.css` and `css/app.css`. They are the source of truth. The same values are available as data in `tokens.json` and as a visual page in `style-guide.html`. This guide explains the system behind them so it can be reproduced or extended.

---

## 1. Design idea

| | Landing page | App |
|---|---|---|
| Mood | Retro terminal, a printed ticket, playful | Quiet stationery, a tool that gets out of the way |
| Color | One saturated lime field, near black ink, one orange accent | Warm off white paper, near black ink, three soft status colors |
| Type | Pixel display font plus a monospace | The system UI font only |
| Corners | Square, hard 2px borders | Soft, 10px and 16px radii, pills |
| Depth | None. Flat color and borders | Very soft, low shadows |
| Themes | Light only | Light and dark |

What ties the two together: near black ink on a warm background, generous spacing, numbered labels in small monospace (`.01`, `01`, `02`), and the red / green "before and after" language (the diff box on the landing page, the status colors in the app).

---

## 2. Landing page

Screenshots: `screenshots/landing.png`, `screenshots/landing-mobile.png`

### 2.1 Colors

| Role | Hex | Used for |
|---|---|---|
| Page field | `#D8E84A` | Page background, text on the dark button, text selection color |
| Panel | `#DEEB63` | The main panel, slightly lighter than the field |
| Ink | `#15160A` | All borders, headings, the button background, the cursor |
| Ink hover | `#3A3E14` | Button hover |
| Olive text | `#4B4F1C` | Nav link, supporting paragraph |
| Olive muted | `#5C6122` | Small labels, the screenshot bar text |
| Accent orange | `#F0955A` | The pill tag ("Downloadable") |
| Diff minus background | `#F0C7B8` | "Before" line |
| Diff minus sign / text | `#A13A1E` / `#6B3A26` | |
| Diff plus background | `#C9E6B0` | "After" line |
| Diff plus sign / text | `#2F5C1E` / `#20361A` | |
| Screenshot frame | `#F7F6F3` | Background behind the app preview (matches the app's own background) |
| Screenshot bar | `#EDEFD8` | The title strip above the preview |

### 2.2 Typography

Loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=VT323&display=swap" rel="stylesheet">
```

The font files are also in this kit: installable files in `fonts/install/`, web files in `fonts/web/` with a ready `fonts/fonts.css`, and a version of the page with the fonts built in at `pages/slot-desk-landing-self-contained.html`. Both fonts are under the SIL Open Font License.

| Element | Font | Size | Notes |
|---|---|---|---|
| Title `[SLOT DESK]` | VT323 | `clamp(32px, 6vw, 48px)`, 28px under 520px | line height 1.1, letter spacing 0.01em. Brackets at 55% opacity |
| Headline | VT323 | `clamp(24px, 3.4vw, 32px)` | line height 1.3, max width 56ch |
| Supporting paragraph | IBM Plex Mono | 13.5px | line height 1.7, olive text, max width 58ch |
| Diff lines | IBM Plex Mono | 12.5px | line height 1.5 |
| Nav link | IBM Plex Mono | 12.5px | letter spacing 0.06em |
| Pill tag | IBM Plex Mono | 10.5px | uppercase, letter spacing 0.04em |
| Screenshot bar | IBM Plex Mono | 11px | uppercase, letter spacing 0.04em |
| Button | IBM Plex Mono 600 | 14px | letter spacing 0.02em |

Body default: IBM Plex Mono, line height 1.6, antialiased.

### 2.3 Layout

- Nav strip at the top: padding `22px clamp(20px, 5vw, 64px)`.
- One centered panel: `width: min(94vw, 780px)`, vertically centered in the remaining viewport.
- Panel title area: padding `26px 26px 20px`, separated by a 2px ink rule.
- Panel body: padding `24px 26px 28px`.
- Vertical rhythm inside the body: diff box (22px gap), headline (16px), paragraph (24px), screenshot (26px), button row.

### 2.4 Components

**Terminal panel** (`.term-panel`)
2px solid ink border, panel color fill, no radius. A second, inner border sits 6px inside: 1px dashed ink at 50% opacity (drawn with `::before`). This double frame is the signature of the page.

**Title row** (`.term-panel-title`)
Title in VT323 with dimmed brackets, followed by a blinking block cursor and the pill tag, on one baseline with a 12px gap.

**Blinking cursor** (`.term-cursor`)
A 9 by 20px ink block, blinking once per second with a hard step (no fade). Animation is switched off when the visitor prefers reduced motion.

**Pill tag** (`.tag`)
Orange fill, 1px ink border, fully rounded, 2px by 9px padding.

**Diff box** (`.term-diffbox`)
Two stacked lines with a 1px border at 25% ink and a 4px radius. First line is the "before" (minus sign, pink). Second line is the "after" (plus sign, green). The sign sits in a fixed 12px column.

**Screenshot frame** (`.term-shot`)
2px ink border, 4px radius, with a title strip on top (`.01  slotdesk.html, preview` style label) and the image filling the full width below.

**Primary button** (`.term-project-link`)
Ink background, lime text, 1px ink border, square corners, padding 12px by 20px. Starts with a download arrow glyph (⇓). Hover lightens the background to `#3A3E14`.

**Text selection**
Inverted: ink background, lime text.

---

## 3. The app

Screenshots: `screenshots/app-light.png`, `screenshots/app-dark.png`, `screenshots/app-mobile.png`, `screenshots/app-first-run.png`

### 3.1 Color tokens

All colors are CSS variables on `:root`. Dark mode redefines the same names, so components never mention a color directly.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#f7f6f3` | `#131211` | Page background |
| `--sunk` | `#eeece7` | `#1d1c19` | Recessed surfaces: inputs, segmented control track, unselected cards |
| `--sunk-2` | `#e5e2db` | `#272521` | Hover on recessed surfaces, neutral chips |
| `--card` | `#fffefc` | `#191816` | Raised surfaces: result cards, the email box, dialogs |
| `--ink` | `#1b1a17` | `#f0eee9` | Main text |
| `--ink-2` | `#57544d` | `#a8a49b` | Secondary text |
| `--ink-3` | `#8b877e` | `#7a766e` | Labels, hints, muted text |
| `--line` | `#e4e1da` | `#2a2824` | Hairline dividers and card borders |
| `--line-2` | `#d2cec5` | `#3d3a34` | Stronger borders, dashed "add" outlines |
| `--acc` | `#1b1a17` | `#f0eee9` | Accent. This is the ink color itself: selected states are simply inverted |
| `--acc-ink` | `#fbfaf8` | `#131211` | Text on the accent |
| `--acc-soft` | `#e8e5de` | `#2a2824` | Soft accent fill |
| `--good` / `--good-bg` / `--good-ln` | `#2f6b4f` / `#e2efe7` / `#a9cdb9` | `#7cc39d` / `#17281f` / `#39543f` | "Suits everyone" |
| `--warn` / `--warn-bg` / `--warn-ln` | `#8a5a16` / `#f6ead7` / `#dfbe84` | `#e0b06a` / `#2c2416` / `#5c4a2a` | "Early or late for someone" |
| `--stop` / `--stop-bg` / `--stop-ln` | `#a03b34` / `#f7e5e2` / `#e0aaa3` | `#e79b91` / `#2e1d1a` / `#5e3a34` | "Unkind to someone", errors, remove actions |

Each status color comes as a trio: a text color, a soft background, and a line color for small swatches.

**There is no brand color in the app.** The accent is the text color, so a selected item is always "ink background, paper text". This is the main rule to keep when adding anything new.

### 3.2 Theme switching

- Follows the system setting through `prefers-color-scheme`.
- Can be forced with `data-theme="light"` or `data-theme="dark"` on the `<html>` element (the "Theme" button toggles it).

### 3.3 Typography

No web fonts. The app uses what is already on the computer, which keeps it offline and instant.

```css
--f:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--fn: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
```

| Element | Size | Weight | Notes |
|---|---|---|---|
| Body | 15px | 400 | line height 1.55 |
| First run title (h1) | 30px | 640 | letter spacing -0.025em |
| Step title (h2) | 26px | 640 | line height 1.2, letter spacing -0.022em, balanced wrapping |
| Day label, card title | 17px | 640 | letter spacing -0.02em |
| Step intro | 14.5px | 400 | `--ink-2`, max width 62ch |
| Buttons | 13px to 14.5px | 600 | |
| Field labels | 12.5px | 400 | `--ink-3` |
| Table header, legends | 11.5px | 500 | `--ink-3` |
| Step number (`01`, `02`) | 11px | 400 | monospace, letter spacing 0.1em, `--ink-3` |

Weight 640 is used for all headings and strong labels (system fonts are variable, so this lands between semibold and bold). All times and numbers use `font-variant-numeric: tabular-nums` so columns line up.

### 3.4 Shape, depth, motion

| Token | Value | Use |
|---|---|---|
| `--r` | 10px | Inputs, small boxes |
| `--r-lg` | 16px | Cards, dialogs, large selectable tiles |
| pill | 999px | Buttons, chips, tags, segmented controls |
| time button | 9px | The time slots |
| `--e1` | `0 1px 1px rgba(27,26,23,.04)` | Cards at rest, selected segment |
| `--e2` | `0 1px 2px rgba(27,26,23,.06), 0 8px 24px -14px rgba(27,26,23,.24)` | Selected time slot |
| `--e3` | `0 2px 6px rgba(27,26,23,.08), 0 28px 60px -28px rgba(27,26,23,.4)` | Drawer, dialog, toast |

Motion is short and quiet: 100 to 160ms for hovers and toggles, 260ms with `cubic-bezier(.32,.72,0,1)` for the drawer sliding in. All transitions are removed when the user prefers reduced motion.

Focus is always visible: a 2px accent outline with a 2px offset.

### 3.5 Layout

- **Header bar**: sticky, translucent (88% of the background with a 14px blur), 1px bottom hairline, padding 13px by 26px. Left: a 22px rounded square logo mark with "SD", the name, and a small monospace build label. Right: a status pill (colored dot plus text) and text buttons.
- **Demo banner**: a full width `--sunk` strip under the header with a small pill button.
- **Main column**: max width 940px, centered, side padding 26px.
- **Steps**: the page is a vertical flow of numbered steps (`01` to `04`). Each step has 34px of vertical padding and a hairline above it. Inside: step number, title, one line of intro, then the controls, with 14 to 16px gaps.
- **Day and time picker**: two columns, a fixed 280px calendar and a flexible column of times, 34px apart. Collapses to one column under 760px.
- **Breakpoints**: 760px (picker stacks), 560px (form fields stack), 520px (first run form stacks).

### 3.6 Components

**Selectable cards** (`.mtg`, `.execcard`)
`--sunk` fill, 16px radius, title in weight 640 with a small muted line below. Hover goes to `--sunk-2`. Selected flips to accent fill with inverted text. The "add new" version is transparent with a 1px dashed border.

**Pill selectors** (`.exbtn`) and **chips** (`.chip`)
Fully rounded. Selectors use the same sunk to accent flip. Chips are outlined (1px `--line-2`) with bold name, muted location, a monospace clock, and a round remove button that turns red on hover. "Add" chips are dashed.

**Segmented control** (`.lens`, `.tone`)
A `--sunk` pill track with 3px padding. The active segment is a `--card` pill with shadow `--e1` and weight 600.

**Inputs** (`label.f input`, `#quick`)
`--sunk` fill, no visible border, 10px radius. On focus the fill becomes `--card` and a `--line-2` border appears. Labels sit above in 12.5px muted text.

**Calendar** (`.dgrid`)
A 7 column grid of square, borderless day buttons with 10px radius. Today has a 1px inset ring and bold number. The picked day is accent fill. Non working days are muted, past days are 30% opacity. Tiny 3px dots under a number mean times were already picked on that day.

**Time slots** (`.t`)
The core of the app. Small rounded buttons (9px radius, 8px by 13px padding), colored by how the time lands:

| State | Look |
|---|---|
| Good | `--good-bg` fill, `--good` text, weight 600 |
| Warn | `--warn-bg` fill, `--warn` text, weight 600 |
| Stop | `--stop-bg` fill, `--stop` text, weight 600 |
| Outside rules | Transparent with a 1px inset hairline, muted text |
| Picked | Accent fill, inverted text, shadow `--e2`, and a ✓ after the time |

Hover lifts the button by 1px. A legend of 10px rounded squares below explains the colors.

**Result cards** (`.slot`)
`--card` fill, 1px `--line` border, 16px radius, shadow `--e1`. Top row: date in weight 640, time range in muted tabular numbers, then a status tag. Cards that are held back switch to the page background with a dashed border. Reasons are listed with a 6px colored dot (red for hard problems, amber for soft ones). A round × in the corner removes the card.

**Tags** (`.tag`)
Pills at 11.5px, weight 600: green "Good to offer", red "Not in the email", amber "Offering anyway" (a problem time the assistant chose to send), and neutral grey for a trip ("In Dubai, 19:30 there").

**Buttons**

| Kind | Class | Look |
|---|---|---|
| Primary | `.big` | Accent fill, pill, 11px by 24px, weight 600. Hover drops to 87% opacity |
| Secondary | `.med` | Transparent, 1px `--line-2` border, pill. Hover darkens border and text |
| Confirm | `.cbtn` | Outlined pill that fills with the accent on hover |
| Quiet | `.ghost` | No border, muted text, `--sunk` background on hover |
| Link | `.tlink`, `.undo`, `.tmore` | Muted text with a soft underline, offset 3px |
| Dashed add | `.dashadd`, `.newmtg`, `.addsm` | Transparent with a 1px dashed border |

**Table** (`table`)
No vertical lines, hairline row dividers, small muted headers with the city as a second line. Rows that are not being offered fade to 36% opacity. Times outside comfortable hours are colored amber or red.

**Email box** (`#out`)
A large `--card` text area with 16px radius, 18px by 20px padding and line height 1.65. Reads like a sheet of paper.

**Settings drawer** (`.drawer`)
Slides in from the right, up to 440px wide, page background, shadow `--e3`. Behind it a dim, slightly blurred scrim. Inside: a header with title, scrolling sections with small 13.5px headings, and a footer with actions. Day rows use small toggle switches (30 by 18px, accent when on).

**Toast** (`.toast`)
An accent pill centered at the bottom of the screen with shadow `--e3`.

**Dialog** (`dialog`)
`--card` fill, 16px radius, max width 420px, 24px padding, actions aligned right.

**First run screen** (`.setup`)
A narrow 560px column with a 30px title, a short intro, and one card containing the form.

**Privacy note** (`.safe`)
A muted paragraph under a hairline at the very bottom, with the key phrase in bold.

### 3.7 Print

When printed, the header, banner, picker, drawer and buttons are hidden and the background turns white, leaving only the results.

---

## 4. Voice in the interface

The wording is part of the design.

- Step titles are plain questions: "Which meeting are you arranging?", "Which times are you offering?"
- Results are described by how they feel to people, not as errors: "Suits everyone", "Early or late for someone", "Unkind to someone".
- Overrides are honest and optional: "Offer it anyway".
- Reassurance about privacy is stated flatly: "Nothing leaves this computer."

---

## 5. Rules for extending the design

1. **App: never introduce a new hue for emphasis.** Emphasis means inverting to ink. Color is reserved for the three statuses.
2. **App: every color must be a token**, defined for both light and dark.
3. **App: pills for actions, 16px cards for content, 10px for inputs.**
4. **Landing page: square corners, 2px ink borders, flat color.** No shadows, no gradients.
5. **Landing page: VT323 for anything loud, IBM Plex Mono for everything else.**
6. **Both: numbers get a small monospace label style** (`.01`, `01`).
7. **Both: respect reduced motion** and keep the visible focus outline.
