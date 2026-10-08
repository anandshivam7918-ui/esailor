'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AdminKpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  isIncrease?: boolean;
  comparisonText?: string;
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
  activeCard?: boolean;
  onClick?: () => void;
}

export function AdminKpiCard({
  title,
  value,
  trend,
  isIncrease = true,
  comparisonText = 'vs. last month',
  icon: Icon,
  iconBgColor = 'bg-[#EBF2EE]',
  iconColor = 'text-[#1B4D3E]',
  activeCard = false,
  onClick,
}: AdminKpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#FAF8F3] rounded-2xl p-5 border transition-all duration-200 ${
        activeCard
          ? 'border-[#1B4D3E] ring-2 ring-[#1B4D3E]/20 shadow-md'
          : 'border-[#E6E0D3] hover:border-[#D0C8B8] hover:shadow-xs'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0 border border-[#D5E3DA]`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-xs font-bold text-[#0D281E]">
          {title}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-serif font-bold text-[#0D281E] tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>

        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                isIncrease
                  ? 'bg-emerald-100/70 text-emerald-800'
                  : 'bg-rose-100/70 text-rose-800'
              }`}
            >
              {isIncrease ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {trend}
            </span>
            {comparisonText && (
              <span className="text-[10px] text-[#8C8275] font-medium">
                {comparisonText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
