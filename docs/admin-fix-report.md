# ESAILOR Admin Repair Report

## Changes made

- Removed built-in admin credential and signing-secret fallbacks. Credentials and signing key must come from environment configuration; login fails closed if they are absent or the signing key is too short.
- Added timing-safe comparisons and session validation for configured username, role, and expiration.
- Added admin-session checks to dashboard stats, orders, production, inventory, and site-content GET handlers.
- Hardened JSON reads/writes so corrupt files and persistence failures are reported instead of silently falling back or claiming success. Cache data is updated only after successful persistence.
- Added a Windows-compatible replacement fallback for JSON store writes after the platform rejects `rename()` over an existing file.
- Added validation for order status, production status/progress, and nonnegative inventory quantities. Serialized inventory read-modify-write operations within a single process.
- Corrected admin auth integration assertions to use distinct negative-test credentials and assert the configured test account in the session.
- Replaced mock-only products, enquiries, quotes, orders, production, inventory, certifications, website-content, customers, reports, media, and settings routes with a shared API workbench. It reads protected APIs, shows real errors/empty states, and supplies the supported update/create/delete actions with confirmation for destructive operations.
- Restored the workbench to the existing warm admin palette, blue action buttons, white rounded panels, and page-specific presentations for certifications, website content, reports, media, and settings while keeping the protected API handlers and mutations.
- Derived customers and report totals from saved quote requests, orders, and products. Environment secrets are not exposed or editable in the UI.
- Added protected media listing/upload/delete endpoints with file type and size limits and generated filenames, plus a protected settings status endpoint that reports configuration booleans without returning secret values. Added uploaded media folder to `.gitignore`.

## Files changed

- `src/lib/admin-auth.js`
- `src/lib/admin-store.js`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/dashboard-stats/route.ts`
- `src/app/api/admin/inventory/route.ts`
- `src/app/api/admin/orders/route.ts`
- `src/app/api/admin/production/route.ts`
- `src/app/api/admin/site-content/route.ts`
- `tests/phase11-admin.test.js`
- `src/components/admin/AdminDataWorkbench.tsx`
- The twelve admin route pages listed in the audit report

The UI audit findings and outstanding workflow gaps are in [admin-audit-report.md](./admin-audit-report.md). This change does not create a shared database/object store or a canonical customer CRM.
