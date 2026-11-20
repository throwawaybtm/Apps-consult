# e-BLUD design tokens

Source of truth for the `@theme` block in `mockups/input.css` and, later, the real app.

**Planned frontend: React + Vite + Tailwind CSS v4 + shadcn/ui, pending checkpoint 2 (stack approval).** The mockups are static HTML, but their buttons, cards, badges, inputs, tables, sidebar and charts follow the shadcn/ui components (Button, Card, Badge, Input, Label, Checkbox, Table / data table, Alert, Toggle group, Sheet, Sidebar, Chart) and use shadcn's semantic token names, so they carry straight into the app. The look is a placeholder for discussion until the client reacts. Nothing here is final.

## Two surfaces

| | Public site | Admin site |
|---|---|---|
| Mood | Modern, light, friendly (same family as the reference public site) | Modern but government style: dense, sidebar, tables |
| Page background | `background`, `tint` wash in the hero | `page` |
| Components | shadcn Button (large), Card, Badge, Input, Alert, dropdown menu | shadcn Sidebar and Sheet, Card, data Table, Toggle group, Form, Checkbox, Chart |
| Navigation | Top bar; menu popover when narrow | Navy sidebar; Sheet drawer when narrow |

## Tokens (shadcn semantic names)

| Token | Value | Use |
|---|---|---|
| `background` / `foreground` | `#ffffff` / `#0f2233` | page, text |
| `card` / `card-foreground` | `#ffffff` / `#0f2233` | Card |
| `popover` / `popover-foreground` | `#ffffff` / `#0f2233` | menus |
| `primary` / `primary-foreground` | `#0369a1` / `#ffffff` | default Button, links (5.9:1 on white) |
| `secondary` / `secondary-foreground` | `#e0f2fe` / `#0c4a6e` | secondary Badge, avatars |
| `muted` / `muted-foreground` | `#f4f8fb` / `#3b4a5a` | table hover, secondary text (9.1:1 on white) |
| `accent` / `accent-foreground` | `#e0f2fe` / `#0c4a6e` | hover and selected states |
| `destructive` / `destructive-soft` | `#b91c1c` / `#fee2e2` | errors, Batal |
| `success` / `success-soft` | `#166534` / `#dcfce7` | Lunas |
| `warning` / `warning-soft` | `#92400e` / `#fef3c7` | menunggak, "contoh" banner |
| `border` | `#d3dde6` | borders |
| `input` | `#5b6b7b` | form control border (5.5:1, see deviations) |
| `ring` | `#075985` | focus ring |
| `chart-1` | `#0284c7` | chart bars (4.1:1 on white, graphics need 3:1) |
| `sidebar`, `sidebar-foreground`, `sidebar-muted` | `#0b2540`, `#dbe7f3`, `#a9bccf` | admin sidebar, footer |
| `sidebar-accent` / `sidebar-accent-foreground` | `#12365a` / `#ffffff` | sidebar hover and current item |
| `sidebar-ring` | `#bae6fd` | focus ring on dark surfaces |
| `heading`, `tint`, `page` | `#0c4a6e`, `#f0f9ff`, `#eaf0f6` | public headings, wash, admin background |

Status is never colour alone: badges and errors always carry text.

## Type and shape

Inter (400, 600, 700), system fallback. Public body 1rem; admin and shadcn components use `text-sm`. Radius follows shadcn: controls `rounded-md`, Card `rounded-xl`, popovers `rounded-md`. Shadows `shadow-xs` and `shadow-sm`.

## Deviations from stock shadcn/ui (on purpose)

- **Input border** uses `input` `#5b6b7b`, not the pale default, to meet WCAG 1.4.11 (3:1).
- **Focus ring** is an opaque 3px outline in `ring`, not the translucent `ring/50`, to meet WCAG 2.4.11 and 1.4.11.
- **Public buttons** use a large size 44px high for touch; admin keeps shadcn's default 36px (above the 24px WCAG 2.2 minimum).
- **Charts** are CSS bars with a text table alternative, standing in for the shadcn Chart (Recharts) component.
- **Status filter** is a native radio group styled as a Toggle group.
- Dark mode tokens are not defined yet.

## Rules

- Tokens only: no hard-coded colours or sizes in markup.
- Never strip the keyboard, focus or ARIA behaviour of a shadcn component.
- Text, controls and focus rings meet WCAG 2.2 AA.
