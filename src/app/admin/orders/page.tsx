'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Truck,
  CheckCircle,
  Package,
} from 'lucide-react';

interface OrderItem {
  id: string;
  company: string;
  country: string;
  product: string;
  quantity: string;
  amount: string;
  status: 'In Production' | 'Shipped' | 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  date: string;
}

const initialOrders: OrderItem[] = [
  {
    id: 'ODR-1042',
    company: 'GreenMart Ltd.',
    country: 'Germany',
    product: 'Shopping Bag',
    quantity: '10,000 pcs',
    amount: '$12,500',
    status: 'In Production',
    date: 'Apr 28, 2026',
  },
  {
    id: 'ODR-1041',
    company: 'EcoRetail Inc.',
    country: 'USA',
    product: 'Tote Bag',
    quantity: '5,000 pcs',
    amount: '$6,250',
    status: 'Shipped',
    date: 'Apr 27, 2026',
  },
  {
    id: 'ODR-1040',
    company: 'NaturePack',
    country: 'UK',
    product: 'Burlap Sack',
    quantity: '20,000 pcs',
    amount: '$18,000',
    status: 'Pending',
    date: 'Apr 26, 2026',
  },
  {
    id: 'ODR-1038',
    company: 'Global Imports',
    country: 'UAE',
    product: 'Bottle Bag',
    quantity: '3,000 pcs',
    amount: '$4,500',
    status: 'Confirmed',
    date: 'Apr 25, 2026',
  },
  {
    id: 'ODR-1036',
    company: 'Sunrite Trading',
    country: 'Australia',
    product: 'Shopping Bag',
    quantity: '8,000 pcs',
    amount: '$9,800',
    status: 'Delivered',
    date: 'Apr 24, 2026',
  },
];

export default function OrdersPage() {
  const [orders] = useState<OrderItem[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Orders"
        subtitle="Track and manage all customer orders from enquiry to delivery."
        badge="Fulfillment Pipeline"
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        }
      />

      {/* 5 Status Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Total Orders</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">54</p>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            ↑ 16%
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">In Production</p>
          <p className="text-xl font-bold text-blue-600 mt-0.5">32</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">Shipped</p>
          <p className="text-xl font-bold text-purple-600 mt-0.5">12</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">Delivered</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">8</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">Cancelled</p>
          <p className="text-xl font-bold text-rose-600 mt-0.5">2</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none">
            <option value="all">All Status</option>
            <option value="In Production">In Production</option>
            <option value="Shipped">Shipped</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
          </select>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{ord.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{ord.company}</td>
                  <td className="py-3.5 px-4 text-slate-500">{ord.country}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{ord.product}</td>
                  <td className="py-3.5 px-4 text-slate-600">{ord.quantity}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{ord.amount}</td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={ord.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{ord.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
                      View <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredOrders.length} of 54 orders</span>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-semibold text-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-xs">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
