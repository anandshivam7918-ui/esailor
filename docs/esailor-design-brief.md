# Design Brief
## eSailor.in — Client Jute Bags B2B Website

**Based on:** PRD v1 (B2B-only, Next.js, no cart/payments, client-managed CMS, live production deliverable)
**Audience for this document:** design + frontend team, before any code is written

---

## 1. Design Principles

Three rules, and why each one is non-negotiable for this specific product:

1. **Proof before persuasion.** Every screen must put a verifiable credibility signal (registration, stat, export number) above or beside the persuasive copy, never below it. B2B buyers comparing multiple exporters (per PRD Persona 1, "Anna") make shortlist decisions in seconds based on trust signals, not adjectives. A hero that leads with a tagline and buries the RCMC/IEC/GST/Udyam registrations below the fold loses the buyer before they scroll.

2. **Every visual choice must earn its place against a "so a buyer can act" test.** No decorative animation, gradient, or illustration exists unless it helps a buyer either understand a product spec or move toward a quote request. This product has no browsing-for-fun use case — unlike a D2C site, a bored scroll is not a success state here. If a design element doesn't reduce time-to-decision or time-to-enquiry, cut it.

3. **The interface must read as industrial-premium, not fashion-premium.** Jutify's aesthetic (lifestyle/fashion-brand tone) is a reference for naming and heritage storytelling — but a B2B buyer sourcing 10,000 units is evaluating a *manufacturer*, not shopping a boutique. Visual weight, material texture, and photography must communicate production scale and craftsmanship, not seasonal fashion. This rules out trend-driven UI patterns (soft pastel gradients, rounded "app-like" playfulness) in favor of restrained, material-led design.

---

## 2. Visual Direction

**Mood:** Grounded, tactile, quietly confident. Think "a well-run export house's flagship showroom," not "a D2C startup's landing page." Warm, earthy, natural materials rendered with studio-quality photography — the product itself (woven jute texture, natural fiber color variation) should do most of the visual work.

**References and what to take from each:**
- **Vadalo Bags** — take the *information density discipline*: certifications, GSTIN/IEC, and stats are never more than one scroll away from any CTA. Do not take its visual execution (too corporate-flat, competing CTAs).
- **Jutify** — take the *restraint and breathing room* in layout, and the collection-naming convention as a content pattern (not a visual pattern). Do not take its low information density on certifications — this product needs Jutify's calm layout with Vadalo's proof density layered in.
- **Miraal Jute Exports** — take *nothing visually*. Use only as a reference for how deep the product taxonomy needs to go.

**What to explicitly avoid** (all called out in the reviewed implementation plan, and worth repeating as design law, not just a dev checklist):
- Purple/blue SaaS gradients — signals generic tech product, undermines the "manufacturer of a natural material" positioning
- Glassmorphism, floating blobs, oversized decorative typography — reads as trend-chasing, undermines trust with a conservative B2B buyer
- Stock photography of hands touching fabric or generic "handshake" business imagery — the client has (or will have) real facility photography; use it or use nothing
- Centered-hero-plus-gradient-CTA template — this is the single most recognizable "generic AI-generated site" pattern; the asymmetric hero specified in the implementation plan is correct and should be treated as a hard requirement, not a nice-to-have

---

## 3. Design Tokens

### Color Palette
Earth-toned, natural-fiber-inspired, with a single warm accent — deliberately avoiding "tech blue" to reinforce a materials-first, craftsmanship brand.

