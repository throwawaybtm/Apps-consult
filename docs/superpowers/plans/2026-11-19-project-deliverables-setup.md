# Project Deliverables Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up this repo so every client project can go from research to a PRD, a guidebook PDF and a dev handbook, the same way each time.

**Architecture:** A repo-level `CLAUDE.md` tells every future session the workflow and its rules. Section checklists in `docs/checklists/` say what each document must cover; they are not templates. Two small Node tools do the mechanical parts: `tools/new-project.cjs` creates a project's folders, and `tools/build-pdf.cjs` prints a guidebook's HTML to an A4 PDF with the preinstalled Playwright Chromium.

**Tech Stack:** Node 22 (CommonJS `.cjs`, because the preinstalled Playwright resolves through `require`), `node:test`, Playwright Chromium (preinstalled; never run `playwright install`), Markdown.

**Spec:** `docs/superpowers/specs/2026-11-19-project-deliverables-design.md`

## Global Constraints

- Three documents per project: `prd.md` (Indonesian), the guidebook (Indonesian, HTML → PDF), and `dev-handbook.md` (English). `agent-kit/` files are in English.
- Technical terms (API, login, dashboard) are left untranslated in the Indonesian documents.
- The guidebook contains **no pricing**; the price goes in a separate quote.
- Every feature in the guidebook and the dev handbook must exist in the PRD. Scope changes go into the PRD first.
- No reusable fill-in templates. Checklists list required sections only.
- Quality bars: Modern Web Guidance at **Baseline Widely available**; **WCAG 2.2 AA**; Core Web Vitals "good" (**LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**); **OWASP Top 10** checklist plus `/security-review` on every change.
- Free first: Firebase on **Spark** (Auth, Firestore, Hosting), **GAS** as the server-side layer, and **Drive** for storage. Anything that needs a billing account requires a written reason plus the client's approval.
- Every GAS endpoint verifies the caller's Firebase identity, and Drive files are never served as public links.
- Five human checkpoints: PRD approved, stack and architecture approved, secrets/payments/personal data, production deploy, final security and accessibility sign-off.
- PDF: **A4**, backgrounds printed, fonts embedded and supporting Indonesian text.
- Project folder names: lowercase letters, digits and single hyphens only (`^[a-z0-9]+(-[a-z0-9]+)*$`).

## Review Focus

1. **The guidebook references local images and fonts in `assets/`** → they must render in the PDF, not show as broken. Test: `buildPdf renders a relative asset` (Task 3).
2. **The PDF is printed before web fonts finish loading** → text falls back to the wrong font. The builder waits for `document.fonts.ready`. Test: `buildPdf embeds fonts` (Task 3).
3. **Wrong or missing input path** → a clear error and exit code 1, not a stack trace or an empty PDF. Test: `buildPdf rejects a missing input` (Task 3).
4. **Re-running new-project with an existing name** → refuse and leave the existing research untouched. Test: `createProject refuses an existing project` (Task 2).
5. **Project name with spaces or capitals ("Toko Budi")** → rejected, with the rule stated in the error. Test: `createProject rejects invalid names` (Task 2).

---

### Task 1: Workflow rules and section checklists

**Files:**
- Create: `CLAUDE.md`
- Create: `projects/README.md`
- Create: `docs/checklists/prd.md`
- Create: `docs/checklists/guidebook.md`
- Create: `docs/checklists/dev-handbook.md`
- Create: `docs/checklists/agent-kit.md`

**Interfaces:**
- Produces: the checklist paths above, which `CLAUDE.md` and `projects/README.md` link to; and the commands `npm run new-project -- <name>` and `npm run build:pdf -- <input.html> [output.pdf]`, which Tasks 2 and 3 implement.

- [ ] **Step 1: Write `CLAUDE.md`** (English, under ~80 lines). It must state:
  - what the repo is for
  - the flow `research/ → prd.md → (client approves) → guidebook + dev-handbook.md → agent-kit/`
  - the language per document
  - every line of Global Constraints
  - the five checkpoints, with an instruction to **stop and ask** at each one
  - which skills to use: `superpowers:brainstorming` for a new project; `modern-web-guidance`, `frontend-design` and `website-design:web-design-system` for the guidebook's look and mockups; `design:accessibility-review`; `/security-review`; the `researcher` subagent for lookups
  - the two npm commands
  - a link to the spec

