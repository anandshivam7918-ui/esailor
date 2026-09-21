# eSailor.in Staging Deployment Guide

This document outlines the process for deploying the eSailor.in website to a staging environment for client review, as specified in Phase 14 of the implementation plan.

## Overview

Staging deployment allows the client to review the website with real content in a production-like environment before final production deployment. This closes the gap that existed in v2 of the plan, which jumped straight from local QA to "final sign-off" without defined criteria.

## Prerequisites

Before deploying to staging, ensure:

1. **Local Development Environment**
   - Node.js 20.x+
   - Git
   - Vercel CLI (`npm i -g vercel`)

2. **Sanity CMS Setup**
   - Sanity project configured with project ID: `6zj8mzj6`
   - Dataset: `production`
   - Sanity API token with appropriate permissions (configured in Vercel env vars)
   - Content seeded with real, client-approved data (not lorem ipsum or placeholders)

3. **Environment Variables**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=6zj8mzj6`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-18`
   - `SANITY_API_TOKEN` (Sanity API token with read/write permissions)
   - `RESEND_API_KEY` (for email notifications)
   - Optional: `NEXT_PUBLIC_GA_ID` (Google Analytics ID)

## Deployment Process

### Step 1: Prepare Content in Sanity CMS

1. Ensure all content is populated with real, client-approved data:
   - Products (with real images, specifications, pricing)
   - Categories (proper hierarchy)
   - Certifications (with verified documents)
   - Company statistics
   - About/Contact/Process page content

2. Verify content accuracy:
   - No lorem ipsum text
   - No stock placeholder images (use real product/facility images)
   - Certification documents verified and unexpired
   - All links functional

### Step 2: Deploy to Vercel Staging

#### Option A: Using Vercel CLI (Recommended for Preview Deployments)

```bash
# Login to Vercel (if not already logged in)
vercel login

# Link the project to Vercel (first time only)
vercel link

# Deploy to staging (creates a preview deployment)
vercel --prod=false
```

#### Option B: Git-Based Deployment (for Preview Branches)

1. Push feature branch to GitHub/GitLab/Bitbucket
2. Vercel automatically creates a preview deployment
3. Share the preview URL with the client

#### Option C: Manual Vercel Dashboard Deployment

1. Go to vercel.com/dashboard
2. Click "New Project"
3. Import the eSailor repository
4. Configure environment variables
5. Deploy

### Step 3: Verify Staging Deployment

After deployment, verify:

1. **Deployment Success**
   - Check Vercel deployment logs for errors
   - Confirm all routes are accessible
   - Verify no build-time errors

2. **Content Verification**
   - Homepage shows real stats, featured categories
   - Product catalog shows real products with accurate data
   - Certifications page displays real certifications
   - All images load properly (no broken image icons)

3. **Functionality Check**
   - Navigation works across all pages
   - Forms submit correctly (test with safe data)
   - WhatsApp CTA opens correct pre-filled chat
   - PDF catalogue download works

### Step 4: Client Review Process

1. Share the staging URL with the client
2. Provide the written acceptance checklist (see ACCEPTANCE_CHECKLIST.md)
3. Schedule a review session (video call or in-person)
4. Client reviews against the checklist and provides feedback
5. Log all change requests in CHANGE_REQUEST_LOG.md
6. Fix all requested changes before proceeding to production

### Step 5: Change Request Management

1. For each change request:
   - Create a detailed entry in CHANGE_REQUEST_LOG.md
   - Prioritize fixes based on impact
   - Implement fixes in a feature branch
   - Test locally
   - Deploy updated version to staging (same URL)
   - Have client re-verify the fix
   - Mark as resolved in the change log

### Step 6: Sign-off and Production Preparation

Once all checklist items are verified and change requests resolved:

1. Obtain written sign-off from client (email/message thread)
2. Tag the commit that corresponds to the approved staging version
3. Prepare for Phase 15: Production Deployment & Handoff

## Rollback Procedure

If issues are discovered after client review:

1. In Vercel dashboard, go to the project's "Deployments" tab
2. Select a previous successful deployment
3. Click "..." → "Promote to Production" (for staging) or "Redeploy"
4. Notify client of rollback and reason

## Best Practices

1. **Environment Separation**
   - Use separate environment variables for staging vs production
   - Never commit `.env` files to git
   - Use Vercel's environment variable settings UI

2. **Content Safety**
   - Never deploy unverified certification content to staging
   - Use content staging in Sanity if available for risky updates

3. **Performance**
   - Enable Vercel's speed insights for performance monitoring
   - Check Lighthouse scores in staging before client review

4. **Security**
   - Ensure Sanity API token has least-privilege permissions
   - Rotate tokens periodically
   - Use environment variable secrets, not hardcoded values

## Troubleshooting

### Common Deployment Issues

| Issue | Solution |
|-------|----------|
| Build fails due to missing env vars | Verify all required env vars are set in Vercel project settings |
| Sanity API errors | Check SANITY_API_TOKEN permissions and validity |
| Image loading issues | Verify images are uploaded to Sanity and referenced correctly |
| Form submission failures | Check RESEND_API_KEY and email service configuration |
| Routing errors | Verify next.config.ts and file system routing |

### Getting Help

1. Check Vercel deployment logs: `vercel logs [deployment-url]`
2. Review Sanity API tokens and permissions
3. Consult the TROUBLESHOOTING section in SANITY-SETUP.md
4. Verify local build works: `npm run build && npm start`

## References

- Implementation Plan v3: esailor-implementation-plan-v3.md
- Sanity Setup: SANITY-SETUP.md
- Environment Variables: .env.example
- Acceptance Criteria: ACCEPTANCE_CHECKLIST.md
- Change Request Process: CHANGE_REQUEST_LOG.md