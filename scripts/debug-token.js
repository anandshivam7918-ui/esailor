import dotenv from 'dotenv';
dotenv.config();

console.log('Token length:', process.env.SANITY_API_TOKEN?.length || 0);
console.log('Token starts with:', process.env.SANITY_API_TOKEN?.substring(0, 4) || 'NULL');
console.log('Token ends with:', process.env.SANITY_API_TOKEN?.substring(-4) || 'NULL');

import {sanityClient} from '../src/lib/sanity.js';

console.log('Client token configured:', !!sanityClient.token && sanityClient.token.length > 0 ? 'YES' : 'NO');