| Token | Hex | Usage | Why |
|---|---|---|---|
| `background` | `#FAF7F2` | Page background | Warm off-white (raw cotton/jute tone), not clinical pure white — softer, more tactile first impression |
| `foreground` | `#2A241C` | Primary text | Warm near-black (espresso/dark jute fiber), never pure black — keeps the whole palette in the same warm family |
| `surface` | `#FFFFFF` | Cards, product tiles | Pure white reserved for contained content areas only, so it reads as "surface," not "page" |
| `surface-muted` | `#F0EBE1` | Section backgrounds, alternating rows | Subtle separation without hard borders |
| `border` | `#DDD4C4` | Dividers, input borders | Warm gray-beige, never cool gray — cool grays clash with the earth palette and read as generic SaaS |
| `primary` | `#5C4A32` | Primary buttons, key headings | Deep jute-brown — the brand's "manufacturer" color; used sparingly so it retains weight |
| `secondary` | `#8A9A5B` | Secondary actions, tags | Muted olive/natural-fiber green — evokes raw jute plant without going "eco-startup green" |
| `accent` | `#C17F42` | Highlights, active states, stat numbers | Warm terracotta/sand — the one color allowed to draw the eye; overuse dilutes its power |
| `success` | `#4A7A5E` | Confirmation states (quote submitted) | Muted forest green, consistent with the earth palette rather than a bright system-green |
| `warning` | `#B8863B` | Form validation warnings | Amber-ochre, stays in-family instead of a jarring yellow |
| `error` | `#A94D3F` | Form errors, expired-certification flags | Muted brick-red — visible but not alarmist |

*Rationale note: no blue anywhere in the core palette. Blue is the single most "default AI/SaaS" signal in B2B web design right now, and this product's entire differentiation is that it's a materials manufacturer, not a software company.*

### Type Scale
**Display/Heading: DM Serif Display** — a high-contrast serif with visible ink-trap character, used at large sizes (H1/H2 only). Chosen because its craftsmanship-era feel signals heritage and manufacturing pedigree without tipping into the delicate, fashion-editorial register a lighter serif (like Playfair) can read as — this product needs to feel *sturdy*, not elegant-fragile.

**Body/UI: Manrope** — a geometric sans with excellent legibility at small sizes and a slightly warm, humanist character (unlike colder grotesques such as Inter). Used for all body copy, labels, buttons, and data-dense areas (spec tables, filters).

*Note: this reconciles a discrepancy with the earlier implementation-plan draft, which specified Playfair Display + Source Sans Pro. DM Serif Display + Manrope was the direction actually agreed with the client during the reference-site review — flag this to the dev team before Phase 3 (Design System) so the token file matches what's been client-approved.*

| Style | Font | Size | Line height | Weight | Usage |
|---|---|---|---|---|---|
| Display | DM Serif Display | 48–64px | 1.1 | 400 | Hero headline only |
| H1 | DM Serif Display | 36px | 1.2 | 400 | Page titles |
| H2 | DM Serif Display | 28px | 1.25 | 400 | Section headings |
| H3 | Manrope | 20px | 1.3 | 700 | Card titles, sub-sections |
| Body | Manrope | 16px | 1.6 | 400 | Paragraph text |
| Small | Manrope | 14px | 1.5 | 400 | Captions, form hints |
| Label | Manrope | 13px | 1.4 | 600 (uppercase, tracked) | Filter labels, spec table keys |

### Spacing Scale
Base unit: **4px**, scaling at 4/8/12/16/24/32/48/64/96px.
Why a 4px (not 8px) base: this product has data-dense areas (spec tables, filter panels) where an 8px-only scale forces awkward compromises between "too tight" and "too loose." The finer base gives room for a 12px or 20px value where an 8px system would round up and waste space.

### Radius
| Element | Radius | Why |
|---|---|---|
| Buttons | 4px | Near-square, deliberately restrained — signals "industrial," not "app-like" |
| Cards / product tiles | 8px | Slightly softer for content containers, still restrained |
| Input fields | 4px | Matches button radius for visual consistency in forms |
| Badges/tags | 999px (pill) | The one rounded exception — pills read as "metadata," distinct from containers |

*Avoid the generic 12–16px "everything is a rounded card" look called out in Phase 10 of the implementation plan — a manufacturer's site should feel more structured/architectural than a consumer app.*

### Shadows
Used only for elevation hierarchy, never decoration.
- `shadow-sm`: `0 1px 2px rgba(42,36,28,0.06)` — resting cards
- `shadow-md`: `0 4px 12px rgba(42,36,28,0.10)` — hover state on product tiles, dropdowns
- `shadow-lg`: `0 12px 32px rgba(42,36,28,0.14)` — modals, the floating WhatsApp CTA

---

## 4. Screen Inventory

