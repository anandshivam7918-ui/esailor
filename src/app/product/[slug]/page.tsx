import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanityClient, urlFor } from '@/lib/sanity';
import { getProductById, getProducts } from '@/lib/admin-store';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ExpandableSection } from '@/components/ui/ExpandableSection';
import { CertificationBadge } from '@/components/ui/CertificationBadge';

interface SanityImageRef {
  asset?: {
    _ref?: string;
    _id?: string;
  };
  url?: string;
}

interface ProductDetailData {
  _id: string;
  name: string;
  slug: { current: string };
  description?: any;
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
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  images?: SanityImageRef[];
}

const safeDescription = (desc: any): string => {
  if (!desc) return 'Certified export-grade jute bag manufactured for global retail and promotional applications.';
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block) =>
        Array.isArray(block?.children)
          ? block.children.map((c: any) => c.text || '').join('')
          : ''
      )
      .join(' ')
      .trim();
  }
  return String(desc);
};

const getCuratedFallbackImages = (categoryName?: string) => {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes('wine') || cat.includes('bottle')) {
    return [
      '/images/products/wine-bottle-carrier.jpg',
      '/images/products/jute-tote-studio.jpg',
    ];
  }
  if (cat.includes('burlap') || cat.includes('sack') || cat.includes('industrial')) {
    return [
      '/images/products/agro-burlap-sack.jpg',
      '/images/products/jute-tote-studio.jpg',
    ];
  }
  if (cat.includes('canvas') || cat.includes('tote') || cat.includes('promo')) {
    return [
      '/images/products/juco-fashion-shopper.jpg',
      '/images/products/printed-designer-tote.jpg',
    ];
  }
  return [
    '/images/products/jute-tote-studio.jpg',
    '/images/hero-jute-tote.jpg',
    '/images/products/juco-fashion-shopper.jpg',
  ];
};

