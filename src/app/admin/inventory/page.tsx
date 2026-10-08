'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Boxes, AlertTriangle, Search } from 'lucide-react';

export default function InventoryPage() {
  const stockItems = [
    { item: 'Jute Fibre (Raw Grade A)', category: 'Raw Material', qty: '4,500 kg', reorderLevel: '5,000 kg', status: 'low' },
    { item: 'Standard Handles (Cotton Braid)', category: 'Components', qty: '25,000 pcs', reorderLevel: '10,000 pcs', status: 'normal' },
    { item: 'Eco Lamination Roll 120cm', category: 'Packaging', qty: '120 rolls', reorderLevel: '50 rolls', status: 'normal' },
    { item: 'Natural Jute Yarn Spools', category: 'Raw Material', qty: '1,200 spools', reorderLevel: '500 spools', status: 'normal' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventory & Raw Materials"
        subtitle="Track raw jute bales, yarn stock, handles and packaging material stock."
        badge="Warehouse Stock"
      />

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory items..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Item Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">In Stock</th>
              <th className="py-3.5 px-4">Reorder Threshold</th>
              <th className="py-3.5 px-4">Stock Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {stockItems.map((st, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{st.item}</td>
                <td className="py-3.5 px-4 text-slate-500">{st.category}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{st.qty}</td>
                <td className="py-3.5 px-4 text-slate-500">{st.reorderLevel}</td>
                <td className="py-3.5 px-4">
                  {st.status === 'low' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" /> Low Stock Alert
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
