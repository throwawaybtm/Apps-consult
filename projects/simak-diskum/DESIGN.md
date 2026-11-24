# SIMAK DISKUM design tokens

Source of truth for the `@theme` block in `mockups/input.css` and, later, the real app.

**Planned frontend: React + Vite + Tailwind CSS v4 + shadcn/ui, pending checkpoint 2 (stack approval).** The mockups are static HTML, but their buttons, cards, badges, inputs, selects, textareas, tables, sidebar, sheet and toggle group follow the shadcn/ui components and use shadcn's semantic token names, so they carry straight into the app. The look is a placeholder for discussion until the client reacts. Nothing here is final.

## Direction: the trial's look, plus a few touches

The Dinas has seen the trial app (`simak-diskum-v5`, its `docs/VISUAL_DESIGN_SYSTEM.md`), so the new app keeps its look: white top bar and pill navigation on the public portal, a welcome banner with a bridge scene, four summary cards with outline icons in tinted tiles, a light left sidebar with a light-blue active pill on the admin side, civic royal blue `#2563eb`, navy text `#0f172a`, an icy `#f0f4f9` page, small radii, and the four stage colours (blue, amber, cyan, green). Colours are the trial's.

Our touches:
- **Gold "hari ini" marker** (`#f4b400`): today in the calendar, the agenda row that is happening now (a soft gold wash), the current stage dot, and the logo tile. Never text on white.
- **Time rail** on the public dashboard: a large date numeral, and each agenda row starts with its start time in large type.
- **Typeface Plus Jakarta Sans** (SIL OFL, designed in Indonesia) instead of the trial's system font, so the web app, the PDF guidebook and the video look the same on every device. TrueType files are used for the guidebook and video.
- **Bridge illustration** (our own simple SVG) in place of the trial's Barelang photograph; the real photo can be supplied by the Dinas (open item).
- **One-page form, inline warnings and automatic Selesai** (the simpler staff screens from `design.md`); the trial's modals and tabs are gone.

## Two surfaces

| | Public portal | Admin |
|---|---|---|
| Mood | Light, civic, time-first | Dense, calm, sidebar and cards |
| Page background | `page` around white cards | `page` |
| Components | Button (large), Card, Badge, Input (pill search), Select, Toggle group, Popover menu | Sidebar and Sheet, Card, Table, Form, Textarea, Alert, stage bar, Details |
| Navigation | White top bar, pill links, search and WIB badge; menu popover when narrow | Light sidebar with a pill for the current page, all eight items as normal links; Sheet drawer when narrow |

## Tokens (shadcn semantic names)

Values come from the trial; where the trial's text or status colour fails WCAG 2.2 AA, the nearest passing shade is used (listed under deviations).

| Token | Value | Use |
|---|---|---|
| `background` / `foreground` | `#ffffff` / `#0f172a` | surfaces, text |
| `primary` / `primary-foreground` | `#2563eb` / `#ffffff` | default Button, links (5.2:1 on white) |
| `secondary` / `secondary-foreground` | `#eff6ff` / `#1e40af` | secondary Badge, soft fills |
| `accent` / `accent-foreground` | `#dbeafe` / `#1d4ed8` | active navigation pill, hover |
| `muted` / `muted-foreground` | `#f8fafc` / `#475569` | table hover, secondary text |
| `destructive` / `destructive-soft` | `#b91c1c` / `#fee2e2` | Dibatalkan, errors |
| `success` / `success-soft` | `#166534` / `#dcfce7` | confirmations |
| `warning` / `warning-soft` | `#92400e` / `#fef3c7` | bentrok warning, "Berlangsung", "contoh" banner, internal-only badges |
| `border` / `input` | `#e2e8f0` / `#64748b` | borders / form control border (WCAG 1.4.11) |
| `ring` | `#1e40af` | focus ring |
| `sidebar`, `sidebar-foreground`, `sidebar-muted` | `#ffffff`, `#334155`, `#64748b` | admin sidebar |
| `sidebar-accent` / `sidebar-ring` | `#dbeafe` / `#1e40af` | current item pill, focus ring |
| `stage-initial` (+`-soft`) | `#1d4ed8` / `#eff6ff` | Input Awal |
| `stage-offline` (+`-soft`) | `#92400e` / `#fef3c7` | Proses Offline |
| `stage-details` (+`-soft`) | `#075985` / `#e0f2fe` | Detail Lengkap; status Terjadwal |
| `stage-complete` (+`-soft`) | `#166534` / `#dcfce7` | Administrasi Lengkap; status Selesai |
| `heading`, `tint`, `halo`, `page` | `#0f172a`, `#eff6ff`, `#bfdbfe`, `#f0f4f9` | headings, wash, soft ring, page |
| `gold`, `gold-soft`, `gold-foreground` | `#f4b400`, `#fff4cc`, `#3d2c00` | our touch, see above |
| `cat-0` (+`-soft`) | `#64748b` / `#f1f5f9` | category without a colour, neutral (4.8:1) |
| `cat-1` Biru (+`-soft`) | `#2563eb` / `#dbeafe` | category colour 1 (5.2:1 on white) |
| `cat-2` Hijau (+`-soft`) | `#16a34a` / `#dcfce7` | category colour 2 (3.3:1) |
| `cat-3` Oranye (+`-soft`) | `#ea580c` / `#ffedd5` | category colour 3 (3.6:1) |
| `cat-4` Ungu (+`-soft`) | `#7c3aed` / `#ede9fe` | category colour 4 (5.7:1) |
| `cat-5` Teal (+`-soft`) | `#0d9488` / `#ccfbf1` | category colour 5 (3.7:1) |
| `cat-6` Mawar (+`-soft`) | `#e11d48` / `#ffe4e6` | category colour 6 (4.7:1) |

