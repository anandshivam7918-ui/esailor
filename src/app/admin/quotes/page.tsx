'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { FileText, Plus, Search, Filter } from 'lucide-react';

export default function QuotesPage() {
  const quotes = [
    { id: 'Q-2087', company: 'GreenMart Ltd.', product: 'Shopping Bag', qty: '10,000 pcs', amount: '$12,500', status: 'quoted', date: 'Apr 28, 2026' },
    { id: 'Q-2086', company: 'EcoRetail Inc.', product: 'Tote Bag', qty: '5,000 pcs', amount: '$6,250', status: 'contacted', date: 'Apr 27, 2026' },
    { id: 'Q-2085', company: 'NaturePack', product: 'Burlap Sack', qty: '20,000 pcs', amount: '$18,000', status: 'pending', date: 'Apr 26, 2026' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quotations"
        subtitle="Generate and manage customer price quotes."
        badge="Pricing Engine"
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Create Quote</span>
          </button>
        }
      />

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotations..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Quote #</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Qty</th>
              <th className="py-3.5 px-4">Est. Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{q.id}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{q.company}</td>
                <td className="py-3.5 px-4">{q.product}</td>
                <td className="py-3.5 px-4">{q.qty}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{q.amount}</td>
                <td className="py-3.5 px-4">
                  <AdminStatusBadge status={q.status} />
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">{q.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
