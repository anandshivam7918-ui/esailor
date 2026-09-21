"use client";

import Link from 'next/link';

export const ProcessTeaser = () => {
  return (
    <section className="relative overflow-hidden bg-[#181411] text-white py-16 sm:py-24 border-b border-[#EAE5DD]">
      {/* Full-width artisan stitching background photo with natural warm overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/process/artisan-stitching-photo.jpg"
          alt="Artisan hands stitching natural jute burlap bag"
          className="h-full w-full object-cover object-center"
        />
        {/* Natural gradient to make text on left easily readable while showing hands on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#171412]/95 via-[#171412]/75 to-transparent sm:to-black/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Narrative Box (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D7C4A8] mb-3 block">
              OUR PROCESS
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.15] text-white">
              From Natural Fibre <br />
              to Finished Product
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#E2DCD5] leading-relaxed max-w-lg">
              We control the entire process — from raw jute fibre to finished bags — ensuring consistent quality, customization and timely delivery.
            </p>

            <div className="mt-8">
              <Link
                href="/process"
                className="inline-flex items-center gap-2 rounded-full bg-[#2E4834] px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#223727] hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Explore Our Manufacturing Process</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right: Watch Process Video CTA (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-start lg:justify-end">
            <Link
              href="/process"
              className="group inline-flex items-center gap-3.5 bg-black/30 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full hover:bg-black/50 transition-all hover:scale-105 shadow-xl"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1C3224] shadow-md group-hover:scale-110 transition-transform pl-0.5">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
              <span className="text-sm font-medium text-white tracking-wide">
                Watch Process Video
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};