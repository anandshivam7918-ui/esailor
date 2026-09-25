"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PremiumButton } from './ui/PremiumButton';
import { InputField } from './ui/InputField';

export type CatalogCategory = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
};

export type CatalogProduct = {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  materialComposition?: string;
  moq?: number;
  category?: {
    _id?: string;
    name?: string;
    slug?: {
      current: string;
    };
  } | null;
  images?: Array<{
    asset?: {
      _ref?: string;
      _id?: string;
    };
  }>;
};

type CatalogPageClientProps = {
  categories: CatalogCategory[];
  products: CatalogProduct[];
};

const getProductDescription = (desc: any): string => {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) =>
        Array.isArray(block.children)
          ? block.children.map((child: any) => child.text || '').join('')
          : ''
      )
      .join(' ')
      .trim();
  }
  return '';
};

const getProductSlug = (product: any): string => {
  if (!product) return '';
  if (typeof product.slug === 'string') return product.slug;
  if (product.slug?.current) return product.slug.current;
  return product._id || '';
};

const getProductImage = (product: CatalogProduct) => {
  const firstImage = product.images?.[0];

  if (firstImage && (firstImage as any).url && !(firstImage as any).url.startsWith('/images/products')) {
    return (firstImage as any).url;
  }

  if (firstImage?.asset?._ref) {
    const ref = firstImage.asset._ref;
    const assetId = ref.split('-').slice(1).join('-');
    return `https://cdn.sanity.io/images/6zj8mzj6/production/${assetId}.jpg`;
  }

  const name = (product.name || '').toLowerCase();
  const cat = (product.category?.name || '').toLowerCase();

  if (name.includes('wine') || name.includes('bottle') || cat.includes('wine')) {
    return '/images/products/wine-bottle-carrier.jpg';
  }
  if (name.includes('burlap') || name.includes('sack') || cat.includes('burlap')) {
    return '/images/products/agro-burlap-sack.jpg';
  }
  if (name.includes('print') || name.includes('floral') || name.includes('botanical') || name.includes('custom')) {
    return '/images/products/printed-designer-tote.jpg';
  }
  if (name.includes('canvas') || name.includes('juco') || name.includes('shopper')) {
    return '/images/products/juco-fashion-shopper.jpg';
  }
  return '/images/products/jute-tote-studio.jpg';
};

export function CatalogPageClient({ categories, products }: CatalogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const materials = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.materialComposition)
            .filter((material): material is string => Boolean(material))
        )
      ).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category?._id === selectedCategory;

      const matchesMaterial =
        selectedMaterial === 'all' ||
        product.materialComposition?.toLowerCase() === selectedMaterial.toLowerCase();

      const descText = getProductDescription(product.description).toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        descText.includes(q) ||
        (product.materialComposition && product.materialComposition.toLowerCase().includes(q)) ||
        (product.category?.name && product.category.name.toLowerCase().includes(q));

      return matchesCategory && matchesMaterial && matchesSearch;
    });
  }, [products, selectedCategory, selectedMaterial, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSearchQuery('');
  };

  const isFiltering =
    selectedCategory !== 'all' || selectedMaterial !== 'all' || searchQuery.trim() !== '';

  const filterPanel = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Categories
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'border-primary bg-primary text-background'
                : 'border-border bg-background text-foreground/80 hover:border-primary/50'
            }`}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setSelectedCategory(category._id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                selectedCategory === category._id
                  ? 'border-primary bg-primary text-background'
                  : 'border-border bg-background text-foreground/80 hover:border-primary/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      {materials.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Material Composition
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMaterial('all')}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                selectedMaterial === 'all'
                  ? 'border-primary bg-primary text-background'
                  : 'border-border bg-background text-foreground/80 hover:border-primary/50'
              }`}
            >
              All Materials
            </button>

            {materials.map((material) => (
              <button
                key={material}
                type="button"
                onClick={() => setSelectedMaterial(material)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedMaterial === material
                    ? 'border-primary bg-primary text-background'
                    : 'border-border bg-background text-foreground/80 hover:border-primary/50'
                }`}
              >
                {material}
              </button>
            ))}
          </div>
        </div>
      )}

      {isFiltering && (
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-xs font-semibold text-accent hover:underline"
        >
          ✕ Reset all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Title & Search Header */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Wholesale Catalog
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Export Jute Bag Collection
          </h1>
          <p className="mt-2 text-sm text-foreground/75">
            Custom sizing, OEM branding, and international trade compliance available across all models.
          </p>
        </div>

        {/* Search Input & Mobile Filter Trigger */}
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <InputField
              type="text"
              label="Search bags, materials..."
              placeholder="Search bags, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-card border border-primary bg-surface px-4 py-2 text-sm font-medium text-primary lg:hidden"
          >
            <span>⚙️</span>
            <span>Filters {isFiltering ? '(Active)' : ''}</span>
          </button>
        </div>
      </div>

      {/* Desktop Filter Panel */}
      <div className="mb-8 hidden rounded-2xl border border-border bg-surface p-6 shadow-sm lg:block">
        {filterPanel}
      </div>

      {/* Mobile Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm overflow-y-auto bg-background p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold text-primary">Filter Products</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-card px-3 py-1.5 text-sm font-bold text-foreground/70 hover:bg-surface-muted"
              >
                ✕ Close
              </button>
            </div>
            {filterPanel}
            <div className="mt-8">
              <PremiumButton
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                variant="primary"
                size="md"
                className="w-full"
              >
                View {filteredProducts.length} Products
              </PremiumButton>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <p className="text-sm text-foreground/75">
          Showing <span className="font-bold text-primary">{filteredProducts.length}</span> products
          {isFiltering ? ' matching your filters' : ''}
        </p>

        {isFiltering && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <span className="text-4xl">👜</span>
          <h2 className="mt-3 text-2xl font-bold text-primary">No products match your criteria</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Try adjusting your search terms, clearing selected categories, or checking other material types.
          </p>
          <div className="mt-6">
            <PremiumButton
              type="button"
              onClick={handleResetFilters}
              variant="primary"
              size="md"
            >
              Reset All Filters
            </PremiumButton>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const productImage = getProductImage(product);
            const slug = getProductSlug(product);
            const descText = getProductDescription(product.description);

            return (
              <article
                key={product._id}
                className="group flex flex-col justify-between overflow-hidden rounded-card border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
              >
                <div>
                  <Link href={`/product/${slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl text-primary/40">
                          👜
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-accent">
                      <span className="font-semibold">{product.category?.name || 'General Jute'}</span>
                      {product.materialComposition ? (
                        <span className="rounded bg-surface-muted px-2 py-0.5 text-foreground/70">
                          {product.materialComposition}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                      <Link href={`/product/${slug}`}>{product.name}</Link>
                    </h2>

                    <p className="mt-2.5 line-clamp-2 text-sm text-foreground/75">
                      {descText ||
                        'Premium sustainable jute bag solution engineered for commercial retail and bulk branding.'}
                    </p>

                    <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-3">
                      {product.moq ? (
                        <span className="text-xs font-medium text-foreground/60">
                          MOQ: {product.moq} units
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex gap-3">
                      <Link
                        href={`/product/${slug}`}
                        className="flex-1 rounded-card border border-primary px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary/5"
                      >
                        View Specs
                      </Link>
                      <Link
                        href={`/quote-request?product=${encodeURIComponent(product.name)}`}
                        className="flex-1 rounded-card border border-primary bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-background"
                      >
                        Enquire Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}