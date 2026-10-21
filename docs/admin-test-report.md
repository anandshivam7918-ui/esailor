# ESAILOR Admin Test Report

## Checks run

- Admin integration tests (`node --test tests/phase11-admin.test.js`): **16 passed, 0 failed** after the auth assertions, fail-closed configuration coverage, and Windows JSON file replacement were corrected.
- Full project test suite (`node --test --test-isolation=none`): **64 passed, 0 failed**. The ordinary `npm test` runner could not spawn test workers under the workspace sandbox (`EPERM`); the in-process run completed successfully with the required filesystem access.
- TypeScript check (`npx tsc --noEmit --incremental false`): **passed** after the UI restoration.
- Production build (`npm run build`): a prior build passed before this visual restoration. The latest build attempt could not open `.next/trace` (`EPERM`) while the local development server was running; no fresh production build result is available for the visual changes.
- Targeted ESLint on the changed auth/store/API/test files: **passed**.
- Targeted ESLint on the shared admin workbench and all rewired route pages: **0 errors**. The restored media preview uses a plain `<img>` and triggers Next.js's image optimization warning.
- Full lint (`npm run lint`): failed with remaining project-wide errors (**21 errors, 41 warnings**), including explicit `any` usage in the audit-log page/charts and unrelated components/configuration. Targeted lint on every changed file passes.

## Limits

Local HTTP verification using the configured credentials: admin login returned **200**; all eight core protected data APIs returned **200** with a session; an unauthenticated orders request returned **401**. Settings GET returned **200** without exposing secrets. A small test image uploaded with **201** and was deleted with **200**. No business records were changed during these checks. Production data persistence and shared media storage still need a durable backend and are documented in [admin-audit-report.md](./admin-audit-report.md).
