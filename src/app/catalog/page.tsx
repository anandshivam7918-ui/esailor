import type { Metadata } from 'next';
import { CatalogPageClient } from '@/components/CatalogPageClient';
import { getProducts, getCategories } from '@/lib/admin-store';

export const metadata: Metadata = {
  title: 'Export Jute Bag Catalog | eSailor.in Wholesale',
  description:
      'Browse our complete export catalog of certified natural jute tote bags, heavy-duty shopping bags, promotional Juco bags, and industrial burlap sacks.',
  openGraph: {
    title: 'Export Jute Bag Catalog | eSailor.in',
        description:
          'Explore certified eco-friendly jute bags, totes, and custom promotional packaging.',
    url: 'https://esailor.in/catalog',
  },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  const initialCategory = resolvedSearchParams?.category || '';

  const [categories, products] = await Promise.all([getCategories(), getProducts(false)]);

  return <CatalogPageClient categories={categories} products={products} initialCategory={initialCategory} />;
}
