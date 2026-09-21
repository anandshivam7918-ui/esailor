import dotenv from 'dotenv';
dotenv.config();

import {sanityClient} from '../src/lib/sanity.js';

console.log('Testing token info...');

try {
  // Try to get the project info
  const project = await sanityClient.request({
    uri: '/',
    method: 'GET',
  });
  console.log('Project info:', project);
} catch (err) {
  console.error('Failed to get project info:', err.message);
}

try {
  // Try to get the schema
  const schema = await sanityClient.request({
    uri: '/schema',
    method: 'GET',
  });
  console.log('Schema loaded:', !!schema);
} catch (err) {
  console.error('Failed to get schema:', err.message);
}

try {
  // Try to list documents (should work with read permission)
  const docs = await sanityClient.fetch('*[_type == "category"][0...0]');
  console.log('Categories query worked, found:', docs.length);
} catch (err) {
  console.error('Categories query failed:', err.message);
}