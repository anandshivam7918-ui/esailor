'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Factory, Search, Filter, Calendar } from 'lucide-react';

interface ProductionItem {
  orderId: string;
  product: string;
  quantity: string;
  progress: number; // 0 to 100
  status: 'In Progress' | 'Planning' | 'Production' | 'Completed' | 'Raw Material';
  expectedDelivery: string;
}

const initialProduction: ProductionItem[] = [
  {
    orderId: 'ODR-1042',
    product: 'Shopping Bag',
    quantity: '10,000 pcs',
    progress: 80,
    status: 'In Progress',
    expectedDelivery: 'May 5, 2026',
  },
  {
    orderId: 'ODR-1041',
    product: 'Tote Bag',
    quantity: '5,000 pcs',
    progress: 60,
    status: 'Planning',
    expectedDelivery: 'May 8, 2026',
  },
  {
    orderId: 'ODR-1040',
    product: 'Bottle Bag',
    quantity: '20,000 pcs',
    progress: 40,
    status: 'Production',
    expectedDelivery: 'May 12, 2026',
  },
  {
    orderId: 'ODR-1038',
    product: 'Burlap Sack',
    quantity: '3,000 pcs',
    progress: 90,
    status: 'Completed',
    expectedDelivery: 'May 6, 2026',
  },
  {
    orderId: 'ODR-1036',
    product: 'Shopping Bag',
    quantity: '8,000 pcs',
    progress: 20,
    status: 'Raw Material',
    expectedDelivery: 'May 10, 2026',
  },
];

export default function ProductionPage() {
  const [production] = useState<ProductionItem[]>(initialProduction);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = production.filter(
    (p) =>
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Production"
        subtitle="Track manufacturing progress and production schedules."
        badge="Manufacturing Floor"
      />

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order or product..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none">
            <option value="all">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
            <option value="Production">Production</option>
            <option value="Completed">Completed</option>
          </select>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Production Progress Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Qty</th>
                <th className="py-3.5 px-4 w-64">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Expected Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.orderId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{item.orderId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{item.product}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.quantity}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.progress >= 80
                              ? 'bg-emerald-500'
                              : item.progress >= 50
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs text-slate-800 w-8">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={item.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.expectedDelivery}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