| Screen | Purpose |
|---|---|
| Homepage | Establish credibility fast, orient buyer to product range, drive toward catalog or quote |
| Product Catalog | Let a buyer browse/filter the full range self-serve |
| Product Detail | Give enough spec detail for a buyer to self-qualify and trigger a quote request |
| Certifications & Credibility | Prove trust claims with verifiable badges, stats, and registration numbers |
| Manufacturing/Process | Demonstrate production scale and quality control |
| About | Company history and export track record |
| Contact | Direct contact paths for buyers who don't want to use a form |
| Quote Request | Capture structured buyer requirements and convert interest into a sales lead |
| Admin Dashboard | Client's internal entry point to manage content |
| Admin: Product/Category Management | CRUD for catalog content |
| Admin: Quote Requests | View and export submitted enquiries |
| Admin: Certifications Management | Manage certification content and expiry status |

---

## 5. User Flows

### Flow A — International buyer evaluating suppliers (Persona: "Anna")
1. Lands on Homepage (via search/referral) → sees hero + trust bar within first viewport
2. Scans certifications/stats → decides the company is credible enough to continue
3. Navigates to Product Catalog → filters by material/use-case
4. Opens a Product Detail page → reviews specs, MOQ, indicative price range
5. Clicks "Enquire About This Product" → Quote Request form pre-filled with product context
6. Fills buyer details, quantity, customization notes → submits
7. Sees confirmation screen → (offline) receives a follow-up from the client's sales team

### Flow B — Domestic bulk buyer, low-friction path (Persona: "Rajiv")
1. Lands on a Product Detail or Category page (often via WhatsApp-shared link)
2. Skims specs briefly — less certification-scrutiny than Flow A
3. Taps the persistent WhatsApp CTA → opens WhatsApp with a pre-filled message referencing the product
4. Continues the conversation entirely outside the site

### Flow C — Client admin managing the catalog
1. Logs into Admin Dashboard
2. Navigates to Product Management → adds/edits a product (fills schema fields, uploads images)
3. System warns if publishing with zero images (blocks or flags before save)
4. Publishes → product appears live on Catalog page within the CMS's revalidation window

### Flow D — Client admin handling an incoming quote request
1. Receives email notification of a new Quote Request
2. Logs into Admin Dashboard → Quote Requests list
3. Reviews buyer details and requested products
4. Exports list to CSV (for batch follow-up) or contacts buyer directly

---

## 6. Per-Screen Layout

### Homepage
- **Hero:** Asymmetric split — headline + primary CTA ("Explore Products" / "Request a Quote") on one side, large product photography on the other. Primary action: drive to Catalog or Quote Request.
- **Trust bar:** Horizontal row of certification badges + key stats (countries served, years in operation), placed immediately below the hero fold — not buried lower on the page (Principle 1).
- **Featured categories:** 3–4 category tiles with photography, linking into filtered Catalog views.
- **Process teaser:** Short visual sequence + "See Our Process" link to the Manufacturing page.
- **Footer:** Navigation, contact info, certifications mini-row repeated (reinforces trust at the exit point of the page too).
- Components used: `Header`, `Hero`, `TrustBar`, `StatCounter`, `CategoryGrid`, `ProcessTeaser`, `Footer`.

### Product Catalog
- **Layout:** Filter panel (left on desktop, drawer on mobile) + product grid. Not a generic sidebar — filter panel uses the accent color for active filter chips so applied filters are always visually obvious.
- **Primary action:** Click into a product (leads to Product Detail).
- Components: `FilterPanel`, `FilterChip`, `ProductGrid`, `ProductCard`.

### Product Detail
- **Layout:** Image gallery left/top, spec table + CTA right/below. Image-led on desktop (buyers need to assess material quality visually), stacked with images first on mobile.
- **Primary action:** "Enquire About This Product" button — highest visual weight on the page, uses `accent` color, sticky on mobile scroll.
- Components: `ImageGallery`, `SpecTable`, `QuoteCTAButton`, `RelatedProducts` (optional, v2-leaning if time allows).

### Certifications Page
- **Layout:** Editorial grid, not a generic icon wall — each certification gets its own card with badge, issuing body, and a one-line explanation of what it verifies (a badge alone means nothing to a first-time buyer).
- Components: `CertificationCard`, `StatCounter`, `ProcessSection` (shared with Manufacturing page).

