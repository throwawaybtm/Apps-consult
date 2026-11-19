# Dev handbook checklist

Language: **English**. Audience: a human reviewer, tech lead or auditor. It is also the source the agent kit is generated from.

- [ ] **Stack decision record** (first section):
  - the requirements that drive the choice, with PRD F-numbers;
  - the options considered;
  - the choice and its trade-offs;
  - the free-tier limits that matter (Firestore daily reads and writes, Hosting bandwidth, GAS quotas, Drive's 15 GB per account shared with Gmail);
  - what happens when those limits are outgrown: name the problem and propose the cheapest fix (for example a free image service that needs no card for image-heavy public apps, or Firebase Storage on Blaze with budget alerts once the client agrees to pay).
  - Free first: Firebase on Spark, plus GAS and Drive. Anything needing a billing account needs a written reason and client approval.
- [ ] **Architecture:** frontend, backend (GAS), data and integrations, with a diagram.
- [ ] **Data model:** collections or tables, fields, relationships and indexes.
- [ ] **API design:** every endpoint or function, its inputs and outputs, and its errors.
- [ ] **Authentication and authorisation:** how users sign in, the roles, and who can read or write what (including Firestore security rules).
- [ ] **Security design:** an OWASP Top 10 walk-through for this app, how secrets are handled, and how personal data is handled.
- [ ] **Performance targets:** Core Web Vitals "good" (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1), and how they are measured.
- [ ] **Testing strategy:** unit, integration and end-to-end tests, plus accessibility (WCAG 2.2 AA) and security checks.
- [ ] **Environments and deployment:** dev and prod, how to deploy, and rollback.
- [ ] **Local setup:** how to run the project from a fresh clone.
- [ ] **If GAS and Drive are used:**
  - how each GAS endpoint verifies the caller's Firebase identity (never an open endpoint);
  - the account the script runs as, and what that account can reach in Drive (use the client's own Google account where possible, so the files and storage quota belong to them);
  - how it stays within GAS limits (6 minutes per execution, about 30 simultaneous executions per user, quotas that can change);
  - file size limits;
  - how files are served (never as public Drive links).
- [ ] **Matches the PRD:** every feature references its PRD F-number, and nothing is added outside the PRD.
