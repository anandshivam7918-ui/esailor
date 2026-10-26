import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { getProductById, getProducts, resolveRedirectSlug } from '@/lib/admin-store';
import { urlFor } from '@/lib/sanity';
import { CONTACT_EMAIL_LINK } from '@/lib/contact-details';

interface SanityImageRef {
  alt?: string;
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
  url?: string;
}

type ProductDescription = string | Array<{ children?: Array<{ text?: string }> }> | null | undefined;

interface ProductDetailData {
  _id: string;
  name: string;
  slug: { current: string };
  description?: ProductDescription;
  materialComposition?: string;
  gsmWeight?: number;
  dimensions?: string;
  colorOptions?: string[];
  printOptions?: string[];
  handleType?: string;
  moq?: number;
  indicativePriceRangeMin?: number;
  indicativePriceRangeMax?: number;
  currency?: string;
  pricingMode?: string;
  unitPrice?: number;
  shortDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  sku?: string;
  unit?: string;
  packagingDetails?: string;
  additionalSpecifications?: Array<{ key: string; value: string }>;
  sampleAvailable?: boolean;
  certifications?: string[];
  length?: number;
  width?: number;
  gusset?: number;
  finishType?: string;
  weavingType?: string;
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  images?: SanityImageRef[];
}

const safeDescription = (desc: ProductDescription): string => {
  if (!desc) return 'Contact our team for product details and a quotation.';
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) =>
        Array.isArray(block?.children)
          ? block.children.map((child) => child.text || '').join('')
          : ''
      )
      .join(' ')
      .trim();
  }
  return String(desc);
};

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getProducts(false);
    const paramsMap = new Map<string, { slug: string }>();

    for (const p of products) {
      const s = typeof p.slug === 'string' ? p.slug : p.slug?.current;
      if (s) {
        paramsMap.set(s, { slug: s });
      }
    }

    const aliases = [
      'agro-burlap-sack',
      'classic-jute-tote',
      'wine-bottle-carrier',
      'printed-designer-tote',
      'juco-fashion-shopper',
      'heavy-industrial-burlap-sacks',
      'natural-jute-tote-bag',
      'luxury-jute-wine-gift-bag',
      'printed-jute-promotional-bag',
      'juco-fine-weave-canvas-tote',
    ];
    for (const a of aliases) {
      paramsMap.set(a, { slug: a });
    }

    return Array.from(paramsMap.values());
  } catch {
    return [
      { slug: 'agro-burlap-sack' },
      { slug: 'classic-jute-tote' },
      { slug: 'wine-bottle-carrier' },
      { slug: 'printed-designer-tote' },
      { slug: 'juco-fashion-shopper' },
      { slug: 'heavy-industrial-burlap-sacks' },
      { slug: 'natural-jute-tote-bag' },
      { slug: 'luxury-jute-wine-gift-bag' },
      { slug: 'printed-jute-promotional-bag' },
      { slug: 'juco-fine-weave-canvas-tote' },
    ];
  }
}

