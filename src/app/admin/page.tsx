'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminKpiCard } from '@/components/admin/AdminKpiCard';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { TrendLineChart } from '@/components/admin/charts/TrendLineChart';
import { ProductDonutChart } from '@/components/admin/charts/ProductDonutChart';
import {
  Inbox,
  FileText,
  ShoppingBag,
  Factory,
  DollarSign,
  ArrowRight,
  Globe,
  Award,
  Calendar,
  ExternalLink,
  RefreshCw,
  Boxes,
} from 'lucide-react';

interface ProductionRow {
  id: string;
  product: string;
  quantity: string;
  image: string;
  status: string;
}

const defaultProductionRows: ProductionRow[] = [
  {
    id: 'ORD-1042',
    product: 'Shopping Bag',
    quantity: '10,000 pcs',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=200&auto=format&fit=crop',
    status: 'In Progress',
  },
  {
    id: 'ORD-1041',
    product: 'Tote Bag',
    quantity: '5,000 pcs',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop',
    status: 'Planning',
  },
  {
    id: 'ORD-1040',
    product: 'Burlap Sack',
    quantity: '20,000 pcs',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop',
    status: 'Production',
  },
  {
    id: 'ORD-1038',
    product: 'Bottle Bag',
    quantity: '8,000 pcs',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=200&auto=format&fit=crop',
    status: 'Confirmed',
  },
  {
    id: 'ORD-1035',
    product: 'Shopping Bag',
    quantity: '12,000 pcs',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=200&auto=format&fit=crop',
    status: 'In Progress',
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalEnquiries: 124,
    quotesSent: 86,
    totalOrders: 54,
    productionInProgress: 32,
    revenueEst: 248500,
  });

  const [productionRows] = useState<ProductionRow[]>(defaultProductionRows);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch {
        // fallback
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header matching mockup: "Good Morning, Ram" */}
      <AdminPageHeader
        title="Good Morning, Ram"
        subtitle="Here's what's happening with your business today."
        dateRangeText="Apr 28, 2026 – May 4, 2026"
      />

      {/* 5 Core KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminKpiCard
          title="Total Enquiries"
          value={stats.totalEnquiries}
          trend="12%"
          isIncrease={true}
          comparisonText="vs. last month"
          icon={Inbox}
          iconBgColor="bg-[#EBF2EE]"
          iconColor="text-[#1B4D3E]"
        />
        <AdminKpiCard
          title="Quotes Sent"
          value={stats.quotesSent}
          trend="9%"
          isIncrease={true}
          comparisonText="vs. last month"
          icon={FileText}
          iconBgColor="bg-[#EBF2EE]"
          iconColor="text-[#1B4D3E]"
        />
        <AdminKpiCard
          title="Orders Received"
          value={stats.totalOrders}
          trend="16%"
          isIncrease={true}
          comparisonText="vs. last month"
          icon={ShoppingBag}
          iconBgColor="bg-[#EBF2EE]"
          iconColor="text-[#1B4D3E]"
        />
        <AdminKpiCard
          title="Production Progress"
          value={stats.productionInProgress}
          trend="10%"
          isIncrease={true}
          comparisonText="vs. last month"
          icon={Factory}
          iconBgColor="bg-[#EBF2EE]"
          iconColor="text-[#1B4D3E]"
        />
        <AdminKpiCard
          title="Revenue (Est.)"
          value={`$${stats.revenueEst.toLocaleString()}`}
          trend="18%"
          isIncrease={true}
          comparisonText="vs. last month"
          icon={DollarSign}
          iconBgColor="bg-[#EBF2EE]"
          iconColor="text-[#1B4D3E]"
        />
      </div>

      {/* Trend Chart + Product Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiry & Order Trend Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF8F3] rounded-2xl p-6 border border-[#E6E0D3] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-[#0D281E]">
                Enquiry & Order Trend
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#1B4D3E]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]" />
                Enquiries
              </span>
              <span className="flex items-center gap-1.5 text-[#B58A43]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B58A43]" />
                Orders
              </span>
            </div>
          </div>
          <TrendLineChart />
        </div>

        {/* Orders by Product Type Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F3] rounded-2xl p-6 border border-[#E6E0D3] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0D281E]">
              Orders by Product Type
            </h2>
            <p className="text-xs text-[#8C8275] mb-4">Product order breakdown</p>
          </div>
          <ProductDonutChart totalOrders={stats.totalOrders} />
        </div>
      </div>

      {/* Global Reach Quick Stats Bar matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FAF8F3] p-5 rounded-2xl border border-[#E6E0D3] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EBF2EE] border border-[#D5E3DA] flex items-center justify-center text-[#1B4D3E] shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-serif font-bold text-[#0D281E]">50+</p>
            <p className="text-xs text-[#8C8275] font-semibold mt-0.5">Countries Served</p>
          </div>
        </div>

        <div className="bg-[#FAF8F3] p-5 rounded-2xl border border-[#E6E0D3] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EBF2EE] border border-[#D5E3DA] flex items-center justify-center text-[#1B4D3E] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-serif font-bold text-[#0D281E]">15+</p>
            <p className="text-xs text-[#8C8275] font-semibold mt-0.5">Years Experience</p>
          </div>
        </div>
      </div>

      {/* Upcoming Production Table matching screenshot */}
      <div className="bg-[#FAF8F3] rounded-2xl border border-[#E6E0D3] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E6E0D3] flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#0D281E]">
              Upcoming Production
            </h2>
            <p className="text-xs text-[#8C8275]">Active orders in manufacturing pipeline</p>
          </div>
          <Link
            href="/admin/production"
            className="text-xs font-bold text-[#1B4D3E] hover:text-[#0D281E] flex items-center gap-1 bg-[#EBF2EE] px-3 py-1.5 rounded-xl border border-[#D5E3DA] transition-colors"
          >
            View Production Floor <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EEE4] text-[#6E6457] font-semibold border-b border-[#E6E0D3] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Order #</th>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D3] text-[#0D281E]">
              {productionRows.map((row) => (
                <tr key={row.id} className="hover:bg-[#F2EEE4]/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#1B4D3E]">{row.id}</td>
                  <td className="py-3.5 px-6 font-semibold flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#E0DACF] bg-[#EFECE4] shrink-0">
                      <img src={row.image} alt={row.product} className="w-full h-full object-cover" />
                    </div>
                    <span>{row.product}</span>
                  </td>
                  <td className="py-3.5 px-6 text-[#6E6457] font-medium">{row.quantity}</td>
                  <td className="py-3.5 px-6 text-right">
                    <AdminStatusBadge status={row.status} />
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
