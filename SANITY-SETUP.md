# Sanity CMS Setup for eSailor.in

This document explains how to set up and use Sanity CMS with the eSailor.in Next.js project.

## 📋 Overview

The eSailor.in project uses Sanity as a headless CMS to manage:
- Product catalog (with categories and subcategories)
- Certifications and credibility badges
- Company statistics (for homepage counters)
- Quote requests (from customers)
- Admin user profiles

## 🔧 Environment Setup

The Sanity connection is configured via environment variables in `.env`:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="6zj8mzj6"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your_sanity_api_token_here"
NEXT_PUBLIC_SANITY_API_VERSION="2026-09-18"
```

> **Note**: The `.env.example` file contains a template. Copy it to `.env` and replace the placeholder values with your actual Sanity credentials.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Test Sanity Connection

```bash
npm run sanity:connect
```

This will verify that your Sanity credentials are correct and that you can connect to the CMS.

### 3. Start Sanity Studio

```bash
npm run sanity:studio
```

This will start the Sanity Studio interface at `http://localhost:3333` (or the port shown in the terminal).

### 4. Seed Initial Data (Optional)

To populate the CMS with sample data:

```bash
npm run sanity:seed
```

This will create sample categories, products, certifications, company statistics, and quote requests.

> **Note**: Images need to be uploaded separately through Sanity Studio. The seed data creates document records but does not attach actual image files.

## 📁 Project Structure

### Sanity Schemas
- `sanity/schemas/category.js` - Category hierarchy (parent/child)
- `sanity/schemas/product.js` - Product catalog with variants and pricing
- `sanity/schemas/certification.js` - Certifications with expiry dates
- `sanity/schemas/companyStat.js` - Homepage statistics counters
- `sanity/schemas/quoteRequest.js` - Customer quote requests
- `sanity/schemas/adminUser.js` - Admin user profiles (auth handled by Sanity)

### Sanity Client
- `src/lib/sanity.js` - Configured Sanity client with helper functions

### Seed Data
- `seed-data/` - Sample data files used for seeding
- `scripts/seed-data.js` - Script to import sample data to Sanity

## 🛠️ Development Workflow

### Fetching Data in Next.js Components

```javascript
import {sanityClient} from '@/src/lib/sanity'

// Get all active products
const products = await sanityClient.fetch(`
  *[_type == "product" && isActive == true] | order(name asc) {
    _id,
    name,
    slug,
    materialComposition,
    gsmWeight,
    moq,
    indicativePriceRangeMin,
    indicativePriceRangeMax,
    "category": category->name,
    images[0] {
      ...,
      "url": urlFor().image().url()
    }
  }
`)
```

### Image URL Helper

```javascript
import {urlFor} from '@/src/lib/sanity'

// Get image URL for any Sanity image asset
const imageUrl = urlFor(productImage).width(800).url()
```

## 📝 Important Notes

1. **Image Handling**: Images uploaded to Sanity need to be referenced by their asset ID. The seed data creates product records but does not attach actual images - you'll need to upload images through Sanity Studio and update the product documents.

2. **Authentication**: Admin access is handled through Sanity's built-in authentication system at `https://[your-project-id].sanity.studio`. Use the email and password associated with your Sanity account.

3. **Schema Updates**: If you modify the schema files, you may need to redeploy or restart the Sanity Studio for changes to take effect.

4. **Production Deployment**: When deploying to Vercel, make sure to add the Sanity environment variables to your Vercel project settings.

## 🔗 Useful Links

- Sanity Project: https://sanity.io/manage
- Sanity Documentation: https://www.sanity.io/docs
- Sanity Studio (your project): https://6zj8mzj6.sanity.studio

## 🐛 Troubleshooting

### Connection Issues
- Double-check your `.env` file matches the format in `.env.example`
- Ensure your Sanity API token has the correct permissions
- Verify your project ID and dataset name are correct

### Schema Validation Errors
- Check that all required fields are present in your documents
- Ensure reference fields point to valid document types
- Look at the Sanity Studio console for detailed error messages

### Image Upload Issues
- Make sure image files are in supported formats (JPG, PNG, WebP, etc.)
- Check file size limits in your Sanity plan