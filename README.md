# eSailor.in - Phase 0 Assumptions

As per the implementation plan v3, Phase 0 requires resolving several blocking decisions before any code can be written. The following assumptions have been made to allow progress while awaiting client confirmation.

## Phase 0 Blocking Decisions - Assumptions Made

### 1. CMS Platform Chosen
**Assumption:** Sanity  
**Reasoning:** Sanity is a hosted headless CMS with excellent TypeScript support, real-time collaboration features, and generous free tier. It pairs naturally with Vercel hosting (both frontend and CMS can be Vercel-deployed), eliminating the need for separate server infrastructure. The admin UI is polished and suitable for non-technical content editors.  
**Note:** If the client prefers Strapi or Payload, this assumption should be corrected before Phase 2 (CMS Content Modeling).

### 2. WhatsApp Number Routing
**Assumption:** One shared number for MVP  
**Reasoning:** Starting with a single WhatsApp number simplifies initial implementation and infrastructure. Routing can be split into international/domestic numbers in a future phase if business needs dictate.  
**Note:** Confirm with client if separate numbers are required from launch.

### 3. Spam Protection for Quote Request Form
**Assumption:** Honeypot technique  
**Reasoning:** The implementation plan recommends honeypot as the default (zero friction). This provides basic spam protection without impacting user experience. CAPTCHA can be implemented later if spam becomes an issue.  
**Note:** This follows the explicit recommendation in the plan.

### 4. Domain/Hosting Ownership
**Assumption:** eSailor-provisioned (Vercel hosting for Next.js frontend; Sanity CMS hosted on Sanity's infrastructure)  
**Reasoning:** Sanity is a hosted CMS where the Studio typically deploys to sanity.studio subdomain or embeds as a route inside the Next.js app. The frontend (Next.js app) will be hosted on Vercel. This provides a unified deployment experience without infrastructure mismatch. The deliverable is a "live production site," so assuming eSailor provisions hosting ensures we can proceed with deployment planning. Client may provide existing domain/hosting later.  
**Note:** Confirm if client has existing domain/hosting preferences.

### 5. Confirmed Catalog Size at Launch
**Assumption:** Small-to-medium catalog (20-50 products) suitable for manual entry via admin CMS  
**Reasoning:** Without confirmed size, we assume a manageable number that doesn't require bulk-import tools initially. The CMS will be built to support larger catalogs, and import functionality can be added in Phase 3 if needed.  
**Note:** If catalog size is large (>100 products), a bulk-import step should be added in Phase 3.

### 6. Email Notification Service for Quote Submissions
**Assumption:** Resend  
**Reasoning:** Resend is developer-friendly, has excellent TypeScript SDK, offers a generous free tier, and integrates smoothly with Next.js applications.  
**Note:** If client has existing SMTP preferences (SendGrid, etc.), this should be adjusted.

## Next Steps

These assumptions allow us to proceed to Phase 1 (Project Setup). The client should review and confirm or correct these assumptions before we complete Phase 1 to avoid rework.

All assumptions should be revisited and validated with the client during the Phase 14 (Staging Deployment & Client Review) acceptance checklist.

---
*Documented as part of Phase 0 completion, 2026-09-18*