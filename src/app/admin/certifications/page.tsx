'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Award, FileText, Download, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertItem {
  id: string;
  name: string;
  code: string;
  validUntil: string;
  status: 'valid' | 'expired';
  description: string;
}

const certsList: CertItem[] = [
  {
    id: '1',
    name: 'RCMC Certificate',
    code: 'RCMC Registration No. JUTE-88902',
    validUntil: 'Valid till: Dec 31, 2026',
    status: 'valid',
    description: 'Registration Cum Membership Certificate issued by the Jute Products Export Promotion Council.',
  },
  {
    id: '2',
    name: 'IEC Certificate',
    code: 'Import Export Code: 0519098231',
    validUntil: 'Valid till: Dec 31, 2026',
    status: 'valid',
    description: 'Directorate General of Foreign Trade (DGFT) primary license for global import/export.',
  },
  {
    id: '3',
    name: 'GST Certificate',
    code: 'GSTIN: 19AAACE1234F1Z5',
    validUntil: 'Valid till: Dec 31, 2026',
    status: 'valid',
    description: 'Goods and Services Tax Registration Certificate for domestic & export invoicing.',
  },
  {
    id: '4',
    name: 'UDYAM Registration',
    code: 'UDYAM-WB-03-0012984',
    validUntil: 'Valid till: Dec 31, 2026',
    status: 'valid',
    description: 'MSME Micro, Small and Medium Enterprises Enterprise Registration Certificate.',
  },
];

export default function CertificationsPage() {
  const [activeTab, setActiveTab] = useState<'certifications' | 'documents'>('certifications');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Certifications & Documents"
        subtitle="Manage your certification, licenses and important documentation."
        badge="Compliance & Export Credentials"
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('certifications')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'certifications'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          Certifications
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'documents'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          Documents
        </button>
      </div>

      {/* Grid of Cert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certsList.map((cert) => (
          <div
            key={cert.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <AdminStatusBadge status={cert.status} />
              </div>

              <h3 className="text-base font-bold text-slate-900">{cert.name}</h3>
              <p className="text-xs font-mono font-semibold text-blue-600 mt-0.5">{cert.code}</p>
              <p className="text-[11px] text-slate-400 mt-1">{cert.validUntil}</p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{cert.description}</p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                View
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
