# Apps-consult

This repo holds research for app-consulting projects. For every client project the research becomes three deliverables, and the software itself is later built by Claude Code from the dev handbook.

Full design: `docs/superpowers/specs/2026-11-19-project-deliverables-design.md`

## Flow (per project, in `projects/<name>/`)

```
research/ → prd.md → (client approves) → guidebook (HTML → PDF) + dev-handbook.md → agent-kit/
```

- Write the PRD first. The guidebook and dev handbook are derived from it.
- **Every feature in the guidebook or dev handbook must exist in the PRD.** Scope changes go into the PRD first, then flow down.
- Start a new project with `superpowers:brainstorming`, then `npm run new-project -- <name>`.
- **Everything for a project lives in `projects/<name>/`**, including its brainstorming design (`projects/<name>/design.md`) and any plans (`projects/<name>/plans/`). Don't use `docs/superpowers/specs/` or `docs/superpowers/plans/` for project work; those are only for changes to this repo's own tooling.

## Branches

- Cloud sessions push to their own `claude/...` branch. **Approved by the repo owner:** every time you push something you'd report as done (a design, an approved design, a plan, a PRD draft, a guidebook, a finished task), also merge it into `main` and push `main` in the same step, without asking first. Only do this when `npm test` passes and `git status` is clean. Say in your reply that `main` was updated. Use a fast-forward when possible; if `main` has moved on, merge `main` in first and re-run `npm test`. Never force-push `main`.

## Documents and languages

| Document | File | Language | Checklist |
|---|---|---|---|
| PRD (client approves) | `prd.md` | Indonesian | `docs/checklists/prd.md` |
| Guidebook (shown to client) | `guidebook/guidebook.html` → `.pdf` | Indonesian | `docs/checklists/guidebook.md` |
| Dev handbook | `dev-handbook.md` | English | `docs/checklists/dev-handbook.md` |
| Agent kit (Claude Code builds from it) | `agent-kit/` | English | `docs/checklists/agent-kit.md` |

- In the Indonesian documents, technical terms (API, login, dashboard) stay untranslated.
- Checklists list required sections. They are **not** templates; write each project fresh.
- The guidebook has **no pricing**. The price goes in a separate quote; the guidebook may say one will follow.

## Rules

- **Quality bars:** Modern Web Guidance at **Baseline Widely available**; **WCAG 2.2 AA**; Core Web Vitals "good" (**LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**); **OWASP Top 10** checklist plus `/security-review` on every change.
- **Free first:** default to Firebase on the **Spark** plan (Auth, Firestore, Hosting), **Google Apps Script (GAS)** as the server-side layer, and **Google Drive** for storage. Anything that needs a billing account (including Blaze) needs a written reason in the stack decision record and the client's approval.
- **Frontend styling default: Tailwind CSS v4** (free, open source). Put the project's design tokens (colours, fonts, spacing, radius) in one `@theme` block that matches its DESIGN.md, and use `frontend-design` so it doesn't look like default Tailwind. Real apps compile it with Vite (`@tailwindcss/vite`). Never ship the CDN script. The project's stack decision record confirms or replaces this.
- **Component default: shadcn/ui** (free, open source; React + Tailwind + Radix UI). So the default frontend is **React + Vite + Tailwind v4 + shadcn/ui**. Add components with `npx shadcn add <component>`; they are copied into the app and owned by it. Use shadcn components before building custom ones, theme them through the `@theme` tokens, and never strip their keyboard, focus or ARIA behaviour. Static mockups can't run shadcn (it needs React), so mockups stay HTML + Tailwind with the same tokens and visually match the shadcn components the app will use. The stack decision record confirms or replaces this.
- Every GAS endpoint must verify the caller's Firebase identity. Never serve Drive files as public links.
- The stack is decided per project, in a decision record at the top of the dev handbook. Help the user weigh it every time.
- PDF output: A4, backgrounds printed, embedded fonts that support Indonesian text.
- Guidebook fonts: put TrueType-outline fonts (`.ttf`, or a `.woff2` built from TrueType outlines) in `guidebook/assets/` and load them with `@font-face`. CFF/OTF outlines, including WOFF2 files that wrap them, get embedded as Type 3 glyphs, which some PDF viewers render poorly.

## Optional: demo video

- A short **Indonesian walkthrough video** (60–90 seconds, with captions) can go alongside the guidebook, made with **Remotion** (the `remotion:*` skills). It lives in `projects/<name>/video/` (`src/index.ts` registers the compositions) and renders to `projects/<name>/video/out/`.
- It reuses the project's mockup screens, `@theme` colours and guidebook font, contains **no pricing**, and every feature it shows must exist in the PRD, like the guidebook.
- **License:** Remotion is free for individuals, companies of 3 people or fewer, and non-profits. Use it only for **our own deliverables**. Never build Remotion into a client's app unless the client buys a Remotion Company License; their headcount counts.
- Render with `npm run video`, never plain `npx remotion render`: the wrapper points Remotion at the preinstalled headless Chromium, because the cloud proxy blocks Remotion's own browser download. Check frames with `npm run video:still` before a full render. Remotion Studio can't be viewed from a cloud session.

## Human checkpoints: stop and ask at each one

1. PRD approved by the client, before anything else.
2. Stack and architecture approved, before coding starts.
3. Anything touching secrets, payments or handling of personal data.
4. Production deployment.
5. Final security and accessibility sign-off, before the client sees it.

## Skills and tools

- New project or a big decision: `superpowers:brainstorming`, then `superpowers:writing-plans`.
- Guidebook look and mockups: `frontend-design`, `website-design:web-design-system`, and `modern-web-guidance` for any HTML, CSS or JS. Mockups use Tailwind v4 (compiled with `npm run css`) so they carry straight into the real build. The guidebook's own print layout can be plain CSS.
- Accessibility: `npm run check:a11y -- <page.html> ...` (automated WCAG 2.2 AA scan with the free axe-core engine) on every guidebook and mockup page, then `design:accessibility-review` for what automation can't judge (reading order, meaning, keyboard flow). The paid Axe scanner plugin isn't used.
- Security: `/security-review`.
- Lookups, doc reading and source gathering: the `researcher` subagent (Haiku).
- Token spend: `token-usage:report`.

## Commands

- `npm run new-project -- <name>`: creates `projects/<name>/` folders. Names use lowercase letters, digits and single hyphens.
- `npm run build:pdf -- <input.html> [output.pdf]`: prints a guidebook to an A4 PDF with the preinstalled Playwright Chromium. Never run `playwright install`.
- `npm run css -- -i <input.css> -o <output.css> [--minify]`: compiles Tailwind v4 for mockups. Run it from the repo root with repo-root paths. The input CSS must sit inside the repo (for example `projects/<name>/mockups/`) so `@import "tailwindcss"` resolves; it starts with `@import "tailwindcss";` and holds the `@theme` tokens. Recompile before `build:pdf` or `check:a11y`.
- `npm run check:a11y -- <page.html> [more.html ...]`: runs axe-core WCAG 2.0–2.2 A/AA rules in Chromium. Exits 1 and lists each violation with where and how to fix it; items needing a manual check are listed without failing.
- `npm run video -- <entry.ts> <composition-id> <out.mp4> [remotion flags]`: renders a Remotion video (H.264 MP4) with the preinstalled headless Chromium.
- `npm run video:still -- <entry.ts> <composition-id> <out.png> --frame=<n>`: renders one frame to check the look before a full render.
- `npm test`: runs the tool tests.
- `npm test`, `css`, `check:a11y`, `video` and `video:still` run `npm install` first, so a fresh session needs no setup.
