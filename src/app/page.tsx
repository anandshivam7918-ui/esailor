import { Hero } from '@/components/Hero';
import { TrustBar } from '@/components/TrustBar';
import { FeaturedCategories } from '@/components/FeaturedCategories';
import { ProcessTeaser } from '@/components/ProcessTeaser';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { PopularProducts } from '@/components/PopularProducts';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Floating Trust & Certifications Bar */}
      <TrustBar />

      {/* 3. Featured Categories */}
      <FeaturedCategories />

      {/* 4. Process Teaser Split Banner */}
      <ProcessTeaser />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Popular Jute Bags */}
      <PopularProducts />

      {/* 7. Global Reach Banner */}
      <section className="relative overflow-hidden bg-[#182E21] text-white py-8 sm:py-10 border-t border-[#264431]">
        {/* World map watermark graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none mix-blend-screen">
          <img
            src="/images/world-trade-routes.jpg"
            alt="World trade map"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Left Headline */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#A2BAA4] block mb-1">
                GLOBAL REACH
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                Exporting Quality Across Continents
              </h2>
            </div>

            {/* Right: 3 Stats with vertical dividers */}
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="text-left">
                <p className="font-serif text-2xl sm:text-3xl font-normal text-white leading-none">50+</p>
                <p className="text-[11px] text-[#A2BAA4] mt-1">Countries Served</p>
              </div>
              <div className="h-9 border-r border-white/20" />
              <div className="text-left">
                <p className="font-serif text-2xl sm:text-3xl font-normal text-white leading-none">15+</p>
                <p className="text-[11px] text-[#A2BAA4] mt-1">Years Experience</p>
              </div>
              <div className="h-9 border-r border-white/20" />
              <div className="text-left">
                <p className="font-serif text-2xl sm:text-3xl font-normal text-white leading-none">2M+</p>
                <p className="text-[11px] text-[#A2BAA4] mt-1">Bags / Month Capacity</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Ready to Discuss Your Requirements? CTA Strip */}
      <section className="relative overflow-hidden bg-[#181411] text-white py-14 sm:py-20 border-b border-black/20">
        {/* Dark natural jute texture background */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('/images/jute-texture-banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#14110E]/80 via-transparent to-[#14110E]/80 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white leading-tight">
            Ready to Discuss Your Requirements?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#DCD6CD] max-w-lg mx-auto">
            Get in touch for a quote or product consultation. We&apos;re here to help.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quote-request"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#2E4834] text-white text-xs sm:text-sm font-semibold hover:bg-[#223727] transition-all shadow-md hover:-translate-y-0.5"
            >
              Request a Quote
            </Link>
            <Link
              href="https://wa.me/919830000000?text=Hello%2C%20I%20would%20like%20to%20discuss%20jute%20bag%20requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold hover:bg-black/60 transition-all hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Us</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}