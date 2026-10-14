import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1C3224]/10 text-[#1C3224] text-2xl mb-6">
          👜
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C17F42]">
          404 — Item Not Found
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-normal text-[#1C1917] tracking-tight">
          Product or Page Not Found
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[#7A7369] leading-relaxed">
          The product or page you requested may have been renamed, relocated, or is temporarily unavailable in our export catalog.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1C3224] text-white text-xs sm:text-sm font-semibold hover:bg-[#142419] transition-all shadow-sm"
          >
            Explore B2B Catalog →
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#DDD4C4] bg-white text-[#1C1917] text-xs sm:text-sm font-semibold hover:bg-[#F3EFE6] transition-all"
          >
            Return to Homepage
          </Link>
          <Link
            href="/quote-request"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#C17F42] text-[#C17F42] text-xs sm:text-sm font-semibold hover:bg-[#C17F42]/10 transition-all"
          >
            Request Custom Quote
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-[#EAE5DD]">
          <p className="text-xs text-[#8C8275] mb-3">Popular Categories in our Export Catalog:</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              href="/catalog?category=jute-shopping-bags"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-[#1C3224] hover:border-[#1C3224] transition-colors"
            >
              Shopping Bags
            </Link>
            <Link
              href="/catalog?category=industrial-burlap-sacks"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-[#1C3224] hover:border-[#1C3224] transition-colors"
            >
              Burlap Hessian Sacks
            </Link>
            <Link
              href="/catalog?category=gift-bottle-bags"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-[#1C3224] hover:border-[#1C3224] transition-colors"
            >
              Wine & Bottle Carriers
            </Link>
            <Link
              href="/catalog?category=canvas-jute-totes"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-[#1C3224] hover:border-[#1C3224] transition-colors"
            >
              Juco & Canvas Totes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
