# Agent kit checklist

Language: **English**. These files go in `projects/<name>/agent-kit/` and are copied into the app's code repo when building starts. Claude Code follows them literally, so be exact.

- [ ] **`CLAUDE.md`:** stack and versions, install/dev/test/build/deploy commands, coding conventions, folder structure, and "never do" rules (no secrets in code, no public Drive links, no open GAS endpoints, no paid services without approval).
- [ ] **Checkpoints in `CLAUDE.md`:** stop and ask at each of the five human checkpoints (PRD approved; stack and architecture approved; secrets, payments or personal data; production deploy; final security and accessibility sign-off).
- [ ] **`specs/<feature>.md`:** one per PRD feature, named with its F-number (for example `specs/F1-login.md`).
- [ ] **Acceptance tests per spec:** each test maps to a PRD acceptance criterion and is written so it can be automated.
- [ ] **`build-order.md`:** the order features are built in, their dependencies, and the check that must pass between stages.
- [ ] **Quality targets** applied to every feature:
  - Modern Web Guidance at Baseline Widely available;
  - WCAG 2.2 AA;
  - Core Web Vitals "good" (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1);
  - an OWASP Top 10 checklist, plus `/security-review` on every change.
- [ ] **Traceability:** every spec traces to a PRD feature, and every PRD feature has a spec.
- [ ] **Free-first stack:** the same as the dev handbook's stack decision record. No service appears that the record didn't approve.