- [ ] **Step 2: Write `projects/README.md`** (English, short). Explain one folder per project, its layout (copied from the spec's "Repo layout"), how to start a project (`npm run new-project -- <name>`), and the order the documents are written in.

- [ ] **Step 3: Write the four checklists** (English). Each one is a checkbox list of required sections, copied from the spec's section for that document, with one line per item saying what "covered" means.
  - `prd.md`: problem and goals; users; numbered features; requirements per feature; **out of scope**; testable acceptance criteria per feature; success measures; constraints (budget, timeline, platform, legal); open questions; an approval section with the client's name and date. Note the Indonesian language rule and the target of about 3–5 pages.
  - `guidebook.md`: the client's problem; the solution; key-screen mockups; the user flow diagram; included and not included (from the PRD); timeline and phases; what the client provides; next steps. Include "no pricing; mention that a separate quote follows" and "every feature shown appears in the PRD".
  - `dev-handbook.md`: the stack decision record (driving requirements, options, choice, trade-offs, free-tier limits that matter, what happens when they are outgrown); architecture with a diagram; data model; API design; auth and authorisation; security design; performance targets; testing strategy; environments and deployment; local setup. Plus the GAS-specific items from the spec: identity check, run-as account and its Drive reach, quota handling, file size limits, no public Drive links.
  - `agent-kit.md`: `CLAUDE.md` (stack, commands, conventions, folder structure, never-do rules, the five checkpoints); one `specs/<feature>.md` per PRD feature, with acceptance tests mapped to PRD criteria; `build-order.md` with dependencies and the check between stages; the quality targets with the exact values from Global Constraints.

- [ ] **Step 4: Verify coverage.** For each document section in the spec, find its line in the matching checklist; there must be no gaps. Run `grep -c "^- \[ \]" docs/checklists/*.md`. Expected: every file reports a count of 8 or more.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md projects/README.md docs/checklists
git commit -m "docs: add workflow rules and per-document section checklists"
```

---

### Task 2: Project folder creator

**Files:**
- Create: `package.json`
- Create: `tools/new-project.cjs`
- Test: `tools/new-project.test.cjs`

**Interfaces:**
- Produces: `createProject(name: string, rootDir?: string = "projects"): string`, which returns the created project's path. It creates `<root>/<name>/research/`, `<root>/<name>/guidebook/assets/` and `<root>/<name>/agent-kit/specs/`, each with a `.gitkeep`, and no document files.
- Produces: a CLI `node tools/new-project.cjs <name>` that prints the path on success, or prints the error message and exits 1.
- Produces: `package.json` scripts: `"test": "node --test tools/*.test.cjs"`, `"new-project": "node tools/new-project.cjs"`, `"build:pdf": "node tools/build-pdf.cjs"`. Use `"private": true` and no dependencies.

- [ ] **Step 1: Write the failing tests** in `tools/new-project.test.cjs`, using a temp dir from `fs.mkdtempSync(os.tmpdir() + "/np-")` as `rootDir`:
  - `createProject creates the folder layout`: the three dirs exist, each `.gitkeep` exists, and the return value equals `path.join(root, "toko-budi")`.
  - `createProject rejects invalid names`: `"Toko Budi"`, `"toko_budi"`, `"-toko"` and `""` each throw, and the error message includes `lowercase letters, digits and single hyphens`.
  - `createProject refuses an existing project`: create `toko-budi`, write `research/notes.md`, then call it again. It throws with a message including `already exists`, and `notes.md` is unchanged.

- [ ] **Step 2: Run** `npm test`. Expected: FAIL (`Cannot find module './new-project.cjs'`).

- [ ] **Step 3: Implement `createProject` and the CLI** in `tools/new-project.cjs`. Validate the name against `^[a-z0-9]+(-[a-z0-9]+)*$`, check for an existing folder before creating anything, then create the dirs with `fs.mkdirSync(..., { recursive: true })`. Export `{ createProject }`, and run the CLI only when `require.main === module`.

- [ ] **Step 4: Run** `npm test`. Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json tools/new-project.cjs tools/new-project.test.cjs
git commit -m "feat: add new-project folder creator"
```

---

### Task 3: Guidebook PDF builder

**Files:**
- Create: `tools/build-pdf.cjs`
- Test: `tools/build-pdf.test.cjs`
- Create: `tools/fixtures/sample-guidebook/guidebook.html`
- Create: `tools/fixtures/sample-guidebook/assets/dot.svg`

**Interfaces:**
- Consumes: the `build:pdf` script from Task 2's `package.json`.
- Produces: `buildPdf(inputHtml: string, outputPdf?: string): Promise<string>`, which resolves to the absolute output path. `outputPdf` defaults to the input path with `.pdf` replacing `.html`.
- Produces: a CLI `node tools/build-pdf.cjs <input.html> [output.pdf]` that prints the output path, or prints the error message and exits 1.

- [ ] **Step 1: Create the fixture.** `guidebook.html` has `lang="id"`, an Indonesian heading and paragraph (for example "Panduan Aplikasi — Ringkasan untuk Klien"), CSS `font-family: "Inter"`, and `<img src="assets/dot.svg" id="dot">`. `dot.svg` is a 10×10 filled circle.

- [ ] **Step 2: Write the failing tests** in `tools/build-pdf.test.cjs`, writing outputs to a temp dir:
  - `buildPdf writes an A4 PDF`: the file starts with `%PDF-`. Its first `/MediaBox [0 0 W H]` match has `593 < W < 597` and `840 < H < 844`.
  - `buildPdf embeds fonts`: the PDF bytes, read as `latin1`, match `/\/FontFile[23]?\b/`.
  - `buildPdf renders a relative asset`: before printing, the test can't see inside the PDF, so instead also export `checkAssets(inputHtml: string): Promise<string[]>`, which returns the `src` of every `<img>` whose `naturalWidth === 0`. For the fixture, assert the result equals `[]`. `buildPdf` must call it and throw `Broken assets: <list>` when the list isn't empty.
  - `buildPdf rejects a missing input`: `buildPdf("nope.html")` rejects with a message including `Input not found`.
  - `buildPdf defaults the output path`: it is called without `outputPdf` on a temp copy of the fixture dir, and resolves to the same path with a `.pdf` extension.

- [ ] **Step 3: Run** `npm test`. Expected: the new tests FAIL (`Cannot find module './build-pdf.cjs'`).

- [ ] **Step 4: Implement `buildPdf`, `checkAssets` and the CLI** in `tools/build-pdf.cjs`:
  - `const { chromium } = require("playwright")`, then `chromium.launch()` with no options.
  - `page.goto(pathToFileURL(abs).href, { waitUntil: "load" })`, then `page.evaluate(() => document.fonts.ready)`.
  - `page.pdf({ path, format: "A4", printBackground: true, preferCSSPageSize: true })`.
  - Check the input exists before launching the browser. Close the browser in a `finally` block. Export `{ buildPdf, checkAssets }`.

- [ ] **Step 5: Run** `npm test`. Expected: all tests PASS (3 from Task 2, 5 here).

- [ ] **Step 6: Manual check.** Run `npm run build:pdf -- tools/fixtures/sample-guidebook/guidebook.html /tmp/sample.pdf`, then look at the first page as an image (for example `pdftoppm -png -r 60 -f 1 -l 1`, or a Playwright screenshot if that tool is missing). Expected: the Indonesian text appears in Inter, and the dot is visible.

- [ ] **Step 7: Commit**

```bash
git add tools/build-pdf.cjs tools/build-pdf.test.cjs tools/fixtures
git commit -m "feat: add A4 guidebook PDF builder"
```

---

### Task 4: End-to-end check and push

**Files:**
- Modify: none, unless a check fails.

- [ ] **Step 1:** Run `npm test`. Expected: 8 tests pass, 0 fail.
- [ ] **Step 2:** Run `npm run new-project -- smoke-test`, then `npm run build:pdf -- tools/fixtures/sample-guidebook/guidebook.html projects/smoke-test/guidebook/guidebook.pdf`. Expected: both print paths and exit 0. Then delete `projects/smoke-test`, since it must not be committed.
- [ ] **Step 3:** Run `git status --short`. Expected: clean, with no PDFs or `smoke-test` left.
- [ ] **Step 4:** Push with `git push -u origin claude/relaxed-heisenberg-5wahqz`.