async function fetchProduct(slug: string): Promise<ProductDetailData | null> {
  // 1. Try Sanity
  try {
    const data = await sanityClient.fetch<ProductDetailData | null>(
      `*[_type == "product" && (slug.current == $slug || _id == $slug) && isActive != false][0] {
        _id,
        name,
        slug,
        description,
        materialComposition,
        gsmWeight,
        dimensions,
        colorOptions,
        printOptions,
        handleType,
        moq,
        indicativePriceRangeMin,
        indicativePriceRangeMax,
        currency,
        category->{_id, name, slug},
        images[]{asset->{_ref, _id}}
      }`,
      { slug }
    );
    if (data) return data;
  } catch (err) {
    // Sanity offline / unconfigured
  }

  // 2. Fallback to local admin store
  try {
    const local = await getProductById(slug);
    if (local) {
      return {
        _id: local._id,
        name: local.name,
        slug: typeof local.slug === 'string' ? { current: local.slug } : local.slug || { current: slug },
        description: local.description,
        materialComposition: local.materialComposition,
        gsmWeight: local.gsmWeight,
        dimensions: local.dimensions,
        colorOptions: local.colorOptions,
        printOptions: local.printOptions,
        handleType: local.handleType,
        moq: local.moq,
        indicativePriceRangeMin: local.indicativePriceRangeMin,
        indicativePriceRangeMax: local.indicativePriceRangeMax,
        currency: local.currency || 'USD',
        category: typeof local.category === 'object' ? local.category : { _id: 'cat-1', name: 'Jute Bags', slug: { current: 'jute-bags' } },
        images: Array.isArray(local.images) ? local.images : [],
      };
    }

    // Relaxed search across all local products
    const all = await getProducts();
    const match = all.find(
      (p: any) =>
        p.slug?.current === slug ||
        p._id === slug ||
        p.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
    );
    if (match) {
      return {
        _id: match._id,
        name: match.name,
        slug: typeof match.slug === 'string' ? { current: match.slug } : match.slug || { current: slug },
        description: match.description,
        materialComposition: match.materialComposition,
        gsmWeight: match.gsmWeight,
        dimensions: match.dimensions,
        colorOptions: match.colorOptions,
        printOptions: match.printOptions,
        handleType: match.handleType,
        moq: match.moq,
        indicativePriceRangeMin: match.indicativePriceRangeMin,
        indicativePriceRangeMax: match.indicativePriceRangeMax,
        currency: match.currency || 'USD',
        category: typeof match.category === 'object' ? match.category : { _id: 'cat-1', name: 'Jute Bags', slug: { current: 'jute-bags' } },
        images: Array.isArray(match.images) ? match.images : [],
      };
    }
  } catch (err) {
    // Store read failure
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: 'Product Catalog | eSailor.in',
      description: 'Explore certified export-grade jute packaging bags from eSailor.in.',
    };
  }

  return {
    title: `${product.name} | B2B Wholesale Exporter | eSailor.in`,
    description: `Export-grade ${product.name} (${product.materialComposition || '100% Eco Jute'}). Certified wholesale manufacturing with custom branding and international freight.`,
    openGraph: {
      title: `${product.name} | eSailor.in Wholesale`,
      description: `Factory-direct pricing on ${product.name}. Inquire for custom volume quotes.`,
      url: `https://esailor.in/product/${slug}`,
    },
  };
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

  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  // Extract or synthesize images
  let resolvedImages: string[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img: any) => {
      if (typeof img === 'string') {
        resolvedImages.push(img);
      } else if (img.url && !img.url.startsWith('/images/products')) {
        resolvedImages.push(img.url);
      } else if (img.asset?._ref) {
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

  if (resolvedImages.length === 0) {
    resolvedImages = getCuratedFallbackImages(product.category?.name);
  }

  const specs: [string, string][] = [
    ['Material Composition', product.materialComposition || '100% Natural Golden Jute'],
    ['Fabric Density / Weight', product.gsmWeight ? `${product.gsmWeight} GSM` : '320 - 360 GSM Export Standard'],
    ['Standard Dimensions', product.dimensions || '40 x 35 x 15 cm (Customizable)'],
    ['Internal Lamination', 'Plant-based biodegradable PLA or 20µ LDPE barrier'],
    ['Handle Type', product.handleType || 'Padded Organic Cotton Webbing with Box-X stitch'],
    ['Minimum Order Quantity', product.moq ? `${product.moq} units` : '250 units'],
    [
      'Indicative Wholesale Range',
      product.indicativePriceRangeMin && product.indicativePriceRangeMax
        ? `$${product.indicativePriceRangeMin} - $${product.indicativePriceRangeMax} ${product.currency || 'USD'} / unit (FOB Kolkata)`
        : '$1.45 - $2.85 USD / unit (Volume Dependent)',
    ],
    ['Printing & Customization', 'Azo-Free Reactive Screen Print / Heat Transfer / Embroidery'],
    ['Export Ports', 'Kolkata Sea Port (CCU) / Nhava Sheva (NSA) Direct'],
    ['Accreditation Compliance', 'GOTS Organic, OEKO-TEX Standard 100, Sedex SMETA Audited'],
  ];

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
              <img
                src={resolvedImages[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 left-4 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-background uppercase tracking-wider">
                {product.category?.name || 'Certified Jute'}
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-surface/90 backdrop-blur px-3 py-1.5 border border-border/70 text-xs font-bold text-primary shadow-sm">
                MOQ: {product.moq || 250} units
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
              <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-[10px] font-bold text-secondary uppercase tracking-wider">
                GOTS & OEKO-TEX Standard
              </span>
              <span className="text-xs text-foreground/60 font-mono">
                SKU: {product._id.slice(0, 10).toUpperCase()}
              </span>
            </div>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              {product.name}
            </h1>

            {/* Wholesale Price Range Indicator */}
            <div className="mt-4 rounded-xl border border-accent/40 bg-surface-dark p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent block">
                Wholesale Factory Direct Pricing
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                {product.indicativePriceRangeMin && product.indicativePriceRangeMax
                  ? `$${product.indicativePriceRangeMin} - $${product.indicativePriceRangeMax}`
                  : '$1.45 - $2.85'}{' '}
                <span className="text-sm font-sans font-normal text-foreground/70">
                  / unit FOB
                </span>
              </div>
              <p className="text-[11px] text-foreground/60 mt-1">
                Tiered volume discounts apply at 1,000 / 5,000 / 25,000+ units. Sea/Air freight quoted separately.
              </p>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-foreground/85">
              {safeDescription(product.description)}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/quote-request?product=${encodeURIComponent(product.name)}&moq=${product.moq || 500}`}
                className="flex-1 text-center px-6 py-3.5 rounded-md bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all shadow-md hover:-translate-y-[1px]"
              >
                Request Quotation & Mockup →
              </Link>
              <Link
                href={`/quote-request?product=${encodeURIComponent(product.name)}&sample=true`}
                className="sm:w-auto text-center px-5 py-3.5 rounded-md border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all"
              >
                Order Physical Sample
              </Link>
            </div>

            <p className="mt-3 text-[11px] text-foreground/60 text-center sm:text-left">
              ⚡ Free digital 3D proof with your logo within 24 hours. Physical samples ship worldwide in 48h.
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