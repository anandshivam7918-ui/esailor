import {sanityClient} from '../src/lib/sanity.js'
import projectConfig from '../sanity.config.js'

async function testConnection() {
  try {
    // Test fetching a simple document count
    const categoryCount = await sanityClient
      .fetch('count(*[_type == "category"])')

    console.log('✅ Successfully connected to Sanity CMS')
    console.log(`📊 Found ${categoryCount} categories in the dataset`)

    // Test fetching project info
    const projectInfo = await sanityClient.request({
      uri: '/',
      method: 'GET'
    })

    console.log(`📋 Project: ${projectInfo.projectId}`)
    console.log(`📂 Dataset: ${projectConfig.dataset}`)

    return true
  } catch (error) {
    console.error('❌ Failed to connect to Sanity CMS:', error.message)
    console.error('Please check your .env file and Sanity project settings')
    return false
  }
}

// ES module equivalent of require.main === module
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1)
  })
}

export default testConnection