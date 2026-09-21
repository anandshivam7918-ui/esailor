export default {
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Certification Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'issuingBody',
      title: 'Issuing Body',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'badgeImage',
      title: 'Badge Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Brief explanation of what this certification verifies'
    },
    {
      name: 'dateObtained',
      title: 'Date Obtained',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'date',
      description: 'Leave blank if certification does not expire'
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Uncheck if certification has expired or is no longer valid',
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
      name: 'dateObtainedDesc',
      title: 'Recently Obtained First',
      by: [{field: 'dateObtained', direction: 'desc'}]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'issuingBody',
      media: 'badgeImage'
    }
  }
}