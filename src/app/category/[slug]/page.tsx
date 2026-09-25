import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanityClient } from '@/lib/sanity';


interface CategoryDoc {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  parentCategory?: { _id: string; name: string; slug: { current: string } };
}

interface CategoryProduct {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  materialComposition?: string;
  moq?: number;
  indicativePriceRangeMin?: number;
  indicativePriceRangeMax?: number;
  currency?: string;
  category?: { _id: string; name: string; slug: { current: string } };
  images?: Array<{ asset?: { _ref?: string; _id?: string } }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const category = await sanityClient.fetch<CategoryDoc | null>(
    `*[_type == "category" && slug.current == $slug][0] { name, description }`,
    { slug }
  );

  if (!category) {
    return {
      title: 'Category Not Found | eSailor.in',
    };
  }

  return {
    title: `${category.name} Wholesale & Export | eSailor.in`,
    description:
      category.description ||
      `Explore high-grade ${category.name} manufactured from certified natural jute fibers for international B2B buyers.`,
    openGraph: {
      title: `${category.name} Wholesale & Export | eSailor.in`,
      description: category.description,
      url: `https://esailor.in/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {

  const { slug } = await Promise.resolve(params);

  if (!slug) {
    notFound();
  }

  const category = await sanityClient.fetch<CategoryDoc | null>(
    `*[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      parentCategory->{_id, name, slug}
    }`,
    { slug }
  );

  if (!category) {
    notFound();
  }

  const products = await sanityClient.fetch<CategoryProduct[]>(
    `*[_type == "product" && category->slug.current == $slug && isActive != false] | order(name asc) {
      _id,
      name,
      slug,
      description,
      materialComposition,
      moq,
      indicativePriceRangeMin,
      indicativePriceRangeMax,
      currency,
      category->{_id, name, slug},
      images[]{asset->{_ref, _id}}
    }`,
    { slug }
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/catalog" className="text-xs font-semibold text-accent hover:underline">
          ← Back to full catalog
        </Link>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/75">
            {category.description}
          </p>
        ) : null}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <p className="text-base text-foreground/70">
            No products are currently cataloged in this category.
          </p>
          <div className="mt-4">
            <Link href="/catalog" className="text-xs font-semibold text-accent hover:underline">
              View all available bags →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-md"
            >
              <div>
                <Link href={`/product/${product.slug.current}`} className="block">
                  <div className="aspect-[4/3] bg-surface-muted overflow-hidden">
                    {product.images?.[0]?.asset?._ref ? (
                      <img
                        src={`https://cdn.sanity.io/images/6zj8mzj6/production/${product.images[0].asset._ref.split('-').slice(1).join('-')}.jpg`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-primary/40">
                        👜
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-accent">
                    <span className="font-semibold">{product.materialComposition || 'Natural Jute'}</span>
                    <span>{product.moq ? `MOQ ${product.moq}` : 'Custom'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-primary">
                    <Link href={`/product/${product.slug.current}`}>{product.name}</Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground/75">
                    {product.description || 'Premium sustainable jute bag engineered for commercial retail.'}
                  </p>
                  <div className="mt-4 flex items-center justify-end border-t border-border pt-3 text-sm">
                    <Link
                      href={`/product/${product.slug.current}`}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
