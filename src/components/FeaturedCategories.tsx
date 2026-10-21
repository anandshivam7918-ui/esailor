import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/admin-store';

type PublicCategory = { _id: string; name: string; slug?: { current?: string }; description?: string };
type PublicProduct = { category?: string | { _id?: string; _ref?: string; slug?: { current?: string } }; images?: Array<{ url?: string; asset?: { url?: string } }> };

export const FeaturedCategories = async () => {
  const [categories, products] = await Promise.all([getCategories() as Promise<PublicCategory[]>, getProducts(false) as Promise<PublicProduct[]>]);
  const featuredCategories = categories.map((category) => {
    const match = products.find((product) => {
      const relation = product.category;
      if (!relation || typeof relation === 'string') return relation === category._id;
      return relation?._id === category._id || relation?._ref === category._id || relation?.slug?.current === category.slug?.current;
    });
    const image = match?.images?.[0];
    return { ...category, representativeImage: image?.url || image?.asset?.url, href: category.slug?.current ? `/category/${category.slug.current}` : `/catalog?category=${encodeURIComponent(category._id)}` };
  }).slice(0, 5);
  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#EAE5DD] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Narrative Column */}
          <div className="lg:col-span-4 xl:col-span-3.5 flex flex-col justify-between py-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A7369] block mb-3">
                OUR PRODUCTS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-normal text-[#1C1917] leading-[1.12]">
                Featured Product Categories
              </h2>
              <p className="mt-5 text-sm sm:text-base text-[#6B645C] leading-relaxed max-w-md">
                Explore our wide range of jute bags, designed for various industries and use cases. All products can be customized to meet your specific requirements.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C1917] hover:text-[#1C3224] underline underline-offset-4 decoration-[#1C1917]/30 hover:decoration-[#1C3224] transition-all group"
              >
                <span>View All Products</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Right Area: 5 Category Cards */}
          <div className="lg:col-span-8 xl:col-span-8.5 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat._id}
                  href={cat.href}
                  className="group flex flex-col rounded-xl bg-[#F3EFE9] overflow-hidden border border-[#EBE6DD] transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  {/* Studio image container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE7DF] flex items-center justify-center p-2.5 sm:p-3">
                    {cat.representativeImage ? <img src={cat.representativeImage} alt={cat.name} className="h-full w-full object-cover object-center rounded-md transition-transform duration-500 group-hover:scale-105" /> : <span className="text-center text-xs text-slate-500">Explore {cat.name}</span>}
                  </div>

                  {/* Card Label & Subtitle */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-start">
                    <h3 className="font-sans text-sm sm:text-[15px] font-bold text-[#1C1917] group-hover:text-[#1C3224] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#7A7369] mt-1.5 leading-snug">
                      {cat.description || 'Explore products in this category.'}
                    </p>
                  </div>
                </Link>
              ))}
              {featuredCategories.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-[#D9D2C7] p-7 text-center text-sm text-[#6B645C]">Published product categories will appear here.</p>}
            </div>

            {/* Floating Carousel Navigation Arrow */}
            <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
              <Link
                href="/catalog"
                aria-label="View more categories"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#E2DDD5] text-[#1C1917] hover:bg-[#FAF8F5] transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 text-[#1C1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
