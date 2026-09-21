export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
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
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Select a parent category to create a hierarchy (leave empty for top-level categories)'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Determines the order in which categories are displayed (lower numbers appear first)',
      initialValue: 0
    }
  ],
  orderings: [
    {
      name: 'displayOrderAsc',
      title: 'Display Order Ascending',
      by: [
        {field: 'displayOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'parentCategory.name'
    }
  }
}