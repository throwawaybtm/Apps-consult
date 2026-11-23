# SIMAK DISKUM design tokens

Source of truth for the `@theme` block in `mockups/input.css` and, later, the real app.

**Planned frontend: React + Vite + Tailwind CSS v4 + shadcn/ui, pending checkpoint 2 (stack approval).** The mockups are static HTML, but their buttons, cards, badges, inputs, selects, textareas, tables, sidebar, sheet and toggle group follow the shadcn/ui components and use shadcn's semantic token names, so they carry straight into the app. The look is a placeholder for discussion until the client reacts. Nothing here is final.

## Direction

The trial app used civic royal blue; this keeps it and gives it one memorable partner: **gold**, used only as the "hari ini" marker (the current day in the calendar, the current agenda row, the current administrative stage) and as the rule under the public header. Gold never carries text on white. The public portal leads with the day itself: a large date numeral beside a time rail where each activity's start time is the biggest thing in its row. The admin side is plain, dense and quiet: a navy sidebar, white cards on a pale blue-grey page.

Typeface: **Plus Jakarta Sans** (SIL OFL, designed in Indonesia, full Indonesian text support). Weights 400, 500, 600, 700, 800. For the guidebook and video, use the TrueType files (`.ttf`).

## Two surfaces

| | Public portal | Admin |
|---|---|---|
| Mood | Light, clear, time-first | Dense, calm, sidebar and cards |
| Page background | `background`, `tint` wash around the day's agenda | `page` |
| Components | Button (large), Card, Badge, Input, Select, Toggle group, Popover menu | Sidebar and Sheet, Card, Table, Form, Textarea, Alert, Progress-style stages, Details |
| Navigation | Navy top bar with gold rule; menu popover when narrow | Navy sidebar; Sheet drawer when narrow |

## Tokens (shadcn semantic names)

| Token | Value | Use |
|---|---|---|
| `background` / `foreground` | `#ffffff` / `#101a3a` | page, text |
| `card` / `popover` | `#ffffff` | Card, menus |
| `primary` / `primary-foreground` | `#1d4ed8` / `#ffffff` | default Button, links (6.7:1 on white) |
| `secondary` / `accent` | `#e0e7ff` (text `#1e3a8a`) | secondary Badge, hover and selected states |
| `muted` / `muted-foreground` | `#f5f7fc` / `#424c66` | table hover, secondary text |
| `destructive` / `destructive-soft` | `#b91c1c` / `#fee2e2` | Dibatalkan, errors |
| `success` / `success-soft` | `#166534` / `#dcfce7` | confirmations |
| `warning` / `warning-soft` | `#92400e` / `#fef3c7` | bentrok warning, "Berlangsung", "contoh" banner, internal-only badges |
| `border` | `#d5dbe8` | borders |
| `input` | `#5b6580` | form control border (WCAG 1.4.11) |
| `ring` | `#1e3a8a` | focus ring |
| `chart-1` | `#3b5bdb` | reserved for charts |
| `sidebar`, `sidebar-foreground`, `sidebar-muted` | `#0f1f4d`, `#dfe5f7`, `#aab6d8` | admin sidebar, public header and footer |
| `sidebar-accent` / `sidebar-ring` | `#1b2f6e` / `#c7d2fe` | hover and current item, focus ring on dark surfaces |
| `heading`, `tint`, `halo`, `page` | `#14246b`, `#f0f4ff`, `#c7d2fe`, `#eceff7` | headings, wash, soft ring, admin background |
| `gold`, `gold-soft`, `gold-foreground` | `#f4b400`, `#fff4cc`, `#3d2c00` | "hari ini" and current-stage marker, current agenda row, logo tile |

Status is never colour alone: badges and notices always carry text. A cancelled activity also gets strikethrough.

## Type and shape

Public body 1rem; admin and shadcn components `text-sm`. Scale: 8xl date numeral (public day only), 3xl page title, 2xl section/time numerals, xl and base headings, sm and xs for meta. Radius follows shadcn: controls `rounded-md`, Card `rounded-xl`. Shadows `shadow-xs` and `shadow-sm`; the report preview sheet uses `shadow-md`.

## SIMAK-specific components

- **Agenda row** (F1): start time large, end time small beneath, title, place and organizer, status badge. States: current (gold left edge and soft gold wash), cancelled (strikethrough plus notice).
- **Stages** (F8): four segments, Input Awal → Proses Offline → Detail Lengkap → Administrasi Lengkap; done in primary, current in bold with a gold dot.
- **Inline warning** (F9) and **field error** (F11): `alert-warning` in the form and red text under the field, never a dialog.
- **Report paper** (F14–F16): white A4-style sheet, black text, kop surat on top, 8-column table, signature block at the lower right. Cancelled rows are dark red.

## Deviations from stock shadcn/ui (on purpose)

- **Input border** uses `input` `#5b6580`, not the pale default, to meet WCAG 1.4.11.
- **Focus ring** is an opaque 3px outline in `ring`, not the translucent `ring/50`.
- **Public buttons** are 44px high for touch; admin keeps shadcn's 36px (above the 24px WCAG 2.2 minimum).
- **Status filter and calendar view switch** are native radio groups styled as a Toggle group.
- The calendar is a CSS grid (no calendar component library yet); the real app may use a library, subject to the stack decision.
- Dark mode tokens are not defined yet.

## Rules

- Tokens only: no hard-coded colours or sizes in markup (the report sheet's black and white are the only exceptions, because it mimics paper).
- Never strip the keyboard, focus or ARIA behaviour of a shadcn component.
- Text, controls and focus rings meet WCAG 2.2 AA.
- Mockup people, places and activities are fictional; officials appear only as job titles ("Nama Pejabat, NIP 19xxxxxx").
