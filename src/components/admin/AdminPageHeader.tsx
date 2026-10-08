'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  dateRangeText?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  badge,
  dateRangeText = 'Apr 28, 2026 – May 4, 2026',
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        {badge && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#EBF2EE] text-[#1B4D3E] border border-[#D5E3DA] px-2.5 py-0.5 rounded-full mb-1.5">
            {badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0D281E] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#6E6457] text-xs md:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side Actions / Date Filter */}
      <div className="flex items-center gap-3 shrink-0">
        {actions}
        {dateRangeText && (
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E0DACF] bg-[#FAF8F3] hover:bg-[#F2EEE4] text-[#0D281E] text-xs font-semibold shadow-xs transition-all cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-[#1B4D3E]" />
            <span>{dateRangeText}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C8275]" />
          </button>
        )}
      </div>
    </div>
  );
}
