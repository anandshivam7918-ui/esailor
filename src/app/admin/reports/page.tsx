'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SalesBarChart } from '@/components/admin/charts/SalesBarChart';
import { BarChart3, Download, DollarSign, ShoppingBag, Inbox, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'orders' | 'enquiries' | 'production'>('sales');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Reports & Analytics"
        subtitle="View sales, enquiries, orders and production analytics."
        badge="Business Intelligence"
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold text-slate-500">
        {(['sales', 'orders', 'enquiries', 'production'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 border-b-2 capitalize transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Sales</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">$248,500</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ 18% vs last month</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">54</p>
            <p className="text-[11px] text-blue-600 font-bold mt-1">↑ 16% vs last month</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Enquiries</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">124</p>
            <p className="text-[11px] text-indigo-600 font-bold mt-1">↑ 12% vs last month</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sales Overview Bar Chart Container */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Sales Overview</h2>
            <p className="text-[11px] text-slate-400">Monthly breakdown of gross revenue generated</p>
          </div>
        </div>
        <SalesBarChart />
      </div>
    </div>
  );
}
