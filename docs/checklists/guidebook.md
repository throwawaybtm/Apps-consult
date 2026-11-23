# Guidebook checklist

Language: **Indonesian**. Format: HTML in `guidebook/guidebook.html`, built to an A4 PDF with `npm run build:pdf`. Audience: the client, who isn't technical. Make it plain, visual and persuasive.

- [ ] **The client's problem:** stated in their own words, so they recognise it.
- [ ] **The solution:** what will be built and how it solves the problem, in a page or less.
- [ ] **Key screens:** mockups of the main screens, built as real HTML with Tailwind v4 (`npm run css`) in the planned design style, visually matching the shadcn/ui components the app will use (use `frontend-design`, `website-design:web-design-system` and `modern-web-guidance`).
- [ ] **User flow:** a diagram of how users move through the app.
- [ ] **Included and not included:** taken directly from the PRD's features and out-of-scope list.
- [ ] **Timeline and phases:** what is delivered when.
- [ ] **What the client provides:** content, accounts (for example their Google account for Drive storage), approvals and access.
- [ ] **Next steps:** what happens after they read this.
- [ ] **No pricing:** the price and terms are in a separate quote. It's fine to say a quote will follow.
- [ ] **Matches the PRD:** every feature shown appears in the PRD, with the same F-number.
- [ ] **Accessible:** `npm run check:a11y -- projects/<name>/guidebook/guidebook.html` (and any mockup pages) reports no violations, and `design:accessibility-review` finds nothing blocking.
- [ ] **Demo video (optional):** if made, it follows the same rules (Indonesian with captions, no pricing, only PRD features, project fonts and colours), lives in `video/`, and renders with `npm run video`.
- [ ] **Builds cleanly:** `npm run build:pdf` succeeds, with no broken images and Indonesian text rendered in the chosen font.
