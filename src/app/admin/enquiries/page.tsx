'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import {
  Inbox,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Globe,
  X,
  FileText,
} from 'lucide-react';

interface EnquiryItem {
  id: string;
  company: string;
  country: string;
  product: string;
  quantity: string;
  status: 'new' | 'contacted' | 'quoted' | 'pending' | 'closed';
  date: string;
  email: string;
  phone: string;
  notes?: string;
}

const initialEnquiries: EnquiryItem[] = [
  {
    id: 'ENO-1048',
    company: 'GreenMart Ltd.',
    country: 'Germany',
    product: 'Shopping Bag',
    quantity: '10,000 pcs',
    status: 'new',
    date: 'Apr 28, 2026',
    email: 'purchasing@greenmart.de',
    phone: '+49 30 123456',
    notes: 'Looking for 300 GSM laminated shopping bags with custom eco handle printing.',
  },
  {
    id: 'ENO-1047',
    company: 'EcoRetail Inc.',
    country: 'USA',
    product: 'Tote Bag',
    quantity: '5,000 pcs',
    status: 'contacted',
    date: 'Apr 27, 2026',
    email: 'info@ecoretail.com',
    phone: '+1 212 555 0198',
    notes: 'Requires sample swatch shipment before bulk production.',
  },
  {
    id: 'ENO-1046',
    company: 'NaturePack',
    country: 'UK',
    product: 'Burlap Sack',
    quantity: '20,000 pcs',
    status: 'quoted',
    date: 'Apr 26, 2026',
    email: 'orders@naturepack.co.uk',
    phone: '+44 20 7946 0912',
    notes: 'Quotation Q-2087 sent. Waiting for buyer sign-off.',
  },
  {
    id: 'ENO-1045',
    company: 'Global Imports',
    country: 'UAE',
    product: 'Bottle Bag',
    quantity: '3,000 pcs',
    status: 'pending',
    date: 'Apr 25, 2026',
    email: 'buyer@globalimports.ae',
    phone: '+971 4 321 4567',
    notes: 'Custom 2-bottle burlap bag with internal divider.',
  },
  {
    id: 'ENO-1044',
    company: 'Sunrite Trading',
    country: 'Australia',
    product: 'Shopping Bag',
    quantity: '8,000 pcs',
    status: 'closed',
    date: 'Apr 24, 2026',
    email: 'supply@sunrite.com.au',
    phone: '+61 2 9876 5432',
    notes: 'Converted to Order #ESO-1042.',
  },
];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Filtered data
  const filteredData = enquiries.filter((item) => {
    const matchesSearch =
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Enquiries / Leads"
        subtitle="Manage and track all incoming enquiries from global clients."
        badge="Leads Pipeline"
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Enquiry</span>
          </button>
        }
      />

      {/* 5 Metric Pill Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Total Enquiries</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">124</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            ↑ 12%
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">New</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">34</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">Contacted</p>
          <p className="text-xl font-bold text-sky-600 mt-0.5">28</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">Quoted</p>
          <p className="text-xl font-bold text-indigo-600 mt-0.5">22</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <p className="text-[11px] text-slate-400 font-medium">Converted</p>
          <p className="text-xl font-bold text-teal-600 mt-0.5">18</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search enquiries..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs rounded-xl px-3 py-2 border border-slate-200 focus:outline-none"
          >
            <option value="all">All Countries</option>
            <option value="Germany">Germany</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="UAE">UAE</option>
            <option value="Australia">Australia</option>
          </select>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Main Enquiries Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 font-medium">{enq.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{enq.company}</td>
                  <td className="py-3.5 px-4 text-slate-500">{enq.country}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{enq.product}</td>
                  <td className="py-3.5 px-4 text-slate-600">{enq.quantity}</td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={enq.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{enq.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedEnquiry(enq)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-[11px] bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      View <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredData.length} of 124 entries</span>
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-7 h-7 rounded-lg font-semibold text-xs ${
                  page === 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{selectedEnquiry.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedEnquiry.company}</h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <p className="text-[10px] text-slate-400">Product</p>
                  <p className="font-semibold">{selectedEnquiry.product}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Quantity</p>
                  <p className="font-semibold">{selectedEnquiry.quantity}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Country</p>
                  <p className="font-semibold">{selectedEnquiry.country}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Status</p>
                  <AdminStatusBadge status={selectedEnquiry.status} />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedEnquiry.email}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedEnquiry.phone}</span>
                </p>
              </div>

              {selectedEnquiry.notes && (
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Requirement Notes</p>
                  <p className="text-slate-700 mt-1">{selectedEnquiry.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Close
              </button>
              <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md">
                Send Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
