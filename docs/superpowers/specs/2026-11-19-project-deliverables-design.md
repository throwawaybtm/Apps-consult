# Project Deliverables: Design

Date: 2026-11-19
Status: Approved 2026-11-19

## Intent

This repo is where app-consulting work is researched and written up. For every client project, the research ends in three documents:

1. **PRD**: the agreed scope, which the client approves.
2. **Guidebook**: what the client is shown to explain what will be built.
3. **Dev handbook**: everything needed to build fully working software.

The software itself will be built by **Claude Code**, as fully as possible: backend, frontend, UI/UX, testing, performance and security. So the dev handbook is not just reading material; it is an instruction set an AI agent executes.

Why this matters: the client needs to understand and agree to what they are buying, and the builder (Claude Code) needs a spec precise enough that "done" is checkable. The PRD is what keeps both aligned.

## Goals

- One set of three documents per project, written specifically for that project.
- Every document traces back to the PRD; the guidebook and handbook never add or drop scope on their own.
- The guidebook is a visual PDF in Indonesian that a non-technical client understands.
- The dev handbook lets Claude Code build, test and ship the app with minimal guessing.
- Modern quality bars are built in: current web platform practice, accessibility, performance and security.

## Non-goals

- Reusable fill-in-the-blank templates. Each project is written fresh. (A short checklist of required sections per document is allowed, to keep coverage consistent.)
- The consulting website. That is a separate project, set aside for now.
- Building any client app as part of this work. This design covers the documents and how they are produced.

## Anti-goals (failure even if it "works")

- A guidebook that promises something the PRD doesn't include.
- A dev handbook that reads well but has no acceptance criteria, so Claude Code produces software that looks finished and isn't.
- A guidebook that looks like a generic AI report instead of a designed document.
- Claude Code making irreversible or risky decisions (secrets, payments, user data, production deploys) without a human.

## The three documents

### 1. PRD (`prd.md`, Indonesian)

- **Reader:** the client and the builder. **The client signs off on it.**
- **Contents:** the problem and goals; the users (who they are and what they need); features as a numbered list; requirements per feature; **out of scope**; acceptance criteria per feature, written so they can be tested; success measures; constraints (budget, timeline, platform, legal); open questions.
- **Length:** short, about 3–5 pages for a typical project.
- Technical terms (API, login, dashboard) stay as they are and are not translated.

### 2. Guidebook (PDF, Indonesian)

- **Reader:** the client. The tone is plain, visual and persuasive.
- **Contents:** the client's problem in their own words; the proposed solution; key screens as mockups; how users move through the app (a flow diagram); what is included and not included (from the PRD); timeline and phases; what the client needs to provide; next steps.
- **Every feature it shows must be in the PRD.**
- **No pricing.** The price and terms go in a separate quote. The guidebook can mention that a quote follows separately.

### 3. Dev handbook (English)

There are two layers.

**a. The readable handbook (`dev-handbook.md`)**, for a human reviewer, tech lead or auditor:
a **stack decision record** (see below); architecture (frontend, backend, data, integrations) with a diagram; data model; API design; authentication and authorisation; security design; performance targets; testing strategy; environments and deployment; and how to run the project locally.

**Stack decision (made per project).** The stack is chosen for each project, not fixed. The handbook opens with a short decision record: the requirements that drive the choice (from the PRD), the options considered, the choice made, and its trade-offs. Human checkpoint 2 approves it.

- **Free first.** The default is services that cost nothing and need **no billing account or credit card**. Any paid service, including Firebase's Blaze plan, needs a written reason in the decision record and the client's approval.
- **Default free stack:**
  - **Firebase on the free Spark plan:** Auth, Firestore and Hosting.
  - **Google Apps Script (GAS)** as the server-side layer, because Cloud Functions aren't available on Spark.
  - **Google Drive** as file storage, reached through GAS. Use the client's own Google account where possible, so the files and quota belong to them.
- **Know the free limits.** The handbook lists the free-tier limits that matter for the project: Firestore daily reads and writes, Hosting bandwidth, GAS quotas, and Drive's 15 GB per account (shared with Gmail). It also says what happens when the project outgrows them.
- **When the free default doesn't fit,** the decision record names the problem and proposes the cheapest fix. Examples: a free image service with no card needed, for image-heavy public apps; or Firebase Storage on Blaze, with budget alerts, once the client agrees to pay.

