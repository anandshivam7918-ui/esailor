import dotenv from 'dotenv';
dotenv.config();

import {sanityClient} from '../src/lib/sanity.js';

console.log('Testing permissions...');

try {
  // Try to get the current user
  const user = await sanityClient.request({
    uri: '/users/me',
    method: 'GET',
  });
  console.log('User:', user);
} catch (err) {
  console.error('Failed to get user:', err.message);
}

try {
  // Try to fetch a simple query to see if we can read
  const count = await sanityClient.fetch('count(*[_type == "category"])');
  console.log('Category count:', count);
} catch (err) {
  console.error('Failed to fetch count:', err.message);
}

try {
  // Try to create a dummy document to see the error
  const doc = await sanityClient.create({
    _type: 'category',
    name: 'Test Category',
    slug: {
      _type: 'slug',
      current: 'test-category'
    }
  });
  console.log('Created test category:', doc);
} catch (err) {
  console.error('Failed to create test category:', err.message);
}