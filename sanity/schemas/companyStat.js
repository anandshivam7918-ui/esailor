export default {
  name: 'companyStat',
  title: 'Company Statistic',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required()
      // Examples: "Countries Served", "Years in Business", "Production Capacity (units/month)", "Happy Clients"
    },
    {
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: Rule => Rule.required()
      // Examples: "25+", "15+", "500,000+", "10,000+"
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Determines the order in which stats are displayed (lower numbers appear first)',
      initialValue: 0
    }
  ],
  orderings: [
    {
      name: 'displayOrderAsc',
      title: 'Display Order Ascending',
      by: [{field: 'displayOrder', direction: 'asc'}]
    }
  ],
  preview: {
    select: {
      title: '${label}: ${value}'
    }
  }
}