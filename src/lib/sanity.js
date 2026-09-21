import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6zj8mzj6';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-18';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN || '',
})

export const urlFor = (source) => imageUrlBuilder(sanityClient).image(source)

// Note: TypeScript types are removed for Node.js compatibility
// In Next.js context, types are available from '@sanity/types'
// Helper to convert Portable Text to React components is temporarily disabled
// export const PortableText = portableTextEditable({
//   // You can add custom serializers here if needed
//   // For example, to customize how links, images, or other block types are rendered
// })