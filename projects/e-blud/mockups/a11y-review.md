# Accessibility review: first-round mockups

Date: 2026-11-19. Pages: `public-home.html`, `admin-dashboard.html`, `admin-permohonan.html`. Standard: WCAG 2.2 AA.

## Automated
`npm run check:a11y` (axe-core, tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa): **no violations** on all three pages. One "needs manual check" item remains on the public page (hero text over a gradient); worked out by hand below.

## Manual checks and results

| Area | Result |
|---|---|
| Contrast (24 text and graphic pairs) | All pass. Lowest: bar colour sky-600 vs white 4.1:1 (graphics need 3:1); sky-700 on sky-50 5.6:1. Hero text on the gradient: 8.5 to 8.9:1 for text, 5.6:1 for the quiet button. |
| Focus ring | 3px ring on every tab stop. **Fixed:** the ring on the dark sidebar was 2.05:1; now light blue, 11.7:1. **Fixed:** the native date field showed no outline when tabbed to. |
| Keyboard | Skip link first. Menu (public) and drawer (admin) open with Enter or Space, close with Escape, and return focus to the button. Status filter radios show a ring on their label. |
| Target size | No interactive target under 24px. **Fixed:** the breadcrumb link was 16px high. Buttons and fields are 40 to 44px. |
| Reflow | No horizontal page scroll at 320px, also with WCAG text-spacing overrides. Tables become stacked cards in narrow containers. |
| Structure | One h1 per page, headings in order, landmarks present (header, nav, main, footer), table wrapper is a named, focusable region. |
| Forms | Every field has a visible label; hints sit above the field; errors show text plus an icon after interaction (`:user-invalid`) and are linked with `aria-describedby`; focus moves to the first invalid field on submit. |
| Charts | Decorative bars are hidden from assistive tech; each chart has a real data table ("Lihat tabel data"). Bars never carry meaning by colour alone (values and labels). |
| Motion | No animations; `prefers-reduced-motion` respected. |

## Not tested here
- A real screen reader (VoiceOver, NVDA). Recommend one pass before the client sees anything.
- Browsers other than Chromium.
- Real content: the nav labels, copy and data are placeholders.
