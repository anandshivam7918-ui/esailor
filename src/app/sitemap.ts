import type { MetadataRoute } from 'next';
import { getProducts, getCategories } from '@/lib/admin-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://esailor.in';
  const lastModified = new Date();

  // 1. Static MVP Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote-request`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/process`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    categoryRoutes = categories.map((cat: { slug?: { current: string } }) => ({
      url: `${baseUrl}/category/${cat.slug?.current}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.warn('Sitemap category fetch notice:', err);
  }

  // 3. Dynamic Active Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products
      .filter((p: { isActive?: boolean; slug?: { current: string } }) => p.isActive !== false)
      .map((p: { slug?: { current: string } }) => ({
        url: `${baseUrl}/product/${p.slug?.current}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));
  } catch (err) {
    console.warn('Sitemap product fetch notice:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