Status is never colour alone: badges and notices always carry text. A cancelled activity also gets strikethrough.

## Type and shape

Public body 1rem; admin and shadcn components `text-sm`. Scale: 8xl date numeral (public day only), 3xl page and hero title, 2xl section and time numerals, base and sm for the rest. Radius follows the trial and shadcn: controls `rounded-md`, Card `rounded-xl` (12 px), hero `rounded-2xl` (16 px). Shadows `shadow-xs` and `shadow-sm`; the report preview sheet uses `shadow-md`.

## SIMAK-specific components

- **Category colours** (F13, shown in F1, F2, F6): each category has one of six fixed hues. The strong colour is only a 4 px strip on the left edge of an agenda row, a calendar entry, a weekly-list row or a category chip (each at least 3:1 against white and against its own light fill, WCAG 1.4.11; lowest is Hijau at 3.0:1 on its fill); the light fill carries the dark ink text, so text contrast never depends on the hue. Colour is never the only signal: the category name is always text (in the row's meta line, as a hidden prefix in calendar entries, and in the legend under the calendar). A category without a colour uses neutral grey. Admins pick the colour in the data master page.
- **Agenda row** (F1): start time large, end time small beneath, title, then category, place and organizer, status badge. Left edge is the category strip. States: current (soft gold wash), cancelled (strikethrough plus notice).
- **Date and time field** (F7, F3, F14): a text field in the Indonesian format (`23/11/2026`, `10.00`, 24-hour) with a button that opens a popover (month grid, or a list of half-hours). Typing always works, the format is checked with a pattern, and the popover is native (Escape closes it, focus goes back to the button, focus starts on the selected day). It follows the shadcn date picker pattern; the browser's own pickers are not used because they show US formats.
- **Disclosure** (F8 surat undangan): collapsed by default with a one-line summary (shows the nomor agenda and perihal once filled) and a chevron.
- **Save bar** (F7): sticky at the bottom of the viewport with the save button and the F12 note; the page sets `scroll-padding-bottom` so a focused field is never hidden behind it (WCAG 2.4.11).
- **Weekly list** (F6): "Agenda minggu ini", one row per activity (day and time, title, stage badge, category strip); the whole row opens the form.
- **Summary card** (F1, F6): icon tile (stage colour on its soft fill), label, value; used as a list, not a definition list.
- **Stages** (F8): four segments, Input Awal → Proses Offline → Detail Lengkap → Administrasi Lengkap; done in primary, current in bold with a gold dot. Stage badges use the four stage colours.
- **Inline warning** (F9) and **field error** (F11): `alert-warning` in the form and red text under the field, never a dialog.
- **Report paper** (F14–F16): white A4-style sheet, black text, kop surat on top, 8-column table, signature block at the lower right. Cancelled rows are dark red.

## Deviations

From stock shadcn/ui:
- **Input border** uses `input` `#64748b`, not the pale default, to meet WCAG 1.4.11.
- **Focus ring** is an opaque 3px outline in `ring`, not the translucent `ring/50`.
- **Placeholder text** is `muted-foreground` at full strength (stock is a 50% tint, about 3.2:1).
- **Public buttons** are 44px high for touch; admin keeps shadcn's 36px.
- The calendar is a CSS grid and the status and view switches are native radio groups styled as a Toggle group.

From the trial's palette (contrast on white or on the soft fill):
- Muted text `#64748b` (trial) → `#475569` on tinted surfaces; `#64748b` stays only for disabled-looking menu items.
- Status text: green `#16a34a` → `#166534`, amber `#d97706` → `#92400e`, cyan `#0284c7` → `#075985`, blue `#2563eb` text on soft blue → `#1d4ed8`. The trial's values are 3.0 to 4.1:1 and fail for small text.
- Input focus border `#3b82f6` → opaque ring `#1e40af`.

**No dark mode for now.** SIMAK is an office tool used in the daytime on desktops and phones; dark tokens can be added later without changing the semantic names.

## Rules

- Tokens only: no hard-coded colours or sizes in markup (the report sheet's black and white and the bridge illustration are the only exceptions).
- Never strip the keyboard, focus or ARIA behaviour of a shadcn component.
- Text, controls and focus rings meet WCAG 2.2 AA.
- Mockup people, places and activities are fictional; officials appear only as job titles ("Nama Pejabat, NIP 19xxxxxx"). The crest and Barelang photograph are not used; the Dinas supplies official artwork.
