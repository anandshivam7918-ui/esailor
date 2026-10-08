'use client';

import React from 'react';

type StatusType =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'pending'
  | 'closed'
  | 'converted'
  | 'in production'
  | 'in_progress'
  | 'shipped'
  | 'confirmed'
  | 'delivered'
  | 'cancelled'
  | 'active'
  | 'draft'
  | 'inactive'
  | 'planning'
  | 'raw material'
  | 'completed'
  | 'valid'
  | 'expired'
  | string;

interface AdminStatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
}

export function AdminStatusBadge({ status, label, size = 'sm' }: AdminStatusBadgeProps) {
  const normalized = (status || '').toString().toLowerCase().trim();
  const text = label || status;

  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (normalized) {
    case 'new':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold';
      break;
    case 'contacted':
      style = 'bg-sky-50 text-sky-700 border-sky-200/80 font-semibold';
      break;
    case 'quoted':
      style = 'bg-indigo-50 text-indigo-700 border-indigo-200/80 font-semibold';
      break;
    case 'pending':
      style = 'bg-amber-50 text-amber-700 border-amber-200/80 font-semibold';
      break;
    case 'closed':
    case 'inactive':
      style = 'bg-slate-100 text-slate-600 border-slate-200 font-semibold';
      break;
    case 'converted':
    case 'delivered':
    case 'completed':
    case 'valid':
    case 'active':
      style = 'bg-emerald-100/70 text-emerald-800 border-emerald-300/80 font-bold';
      break;
    case 'in production':
    case 'in_progress':
    case 'production':
      style = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
      break;
    case 'shipped':
      style = 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      break;
    case 'confirmed':
      style = 'bg-teal-50 text-teal-700 border-teal-200 font-semibold';
      break;
    case 'cancelled':
    case 'expired':
      style = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      break;
    case 'planning':
      style = 'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold';
      break;
    case 'raw material':
      style = 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
      break;
    default:
      style = 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses} capitalize transition-colors ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{text}</span>
    </span>
  );
}
