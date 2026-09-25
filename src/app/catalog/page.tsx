import type { Metadata } from 'next';
import { CatalogPageClient } from '@/components/CatalogPageClient';
import { getProducts, getCategories } from '@/lib/admin-store';
import { sanityClient } from '@/lib/sanity';

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

export default async function CatalogPage() {
  let categories: any[] = [];
  let products: any[] = [];

  try {
    const results = await Promise.all([
      sanityClient.fetch(
        `*[_type == "category"] | order(displayOrder asc) {
          _id,
          name,
          slug,
          description
        }`
      ),
      sanityClient.fetch(
        `*[_type == "product" && isActive != false] | order(name asc) {
          _id,
          name,
          slug,
          description,
          materialComposition,
          moq,
          category->{_id, name, slug},
          images[]{asset->{_ref, _id}}
        }`
      ),
    ]);
    if (results[0] && results[0].length > 0) categories = results[0];
    if (results[1] && results[1].length > 0) products = results[1];
  } catch {
    // Fallback to local store
  }

  if (categories.length === 0) {
    categories = await getCategories();
  }
  if (products.length === 0) {
    products = await getProducts();
  }

  return <CatalogPageClient categories={categories} products={products} />;
}
