import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Checking environment:');
console.log('  PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'set' : 'not set');
console.log('  DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET ? 'set' : 'not set');
console.log('  SANITY_API_TOKEN:', process.env.SANITY_API_TOKEN ? 'set' : 'not set');

import {sanityClient} from '../src/lib/sanity.js'
import {categories as rawCategories, juteBagChildCategories, toteBagChildCategories} from '../seed-data/categories.js'
import {products} from '../seed-data/products.js'
import {certifications} from '../seed-data/certifications.js'
import {companyStats} from '../seed-data/companyStats.js'
import {quoteRequests} from '../seed-data/quoteRequests.js'
import * as path from 'node:path';

// Helper to create a document
async function createDocument(doc) {
  try {
    const result = await sanityClient.create(doc)
    console.log(`✅ Created ${doc._type}: ${doc.name || doc.title || doc.buyerName || 'Unknown'}`)
    return result
  } catch (error) {
    console.error(`❌ Failed to create ${doc._type}:`, error.message)
    throw error
  }
}

// Helper to wait a bit between requests to avoid rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function seedData() {
  console.log('🌱 Starting to seed data to Sanity CMS...\n')
  // Add a log to see if we get here
  console.log('🌱 seedData function started')

  try {
    // Seed Categories (parent level first)
    console.log('📂 Seeding main categories...')
    for (const category of rawCategories) {
      await createDocument(category)
      await sleep(200) // Small delay between requests
    }

    console.log('\n📂 Seeding child categories for Jute Bags...')
    for (const category of juteBagChildCategories) {
      await createDocument(category)
      await sleep(200)
    }

    console.log('\n📂 Seeding child categories for Tote Bags...')
    for (const category of toteBagChildCategories) {
      await createDocument(category)
      await sleep(200)
    }

    // Seed Certifications
    console.log('\n🏆 Seeding certifications...')
    for (const cert of certifications) {
      await createDocument(cert)
      await sleep(200)
    }

    // Seed Company Stats
    console.log('\n📊 Seeding company statistics...')
    for (const stat of companyStats) {
      await createDocument(stat)
      await sleep(200)
    }

    // Seed Products (these reference categories, so we do them after categories)
    console.log('\n📦 Seeding products...')
    for (const product of products) {
      await createDocument(product)
      await sleep(200)
    }

    // Seed Quote Requests
    console.log('\n📝 Seeding sample quote requests...')
    for (const request of quoteRequests) {
      await createDocument(request)
      await sleep(200)
    }

    console.log('\n🎉 Data seeding completed successfully!')
    console.log('💡 Note: Images need to be uploaded separately through Sanity Studio')
    console.log('🔗 Access your Sanity Studio at: https://6zj8mzj6.sanity.studio')

  } catch (error) {
    console.error('\n💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding function
const fileUrlFromPath = (filePath) => {
  const resolved = path.resolve(filePath);
  return new URL('file://' + resolved).href;
};

if (import.meta.url === fileUrlFromPath(process.argv[1])) {
  seedData()
}

export default seedData