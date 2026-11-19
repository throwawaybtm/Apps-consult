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
- Every GAS endpoint must verify the caller's Firebase identity. Never serve Drive files as public links.
- The stack is decided per project, in a decision record at the top of the dev handbook. Help the user weigh it every time.
- PDF output: A4, backgrounds printed, embedded fonts that support Indonesian text.
- Guidebook fonts: put TrueType-outline fonts (`.ttf`, or a `.woff2` built from TrueType outlines) in `guidebook/assets/` and load them with `@font-face`. CFF/OTF outlines, including WOFF2 files that wrap them, get embedded as Type 3 glyphs, which some PDF viewers render poorly.

## Human checkpoints: stop and ask at each one

1. PRD approved by the client, before anything else.
2. Stack and architecture approved, before coding starts.
3. Anything touching secrets, payments or handling of personal data.
4. Production deployment.
5. Final security and accessibility sign-off, before the client sees it.

## Skills and tools

- New project or a big decision: `superpowers:brainstorming`, then `superpowers:writing-plans`.
- Guidebook look and mockups: `frontend-design`, `website-design:web-design-system`, and `modern-web-guidance` for any HTML, CSS or JS.
- Accessibility: `npm run check:a11y -- <page.html> ...` (automated WCAG 2.2 AA scan with the free axe-core engine) on every guidebook and mockup page, then `design:accessibility-review` for what automation can't judge (reading order, meaning, keyboard flow). The paid Axe scanner plugin isn't used.
- Security: `/security-review`.
- Lookups, doc reading and source gathering: the `researcher` subagent (Haiku).
- Token spend: `token-usage:report`.

## Commands

- `npm run new-project -- <name>`: creates `projects/<name>/` folders. Names use lowercase letters, digits and single hyphens.
- `npm run build:pdf -- <input.html> [output.pdf]`: prints a guidebook to an A4 PDF with the preinstalled Playwright Chromium. Never run `playwright install`.
- `npm run check:a11y -- <page.html> [more.html ...]`: runs axe-core WCAG 2.0–2.2 A/AA rules in Chromium. Exits 1 and lists each violation with where and how to fix it; items needing a manual check are listed without failing.
- `npm test`: runs the tool tests.
- `npm test` and `check:a11y` run `npm install` first, so a fresh session needs no setup.
