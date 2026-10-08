"use client";

import React, { useState } from "react";
import { Check, X, ExternalLink, FileText } from "lucide-react";

interface CertificationItem {
  code: string;
  title: string;
  description: string;
  issuer: string;
  docUrl?: string;
}

const certificationsData: CertificationItem[] = [
  {
    code: "RCMC",
    title: "JPDEPC – RCMC",
    description: "Registration-cum-Membership Certificate",
    issuer: "Jute Products Export Promotion Council",
    docUrl: "/certificates/compliance-dossier.pdf",
  },
  {
    code: "IEC",
    title: "IEC",
    description: "Importer Exporter Code",
    issuer: "Directorate General of Foreign Trade",
    docUrl: "/certificates/compliance-dossier.pdf",
  },
  {
    code: "GST",
    title: "GST",
    description: "GST Registered",
    issuer: "Goods & Services Tax Network (India)",
    docUrl: "/certificates/compliance-dossier.pdf",
  },
  {
    code: "UDYAM",
    title: "Udyam",
    description: "Micro Enterprise",
    issuer: "Ministry of MSME, Govt. of India",
    docUrl: "/certificates/compliance-dossier.pdf",
  },
];

export const TrustBar = () => {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  return (
    <section className="bg-[#FAF8F5] border-b border-[#EAE5DD] py-8 sm:py-9 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">

          {/* Left: Certifications Section */}
          <div className="w-full lg:w-auto flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A7369]">
                OUR CERTIFICATIONS
              </span>
              <span className="text-[10px] text-[#24402F] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-[#24402F]" /> Verified Trade Accreditations
              </span>
            </div>

            {/* 4 Certification Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {certificationsData.map((cert) => (
                <div
                  key={cert.code}
                  onClick={() => setSelectedCert(cert)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCert(cert);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${cert.title} details`}
                  className="group relative bg-[#FAF8F5] rounded-xl border border-[#E0DACF] p-3.5 sm:p-4 flex items-center gap-3.5 cursor-pointer transition-all duration-200 hover:border-[#1C3224] hover:bg-white hover:-translate-y-0.5 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1C3224]/30"
                >
                  {/* Clean Typographic Certification Badge */}
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1C3224]/30 bg-white text-[#1C3224] font-bold text-xs tracking-tight shadow-xs transition-colors duration-200 group-hover:border-[#1C3224] group-hover:bg-[#1C3224] group-hover:text-white">
                    <span>{cert.code}</span>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1C3224] text-white text-[9px] shadow-xs group-hover:bg-[#C17F42]">
                      ✓
                    </span>
                  </div>

                  {/* Certification Description */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#1C1917] leading-snug group-hover:text-[#1C3224] transition-colors truncate">
                      {cert.title}
                    </span>
                    <span className="text-[11px] text-[#6B645C] font-medium leading-tight mt-0.5 group-hover:text-[#3A352F] transition-colors line-clamp-2">
                      {cert.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block h-16 w-px bg-[#E2DDD5] mx-2 self-center" />

          {/* Right: Trusted Globally Stats */}
          <div className="w-full lg:w-auto shrink-0 bg-white/60 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-[#E0DACF]">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A7369] block mb-3.5">
              TRUSTED GLOBALLY
            </span>
            <div className="flex items-center justify-between sm:justify-start gap-6 sm:gap-10">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-none">50+</p>
                <p className="text-[11px] text-[#6B645C] font-medium mt-1 leading-tight">Countries Served</p>
              </div>
              <div className="h-8 border-r border-[#E2DDD5]" />
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-none">15+</p>
                <p className="text-[11px] text-[#6B645C] font-medium mt-1 leading-tight">Years Experience</p>
              </div>
              <div className="h-8 border-r border-[#E2DDD5]" />
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-none">2M+</p>
                <p className="text-[11px] text-[#6B645C] font-medium mt-1 leading-tight">Bags / Month</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightweight Certificate Document Modal Viewer */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
        >
          <div
            className="bg-[#FAF8F5] rounded-2xl max-w-md w-full p-6 border border-[#E0DACF] shadow-2xl space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E0DACF] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C3224] text-white flex items-center justify-center font-bold text-xs">
                  {selectedCert.code}
                </div>
                <div>
                  <h3 id="cert-modal-title" className="text-base font-bold text-[#1C1917]">
                    {selectedCert.title}
                  </h3>
                  <p className="text-xs text-[#6B645C] font-medium">{selectedCert.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-full bg-[#EFEBE3] hover:bg-[#E2DDD5] text-[#1C1917] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E0DACF] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B645C] font-medium">Issuing Authority:</span>
                <span className="font-bold text-[#1C1917] text-right">{selectedCert.issuer}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-[#E0DACF]/60 pt-2">
                <span className="text-[#6B645C] font-medium">Verification Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                  ✓ Active & Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-[#E0DACF]/60 pt-2">
                <span className="text-[#6B645C] font-medium">Global Trade Scope:</span>
                <span className="font-semibold text-[#1C1917]">B2B Direct Export Compliant</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {selectedCert.docUrl ? (
                <a
                  href={selectedCert.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C3224] text-white text-xs font-semibold hover:bg-[#142419] transition-colors shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Official PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-[#6B645C]">Verified for International Commercial Trade</span>
              )}
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E0DACF] bg-[#EFEBE3] text-xs font-semibold text-[#1C1917] hover:bg-[#E2DDD5] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};