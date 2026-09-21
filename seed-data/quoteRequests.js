// Sample quote request data for eSailor.in (for demonstration only)
export const quoteRequests = [
  {
    _type: 'quoteRequest',
    buyerName: 'Emma Thompson',
    companyName: 'EcoRetail Europe GmbH',
    country: 'Germany',
    buyerType: 'international',
    // products will be populated with references after products are created
    quantity: 5000,
    customizationNotes: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Requesting natural jute tote bags with our company logo printed on one side. Need GOTS certification documentation and eco-friendly packaging.'
          }
        ]
      }
    ],
    email: 'emma.thompson@ecoretail.eu',
    phone: '+49 30 12345678',
    status: 'new'
  },
  {
    _type: 'quoteRequest',
    buyerName: 'Rajesh Patel',
    companyName: 'Celebrations India Pvt. Ltd.',
    country: 'India',
    buyerType: 'domestic',
    quantity: 2000,
    customizationNotes: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Looking for printed jute shopping bags for Diwali corporate gifting. Need full-color printing on both sides with traditional motifs.'
          }
        ]
      }
    ],
    email: 'rajesh.patel@celebrationsindia.com',
    phone: '+91 98765 43210',
    status: 'contacted'
  }
]