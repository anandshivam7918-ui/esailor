import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sustainable Manufacturing Process | eSailor.in Jute Factory',
  description:
    'Discover our 6-stage eco-friendly manufacturing process: from ethical Ganges Delta fiber retting and spinning to precision loom weaving, AZO-free printing, and export packing.',
  openGraph: {
    title: 'Sustainable Jute Bag Manufacturing Process | eSailor.in',
    description:
      'Explore our certified sustainable manufacturing chain: 100% biodegradable jute fibers, water-based printing, and zero-waste cutting.',
    url: 'https://esailor.in/process',
  },
};


interface ProcessStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  keySpecs: string[];
  imageUrl: string;
  icon: string;
}

const processSteps: ProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Raw Jute Sourcing & Retting',
    subtitle: '100% Biodegradable Plant Fibers',
    description:
      'We source premium golden jute fibers directly from certified sustainable farming cooperatives in the Ganges Delta. The raw stalks undergo natural microbiological retting in slow-moving fresh water, separating pliable, high-tensile bast fibers without harsh synthetic chemicals.',
    keySpecs: [
      'Grade: TD-4 / W-4 Export Standard',
      'Naturally water-retted for 14–21 days',
      'Zero chlorine bleaching agents',
    ],
    imageUrl: '/images/process/raw-jute-harvest.jpg',
    icon: '🌾',
  },
  {
    stepNumber: 2,
    title: 'Carding & Spinning into Yarn',
    subtitle: 'High-Tensile Strength Spinning',
    description:
      'Harvested fibers are conditioned with vegetable-based batching oil emulsion, combed through multiple carding passes to align filaments, and drawn into sliver. Precision ring spinning produces strong, uniform jute yarn tailored to specific ply and count requirements.',
    keySpecs: [
      'Yarn count: 6 lbs to 28 lbs',
      'Twist per inch (TPI) optimized for heavy loads',
      'Food-grade batching oil compliance',
    ],
    imageUrl: '/images/process/spinning-yarn-bobbins.jpg',
    icon: '🧵',
  },
  {
    stepNumber: 3,
    title: 'Weaving into Fabric (Hessian & Burlap)',
    subtitle: 'High-Density Loom Weaving',
    description:
      'Modern automated shuttleless looms weave yarn into durable canvas, dense hessian, and laminated jute fabrics. We tightly monitor fabric density (picks and ends per inch) to ensure uniform surface texture, opacity, and extreme tear resistance.',
    keySpecs: [
      'Fabric weight: 240 GSM to 450 GSM',
      'Plain & twill weave configurations',
      'Optional biodegradable plant-laminate backing',
    ],
    imageUrl: '/images/process/loom-weaving-photo.jpg',
    icon: '🧶',
  },
  {
    stepNumber: 4,
    title: 'Pattern Cutting & Heavy-Duty Stitching',
    subtitle: 'Reinforced Load-Bearing Seams',
    description:
      'Precision laser and die cutting machines cut fabric panels to exacting millimeter tolerances. Industrial lockstitch and overlock sewing lines construct bag bodies with double-folded top hems and reinforced "X-box" cross-stitching on all handle anchor points.',
    keySpecs: [
      'Industrial nylon/poly-blend bonded thread',
      'Box-X stitch reinforcement on handles',
      'Handle options: Cotton rope, woven webbing, self-jute',
    ],
    imageUrl: '/images/process/artisan-stitching-photo.jpg',
    icon: '✂️',
  },
  {
    stepNumber: 5,
    title: 'Eco-Friendly Custom Printing',
    subtitle: 'Azo-Free Pigments & Sharp Branding',
    description:
      'Custom buyer branding, promotional graphics, and barcodes are applied using water-based, non-toxic pigment inks. We offer multi-color automatic carousel screen printing, sharp heat transfers, and fine embroidery that withstands repeated laundering and sun exposure.',
    keySpecs: [
      'OEKO-TEX compliant azo-free inks',
      'Up to 8-color screen printing capabilities',
      'Pantone PMS accurate color matching',
    ],
    imageUrl: '/images/process/screen-printing-photo.jpg',
    icon: '🎨',
  },
  {
    stepNumber: 6,
    title: 'Quality Inspection & Export Packing',
    subtitle: 'Rigorous 100% Pre-Shipment Audit',
    description:
      'Every finished unit passes our 4-tier inspection: dimension gauge verification, seam tensile pull-testing (up to 25 kg load capacity), visual defect audit, and needle detector screening. Approved bags are compressed into moisture-sealed export cartons or fumigated wooden pallets.',
    keySpecs: [
      'AQL 2.5 international inspection standard',
      'Tensile handle pull tests up to 25 kg',
      'Moisture barrier desiccant sealed cartons',
    ],
    imageUrl: '/images/process/export-inspection-photo.jpg',
    icon: '📦',
  },
];

