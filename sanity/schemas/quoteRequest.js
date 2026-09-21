export default {
  name: 'quoteRequest',
  title: 'Quote Request',
  type: 'document',
  fields: [
    {
      name: 'buyerName',
      title: 'Buyer Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'buyerType',
      title: 'Buyer Type',
      type: 'string',
      options: {
        list: [
          {title: 'International', value: 'international'},
          {title: 'Domestic (India)', value: 'domestic'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'products',
      title: 'Products of Interest',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }]}],
      description: 'Select one or more products you are interested in'
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      description: 'Total quantity requested',
      validation: Rule => Rule.min(1).required()
    },
    {
      name: 'customizationNotes',
      title: 'Customization Notes',
      type: 'blockContent',
      description: 'Details about branding, printing, colors, sizes, or other special requirements'
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Closed', value: 'closed'}
        ]
      },
      initialValue: 'new',
      validation: Rule => Rule.required()
    }
  ],
  orderings: [
    {
      name: 'createdAtDesc',
      title: 'Newest First',
      by: [{field: '_createdAt', direction: 'desc'}]
    }
  ],
  preview: {
    select: {
      title: 'buyerName',
      subtitle: 'companyName || country',
      status: 'status'
    }
  }
}