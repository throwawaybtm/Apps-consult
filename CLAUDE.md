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

## Human checkpoints: stop and ask at each one

1. PRD approved by the client, before anything else.
2. Stack and architecture approved, before coding starts.
3. Anything touching secrets, payments or handling of personal data.
4. Production deployment.
5. Final security and accessibility sign-off, before the client sees it.

## Skills and tools

- New project or a big decision: `superpowers:brainstorming`, then `superpowers:writing-plans`.
- Guidebook look and mockups: `frontend-design`, `website-design:web-design-system`, and `modern-web-guidance` for any HTML, CSS or JS.
- Accessibility: `design:accessibility-review` (and Axe once `/axe-accessibility:mcp-setup` is done).
- Security: `/security-review`.
- Lookups, doc reading and source gathering: the `researcher` subagent (Haiku).
- Token spend: `token-usage:report`.

## Commands

- `npm run new-project -- <name>`: creates `projects/<name>/` folders. Names use lowercase letters, digits and single hyphens.
- `npm run build:pdf -- <input.html> [output.pdf]`: prints a guidebook to an A4 PDF with the preinstalled Playwright Chromium. Never run `playwright install`.
- `npm test`: runs the tool tests.
