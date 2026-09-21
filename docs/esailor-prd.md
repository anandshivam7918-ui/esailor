# Product Requirements Document
## eSailor.in — Client Jute Bags B2B Website

**Status:** Draft v1 — based on confirmed scope decisions below
**Confirmed scope:** B2B only · Next.js · No online payments/checkout (enquiry & quote-based) · Client-managed catalog (admin/CMS required) · Deliverable = live production site

---

## 1. Problem Statement

The client currently has no digital presence that matches the scale and credibility of their manufacturing operation. Buyers evaluating jute bag suppliers today rely on directory-style listings (like Miraal) or generic PDF catalogues sent over email — both of which fail to establish trust quickly with international B2B buyers who are comparing multiple suppliers and cannot physically inspect product or facilities before committing.

**Who hurts:**
- **International/domestic bulk buyers** (importers, retailers, corporate gifting buyers) lose confidence when a supplier's online presence looks unpolished or provides no verifiable proof of certifications, capacity, or export experience — this lengthens sales cycles and loses deals to competitors like Vadalo Bags who present trust signals clearly upfront.
- **The client's sales team** wastes time manually re-sending catalogues, certification documents, and pricing indications over email/WhatsApp for every enquiry, because there's no self-serve way for a buyer to find this information.

**Why now:** Competitors (Vadalo, Jutify) have already built polished digital trust funnels. Without a comparable site, the client is losing the "first impression" battle before a human conversation even starts.

---

## 2. Target User + 2 Personas

**Target user:** B2B buyers sourcing jute bags/products in bulk — both international importers and domestic (India) bulk buyers. No individual/retail (D2C) shoppers in scope.

### Persona 1 — "Anna, the International Importer"
- Buyer for a mid-size European retail chain or eco-lifestyle brand
- Sources 5,000–50,000 units per order, evaluates 3–5 suppliers before shortlisting
- Cares most about: certifications (GOTS, OEKO-TEX, Sedex), export track record, sample process, and clear lead times
- Browses primarily on desktop during business hours; wants to self-serve as much information as possible before contacting sales
- Trigger to convert: a clear, credible "Request a Quote" path with visible MOQs and indicative pricing ranges

### Persona 2 — "Rajiv, the Domestic Bulk Buyer"
- Procurement lead at an Indian corporate (gifting), event company, or retail chain
- Orders 500–5,000 units, more price-sensitive, faster decision cycle than export buyers
- Cares most about: fast response time, ability to customize (branding/printing), payment terms in INR
- Often initiates contact via WhatsApp rather than a form
- Trigger to convert: a low-friction enquiry flow (WhatsApp CTA, simple form) and visible customization options

