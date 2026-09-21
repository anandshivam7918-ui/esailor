# eSailor.in Staging Acceptance Checklist

This is the written acceptance checklist that clients must review and sign off on during Phase 14: Staging Deployment & Client Review. As specified in the implementation plan v3, this checklist closes the acceptance gap that existed in v2.

**Important**: Sign-off must be done in writing (email/message thread, not verbal). Do not proceed to Phase 15 (Production Deployment) without written client sign-off on this checklist.

## Review Instructions

1. Access the staging URL provided by the development team
2. Review each item below on both desktop and mobile devices
3. Test functionality as indicated
4. Provide written feedback for any items that do not meet criteria
5. Do not mark items as complete unless they fully satisfy the requirements
6. Provide sign-off via email or message thread confirming all items are satisfied

## Acceptance Checklist

### 1. Content Verification
☐ **All MVP pages present and populated with real, client-approved content**
   - Homepage: Hero section, trust bar, stats counters, featured categories, process teaser, CTA sections all show real content
   - Catalog page: Shows real products from CMS (not lorem ipsum or placeholder data)
   - Product detail pages: Show real product specifications, images, pricing
   - Certifications page: Shows real certification documents provided by client
   - Manufacturing/Process page: Shows real facility images/video or approved stock imagery
   - About page: Shows real company history and export experience
   - Contact page: Shows real contact information
   - Footer: Shows real contact info, social links, certifications

   *Verification Method*: Visual inspection - confirm no "Lorem ipsum", "placeholder", or "sample text" is visible

### 2. Certification Integrity
☐ **Every certification shown has a verified, unexpired source document on file**
   - Each certification badge displayed has a corresponding verified document (PDF/scan) on file
   - No expired certifications are displayed as current
   - Certification issuing bodies are legitimate and verifiable
   - Certification dates match the source documents

   *Verification Method*: Development team provides source documents for visual comparison

### 3. Quote Request Form Functionality
☐ **Quote Request form successfully delivers a test enquiry to the client's actual sales inbox**
   - Form submits successfully with test data
   - Test submission appears in Sanity CMS as a QuoteRequest document
   - Test submission triggers email to client's actual sales inbox (not a test/dummy address)
   - Email contains all submitted form data
   - User sees confirmation message after submission
   - Form preserves data on submission error (network/server failure)

   *Verification Method*: Submit test form and verify receipt in both CMS and email inbox

### 4. WhatsApp CTA Functionality
☐ **WhatsApp CTA opens a chat with the client's actual business number**
   - WhatsApp button/floating CTA uses the client's approved business WhatsApp number
   - Clicking opens WhatsApp (web or app) with pre-filled message
   - Pre-filled message includes relevant context (page/product information)
   - Fallback contact information (phone/email) displays correctly when WhatsApp unavailable
   - WhatsApp number matches what client provided in Phase 0 decisions

   *Verification Method*: Click WhatsApp CTA and verify it opens correct chat with pre-filled message

### 5. Mobile Usability
☐ **Site is usable and looks intentional (not just "not broken") on a real mobile device**
   - All pages load correctly on actual iOS and Android devices (not just browser resize)
   - Navigation is accessible and functional on touch screens
   - Text is readable without zooming (minimum 16px base font size)
   - Touch targets are appropriately sized (minimum 44x44dp)
   - Forms are easy to complete on mobile keyboards
   - Images load properly and don't break layout
   - No horizontal scrolling required
   - Page transitions and animations work smoothly on mobile
   - Load times are acceptable on mobile networks (test with 3G/4G simulation if needed)

   *Verification Method*: Test on actual mobile devices, not just Chrome devtools device simulation

### 6. Admin/CMS Functionality
☐ **Client's admin user can log in and successfully add/edit a product themselves, unassisted**
   - Admin user can log in to Sanity Studio using provided credentials
   - Admin interface loads without errors
   - Admin can create a new product:
     * Fill in all required fields
     * Upload product images
     * Select appropriate category
     * Save/publish the product
   - Admin can edit an existing product:
     * Locate product in content list
     * Edit fields
     * Upload new images
     * Save changes
   - Admin can view published changes on the frontend website
   - No developer assistance required for basic CRUD operations

   *Verification Method*: Client performs these tasks independently during review session

## Change Request Process

If any items above cannot be marked as complete:

1. Document each deficiency in the Change Request Log (CHANGE_REQUEST_LOG.md)
2. Provide specific details:
   - Page/section affected
   - Description of issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or screen recordings (if helpful)
3. Development team will address each change request
4. After fixes are deployed to staging, client will re-verify the specific items
5. Only when all checklist items can be marked as complete should written sign-off be provided

## Sign-off Format

Provide written sign-off using this format:

```
eSailor.in Staging Acceptance - Sign-off

Project: eSailor.in Website
Staging URL: [insert URL]
Review Date: [insert date]
Reviewer: [client name/representative]

I have reviewed the staging deployment against the written acceptance checklist above and confirm that all items are satisfied. I authorize proceeding to Phase 15: Production Deployment & Handoff.

[Signature/Typed Name]
[Title/Position]
[Date]
```

Submit this sign-off via email or message thread to the development team lead.

---
*This checklist is part of Phase 14 in the eSailor.in Website Implementation Plan v3, designed to ensure quality client-reviewed staging before production deployment.*