export default function ManufacturingProcessPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="mb-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Engineering Sustainability
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Our Manufacturing Process
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
          From unrefined golden jute stalks to high-durability export retail bags, explore the
          disciplined steps, sustainable machinery, and strict quality control behind every eSailor order.
        </p>
      </div>

      {/* Production Metrics Bar */}
      <div className="mb-16 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm md:grid-cols-4 md:p-8">
        <div className="border-r border-border pr-4 last:border-r-0">
          <p className="text-3xl font-extrabold text-primary sm:text-4xl">500,000+</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Monthly Bag Capacity
          </p>
          <p className="mt-0.5 text-xs text-foreground/60">Scalable for global retail volume</p>
        </div>
        <div className="border-r border-border pr-4 last:border-r-0">
          <p className="text-3xl font-extrabold text-primary sm:text-4xl">25 kg+</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Load-Bearing Rating
          </p>
          <p className="mt-0.5 text-xs text-foreground/60">Tested on reinforced X-box seams</p>
        </div>
        <div className="border-r border-border pr-4 last:border-r-0">
          <p className="text-3xl font-extrabold text-primary sm:text-4xl">100%</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Biodegradable Base
          </p>
          <p className="mt-0.5 text-xs text-foreground/60">Natural renewable golden fiber</p>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-primary sm:text-4xl">AQL 2.5</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Quality Inspection Level
          </p>
          <p className="mt-0.5 text-xs text-foreground/60">Strict international trade standard</p>
        </div>
      </div>

      {/* Process Sequence */}
      <section className="mb-20">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-primary">Stage-by-Stage Production Flow</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Structured step sequence from raw materials to export-ready packaging.
            </p>
          </div>
          <span className="rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1 text-xs font-semibold text-secondary">
            ISO & Sedex Audited Process
          </span>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DESKTOP LAYOUT: Horizontal / Multi-Column Flow (>= lg) */}
        {/* ---------------------------------------------------- */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <article
                key={step.stepNumber}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
              >
                <div>
                  {/* Image Preview with Step Badge */}
                  <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl bg-surface-muted">
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-background shadow-md">
                      {step.stepNumber}
                    </div>
                    <div className="absolute right-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                      {step.icon} Stage {step.stepNumber}
                    </div>
                  </div>

                  {/* Titles */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {step.subtitle}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-primary">{step.title}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    {step.description}
                  </p>
                </div>

                {/* Key Technical Specs */}
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                    Quality Benchmarks:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-foreground/70">
                    {step.keySpecs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent">✓</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MOBILE LAYOUT: Vertical Progressive Stepper (< lg)    */}
        {/* ---------------------------------------------------- */}
        <div className="lg:hidden">
          <div className="relative space-y-8 border-l-2 border-accent/40 pl-6 ml-4">
            {processSteps.map((step) => (
              <div key={step.stepNumber} className="relative">
                {/* Step Connector Marker */}
                <div className="absolute -left-[37px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-accent text-sm font-bold text-background shadow">
                  {step.stepNumber}
                </div>

                {/* Content Card */}
                <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                  <div className="h-44 w-full bg-surface-muted">
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{step.icon}</span>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                        Stage {step.stepNumber} — {step.subtitle}
                      </p>
                    </div>

                    <h3 className="mt-1 text-xl font-bold text-primary">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                      {step.description}
                    </p>

                    <div className="mt-4 rounded-xl bg-surface-muted p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                        Technical Standards:
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-foreground/75">
                        {step.keySpecs.map((spec, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-accent font-bold">✓</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Control Assurance Guarantee */}
      <section className="mb-16 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
              Quality Assurance Policy
            </span>
            <h2 className="mt-3 text-3xl font-bold text-primary">
              Zero-Defect Commitment for Global Importers
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">
              Export shipments must withstand transoceanic shipping, fluctuating humidity, and repeated
              retail handling. We apply standardized stress tests to every production run prior to bill of lading generation:
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="font-bold text-primary">Handle Pull Test</p>
                <p className="mt-1 text-xs text-foreground/70">
                  Deadweight load sustained up to 25 kg with zero seam tearing.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="font-bold text-primary">Moisture Check</p>
                <p className="mt-1 text-xs text-foreground/70">
                  Electronic hygrometer checks ensure fiber moisture stays below 14%.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="font-bold text-primary">Needle Detection</p>
                <p className="mt-1 text-xs text-foreground/70">
                  Full conveyer metal detection to safeguard retail consumers.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface-muted p-4">
                <p className="font-bold text-primary">Colorfastness Audit</p>
                <p className="mt-1 text-xs text-foreground/70">
                  Rub-fastness and light-fastness verified for print longevity.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface-muted p-6 text-center">
            <span className="text-5xl">🏭</span>
            <h3 className="mt-4 text-2xl font-bold text-primary">Visit or Audit Our Facility</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-foreground/75">
              We welcome buyer visits and third-party inspection agencies (SGS, Intertek, Bureau Veritas)
              for in-line and final random pre-shipment inspections.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-md border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Schedule Facility Audit
              </Link>
              <Link
                href="/quote-request"
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-primary/90"
              >
                Request Custom Sample Run
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-2xl border border-primary/20 bg-primary p-8 text-center text-background">
        <h2 className="text-3xl font-bold">Ready to Launch Your Custom Jute Bag Production?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-background/85">
          Submit your design specifications, dimensions, and estimated quantities. Our technical
          production team will provide a comprehensive manufacturing quote within 24 hours.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/quote-request"
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent/90"
          >
            Request Manufacturing Quote
          </Link>
          <Link
            href="/catalog"
            className="rounded-md border border-background/30 px-6 py-3 text-sm font-semibold text-background transition hover:bg-background/10"
          >
            Browse Production Styles
          </Link>
        </div>
      </section>
    </main>
  );
}
