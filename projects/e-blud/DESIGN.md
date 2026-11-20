# e-BLUD design tokens

Source of truth for the `@theme` block in `mockups/input.css` (and later the real app). These are the values the first-round mockups already use; they are a placeholder look for discussion until the client reacts. Nothing here is a final design.

## Two surfaces

| | Public site | Admin site |
|---|---|---|
| Mood | Modern, light, friendly (same family as the reference public site) | Modern but government style: dense, sidebar, tables |
| Page background | white, `brand-50` wash in the hero | `page` (`#eaf0f6`) |
| Corners | `card` 14px, `control` 8px | `panel` 6px, `field` 4px |
| Navigation | Top bar; popover menu when narrow | Navy sidebar; popover drawer when narrow |

## Colour

| Token | Value | Use |
|---|---|---|
| `brand-50` | `#f0f9ff` | washes, hover |
| `brand-100` | `#e0f2fe` | chips, avatars |
| `brand-200` | `#bae6fd` | focus ring on dark surfaces, current step halo |
| `brand-600` | `#0284c7` | chart bars only (4.1:1 on white, needs 3:1) |
| `brand-700` | `#0369a1` | text, buttons (5.9:1 on white) |
| `brand-800` | `#075985` | focus ring, button hover |
| `brand-900` | `#0c4a6e` | headings |
| `navy-900` / `navy-800` | `#0b2540` / `#12365a` | admin sidebar, table head, footer |
| `ink` / `ink-2` | `#0f2233` / `#3b4a5a` | body / secondary text (9.1:1 on white) |
| `line` | `#d3dde6` | borders |
| `page`, `stripe` | `#eaf0f6`, `#f4f8fb` | admin background, table stripes |
| `field-edge` | `#5b6b7b` | form control borders (5.5:1) |
| `ok` / `ok-bg` | `#166534` / `#dcfce7` | success |
| `warn` / `warn-bg` | `#92400e` / `#fef3c7` | warning, "contoh" banner |
| `err` / `err-bg` | `#b91c1c` / `#fee2e2` | errors |

Status is never colour alone: chips and errors always carry text.

## Type

Inter (400, 600, 700), system fallback. Body 1rem at 1.6 line height. Headings 700, line height 1.2, balanced wrapping.

## Rules

- Tokens only: no hard-coded colours or sizes in markup.
- Text, controls and focus rings meet WCAG 2.2 AA; target size at least 24px, buttons 44px high.
- Charts are single-series bars with a text table alternative.