async function fetchProduct(slug: string): Promise<{ product: ProductDetailData | null; redirectedSlug?: string }> {
  if (!slug) return { product: null };

  // Check slug history for automatic redirects
  try {
    const redirected = await resolveRedirectSlug(slug);
    if (redirected && redirected !== slug) {
      return { product: null, redirectedSlug: redirected };
    }
  } catch {
    // Redirect table read failure handled gracefully
  }

  try {
    const product = await getProductById(slug, false);
    if (!product) return { product: null };
    const category = typeof product.category === 'object' ? product.category : undefined;
    return {
      product: {
        ...product,
        slug: typeof product.slug === 'string' ? { current: product.slug } : product.slug || { current: slug },
        category: category || undefined,
        images: Array.isArray(product.images) ? product.images.map((image: SanityImageRef) => ({ ...image, url: image.url || image.asset?.url })) : [],
      } as ProductDetailData,
    };
  } catch {
    // The shared catalog service reports unavailable backing storage as a missing listing here.
  }
  return { product: null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  try {
    const { slug } = await Promise.resolve(params);
    const { product } = await fetchProduct(slug);

    if (!product) {
      return {
        title: 'Product Details | eSailor.in',
        description: 'Explore certified export-grade jute packaging bags from eSailor.in.',
      };
    }

    return {
      title: product.seoTitle || `${product.name} | B2B Wholesale | eSailor.in`,
      description: product.seoDescription || product.shortDescription || safeDescription(product.description),
      openGraph: {
        title: `${product.name} | eSailor.in Wholesale`,
        description: `Factory-direct pricing on ${product.name}. Inquire for custom volume quotes.`,
        url: `https://esailor.in/product/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Product Catalog | eSailor.in',
      description: 'Explore certified export-grade jute packaging bags from eSailor.in.',
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);

  if (!slug) {
    notFound();
  }

  const { product, redirectedSlug } = await fetchProduct(slug);

  if (redirectedSlug) {
    redirect(`/product/${redirectedSlug}`, RedirectType.replace);
  }

  if (!product) {
    notFound();
  }

  // Extract or synthesize images
  const resolvedImages: string[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img: SanityImageRef) => {
      if (img?.url && typeof img.url === 'string') {
        resolvedImages.push(img.url);
      } else if (img?.asset?._ref) {
        try {
          resolvedImages.push(urlFor(img).width(800).height(600).url());
        } catch {
          const ref = img.asset._ref;
          const assetId = ref.split('-').slice(1).join('-');
          resolvedImages.push(`https://cdn.sanity.io/images/6zj8mzj6/production/${assetId}.jpg`);
        }
      }
    });
  }

  const dimensions = [product.length, product.width, product.gusset].filter((value) => value !== undefined && value !== null);
  const specs: [string, string][] = [
    product.materialComposition && ['Material Composition', product.materialComposition],
    product.gsmWeight && ['Fabric Density / Weight', `${product.gsmWeight} GSM`],
    product.dimensions && dimensions.length === 0 && ['Dimensions', product.dimensions],
    dimensions.length > 0 && ['Dimensions (L × W × Gusset)', `${dimensions.join(' × ')} cm`],
    product.handleType && ['Handle Type', product.handleType],
    product.moq && ['Minimum Order Quantity', `${product.moq} ${String(product.unit || 'pcs')}`],
    Array.isArray(product.printOptions) && product.printOptions.length > 0 && ['Printing & Customization', product.printOptions.join(', ')],
    product.finishType && ['Finish', product.finishType],
    product.weavingType && ['Weaving Type', product.weavingType],
    Array.isArray(product.colorOptions) && product.colorOptions.length > 0 && ['Available Colors', product.colorOptions.join(', ')],
    Array.isArray(product.certifications) && product.certifications.length > 0 && ['Certifications', product.certifications.join(', ')],
    product.packagingDetails && ['Packaging', product.packagingDetails],
  ].filter(Boolean) as [string, string][];
  for (const item of product.additionalSpecifications || []) {
    if (item.key?.trim() && item.value?.trim()) specs.push([item.key, item.value]);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-xs text-foreground/60 font-medium">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/catalog" className="hover:text-primary transition-colors">
              B2B Catalog
            </Link>
          </li>
          {product.category?.name && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/catalog?category=${product.category.slug?.current || 'jute-bags'}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="font-bold text-primary truncate max-w-[240px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Layout: 55/45 Editorial Split */}
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Image Showcase (7 cols) */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
              {resolvedImages[0] ? <img src={resolvedImages[0]} alt={product.images?.[0]?.alt || product.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-foreground/60">Product image available on request</div>}
              <div className="absolute top-4 left-4 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-background uppercase tracking-wider">
                {product.category?.name || 'Certified Jute'}
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-surface/90 backdrop-blur px-3 py-1.5 border border-border/70 text-xs font-bold text-primary shadow-sm">
                MOQ: {product.moq ? `${product.moq} ${String((product as ProductDetailData & { unit?: string }).unit || 'pcs')}` : 'Confirm with sales'}
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {resolvedImages.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {resolvedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-border bg-surface aspect-square"
                >
                  <img
                    src={imageUrl}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quality Assurance Highlight Bar */}
          <div className="mt-8 rounded-xl border border-border bg-surface-dark p-6">
            <h3 className="font-serif text-lg font-bold text-primary mb-3">
              Manufacturing & Export Guarantees
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-secondary font-bold text-sm">✓</span>
                <div>
                  <strong className="text-primary block">Box-X Stitching</strong>
                  <span className="text-foreground/75">Handles stress-tested to 20kg load</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-secondary font-bold text-sm">✓</span>
                <div>
                  <strong className="text-primary block">Dual Metal Detection</strong>
                  <span className="text-foreground/75">100% needle-free export guarantee</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-secondary font-bold text-sm">✓</span>
                <div>
                  <strong className="text-primary block">Azo-Free Inks</strong>
                  <span className="text-foreground/75">Eco-tested reactive water dyes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Commercial Inquiries (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              {product.sku && <span className="text-xs text-foreground/60 font-mono">SKU: {product.sku}</span>}
            </div>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              {product.name}
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-foreground/85">
              {safeDescription(product.shortDescription || product.description)}
            </p>
            <p className="mt-3 text-sm font-semibold text-primary">{product.pricingMode === 'fixed' && product.unitPrice ? `${product.currency || 'USD'} ${product.unitPrice} per ${product.unit || 'unit'}` : 'Pricing provided on request'}</p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/quote-request?product=${encodeURIComponent(product.name)}${product.moq ? `&moq=${product.moq}` : ''}`}
                className="flex-1 text-center px-6 py-3.5 rounded-md bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all shadow-md hover:-translate-y-[1px]"
              >
                Request Quotation & Mockup →
              </Link>
              {product.sampleAvailable && <Link
                href={`/quote-request?product=${encodeURIComponent(product.name)}&sample=true`}
                className="sm:w-auto text-center px-5 py-3.5 rounded-md border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all"
              >
                Order Physical Sample
              </Link>}
            </div>

            <p className="mt-3 text-[11px] text-foreground/60 text-center sm:text-left">
              Share your target quantity and specifications with our team for a tailored response.{' '}
              <a
                href={`${CONTACT_EMAIL_LINK}?subject=${encodeURIComponent(`Product Enquiry: ${product.name}`)}`}
                className="font-semibold text-accent hover:underline"
              >
                Email us about this product
              </a>
              .
            </p>

            {/* Technical Specifications Table */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-serif text-lg font-bold text-primary mb-4">
                Technical Specifications Matrix
              </h3>
              <dl className="divide-y divide-border border-y border-border text-xs">
                {specs.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-2 py-2.5">
                    <dt className="text-foreground/60 font-medium">{label}</dt>
                    <dd className="font-semibold text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
