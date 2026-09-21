"use client";

import Link from 'next/link';

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#2E4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
    title: 'Sustainable Materials',
    description: 'Eco-friendly and biodegradable jute',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#2E4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m14.5 9.5-5 5"/>
        <path d="m9.5 9.5 5 5"/>
        <path d="M12 2v20"/>
      </svg>
    ),
    title: 'Custom Designs',
    description: 'Tailored to your brand and needs',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#2E4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: 'Global Compliance',
    description: 'Meets international quality standards',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#2E4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" x2="22" y1="12" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Export Experience',
    description: '15+ years in global trade',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#2E4834]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="12" x="1" y="4" rx="2"/>
        <path d="M17 8h4a2 2 0 0 1 2 2v6h-6V8Z"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
      </svg>
    ),
    title: 'Reliable Supply',
    description: 'On-time delivery and consistent quality',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#EAE5DD]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8275] block mb-2.5">
            WHY CHOOSE US
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1917]">
            Your Trusted Jute Manufacturing Partner
          </h2>
        </div>

        {/* Main Grid: 5 Features + Right Banner Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left: 5 Columns with vertical dividers */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE5DD] border border-[#EAE5DD] rounded-xl bg-[#FAF8F5]/60 overflow-hidden shadow-sm">
            {FEATURES.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 flex flex-col justify-start items-start text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-xs border border-[#EAE5DD] mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#1C1917] leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-[#6B645C] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Sustainability Forest Canopy Banner matching ye kro.png */}
          <div className="lg:col-span-3">
            <Link
              href="/certifications"
              className="group relative flex flex-col justify-between h-full min-h-[220px] rounded-xl overflow-hidden p-6 text-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Background forest image */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/images/forest-canopy.jpg"
                  alt="Sustainable lush green forest canopy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              </div>

              {/* Top empty spacer */}
              <div className="relative z-10" />

              {/* Bottom text & arrow */}
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl font-normal leading-snug text-white">
                  Sustainable <br />
                  Choices for a <br />
                  Better Tomorrow
                </h3>
                <div className="mt-3 flex items-center justify-between text-white/90">
                  <span className="font-mono text-base group-hover:translate-x-1 transition-transform">
                    --→
                  </span>
                  <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