- **If Drive/GAS is used, the handbook must specify:** how the GAS web app checks the caller's Firebase identity (never an open endpoint); which account it runs as and what that account can reach in Drive; how it stays within GAS limits (6 minutes per execution, about 30 simultaneous executions per user, and quotas that can change); file size limits; and how files are served (not as public Drive links).

**b. Agent-executable files**, generated from the handbook and placed in the app's code repo when building starts:
- `CLAUDE.md`: stack, commands, coding conventions, folder structure, and "never do" rules.
- `specs/<feature>.md`: one per PRD feature, each with acceptance tests that map to the PRD's acceptance criteria.
- `build-order.md`: the order features are built in, their dependencies, and the checks between stages.
- **Quality targets** that apply to every feature:
  - Web platform: follow Modern Web Guidance at **Baseline Widely available**, unless the PRD sets a different browser target.
  - Accessibility: **WCAG 2.2 AA**, checked with Axe where available, plus `design:accessibility-review`.
  - Performance: **Core Web Vitals "good"** thresholds (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).
  - Security: an OWASP Top 10-based checklist, and `/security-review` on every change.

**Human checkpoints.** Claude Code stops for approval at each of these:
1. PRD approved by the client, before anything else.
2. Architecture and stack approved, before coding starts.
3. Anything touching secrets, payments or handling of personal data.
4. Production deployment.
5. Final security and accessibility sign-off, before the client sees it.

## Flow per project

```
research/ ──► prd.md ──(client approves)──┬──► guidebook (HTML → PDF) ──► client
                                          └──► dev-handbook.md ──► CLAUDE.md, specs/, build-order.md ──► Claude Code builds
```

Any change in scope goes into the PRD first, then into the other documents.

## Repo layout

```
projects/
  <project-name>/
    research/            findings, sources, notes
    prd.md
    guidebook/
      guidebook.html     source
      assets/            images, fonts, mockup screenshots
      guidebook.pdf      built output
    dev-handbook.md
    agent-kit/           CLAUDE.md, specs/, build-order.md (copied into the app repo at build time)
```

## Approaches (for producing the guidebook PDF)

| Approach | Trade-off |
|---|---|
| **A. HTML and CSS printed to PDF with Chromium (chosen)** | Full layout control. Mockups are real HTML that can reuse the app's planned design system. Text-based, so it lives in git. Chromium is already in the environment, so no setup is needed. Costs some effort to set up the visual style on the first project. |
| B. Claude Docs exported to PDF | Easy editing and client comments, but limited layout. It looks like a report, and mockups would only be images. |
| C. Pandoc with LaTeX or Typst | Great typography for text, but mockups and complex layouts are awkward. Needs extra tools installed every session, which means a setup script. |

**Chosen: A**, because the guidebook's job is to show the client what they're getting, and real HTML mockups do that best.

## Decided by the user

- Three documents per project: PRD, guidebook and dev handbook.
- One-off per project, with no reusable templates.
- Guidebook is a visual PDF in Indonesian, produced with approach A.
- Claude Code builds the software as fully as possible, across backend, frontend, UI/UX, testing, performance and security.
- Either language works for the PRD; the call below picks one.
- Pricing is not in the guidebook; it goes in a separate quote.
- The stack is chosen per project, and the user wants help making this decision each time.
- Free first: Firebase on Spark, with GAS and Drive. Nothing that needs a billing account unless it's justified and the client approves.

## Calls made by Claude (for review)

- PRD in **Indonesian**; dev handbook, `CLAUDE.md` and specs in **English**.
- PRD kept as a separate document instead of a handbook chapter, so the client can sign off on it.
- The five human checkpoints listed above.
- Quality bar defaults: Baseline Widely available, WCAG 2.2 AA, Core Web Vitals "good", OWASP Top 10.
- The repo layout above.
- A short section checklist per document, kept in `docs/checklists/`, instead of templates.
- PDF settings: A4 size, embedded fonts that support Indonesian text, and printed with headless Chromium through a small script in `tools/`.

## Left to the builder

- The exact wording of each section checklist.
- The visual style of the first guidebook (type, colour, layout). Use `frontend-design` and `website-design:web-design-system`, and the client's branding if they provide it.
- The PDF build script's implementation details.
- How mockups are captured: live HTML in the page, or screenshots inserted.
