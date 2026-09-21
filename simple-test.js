import {createClient} from '@sanity/client'

// Simple test to see if we can create a client
const client = createClient({
  projectId: '6zj8mzj6',
  dataset: 'production',
  apiVersion: '2026-09-18',
  useCdn: true
})

console.log('Client created successfully')

// Try a simple request
client.fetch('count(*[_type == "category"])')
  .then(count => {
    console.log(`Connected! Found ${count} categories`)
  })
  .catch(err => {
    console.error('Error fetching data:', err.message)
  })