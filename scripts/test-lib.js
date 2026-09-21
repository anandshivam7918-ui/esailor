import {sanityClient} from '../src/lib/sanity.js'

console.log('Imported sanityClient from lib')

// Try a simple request
sanityClient.fetch('count(*[_type == "category"])')
  .then(count => {
    console.log(`Connected! Found ${count} categories`)
  })
  .catch(err => {
    console.error('Error fetching data:', err.message)
    console.error('Error stack:', err.stack)
  })