*(Flagging: these personas are inferred from the reference-site analysis and confirmed scope — the client should validate/refine names, order-size ranges, and specific pain points before final sign-off. See Open Questions #1.)*

---

## 3. Goals and Non-Goals

### Goals
- Establish credibility fast: certifications, export stats, and manufacturing scale visible within the first screen
- Give buyers a self-serve way to browse the full product catalog with specs (material, GSM, size, print/handle options) without needing to email for a basic catalogue
- Provide two clear, low-friction enquiry paths: a structured "Request Quote" form and a WhatsApp CTA with pre-filled context
- Let the client's team manage/update the product catalog themselves post-launch (no dev dependency)
- Reflect a premium, modern brand feel (per Jutify-style visual direction) while retaining B2B trust signals (per Vadalo-style credibility stack)

### Non-Goals (explicitly out of scope for this build)
- **No online payments or cart/checkout** — all orders are converted via manual quote → offline negotiation → offline payment, exactly as confirmed
- No D2C/retail shopping experience (single-unit purchases, personal checkout)
- No live/automated tax, duty, or freight calculation
- No multi-vendor/marketplace functionality — single client's own products only
- No native mobile app

---

## 4. User Stories

**Buyer-facing:**
- As an international buyer, I want to see the client's certifications and export stats immediately, so that I can quickly judge whether they're credible enough to shortlist.
- As a buyer, I want to browse products by category and filter by material/size/use-case, so that I can find relevant products without scrolling through everything.
- As a buyer, I want to see indicative pricing ranges or MOQs on product pages, so that I can self-qualify before reaching out.
- As a buyer, I want to submit a quote request with my requirements (product, quantity, customization) in one form, so that I don't have to explain everything over email from scratch.
- As a domestic buyer, I want a WhatsApp button that opens a chat with my product/interest pre-filled, so that I can get a fast response without filling a form.
- As a buyer, I want to see the manufacturing process and facility, so that I can trust the client's production capacity and quality control.
- As a buyer, I want to download a PDF catalogue/brochure, so that I can share it internally with my own decision-makers.

**Client/admin-facing:**
- As the client's team, I want to add, edit, or remove products and categories myself, so that I don't depend on a developer for routine catalog updates.
- As the client's team, I want to receive and view quote-request submissions in one place, so that I don't lose enquiries across email/WhatsApp.
- As the client's team, I want to update certification documents/badges when they're renewed or newly obtained, so that the site never shows outdated or false claims.

---

## 5. Feature List — MVP / v2 / Later

### MVP
- Homepage: hero, trust/certification bar, stats counters, featured categories, process teaser, CTA
- Full product catalog with category hierarchy, filters (material, size, use-case, print/handle type), and individual product detail pages
- Certifications & credibility page (ISO, GOTS, OEKO-TEX, Sedex, export stats, GSTIN/IEC visibility)
- Manufacturing/process page (visual sequence: raw material → spinning → weaving → stitching → QC)
- Quote Request form (multi-field: product, quantity, customization notes, buyer type, contact info)
- WhatsApp CTA with pre-filled message, present on product pages and floating on all pages
- Downloadable PDF catalogue/brochure
- Admin/CMS panel for the client's team: manage products, categories, certifications, and view submitted quote requests
- Basic contact/about page with company history and export experience
- Responsive design (desktop-first per B2B buyer behavior, but fully usable on mobile)

### v2
- Tiered/indicative pricing calculator (quantity → estimated FOB range) rather than fully manual quoting
- Buyer segmentation: separate "International Buyer" vs "India Buyer" landing paths with different MOQ/lead-time/payment-term info (Vadalo-style)
- Customer testimonials/case studies with buyer photos and countries
- Sample request workflow (distinct from full bulk quote)
- Multi-language support for key export markets
- Analytics dashboard for the client (enquiry volume, top-viewed products)

### Later
- Buyer portal/login (view quote history, saved products)
- Integration with client's ERP/inventory system for real-time stock visibility
- Automated freight/duty estimation
- Blog/content hub for SEO (sustainability, jute industry content)

---

## 6. Detailed Functional Requirements (MVP Features Only)

### 6.1 Product Catalog
- Products organized in a minimum 2-level category hierarchy (e.g. Jute Bags → Tote Bags, Jute Bags → Shopping Bags), mirroring the taxonomy depth seen on Miraal
- Each product has: name, category, description, material composition, GSM/weight, dimensions, available colors/prints, handle type, MOQ, images (min. 3 per product), and an optional indicative price range
- Filtering by category, material, and use-case; sorting not required for MVP
- Product detail page includes an "Enquire About This Product" CTA that pre-fills the Quote Request form

### 6.2 Quote Request Form
- Fields: name, company name, country, buyer type (international/domestic — informs internal routing), product(s) of interest, quantity, customization notes, email, phone
- On submit: confirmation message shown to buyer + email notification sent to client's sales inbox + record saved and viewable in admin panel
- Basic spam protection (e.g. honeypot field or CAPTCHA) — **flagged as needing a decision, see Open Questions #2**

### 6.3 WhatsApp CTA
- Persistent floating button (desktop + mobile) linking to WhatsApp with a pre-filled message including page/product context
- Separate WhatsApp numbers for international vs. domestic enquiries — **flagged, see Open Questions #3**

### 6.4 Certifications & Credibility Section
- Displays certification badges (image + name + issuing body), export stats (countries served, years in business, production capacity), and business registration numbers (GSTIN, IEC, MSME)
- Content and assets must be supplied and verified by the client before launch — placeholder/fake certification data must never go live

### 6.5 Admin/CMS Panel
- Role-based login for client's team (at least one admin role for MVP; multi-role permissions can be v2)
- CRUD for products, categories, and certification content
- Read-only list view of submitted quote requests with export-to-CSV
- Built on a headless CMS (e.g. Sanity, Strapi, or Payload) integrated with the Next.js frontend — **specific CMS choice flagged, see Open Questions #4**

### 6.6 Manufacturing/Process Page
- Visual step sequence (image or short video per stage) plus supporting copy on materials and quality control
- Depends entirely on the client providing usable photo/video assets — **flagged, see Open Questions #5**

---

## 7. Data Model Sketch

**Product**
- id, name, slug, categoryId, description, materialComposition, gsmWeight, dimensions, colorOptions[], printOptions[], handleType, moq, indicativePriceRange (min/max, currency), images[], isActive, createdAt, updatedAt

**Category**
- id, name, slug, parentCategoryId (nullable, for hierarchy), description, displayOrder

**QuoteRequest**
- id, buyerName, companyName, country, buyerType (enum: international/domestic), productIds[], quantity, customizationNotes, email, phone, status (enum: new/contacted/closed), createdAt

**Certification**
- id, name, issuingBody, badgeImage, description, dateObtained, expiryDate (nullable), isActive

**CompanyStat**
- id, label (e.g. "Countries Served"), value, displayOrder *(for homepage stat counters)*

**AdminUser**
- id, name, email, role (enum: admin/editor), passwordHash, lastLogin

*(Relationships: Product belongs to Category; Category can have a parent Category; QuoteRequest references one or more Products.)*

---

## 8. Edge Cases and Failure States

- **Quote form submitted with no product selected** — allow it (buyer may have a general enquiry), but flag internally as "general enquiry" rather than product-specific
- **Product has zero images uploaded** — show a placeholder image, never a broken image icon; admin panel should warn editors before publishing an image-less product
- **Certification with an expired `expiryDate`** — should not render on the live site automatically, or should visually flag as "renewal in progress" per client instruction (avoids the Vadalo-style ambiguity of unclear certification status)
- **Admin deletes a category that still has products assigned** — must be blocked or require reassignment first, not silently orphan products
- **WhatsApp link opens on desktop without WhatsApp Web configured** — provide a fallback (phone number + email) visible near the CTA
- **Quote request form submission fails (network/server error)** — show a clear retry message and do not lose the buyer's entered data on retry
- **Buyer on a slow connection loads a media-heavy homepage (parallax, cinematic video)** — must have a lightweight fallback (static image) so the page remains usable, not just visually impressive on fast connections
- **Duplicate quote requests from the same buyer in a short window** — should not be silently merged or dropped; sales team decides how to handle, but system must not lose either submission

---

## 9. Success Metrics

- **Quote request volume**: number of submitted quote requests per month post-launch (primary lead-generation metric)
- **WhatsApp CTA engagement**: click-through rate on WhatsApp CTA vs. form submissions (indicates which channel domestic vs. international buyers prefer)
- **Catalogue download rate**: PDF brochure downloads as a proxy for buyer research-stage engagement
- **Admin adoption**: whether the client's team is actively using the CMS to update products within the first 30 days post-launch (adoption failure here undermines the entire "client-managed catalog" goal)
- **Time-to-first-response** on quote requests (operational metric, not platform-controlled, but worth tracking to prove ROI)
- **Bounce rate on certifications/credibility page** — a proxy for whether the trust-building section is actually being read

*(Flagging: no baseline/target numbers have been set — see Open Questions #6.)*

---

## 10. Open Questions

1. **Personas** — The two personas above are inferred from reference-site analysis, not confirmed by the client. Need validation of actual buyer profiles, typical order sizes, and geographic focus.
2. **Spam protection on Quote Request form** — CAPTCHA (adds friction) vs. honeypot (invisible but less robust)? Needs a decision.
3. **WhatsApp routing** — One shared number for all enquiries, or separate numbers/teams for international vs. domestic buyers?
4. **CMS choice for admin panel** — Sanity, Strapi, Payload, or another headless CMS? Affects hosting cost and admin UX; needs a decision before backend work starts.
5. **Manufacturing/process page assets** — Does the client have usable photo/video of their facility and process today, or does this need a separate content production phase (and budget)?
6. **Success metric baselines/targets** — No current numbers exist to compare against (e.g. current monthly enquiry volume via email/WhatsApp). Needed to judge whether the new site is actually improving lead generation.
7. **Catalog size at launch** — Still not confirmed; affects whether initial product entry is done manually by the dev team or requires a bulk-import tool in the admin panel.
8. **Domain/hosting ownership** — Does the client already have a domain and hosting preference, or is eSailor provisioning this as part of the "live production site" deliverable?
9. **Certification verification process** — Who signs off that certification badges/claims shown on the site are current and accurate before launch, and on an ongoing basis?
10. **Post-launch support** — Is there a support/maintenance retainer after the "live production site" is handed off, or does the engagement end at launch?
