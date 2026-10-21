# ESAILOR Admin Panel Audit

## Scope

Reviewed the local admin routes, shared layout/navigation, API handlers, authentication, JSON data store, and admin store operations. This report describes the checked tree and does not claim that UI flows were browser-tested.

## Route inventory

| Route | Data/workflow found | Audit result |
| --- | --- | --- |
| `/admin` | Dashboard stats API plus sample trend and production content | Partially live; trend/upcoming rows remain sample data |
| `/admin/products` | Loads protected products API; add draft, rename, and delete actions | Connected to API; full product field editing remains limited |
| `/admin/enquiries`, `/admin/quotes` | Loads protected quote-request API; advances status, deletes with confirmation, exports CSV | Connected to API |
| `/admin/orders` | Loads protected orders API; create and advance status | Connected to API |
| `/admin/customers` | Groups saved quote requests into customer records | Derived, read-only view; no canonical customer store |
| `/admin/production` | Loads protected production API; update progress | Connected to API |
| `/admin/inventory` | Loads protected inventory API; update quantity | Connected to API |
| `/admin/certifications` | Loads protected certification API; add, activate/deactivate, delete | Connected to API; editing all certification fields remains limited |
| `/admin/website-content` | Loads protected site-content API; edit content section JSON | Connected to API |
| `/admin/media` | Lists, uploads, and deletes bounded image files | Works on local filesystem; shared persistent storage is not configured |
| `/admin/reports` | Calculates totals from saved orders, enquiries, and products | Live summary; no date filtering or downloadable report yet |
| `/admin/settings` | Explains environment-managed configuration | No settings persistence API; secrets are not exposed in the UI |
| `/admin/audit-log` | Audit log API | Live and protected |

These record pages now use the shared API workbench. The global admin search, date selection, dashboard trend chart, and notification affordances are still not backed by complete search/report/notification workflows. Some product and certification fields have only basic controls; the workbench makes existing operations available without claiming full field-level editing.

## Security and data findings

- The admin auth implementation previously contained fallback credentials and a fallback session secret. It now reads only `ADMIN_USER`, `ADMIN_PASSWORD`, and `SESSION_SECRET`, and refuses authentication unless all are configured and the session secret is at least 32 characters.
- Admin credentials were absent in the initial audit. The local ignored `.env` is now configured with the username/password supplied by the project owner and a generated session secret. Production hosting still needs its own secret configuration.
- Previously unauthenticated admin GET endpoints exposed dashboard totals, orders, production, inventory, and site content. Those GET handlers now require a valid admin session. All listed admin data handlers are session-gated.
- Admin JSON persistence previously updated the in-memory copy before disk persistence and hid write failures. It now only updates the cache after persistence, reports failures, rejects invalid JSON rather than replacing it with seed data, and uses a per-file lock for inventory quantity updates.
- JSON files on the application filesystem are not a suitable shared durable store for multi-instance/serverless production. A persistent database/CMS adapter is needed for those deployment modes; this repair surfaces local filesystem failures instead of reporting false success.
- Local inventory locking is process-local. Multiple Node processes can still race; use a transactional shared store before multi-instance use.
- Product/category/certification and quote APIs have protected CRUD coverage. The admin record pages are connected to protected APIs. Customers are derived from enquiries, reports are summary totals, and media uses instance-local filesystem storage; these are not substitutes for a canonical CRM, full reporting service, or shared object storage.

## Remaining manual review

1. Configure production admin secrets through the hosting provider's secret manager.
2. Choose and configure a durable shared data backend before production writes or multi-instance deployment.
3. Configure shared persistent media storage before production uploads. Add date filtering/export and a canonical customer workflow if those are required.
4. Perform authenticated browser acceptance tests across every route and form.