### Manufacturing/Process Page
- **Layout:** Vertical stepped timeline (mobile) / horizontal stepped timeline (desktop), each step with photography/video and a short caption.
- Components: `ProcessStep`, `CapacityStat`.

### About Page
- **Layout:** Narrative-led, single column, generous line length control (max ~65ch) for readability — this page is read, not scanned.
- Components: standard `RichText` block, `StatCounter` reused for export-experience numbers.

### Contact Page
- **Layout:** Two-column — contact details/CTA block left, embedded map (optional) right; collapses to stacked on mobile.
- Components: `ContactCard`, `WhatsAppCTA` (reused), optional `MapEmbed`.

### Quote Request Form
- **Layout:** Progressive disclosure — Step 1: product/quantity, Step 2: customization notes, Step 3: contact details + submit. Avoids a single overwhelming wall of fields (per PRD requirement).
- **Primary action:** "Submit Request" on the final step — disabled until required fields validate.
- Components: `FormStepper`, `ProductSelector`, `QuantityInput`, `CustomizationTextarea`, `ContactFields`, `SubmitButton`, `ConfirmationState`.

### Admin Dashboard
- **Layout:** Sidebar nav (desktop) collapsing to top nav (mobile/tablet) — Products, Categories, Certifications, Quote Requests.
- Components: `AdminSidebar`, `DataTable`, `AdminFormFields`.

---

## 7. Component Library

| Component | Variants | States |
|---|---|---|
| `Button` | primary, secondary, text/tertiary, icon-only (WhatsApp) | default, hover, active, disabled, loading |
| `Input` | text, number, textarea, select | default, focus, error, disabled |
| `ProductCard` | grid (catalog), featured (homepage) | default, hover (image zoom + shadow-md) |
| `FilterChip` | default, active | default, active/selected, removable |
| `CertificationCard` | active, expired-hidden (never rendered if inactive) | default, hover |
| `StatCounter` | default, compact (footer) | static, animated-on-scroll-into-view |
| `WhatsAppCTA` | floating (global), inline (page-embedded) | default, hover |
| `Modal` | confirmation, form-step (if used) | opening, open, closing |
| `Badge/Tag` | material, category, status | default |
| `DataTable` (admin) | products, categories, quote requests | default, empty, loading, error |
| `FormStepper` | 3-step (quote form) | active step, completed step, upcoming step |
| `Toast/Alert` | success, error, warning | entering, visible, exiting |

---

## 8. States (Empty / Loading / Error / Success / Offline)

| Screen | Empty | Loading | Error | Success | Offline |
|---|---|---|---|---|---|
| Product Catalog | "No products match these filters" + a clear "Reset filters" action — never a blank grid with no explanation | Skeleton grid (matches card layout, not a generic spinner) | "Couldn't load products" + retry button | N/A (browsing has no discrete success state) | Cached last-viewed catalog if feasible; otherwise a clear offline message, not a silent blank page |
| Product Detail | N/A (page shouldn't be reachable if product doesn't exist — 404 instead) | Skeleton for gallery + spec table | "Product unavailable" fallback with link back to Catalog | N/A | Show cached content if previously visited |
| Quote Request Form | N/A | Submit button shows inline spinner, fields disabled during submission | Inline error banner above the form: "Something went wrong — your details are saved, please retry" (never clear the form on error) | Confirmation screen: "Request received — [Company] will contact you within [X] business days" | Detect offline before submit attempt; block submission with a clear message rather than letting it silently fail |
| Certifications Page | If no active certifications exist yet (pre-launch data gap), show nothing rather than a broken empty grid — this page should not go live until populated | Skeleton cards | Fallback: hide the section rather than show a broken state (certifications failing to load must never look like "no certifications exist") | N/A | Cached content acceptable — low update frequency |
| Admin: Product Management | "No products yet — add your first product" with a prominent CTA | Table skeleton rows | Inline error per failed row action, not a full-page crash | Toast: "Product saved" | Admin tools require connectivity — show a clear "you're offline" banner, disable editing actions |
| Admin: Quote Requests | "No quote requests yet" | Table skeleton rows | Retry action per failed load | Toast on successful CSV export | Same as above — disable actions, clear messaging |

