export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    },
    {
      name: 'materialComposition',
      title: 'Material Composition',
      type: 'string',
      description: 'e.g., 100% Jute, Cotton-Jute Blend, etc.'
    },
    {
      name: 'gsmWeight',
      title: 'GSM Weight',
      type: 'number',
      description: 'Grams per square meter - indicates fabric thickness and quality'
    },
    {
      name: 'dimensions',
      title: 'Dimensions (L x W x H)',
      type: 'string',
      description: 'e.g., "40x30x15 cm" or "16x12x6 inches"'
    },
    {
      name: 'colorOptions',
      title: 'Color Options',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Available color variants for this product'
    },
    {
      name: 'printOptions',
      title: 'Print Options',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Available printing techniques (screen print, heat transfer, embroidery, etc.)'
    },
    {
      name: 'handleType',
      title: 'Handle Type',
      type: 'string',
      description: 'e.g., Cotton Rope, Jute Twine, Leather, Webbing, etc.'
    },
    {
      name: 'moq',
      title: 'Minimum Order Quantity',
      type: 'number',
      description: 'Minimum quantity required for order',
      validation: Rule => Rule.min(1)
    },
    {
      name: 'indicativePriceRangeMin',
      title: 'Indicative Price Range Min (USD)',
      type: 'number',
      description: 'Minimum indicative price per unit in USD'
    },
    {
      name: 'indicativePriceRangeMax',
      title: 'Indicative Price Range Max (USD)',
      type: 'number',
      description: 'Maximum indicative price per unit in USD'
    },
    {
        name: 'currency',
        title: 'Currency',
        type: 'string',
        initialValue: 'USD',
        validation: Rule => Rule.required()
      },
    {
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.min(1).max(10).required()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Uncheck to hide this product from the catalog without deleting it',
      initialValue: true
    }
  ],
  orderings: [
    {
      name: 'nameAsc',
      title: 'Name Ascending',
      by: [{field: 'name', direction: 'asc'}]
    },
    {
      name: 'createdAtDesc',
      title: 'Newest First',
      by: [{field: '_createdAt', direction: 'desc'}]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'images.0'
    }
  }
}