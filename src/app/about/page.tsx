import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero / Introduction */}
      <div className="mb-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Our Heritage & Story
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Crafting the Future of Sustainable Packaging
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
          eSailor is an export-focused manufacturer of eco-friendly jute bags and customized textile
          packaging, bridging sustainable farming with global commercial retail.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="mx-auto max-w-3xl space-y-8 text-foreground/85">
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Roots in the Golden Fiber Belt</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            Founded in West Bengal, India — the epicenter of the world&apos;s finest jute cultivation —
            eSailor began with a simple yet ambitious vision: to replace single-use plastic packaging
            with 100% natural, biodegradable, and durable jute products that withstand international
            commercial demands.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            Over the years, we have grown from a localized weaving unit into a comprehensive export
            facility equipped with modern semi-automated looms, precision laser cutting tables,
            non-toxic water-based screen printing setups, and rigorous multi-stage quality control
            laboratories.
          </p>
        </section>

        {/* Export Track Record */}
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Global Export Experience</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            With over 15 years of dedicated foreign trade experience, eSailor has delivered over
            12 million custom bags to commercial importers, major supermarket chains, promotional
            marketing agencies, and luxury fashion brands across 25+ countries, including Germany,
            the United Kingdom, the United States, Japan, the UAE, and Australia.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            Our export desk possesses deep institutional knowledge of international trade documentation,
            Incoterms (FOB, CIF, CFR, DDP), Certificate of Origin procedures, and strict chemical
            trade registrations and documentation, including RCMC, IEC, GST, and Udyam.
          </p>
        </section>

        {/* Location & Logistical Advantage */}
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Strategic Location & Port Proximity</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            Our primary manufacturing operations and warehousing centers are located in the industrial
            corridor of Greater Kolkata, West Bengal, India.
          </p>
          <div className="mt-6 rounded-xl border border-secondary/30 bg-secondary/10 p-5">
            <h3 className="text-base font-semibold text-primary">Logistics Advantage</h3>
            <p className="mt-1 text-sm text-foreground/75">
              Situated within 45 kilometers of Kolkata&apos;s Syama Prasad Mookerjee Sea Port and Netaji Subhash
              Chandra Bose International Airport, our facility ensures rapid container loading, reduced
              inland haulage time, and dependable sailing schedules for 20ft and 40ft High Cube containers.
            </p>
          </div>
        </section>

        {/* Ethical Standards & Sustainability */}
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Commitment to People & Planet</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <span className="text-2xl">🌿</span>
              <h3 className="mt-2 text-lg font-bold text-primary">100% Biodegradable</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                Jute fibers naturally decompose within months without leaving toxic microplastics or
                chemical residue in soil or oceans.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <span className="text-2xl">🤝</span>
              <h3 className="mt-2 text-lg font-bold text-primary">Fair Ethical Labor</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                We maintain documented workplace practices and responsible sourcing processes to support
                dependable, transparent export operations.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <span className="text-2xl">💧</span>
              <h3 className="mt-2 text-lg font-bold text-primary">Zero Chemical Effluent</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                Our printing processes exclusively utilize water-based, azo-free pigments certified free
                from restricted heavy metals and carcinogenic amines.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <span className="text-2xl">🔍</span>
              <h3 className="mt-2 text-lg font-bold text-primary">Rigorous Quality Checks</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                Every batch undergoes tensile handle tests, fabric GSM verification, and metal detection
                prior to carton sealing.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Export Metrics Counter Bar */}
      <div className="mx-auto my-16 max-w-5xl rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div>
            <p className="text-4xl font-extrabold text-primary sm:text-5xl">15+</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Years of Export
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary sm:text-5xl">25+</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Countries Served
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary sm:text-5xl">12M+</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Bags Delivered
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary sm:text-5xl">500k</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Monthly Capacity
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="rounded-2xl border border-primary/20 bg-primary p-8 text-center text-background">
        <h2 className="text-3xl font-bold">Partner with an Experienced Jute Manufacturer</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-background/80">
          Whether you need a custom shopping tote program for national retail or customized burlap sacks
          for agricultural trade, our export team is ready to serve you.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/catalog"
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent/90"
          >
            Explore Product Catalog
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-background/30 px-6 py-3 text-sm font-semibold text-background transition hover:bg-background/10"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
