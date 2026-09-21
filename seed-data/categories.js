// Sample category data for eSailor.in
export const categories = [
  {
    _type: 'category',
    name: 'Jute Bags',
    slug: {
      _type: 'slug',
      current: 'jute-bags'
    },
    description: 'Eco-friendly jute bags for various applications',
    displayOrder: 1
  },
  {
    _type: 'category',
    name: 'Tote Bags',
    slug: {
      _type: 'slug',
      current: 'tote-bags'
    },
    description: 'Versatile tote bags for shopping and daily use',
    displayOrder: 2
  },
  {
    _type: 'category',
    name: 'Shopping Bags',
    slug: {
      _type: 'slug',
      current: 'shopping-bags'
    },
    description: 'Durable shopping bags for retail and grocery use',
    displayOrder: 3
  },
  {
    _type: 'category',
    name: 'Promotional Bags',
    slug: {
      _type: 'slug',
      current: 'promotional-bags'
    },
    description: 'Customizable bags for promotional and branding purposes',
    displayOrder: 4
  },
  {
    _type: 'category',
    name: 'Luxury Bags',
    slug: {
      _type: 'slug',
      current: 'luxury-bags'
    },
    description: 'Premium quality bags for high-end retail and gifting',
    displayOrder: 5
  }
]

// Child categories for Jute Bags
export const juteBagChildCategories = [
  {
    _type: 'category',
    name: 'Tote Bags (Jute)',
    slug: {
      _type: 'slug',
      current: 'tote-bags-jute'
    },
    description: 'Classic tote bags made from natural jute fibers',
    displayOrder: 1
  },
  {
    _type: 'category',
    name: 'Shopping Bags (Jute)',
    slug: {
      _type: 'slug',
      current: 'shopping-bags-jute'
    },
    description: 'Sturdy shopping bags with jute construction',
    displayOrder: 2
  },
  {
    _type: 'category',
    name: 'Drawstring Bags (Jute)',
    slug: {
      _type: 'slug',
      current: 'drawstring-bags-jute'
    },
    description: 'Convenient drawstring closure bags made from jute',
    displayOrder: 3
  }
]

// Child categories for Tote Bags
export const toteBagChildCategories = [
  {
    _type: 'category',
    name: 'Canvas Tote Bags',
    slug: {
      _type: 'slug',
      current: 'canvas-tote-bags'
    },
    description: 'Heavy-duty canvas tote bags for heavy loads',
    displayOrder: 1
  },
  {
    _type: 'category',
    name: 'Insulated Tote Bags',
    slug: {
      _type: 'slug',
      current: 'insulated-tote-bags'
    },
    description: 'Temperature-maintaining tote bags for food and beverages',
    displayOrder: 2
  }
]