---

## 9. Responsive Behaviour

**Breakpoints:** Mobile ~320–480px · Tablet ~768–1024px · Desktop ~1280px+ · Large desktop ~1440px+

- **Navigation:** Full nav bar (desktop) → hamburger/drawer (tablet and mobile). WhatsApp CTA remains persistently visible at all breakpoints — it is the primary low-friction conversion path for the domestic buyer persona and must never be hidden inside a collapsed menu.
- **Homepage hero:** Asymmetric two-column (desktop) → stacked, image-first (mobile) — image first on mobile because product photography is the fastest trust signal on a small screen where copy takes longer to scan.
- **Catalog filters:** Persistent side panel (desktop) → bottom drawer triggered by a "Filters" button (mobile) — a collapsed accordion at the top of a mobile catalog page pushes products too far down the scroll.
- **Product Detail:** Side-by-side gallery/specs (desktop) → stacked, gallery first (mobile), with the CTA button becoming sticky at the bottom of the viewport on mobile so it's always reachable without scrolling back up.
- **Quote Request form:** Multi-column field layout (desktop, where space allows) → single-column stacked (mobile) — never compress to multi-column on mobile, this is a data-entry task and column-switching increases error rates.
- **Admin dashboard:** Sidebar (desktop/tablet landscape) → top nav with a menu button (mobile) — full admin functionality should remain usable on mobile since the client may check quote requests on the go, but data-table-heavy screens (product management) should recommend desktop for bulk edits rather than force a broken mobile table experience.
- **Touch targets:** Minimum 44×44px for all interactive elements on mobile/tablet, including filter chips and admin table row actions.

---

## 10. Accessibility

- **Contrast ratios:** All text/background pairings in the token palette above meet WCAG AA (4.5:1 for body text, 3:1 for large text/headings). `foreground` (#2A241C) on `background` (#FAF7F2) and on `surface` (#FFFFFF) both clear AA comfortably; `accent` (#C17F42) is used only for large text, icons, and non-text UI elements (never small body text) since it sits closer to the AA boundary on light backgrounds — verify with a contrast checker during token implementation, not assumed from the hex values alone.
- **Focus order:** Logical DOM order matching visual order on every page — header nav → main content → footer, with no positive `tabindex` values used anywhere. The floating WhatsApp CTA should sit last in tab order on each page (it's a persistent utility, not primary content) but must still be reachable via keyboard.
- **Keyboard navigation:** All interactive elements (filters, product cards, form fields, admin table actions) reachable and operable via keyboard alone. Filter chips must be togglable with Enter/Space, not just click. The multi-step Quote Request form must allow keyboard-only progression through steps, with a visible focus indicator on the active step.
- **Visible focus states:** A consistent, high-contrast focus ring (using `accent` color at full opacity) on every interactive element — never rely on browser defaults alone, and never suppress `:focus` styles without providing a custom replacement.
- **Form labels & errors:** Every input has a visible, associated `<label>` (not placeholder-as-label). Error messages are programmatically associated with their field via `aria-describedby`, not just visually adjacent.
- **ARIA needs:**
  - `FilterChip` and toggle-style controls: `aria-pressed` state
  - `Modal` components: `role="dialog"`, `aria-modal="true"`, focus trapped inside while open, focus returned to the triggering element on close
  - `Toast/Alert`: `role="status"` (success) or `role="alert"` (errors) so screen readers announce them without requiring focus
  - `FormStepper`: current step announced via `aria-current="step"`
  - Certification badges: descriptive `alt` text naming the certification, not just "badge icon"
  - `StatCounter` animated numbers: ensure the final value is present in the DOM/accessible name even before animation completes, so screen readers don't announce "0" or a mid-animation value
- **Reduced motion:** All scroll-triggered reveals, stat-counter animations, and hover transitions respect `prefers-reduced-motion: reduce` — provide the end-state immediately rather than skipping the content entirely.
- **Heading hierarchy:** One `<h1>` per page (page title), logical H2/H3 nesting per section — the Certifications and Manufacturing pages in particular must not skip levels for visual-size reasons (e.g. using an `<h4>` because it "looks right" where an `<h3>` is semantically correct).
