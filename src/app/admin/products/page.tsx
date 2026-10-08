'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Tag, Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  gsm: string;
  moq: string;
  status: 'active' | 'draft';
  image: string;
}

const initialProducts: ProductItem[] = [
  {
    id: 'PRD-001',
    name: 'Jute Shopping Bag',
    category: 'Shopping Bags',
    gsm: '250-350 GSM',
    moq: '1,000 pcs',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'PRD-002',
    name: 'Tote Bag',
    category: 'Tote Bags',
    gsm: '300-400 GSM',
    moq: '1,000 pcs',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'PRD-003',
    name: 'Bottle Bag',
    category: 'Bottle Bags',
    gsm: '250-400 GSM',
    moq: '1,000 pcs',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'PRD-004',
    name: 'Burlap Sacks',
    category: 'Burlap Sacks',
    gsm: '300-500 GSM',
    moq: '1,000 pcs',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'PRD-005',
    name: 'Custom Printed Bag',
    category: 'Others',
    gsm: '250-400 GSM',
    moq: '1,000 pcs',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=200&auto=format&fit=crop',
  },
];

export default function ProductsPage() {
  const [products] = useState<ProductItem[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Products"
        subtitle="Manage your product catalog and specifications."
        badge="Catalog Manager"
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        }
      />

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none">
            <option value="all">All Categories</option>
            <option value="Shopping Bags">Shopping Bags</option>
            <option value="Tote Bags">Tote Bags</option>
            <option value="Bottle Bags">Bottle Bags</option>
            <option value="Burlap Sacks">Burlap Sacks</option>
          </select>

          <select className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none">
            <option value="all">Status: Active</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">GSM</th>
                <th className="py-3.5 px-4">MOQ</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((prd) => (
                <tr key={prd.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={prd.image} alt={prd.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{prd.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{prd.category}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{prd.gsm}</td>
                  <td className="py-3.5 px-4 text-slate-600">{prd.moq}</td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={prd.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
                      Edit <Edit className="w-3 h-3" />
                    </button>
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
