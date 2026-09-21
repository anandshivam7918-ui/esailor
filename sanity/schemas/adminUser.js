export default {
  name: 'adminUser',
  title: 'Admin User Profile',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          {title: 'Admin (Full Access)', value: 'admin'},
          {title: 'Editor (Content Only)', value: 'editor'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime'
    }
    // Note: Authentication is handled by Sanity's built-in user management system.
    // This schema stores additional profile information if needed.
    // Passwords are managed securely by Sanity, not stored here.
  ],
  orderings: [
    {
      name: 'nameAsc',
      title: 'Name Ascending',
      by: [{field: 'name', direction: 'asc'}]
    },
    {
      name: 'lastLoginDesc',
      title: 'Most Recent Login First',
      by: [{field: 'lastLogin', direction: 'desc'}]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      status: 'role'
    }
  }
}