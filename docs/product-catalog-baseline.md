# Product Catalog Baseline Audit

## Existing data flow

- Admin product reads and CRUD mutations use the protected `/api/admin/products` route and `src/lib/admin-store.js`; records are persisted in `data/products.json`, with `seed-data/products.js` used when that file is absent. Categories follow the same JSON-plus-seed pattern.
- Public catalog and category pages query Sanity directly first, then fall back to the local store only when Sanity returns no records or errors. Product detail also queries Sanity first and then falls back to local records. A Sanity mutation token is configured in the local environment, while no Sanity schema definitions or mutations exist in this repository.
- The homepage popular products and featured category cards are hardcoded arrays. Thus admin JSON edits are not reliably reflected on public Sanity-backed pages or homepage cards.

## Product workflow gaps

- The admin page delegates to the generic workbench. Add asks only for a name and creates a draft; edit changes only the name. It has no category selector, full product form, SKU, structured commercial/SEO data, or gallery workflow.
- The existing media API stores uploaded images locally under `public/admin-media`; it is not wired to product create/edit. The admin table serializes category objects instead of showing the category label.
- The product store generates slugs without checking collisions, fills several omitted fields with fixed defaults, and does not validate category references or numeric ranges. Delete physically removes products without checking historical references.
- Public Sanity GROQ filters use `isActive != false`, which does not consistently enforce the explicit publication status. The local detail fallback can also return a Draft if legacy `isActive` data is missing.

## Safe implementation direction

Use the already configured Sanity dataset as the authoritative product and category source when it contains categories. If its category collection is empty, use the existing local catalog as one consistent source for admin and public pages until Sanity categories are configured. Sanity request failures must surface as errors rather than silently switching sources. Route admin mutations and all public product consumers through shared server-side catalog accessors, enforce publication eligibility in those accessors, and invalidate the affected Next.js routes after mutations. Preserve existing Sanity and local product identifiers and do not run a bulk migration.
