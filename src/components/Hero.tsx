"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const HERO_IMAGES = [
  '/images/hero-slide-1.jpg',
  '/images/hero-slide-2.jpg',
  '/images/hero-slide-3.jpg',
];

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically cycle through background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#181411] text-white min-h-[520px] lg:min-h-[600px] flex items-center border-b border-black/20">
      {/* 1. Full-Bleed Panoramic Background Slideshow (Cycles every 5s with smooth crossfade) */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((imgSrc, idx) => (
          <div
            key={imgSrc}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentImageIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            } transition-transform duration-[7000ms]`}
          >
            <img
              src={imgSrc}
              alt={`Hero Slide ${idx + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}

        {/* Gradient overlays to guarantee text legibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-transparent sm:w-3/5 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
        <div className="max-w-xl sm:max-w-2xl">

          {/* Overline */}
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#D7C4A8] mb-3 sm:mb-4 block">
            PREMIUM JUTE BAGS MANUFACTURER & EXPORTER
          </span>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-normal leading-[1.08] text-white tracking-tight drop-shadow-sm whitespace-pre-line">
            Jute Products,{"\n"}Made for Global Supply
          </h1>

          {/* Description */}
          <p className="mt-5 text-sm sm:text-base text-[#DCD6CD] leading-relaxed max-w-lg">
            Sustainable. Durable. Customizable. We manufacture high-quality jute bags for international and domestic bulk buyers, with a focus on quality, compliance and reliable delivery.
          </p>

          {/* Dual Action CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full bg-[#3D5737] px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-medium text-white shadow-md transition-all hover:bg-[#30452B] hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Explore Products</span>
              <span>→</span>
            </Link>
            <Link
              href="/quote-request"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/25 backdrop-blur-sm px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/15 hover:border-white/60 hover:-translate-y-0.5"
            >
              Request a Quote
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};