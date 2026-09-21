"use client";

import Link from 'next/link';
import { useState } from 'react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#1C3224] text-[#FAF8F5] text-[10px] sm:text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          {/* Left Tagline */}
          <div className="flex items-center gap-2 min-w-0 truncate">
            <svg className="w-3.5 h-3.5 text-[#D4A373] shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>
            <span className="font-medium tracking-wide text-[#FAF8F5]/90 truncate">
              Your Trusted Jute Bag Manufacturer & Exporter
            </span>
            <span className="hidden md:inline text-white/30 shrink-0">|</span>
            <span className="hidden md:inline text-[#FAF8F5]/80 shrink-0">Quality • Sustainability • Global Reach</span>
          </div>

          {/* Right Action: Download PDF */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/catalog.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#FAF8F5]/90 hover:text-white font-medium transition-colors whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download Product Catalogue (PDF)</span>
              <span className="sm:hidden">PDF Catalogue</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="bg-white border-b border-[#EFEBE3] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5 sm:py-4 gap-4 sm:gap-6 min-h-[64px]">

            {/* Brand Logo */}
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5 shrink-0">
              <div className="flex items-center justify-center text-[#24402F] transition-transform group-hover:scale-105">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                  <path d="M7 23C7 23 7 13 17 9C17 9 17 19 7 23Z" fill="#1C3224" />
                  <path d="M14 25C14 25 14 17 24 13C24 13 24 21 14 25Z" fill="#4B6A45" />
                  <path d="M7 23C11 20 15 16 17 9" stroke="#EFEBE3" strokeWidth="1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917] leading-none">
                  Esailor
                </span>
                <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase text-[#7A7369] mt-0.5 sm:mt-1">
                  NATURAL. DURABLE. GLOBAL.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Visible on XL screens 1280px+) */}
            <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8 text-[14px] font-medium text-[#3A352F] whitespace-nowrap">
              <Link href="/" className="text-[#1C3224] font-semibold hover:text-[#C17F42] transition-colors">
                Home
              </Link>
              <Link href="/catalog" className="hover:text-[#1C3224] transition-colors">
                Products
              </Link>
              <Link href="/process" className="hover:text-[#1C3224] transition-colors">
                Manufacturing
              </Link>
              <Link href="/certifications" className="hover:text-[#1C3224] transition-colors">
                Certifications
              </Link>
              <Link href="/about" className="hover:text-[#1C3224] transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-[#1C3224] transition-colors">
                Contact
              </Link>
            </nav>

            {/* Desktop Right Actions: Search + Request a Quote CTA (Visible on XL screens 1280px+) */}
            <div className="hidden xl:flex items-center gap-3.5 shrink-0">
              <Link
                href="/catalog"
                className="p-2 text-[#4A453E] hover:text-[#1C3224] transition-colors"
                title="Search products"
                aria-label="Search products"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              <Link
                href="/quote-request"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1C3224] text-white text-[13px] font-semibold hover:bg-[#142419] transition-all shadow-sm hover:-translate-y-[1px] whitespace-nowrap"
              >
                Request a Quote
              </Link>
            </div>

            {/* Mobile / Tablet Controls (Visible on screens < 1280px, including 1024px tablet) */}
            <div className="flex items-center gap-2 sm:gap-3 xl:hidden shrink-0">
              <Link
                href="/catalog"
                className="p-1.5 text-[#4A453E] hover:text-[#1C3224] transition-colors"
                title="Search products"
                aria-label="Search products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              <Link
                href="/quote-request"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1C3224] text-white text-xs sm:text-sm font-semibold hover:bg-[#142419] transition-colors whitespace-nowrap"
              >
                Quote
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md border border-[#DDD4C4] text-[#1C3224] hover:bg-[#FAF8F5] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>

          {/* Mobile Navigation Drawer Dropdown */}
          {mobileMenuOpen && (
            <div className="border-t border-[#EFEBE3] py-4 xl:hidden animate-fadeIn">
              <nav className="flex flex-col space-y-3 text-sm font-semibold text-[#1C1917]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 rounded-md hover:bg-[#FAF8F5] hover:text-[#C17F42] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 rounded-md hover:bg-[#FAF8F5] hover:text-[#C17F42] transition-colors"
                >
                  Products Catalog
                </Link>
                <Link
                  href="/process"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 rounded-md hover:bg-[#FAF8F5] hover:text-[#C17F42] transition-colors"
                >
                  Manufacturing Process
                </Link>
                <Link
                  href="/certifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 rounded-md hover:bg-[#FAF8F5] hover:text-[#C17F42] transition-colors"
                >
                  Certifications & Standards
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 rounded-md hover:bg-[#FAF8F5] hover:text-[#C17F42] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 px-2 rounded-md hover:bg-[#FAF8F5] hover:text-[#C17F42] transition-colors"
                >
                  Contact Desk
                </Link>

                <div className="pt-3 border-t border-[#EFEBE3] flex flex-col gap-2.5">
                  <a
                    href="https://wa.me/919830000000?text=Hello%2C%20I%20would%20like%20to%20request%20a%20B2B%20jute%20bags%20quote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>WhatsApp Global Desk</span>
                  </a>

                  <a
                    href="/catalog.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>📄</span> Download Catalogue (PDF)
                  </a>
                </div>
              </nav>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};