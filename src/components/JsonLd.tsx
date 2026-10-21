import React from 'react';
import { CONTACT_PHONE } from '@/lib/contact-details';

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
        logo: 'https://esailor.in/images/esailor-logo.png',
        description:
          'Direct manufacturer and international exporter of eco-friendly jute bags, tote bags, shopping bags, and industrial burlap packaging. Registered with RCMC, IEC, GST, and Udyam.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'HARI ABASAN PHASE 1 HANAPARA',
          addressLocality: 'Kolkata',
          addressRegion: '24 PARAGANAS NORTH, WEST BENGAL',
          postalCode: '700101',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: `+91-${CONTACT_PHONE}`,
          contactType: 'sales',
          email: 'export@esailor.in',
          areaServed: 'Worldwide',
          availableLanguage: ['English', 'German', 'French', 'Spanish'],
        },
        sameAs: [
          'https://www.instagram.com/esailorofficial/',
          'https://www.facebook.com/esailor.in/',
          'https://www.linkedin.com/company/https-esailor.in-',
          'https://www.youtube.com/@ESailorOfficial',
        ],
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
