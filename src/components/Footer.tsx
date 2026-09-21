"use client";

import Link from "next/link";
import { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#122318] text-[#FAF8F5] border-t border-[#233A2A] relative overflow-hidden font-sans">
      {/* Background Subtle Gradient & Watermark */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14261B]/80 via-transparent to-[#0D1811]/90 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* 1. Main 5-Column Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">

          {/* Col 1: Brand & Exporter Identity (4 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            {/* Brand Logo */}
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex items-center justify-center text-[#D4A373] transition-transform group-hover:scale-105">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <path d="M7 23C7 23 7 13 17 9C17 9 17 19 7 23Z" fill="#D4A373"/>
                  <path d="M14 25C14 25 14 17 24 13C24 13 24 21 14 25Z" fill="#A2BAA4"/>
                  <path d="M7 23C11 20 15 16 17 9" stroke="#122318" strokeWidth="1"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  JuteCraft
                </span>
                <span className="text-[8px] font-bold tracking-[0.24em] uppercase text-[#D4A373] mt-1">
                  NATURAL | DURABLE | SUSTAINABLE
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#FAF8F5]/75 leading-relaxed max-w-sm">
              Direct manufacturer & government-recognized star export house specializing in certified 
              organic jute packaging, retail shoppers, and hydrocarbon-free commodity burlap.
            </p>

            {/* Industrial Plant Details Box */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-xs space-y-2 max-w-sm backdrop-blur-xs">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span className="text-[#D4A373]">🏭</span> Bengal Delta Manufacturing Facility:
              </p>
              <p className="text-[#FAF8F5]/70 leading-relaxed text-[11px]">
                NH-12 Industrial Corridor, Barasat, North 24 Parganas, West Bengal 700124, India
              </p>
              <div className="pt-2 border-t border-white/10 text-[10px] text-[#FAF8F5]/60 flex items-center justify-between">
                <span>IEC: 0219481900</span>
                <span>Port: CCU / NSA Direct</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#D4A373] hover:bg-[#D4A373] hover:text-[#122318] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#D4A373] hover:bg-[#D4A373] hover:text-[#122318] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#D4A373] hover:bg-[#D4A373] hover:text-[#122318] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#D4A373] hover:bg-[#D4A373] hover:text-[#122318] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: B2B Collections (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-serif text-base font-normal text-white tracking-wide border-b border-white/10 pb-2">
              B2B Collections
            </h3>
            <nav className="flex flex-col space-y-2 text-xs text-[#FAF8F5]/75">
              <Link href="/catalog?category=jute-shopping-bags" className="hover:text-[#D4A373] transition-colors">
                Retail Shopping Totes
              </Link>
              <Link href="/catalog?category=canvas-jute-totes" className="hover:text-[#D4A373] transition-colors">
                Juco Fashion & Promo Bags
              </Link>
              <Link href="/catalog?category=gift-bottle-bags" className="hover:text-[#D4A373] transition-colors">
                Wine & Gourmet Bottle Carriers
              </Link>
              <Link href="/catalog?category=industrial-burlap-sacks" className="hover:text-[#D4A373] transition-colors">
                Agro Commodity Burlap Sacks
              </Link>
              <Link href="/catalog?category=drawstring-pouches" className="hover:text-[#D4A373] transition-colors">
                Cosmetic & Jewelry Pouches
              </Link>
              <Link href="/catalog" className="text-[#D4A373] font-semibold pt-2 hover:underline inline-flex items-center gap-1">
                <span>View All Models (40+)</span>
                <span>→</span>
              </Link>
            </nav>
          </div>

          {/* Col 3: Compliance & Supply (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-serif text-base font-normal text-white tracking-wide border-b border-white/10 pb-2">
              Compliance & Supply
            </h3>
            <nav className="flex flex-col space-y-2 text-xs text-[#FAF8F5]/75">
              <Link href="/certifications" className="hover:text-[#D4A373] transition-colors">
                GOTS & OEKO-TEX Standard
              </Link>
              <Link href="/certifications" className="hover:text-[#D4A373] transition-colors">
                Sedex SMETA 4-Pillar Audit
              </Link>
              <Link href="/process" className="hover:text-[#D4A373] transition-colors">
                12-Step Manufacturing Journey
              </Link>
              <Link href="/process" className="hover:text-[#D4A373] transition-colors">
                Box-X Handle Load Testing
              </Link>
              <Link href="/about" className="hover:text-[#D4A373] transition-colors">
                Delta Cooperative Sourcing
              </Link>
              <a
                href="/certificates/compliance-dossier.pdf"
                download
                className="text-[#A2BAA4] font-semibold pt-2 hover:underline inline-flex items-center gap-1.5"
              >
                <span>📑</span> Audit Dossier (PDF)
              </a>
            </nav>
          </div>

          {/* Col 4: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-serif text-base font-normal text-white tracking-wide border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2 text-xs text-[#FAF8F5]/75">
              <Link href="/" className="hover:text-[#D4A373] transition-colors">
                Home
              </Link>
              <Link href="/catalog" className="hover:text-[#D4A373] transition-colors">
                Products
              </Link>
              <Link href="/process" className="hover:text-[#D4A373] transition-colors">
                Manufacturing
              </Link>
              <Link href="/certifications" className="hover:text-[#D4A373] transition-colors">
                Certifications
              </Link>
              <Link href="/about" className="hover:text-[#D4A373] transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-[#D4A373] transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Col 5: Stay Connected / Newsletter (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="font-serif text-base font-normal text-white tracking-wide border-b border-white/10 pb-2">
              Stay Connected
            </h3>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
              Subscribe for global B2B trade insights, raw jute commodity trends, and new product releases.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full rounded-full bg-white/10 border border-white/20 px-3.5 py-2 pr-10 text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#D4A373] transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4A373] text-[#122318] hover:bg-[#c49260] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#A2BAA4] font-medium animate-fadeIn">
                  ✓ Thank you for subscribing!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* 2. Trust / Value Strip */}
        <div className="border-t border-b border-white/10 py-6 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center sm:text-left">
            
            {/* Item 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/15 text-[#D4A373]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Eco Friendly</h4>
                <p className="text-[11px] text-[#FAF8F5]/65 mt-0.5">Better for People & Planet</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/15 text-[#D4A373]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Quality Assured</h4>
                <p className="text-[11px] text-[#FAF8F5]/65 mt-0.5">International Standards</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/15 text-[#D4A373]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">On-Time Delivery</h4>
                <p className="text-[11px] text-[#FAF8F5]/65 mt-0.5">Global Shipping</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/15 text-[#D4A373]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Custom Solutions</h4>
                <p className="text-[11px] text-[#FAF8F5]/65 mt-0.5">Your Brand, Our Craft</p>
              </div>
            </div>

            {/* Item 5 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/15 text-[#D4A373]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Dedicated Support</h4>
                <p className="text-[11px] text-[#FAF8F5]/65 mt-0.5">Before & After Sales</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Bottom Utility Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-[#FAF8F5]/60 gap-4">
          
          {/* Left Copyright */}
          <div className="text-center md:text-left text-[11px]">
            <span>© {new Date().getFullYear()} JuteCraft. All rights reserved.</span>
            <span className="mx-2 text-white/20">•</span>
            <span>A unit of eSailor.in</span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <Link href="/certifications" className="hover:text-white transition-colors">
              Chain of Custody
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/process" className="hover:text-white transition-colors">
              Zero-Defect QA Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Trade Privacy
            </Link>
          </div>

          {/* Right Accreditations & Origin */}
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-white/80 font-medium">
              <span>🇮🇳</span> Made in India
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};