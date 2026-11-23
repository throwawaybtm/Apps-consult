# Projects

One folder per client project. Create it with:

```bash
npm run new-project -- <name>
```

Names use lowercase letters, digits and single hyphens (for example `toko-budi`).

## Layout

```
projects/
  <project-name>/
    research/            findings, sources, notes
    prd.md
    guidebook/
      guidebook.html     source
      assets/            images, fonts, mockup screenshots
      guidebook.pdf      built output
    video/               optional Remotion demo video (src/, out/)
    dev-handbook.md
    agent-kit/           CLAUDE.md, specs/, build-order.md (copied into the app repo at build time)
```

## Order

1. **research/**: collect findings and sources.
2. **prd.md** (Indonesian): the client approves it before anything else. Checklist: `docs/checklists/prd.md`.
3. **guidebook/** (Indonesian, HTML → PDF with `npm run build:pdf -- projects/<name>/guidebook/guidebook.html`). Checklist: `docs/checklists/guidebook.md`.
4. **dev-handbook.md** (English), opening with the stack decision record. Checklist: `docs/checklists/dev-handbook.md`.
5. **agent-kit/** (English), generated from the dev handbook. Checklist: `docs/checklists/agent-kit.md`.

Every feature in steps 3–5 must exist in the PRD. Change scope in the PRD first.
