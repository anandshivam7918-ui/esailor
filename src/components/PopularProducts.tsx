import Link from 'next/link';
import { getProducts } from '@/lib/admin-store';

type PublicProduct = {
  _id: string; name: string; slug?: string | { current?: string }; isFeatured?: boolean; showOnHomepage?: boolean;
  images?: Array<{ url?: string; alt?: string; asset?: { url?: string } }>;
  gsmWeight?: number; materialComposition?: string; moq?: number; unit?: string;
};

export const PopularProducts = async () => {
  const products = await getProducts(false) as PublicProduct[];
  const featured = products.filter((product) => product.isFeatured || product.showOnHomepage);
  const popular = (featured.length ? featured : products).slice(0, 5);
  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#EAE5DD] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8275] block mb-2.5">
              FEATURED PRODUCTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917]">
              Popular Products
            </h2>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C3224] hover:text-[#C17F42] transition-colors whitespace-nowrap group"
          >
            <span>View All Products</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Product Carousel Container with Left/Right Arrows */}
        <div className="relative">
          {/* Left Arrow Button */}
          <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10">
            <button
              aria-label="Previous products"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-[#E2DDD5] text-[#1C1917] hover:bg-[#FAF8F5] transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* 5 Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {popular.map((product) => {
              const slug = typeof product.slug === 'string' ? product.slug : product.slug?.current || product._id;
              const firstImage = product.images?.[0];
              const image = firstImage?.url || firstImage?.asset?.url;
              return (
              <div
                key={product._id}
                className="group flex flex-col rounded-xl bg-white border border-[#EAE5DD] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#1C3224]/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image on warm studio background */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F3ED] flex items-center justify-center p-3">
                  {image ? <img src={image} alt={firstImage?.alt || product.name} className="h-full w-full object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-105" /> : <span className="text-xs text-slate-500">Image available on request</span>}
                </div>

                {/* Card Details matching ye kro.png */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#1C1917] group-hover:text-[#1C3224] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#7A7369] mt-1">
                      {[product.gsmWeight ? `${product.gsmWeight} GSM` : '', product.materialComposition || ''].filter(Boolean).join(' · ') || 'Product specifications available on request'}
                    </p>
                    <p className="text-[11px] text-[#7A7369] mt-0.5">
                      {product.moq ? `MOQ: ${product.moq} ${product.unit || 'pcs'}` : 'MOQ: Confirm with sales'}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-[#F0EBE1]">
                    <Link
                      href={`/product/${slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C3224] hover:text-[#C17F42] transition-colors group-hover:underline"
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
            {popular.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-[#D9D2C7] bg-white p-8 text-center text-sm text-[#6B645C]">Published products will appear here.</p>}
          </div>

          {/* Right Arrow Button */}
          <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
            <button
              aria-label="Next products"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-[#E2DDD5] text-[#1C1917] hover:bg-[#FAF8F5] transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
