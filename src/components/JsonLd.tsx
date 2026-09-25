import React from 'react';

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://esailor.in/#organization',
        name: 'eSailor.in',
        legalName: 'eSailor Bags India Private Limited',
        url: 'https://esailor.in',
        logo: 'https://esailor.in/images/logo.png',
        description:
          'Direct manufacturer and international exporter of eco-friendly jute bags, tote bags, shopping bags, and industrial burlap packaging. Registered with RCMC, IEC, GST, and Udyam.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Industrial Jute Park, Export Processing Zone',
          addressLocality: 'Kolkata',
          addressRegion: 'West Bengal',
          postalCode: '700001',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-98765-43210',
          contactType: 'sales',
          email: 'export@esailor.in',
          areaServed: 'Worldwide',
          availableLanguage: ['English', 'German', 'French', 'Spanish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://esailor.in/#website',
        url: 'https://esailor.in',
        name: 'eSailor.in | B2B Jute Bag Manufacturer & Exporter',
        publisher: { '@id': 'https://esailor.in/#organization' },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}