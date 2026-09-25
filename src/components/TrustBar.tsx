"use client";

export const TrustBar = () => {
  return (
    <section className="bg-[#FAF8F5] border-b border-[#EAE5DD] py-6 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

          {/* Left: Certifications */}
          <div className="w-full lg:w-auto flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A7369] block mb-3.5">
              OUR CERTIFICATIONS
            </span>

            {/* 4 Certification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 items-center">
              
              {/* 1. RCMC */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2D2A26] bg-transparent text-[#2D2A26] font-bold text-xs tracking-tighter shadow-sm">
                  RCMC
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1C1917] leading-tight">JPDEPC – RCMC</span>
                  <span className="text-[10px] text-[#6B645C] font-medium leading-tight">Registration-cum-Membership Certificate</span>
                </div>
              </div>

              {/* 2. IEC */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2D2A26] bg-transparent text-[#2D2A26] font-bold text-xs tracking-tighter shadow-sm">
                  IEC
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1C1917] leading-tight">IEC</span>
                  <span className="text-[10px] text-[#6B645C] font-medium leading-tight">Importer Exporter Code</span>
                </div>
              </div>

              {/* 3. GST */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2D2A26] bg-transparent text-[#2D2A26] font-bold text-xs tracking-tighter shadow-sm">
                  GST
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1C1917] leading-tight">GST</span>
                  <span className="text-[10px] text-[#6B645C] font-medium leading-tight">GST Registered</span>
                </div>
              </div>

              {/* 4. Udyam */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2D2A26] bg-transparent text-[#2D2A26] font-bold text-xs tracking-tighter shadow-sm">
                  UDYAM
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1C1917] leading-tight">Udyam</span>
                  <span className="text-[10px] text-[#6B645C] font-medium leading-tight">Micro Enterprise</span>
                </div>
              </div>

            </div>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block h-12 w-px bg-[#E2DDD5] mx-4" />

          {/* Right: Trusted Globally Stats */}
          <div className="w-full lg:w-auto shrink-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#7A7369] block mb-3.5">
              TRUSTED GLOBALLY
            </span>
            <div className="flex items-center gap-8 sm:gap-12">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-none">50+</p>
                <p className="text-xs text-[#6B645C] font-medium mt-1 leading-tight">Countries Served</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-none">15+</p>
                <p className="text-xs text-[#6B645C] font-medium mt-1 leading-tight">Years in Business</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-normal text-[#1C1917] leading-none">2M+</p>
                <p className="text-xs text-[#6B645C] font-medium mt-1 leading-tight">Bags / Month Capacity</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};