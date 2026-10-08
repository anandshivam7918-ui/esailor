'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Users, Search, Plus } from 'lucide-react';

export default function CustomersPage() {
  const customers = [
    { company: 'GreenMart Ltd.', country: 'Germany', contactPerson: 'Hans Weber', email: 'hans@greenmart.de', totalOrders: 14, totalSpent: '$148,000' },
    { company: 'EcoRetail Inc.', country: 'USA', contactPerson: 'Sarah Jenkins', email: 's.jenkins@ecoretail.com', totalOrders: 9, totalSpent: '$92,500' },
    { company: 'NaturePack', country: 'UK', contactPerson: 'Oliver Smith', email: 'oliver@naturepack.co.uk', totalOrders: 21, totalSpent: '$210,000' },
    { company: 'Global Imports', country: 'UAE', contactPerson: 'Tariq Al-Mansoor', email: 'tariq@globalimports.ae', totalOrders: 5, totalSpent: '$45,000' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers & Buyer Accounts"
        subtitle="Manage international and domestic client directory and accounts."
        badge="CRM Directory"
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        }
      />

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Country</th>
              <th className="py-3.5 px-4">Primary Contact</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {customers.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{c.company}</td>
                <td className="py-3.5 px-4 text-slate-500">{c.country}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800">{c.contactPerson}</td>
                <td className="py-3.5 px-4 text-slate-500">{c.email}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{c.totalOrders} orders</td>
                <td className="py-3.5 px-4 font-bold text-blue-600">{c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
