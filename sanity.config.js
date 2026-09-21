import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import category from './sanity/schemas/category.js'
import product from './sanity/schemas/product.js'
import certification from './sanity/schemas/certification.js'
import companyStat from './sanity/schemas/companyStat.js'
import quoteRequest from './sanity/schemas/quoteRequest.js'
import adminUser from './sanity/schemas/adminUser.js'

export default defineConfig({
  name: 'default',
  title: 'eSailor CMS',

  projectId: '6zj8mzj6',
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool()
  ],

  schema: {
    types: [category, product, certification, companyStat, quoteRequest, adminUser]
  },
})