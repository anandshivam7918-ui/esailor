import type { Metadata } from 'next';
import { QuoteRequestForm } from '@/components/QuoteRequestForm';

export const metadata: Metadata = {
  title: 'Request B2B Wholesale Quote | eSailor.in Jute Bags Exporter',
  description:
    'Submit an official FOB/CIF pricing inquiry for custom bulk jute tote bags, grocery shoppers, and promotional burlap packaging. 24-hour turnaround guaranteed.',
  openGraph: {
    title: 'Request B2B Wholesale Quote | eSailor.in',
    description:
      'Direct factory wholesale quotes for international buyers. Custom sizes, branding, and eco-certified materials with dedicated export support.',
    url: 'https://esailor.in/quote-request',
  },
};

export const dynamic = 'force-dynamic';

export default async function QuoteRequestPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let defaultProduct = '';
  try {
    if (props?.searchParams) {
      const searchParams = await props.searchParams;
      const productParam = searchParams?.product;
      defaultProduct =
        typeof productParam === 'string'
          ? productParam
          : Array.isArray(productParam)
          ? productParam[0] || ''
          : '';
    }
  } catch (err) {
    console.error('Error reading searchParams:', err);
  }

  return <QuoteRequestForm defaultProduct={defaultProduct} />;
}
