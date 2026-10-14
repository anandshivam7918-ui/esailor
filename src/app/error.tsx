'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600 text-2xl mb-4">
          ⚠️
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1917] font-semibold">
          Temporary Loading Error
        </h1>
        <p className="mt-3 text-sm text-[#7A7369]">
          We encountered a temporary issue while loading this page. Our trade desk is available for immediate inquiries.
        </p>
        {error.digest && (
          <p className="mt-2 text-[11px] font-mono text-gray-400">
            Reference code: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-full bg-[#1C3224] text-white text-xs font-semibold hover:bg-[#142419] transition-all"
          >
            Try Again
          </button>
          <Link
            href="/catalog"
            className="px-5 py-2.5 rounded-full border border-[#DDD4C4] bg-white text-[#1C1917] text-xs font-semibold hover:bg-[#F3EFE6] transition-all"
          >
            Go to Catalog
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full border border-[#C17F42] text-[#C17F42] text-xs font-semibold hover:bg-[#C17F42]/10 transition-all"
          >
            Contact Desk
          </Link>
        </div>
      </div>
    </main>
  );
}
