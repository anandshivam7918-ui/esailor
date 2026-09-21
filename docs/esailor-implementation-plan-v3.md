# eSailor.in Website Implementation Plan — v3 (Senior Dev Pass)

**Scope anchor:** B2B-only jute bags site. No cart/payments. Next.js + headless CMS. Client-managed catalog. Deliverable = live production site.

Legend: **Effort** S/M/L (rough relative size) · **Risk** Low/Med/High (impact if this goes wrong or is skipped) · 🚫 = hard blocker, do not proceed past this item until resolved.

---

## Phase 0: Blocking Decisions (resolve before any code is written)
**Effort: S · Risk: High — everything downstream depends on these**

- [x] 🚫 CMS platform chosen (Sanity / Strapi / Payload) — do not start Phase 2 until decided
- [x] 🚫 WhatsApp number routing decided: one shared number for MVP, or split international/domestic
- [x] 🚫 Spam-protection method for the Quote Request form decided: honeypot (default recommendation — zero friction) vs. CAPTCHA
- [x] 🚫 Domain/hosting ownership confirmed: client-provided or eSailor-provisioned
- [x] 🚫 Confirmed catalog size at launch (drives whether product entry is manual or needs a bulk-import step in Phase 3)
- [x] Email-notification service chosen for quote submissions (e.g. Resend, SendGrid, or client's existing mailbox via SMTP)

*If any 🚫 item is unresolved, timebox a decision using the PM's/your own best judgment, document the assumption in the repo README, and flag it to the client — do not silently block indefinitely.*

---

## Phase 1: Project Setup
**Effort: S · Risk: Low**

- [x] Initialize Next.js 14+ (App Router), TypeScript, Tailwind CSS
- [x] Configure ESLint + Prettier, Git repo, `.env.example` (include CMS keys, email-service key, analytics ID placeholders)
- [x] Folder structure: `/app`, `/components`, `/lib`, `/types`, `/styles`
- [x] Verify `npm run dev`, `npm run build`, type-check, and lint all pass on the empty scaffold

---

## Phase 2: CMS Content Modeling & Seed Data
**Effort: M · Risk: High — every page after this depends on the schema being right the first time**

- [x] Model schemas: `Product`, `Category` (parent/child, min. 2 levels), `Certification` (with `expiryDate` + `isActive`), `CompanyStat`, `QuoteRequest`, `AdminUser` (roles)
- [x] Wire up the CMS client in `/lib` (typed queries, not ad-hoc fetches scattered across pages)
- [x] Seed realistic sample data for every schema — enough to build real UI against, not lorem-ipsum placeholders
- [x] If catalog size (Phase 0) is large, build/import a bulk-import script now, not as an afterthought in Phase 12

---

## Phase 3: Design System (consolidated)
**Effort: M · Risk: Med**
> Collapses the original template's separate tooling phases (Superpowers, UI/UX Pro Max, MotionSites, Figma MCP) into one time-boxed pass. None of these were requested by the client — treat as optional accelerants, not required gates.
- [x] Typography, color, spacing, layout, and component tokens defined in Tailwind config — one PR, one review
- [ ] Motion language defined only if animation is actually planned for MVP sections (hero reveal, stat counters, filter transitions) — skip generic "motion foundation" work with no attached use case
- [x] Accessibility baseline (semantic HTML, focus states, contrast, heading hierarchy) built into the token system from the start, not audited later
- [ ] shadcn/ui initialized, components added individually as pages need them (not all upfront)
- **Skip unless already installed/available:** Superpowers workflow, Figma MCP, UI/UX Pro Max — these are general tooling, not project requirements. Document as "not used" and move on; do not spend cycles installing tooling nobody asked for.

---

## Phase 4: Global Components (single canonical build — no duplication)
**Effort: S · Risk: Med**
> This is the one place the WhatsApp CTA and PDF catalogue link get built. The homepage (Phase 5) *consumes* these components; it does not redefine them.
- [x] `Header` component: nav + WhatsApp CTA + PDF catalogue link — this is the canonical implementation
- [x] `WhatsAppCTA`: floating, persistent across all pages, pre-fills message with page/product context, uses the number(s) decided in Phase 0
- [x] Fallback contact (phone/email) rendered next to the WhatsApp CTA
- [x] `Footer` component: nav, contact info, social, certifications mini-badge row
- [x] PDF catalogue download component (points to a static asset for MVP; regenerating it dynamically is a v2 concern, not MVP)

---

## Phase 5: Homepage
**Effort: M · Risk: Low**
- [x] Sections: Hero, Trust bar, Stats, Featured categories, Process teaser, Footer — **reuses** `Header`/`Footer` from Phase 4, does not reimplement them
- [x] Pulls real data from CMS (stats, featured categories) — no hardcoded content
- [ ] Playwright visual QA across mobile/tablet/desktop before moving on

---

## Phase 6: Catalog & Product Detail Pages
**Effort: M · Risk: Med**
- [x] Catalog page: category/material/use-case filters, product grid, drawer filters on mobile
- [x] Product detail page: image gallery, spec table, "Enquire About This Product" CTA that pre-fills the Quote Request form (product ID passed via query param or state)
- [x] Functional test: filter combinations return correct CMS-backed results (not just a visual screenshot)

---

## Phase 7: Certifications Page
**Effort: S · Risk: High (compliance, not just UI)**
- [x] Certification grid reads `isActive` + `expiryDate` from CMS — an expired or inactive certification must never render as current
- [x] 🚫 **Launch gate:** do not populate this page with real certification claims until the client has provided verifying documentation for each one. Placeholder/unverified certifications must not reach Phase 11 (Content Population), let alone production.
- [x] Unit test on the expiry logic itself — this is business logic, not a visual concern, and a Playwright screenshot will not catch a stale badge rendering as "active"

---

## Phase 8: Manufacturing Process Page
**Effort: S · Risk: Med**
- [x] Launch with stock imagery for now (client facility photo/video ready to swap upon delivery)
- [x] Vertical step layout on mobile, horizontal on desktop

---

## Phase 9: About & Contact Pages
**Effort: S · Risk: Low**
- [x] About: company history, export experience, location
- [x] Contact: address, phone, email, links to WhatsApp CTA (reuses Phase 4 component)

---

## Phase 10: Quote Request Form
**Effort: M · Risk: High — this is the site's core conversion mechanism**
- [x] Fields: name, company, country, buyer type, product(s), quantity, customization notes, email, phone
- [x] Spam protection implemented per the Phase 0 decision
- [x] On submit: confirmation shown to buyer, record saved to CMS, **and** email sent to the client's sales inbox via the service chosen in Phase 0
- [x] Failure handling: network/server error shows a retry option without losing entered field data
- [x] **Functional/integration test, not just visual QA:** submit a real test request end-to-end and confirm (a) CMS record created, (b) email received, (c) confirmation shown to user

---

## Phase 11: Admin CMS / Dashboard
**Effort: M · Risk: Med**
- [x] Auth (admin role minimum for MVP)
- [x] CRUD for products, categories, certizations
- [x] Quote request list view with **CSV export** (explicit PRD requirement)
- [x] Safeguard: block category deletion while products are still assigned to it
- [x] Safeguard: warn editor before publishing a product with zero images
- [x] **Functional test, not just visual QA:** full CRUD cycle + CSV export produces a valid, correctly-formatted file

---

## Phase 12: Content Population
**Effort: M · Risk: High**
- [x] Load final client-approved product catalog
- [x] 🚫 Load certification content **only after** the Phase 7 verification gate is satisfied
- [x] Load final company stats, manufacturing media, about/contact details
- [x] Client reviews populated content against a written checklist (see Acceptance Criteria below) — not an informal "looks good" nod


---

## Phase 13: QA & Consistency Audit
**Effort: S · Risk: Low**
- [x] Typography/spacing/component/visual-language consistency pass across all pages
- [x] Full engineering audit: build/type/lint clean, no exposed secrets, no console errors, no unused dependencies
- [x] SEO pass: per-page metadata, sitemap.xml, robots.txt, image alt text, Open Graph tags


---

## Phase 14: Staging Deployment & Client Review **[NEW — closes the acceptance gap]**
**Effort: S · Risk: High — this is the step v2 skipped entirely**
- [ ] Deploy to a staging URL (e.g. Vercel preview) with populated, real content — not local-only
- [ ] Client reviews staging against the **written acceptance checklist** below and signs off in writing (email/message thread, not verbal)
- [ ] Any change requests from this review are logged and fixed before proceeding to Phase 15 — do not deploy to production with open change requests

**Acceptance checklist (what "sign-off" actually checks):**
1. All MVP pages present and populated with real, client-approved content (no lorem ipsum, no stock placeholder images)
2. Every certification shown has a verified, unexpired source document on file
3. Quote Request form successfully delivers a test enquiry to the client's actual sales inbox
4. WhatsApp CTA opens a chat with the client's actual business number
5. Site is usable and looks intentional (not just "not broken") on a real mobile device, not just a resized browser window
6. Client's admin user can log in and successfully add/edit a product themselves, unassisted

---

## Phase 15: Production Deployment & Handoff
**Effort: S · Risk: Med**
- [ ] Point production domain (Phase 0 decision) at the app, SSL configured
- [ ] Production environment variables set securely (never committed)
- [ ] Post-deployment smoke test: homepage, catalog, product detail, quote form end-to-end, admin login — all verified live, not just on staging
- [ ] Client's team trained on the CMS/admin panel (screen-share or recorded walkthrough)
- [ ] Post-launch support/maintenance arrangement confirmed and documented in writing

---

## Phase 16: Final Sign-Off
**Effort: S · Risk: Low (by this point, risk should already be retired)**
- [ ] Client confirms production site matches the Phase 14 acceptance checklist, now verified live
- [ ] Project marked complete; open items (if any) logged as a v2 backlog, not silently dropped

---

## What changed from v2 and why
1. **Blocking decisions moved to Phase 0**, explicit and gated with 🚫 — CMS choice, WhatsApp routing, spam protection, domain ownership, and catalog size no longer sit buried as checkboxes mid-plan.
2. **WhatsApp CTA and PDF catalogue now have exactly one canonical build location** (Phase 4), consumed everywhere else — no more duplicate definition between "global components" and "homepage."
3. **CMS modeling moved immediately before design/build work** (Phase 2, right after setup) instead of sitting 10 phases away from where it's first used.
4. **Non-essential tooling phases (Superpowers, Figma MCP, UI/UX Pro Max, MotionSites) collapsed into one optional, time-boxed line** in Phase 3 — they were never requested and shouldn't consume separate phases/attention.
5. **Effort and risk tags added per phase** so the team (and client) can see where the real cost and exposure sits, instead of every phase reading as equally weighted.
6. **Certification verification is now a hard launch gate (🚫)**, not just a UI safeguard — an unverified certification cannot reach Content Population, let alone production.
7. **Staging deployment + written acceptance checklist added as Phase 14** — v2 jumped straight from local QA to "final sign-off" with no defined criteria; this closes that gap directly.
8. **Functional/integration tests called out explicitly** wherever a Playwright screenshot can't catch the actual failure mode (certification expiry logic, CSV export, quote-form email delivery).