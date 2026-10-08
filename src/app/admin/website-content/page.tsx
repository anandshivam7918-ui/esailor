'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Globe, Edit, FileText, CheckCircle } from 'lucide-react';

export default function WebsiteContentPage() {
  const pages = [
    { name: 'Home Page Hero & Banners', slug: '/', lastUpdated: '2 hours ago', status: 'Published' },
    { name: 'About eSailor & Eco Heritage', slug: '/about', lastUpdated: '1 day ago', status: 'Published' },
    { name: 'Manufacturing Process & Loom Tech', slug: '/process', lastUpdated: '3 days ago', status: 'Published' },
    { name: 'Contact & Global Office Locations', slug: '/contact', lastUpdated: '5 days ago', status: 'Published' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Content Management"
        subtitle="Update public marketing copy, hero banners, and company information."
        badge="CMS Editor"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((p, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {p.status}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{p.name}</h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{p.slug}</p>
              <p className="text-[11px] text-slate-400 mt-1">Updated {p.lastUpdated}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold">
              <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit Page
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
