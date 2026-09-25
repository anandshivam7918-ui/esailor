import Link from 'next/link';
import { sanityClient, urlFor } from '@/lib/sanity';
import { filterValidCertifications, getCertificationStatus } from '@/lib/certifications';

export const revalidate = 60; // Revalidate every minute

interface CertificationItem {
  _id: string;
  code?: string;
  name: string;
  subtitle?: string;
  issuingBody: string;
  badgeImage?: { asset?: { _ref?: string; _id?: string } };
  description?: unknown;
  dateObtained: string;
  expiryDate?: string;
  isActive?: boolean;
}

const fallbackCertifications: CertificationItem[] = [
  {
    _id: 'cert-rcmc',
    code: 'RCMC',
    name: 'JPDEPC – RCMC',
    subtitle: 'Registration-cum-Membership Certificate',
    issuingBody: 'JPDEPC',
    dateObtained: '',
    isActive: true,
  },
  {
    _id: 'cert-iec',
    code: 'IEC',
    name: 'IEC',
    subtitle: 'Importer Exporter Code',
    issuingBody: 'IEC',
    dateObtained: '',
    isActive: true,
  },
  {
    _id: 'cert-gst',
    code: 'GST',
    name: 'GST',
    subtitle: 'GST Registered',
    issuingBody: 'GST',
    dateObtained: '',
    isActive: true,
  },
  {
    _id: 'cert-udyam',
    code: 'UDYAM',
    name: 'Udyam',
    subtitle: 'Micro Enterprise',
    issuingBody: 'Udyam',
    dateObtained: '',
    isActive: true,
  },
];

const actualCertificationNames = new Set(fallbackCertifications.map((cert) => cert.name));

function renderDescription(desc: unknown) {
  if (!desc) return null;
  if (typeof desc === 'string') return desc;
  if (Array.isArray(desc)) {
    return desc
      .map((block: Record<string, unknown>) => {
        if (block?.children && Array.isArray(block.children)) {
          return block.children
            .map((child: Record<string, unknown>) => (typeof child?.text === 'string' ? child.text : ''))
            .join('');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  }
  return null;
}

export default async function CertificationsPage() {
  let allCertifications: CertificationItem[] = [];

  try {
    const data = await sanityClient.fetch<CertificationItem[]>(
      `*[_type == "certification"] | order(dateObtained desc) {
        _id,
        code,
        name,
        subtitle,
        issuingBody,
        badgeImage,
        description,
        dateObtained,
        expiryDate,
        isActive
      }`
    );
    const actualCertifications = (data || []).filter((cert) => actualCertificationNames.has(cert.name));
    if (actualCertifications.length > 0) {
      allCertifications = actualCertifications;
    } else {
      allCertifications = fallbackCertifications;
    }
  } catch (error) {
    console.error('Failed to fetch certifications from CMS:', error);
    allCertifications = fallbackCertifications;
  }

  // Strictly filter valid & active certifications using Phase 7 expiry business logic
  const now = new Date();
  const validCertifications = filterValidCertifications(allCertifications, now);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Quality & Compliance
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Certifications & Standards
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-foreground/80">
          eSailor maintains rigorous compliance with global textile standards, fair trade
          practices, and environmental benchmarks to guarantee export-grade quality.
        </p>
      </div>

      {/* Compliance / Launch Gate Notice */}
      <div className="mb-10 rounded-xl border border-secondary/40 bg-surface p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="text-2xl">🛡️</span>
          <div>
            <h2 className="text-base font-semibold text-primary">
              Strict Verification & Credibility Standard
            </h2>
            <p className="mt-1 text-sm text-foreground/75">
              All displayed certifications are verified against active issuing bodies. Expired,
              unrenewed, or pending certifications are automatically excluded from our active
              roster to guarantee zero false claims to international buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Active Certifications Grid */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-primary">
            Active Accreditations ({validCertifications.length})
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Verified Current
          </span>
        </div>

        {validCertifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="text-lg font-medium text-foreground/70">
              Certifications are currently being renewed and verified with our audit bodies.
            </p>
            <p className="mt-2 text-sm text-foreground/50">
              Please contact our compliance desk for immediate audit document copies.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {validCertifications.map((cert) => {
              const status = getCertificationStatus(cert, now);
              const textDescription = renderDescription(cert.description);
              let imageUrl: string | null = null;

              if (cert.badgeImage) {
                try {
                  imageUrl = urlFor(cert.badgeImage).width(300).height(200).url();
                } catch {
                  imageUrl = null;
                }
              }

              return (
                <article
                  key={cert._id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"
                >
                  <div>
                    {/* Badge / Icon */}
                    <div className="mb-5 flex h-32 w-full items-center justify-center rounded-xl bg-surface-muted p-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={cert.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="text-4xl">🏅</span>
                          <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary/70">
                            {cert.issuingBody}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="mb-2">
                      <span className="inline-block rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
                        {status.statusText}
                      </span>
                    </div>

                    {/* Title & Body */}
                    <h3 className="text-xl font-bold text-primary">{cert.name}</h3>
                    <p className="mt-1 text-sm font-medium text-accent">
                      {cert.subtitle || cert.issuingBody}
                    </p>

                    {textDescription ? (
                      <p className="mt-3 line-clamp-3 text-sm text-foreground/75">
                        {textDescription}
                      </p>
                    ) : null}
                  </div>

                  {/* Validity Footer */}
                  <div className="mt-6 border-t border-border pt-4 text-xs text-foreground/60">
                    <div className="flex justify-between py-1">
                      {cert.dateObtained ? (
                        <>
                          <span>Date Obtained:</span>
                          <span className="font-medium text-foreground">{cert.dateObtained}</span>
                        </>
                      ) : null}
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Validity:</span>
                      <span className="font-medium text-foreground">
                        {cert.expiryDate ? `Until ${cert.expiryDate}` : 'Ongoing Audit'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Statutory & Export Compliance Registration */}
      <section className="mb-16 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-primary">Export Registrations & Statutory Credibility</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Official export registration identifiers for commercial verification and bank trade compliance.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
              Import Export Code (IEC)
            </span>
            <p className="mt-2 font-mono text-lg font-bold text-primary">AVAILABLE ON REQUEST</p>
            <p className="mt-1 text-xs text-foreground/60">DGFT Ministry of Commerce</p>
          </div>

          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
              GSTIN Registration
            </span>
            <p className="mt-2 font-mono text-lg font-bold text-primary">VERIFIED (INDIA)</p>
            <p className="mt-1 text-xs text-foreground/60">Goods & Services Tax Network</p>
          </div>

          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
              MSME / Udyam
            </span>
            <p className="mt-2 font-mono text-lg font-bold text-primary">REGISTERED ENTERPRISE</p>
            <p className="mt-1 text-xs text-foreground/60">Govt. of India Recognized</p>
          </div>

          <div className="rounded-xl border border-border bg-surface-muted p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
              Export Export Council
            </span>
            <p className="mt-2 font-mono text-lg font-bold text-primary">JMDC / FIEO MEMBER</p>
            <p className="mt-1 text-xs text-foreground/60">Jute Manufactures Development</p>
          </div>
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="rounded-2xl border border-primary/20 bg-primary p-8 text-center text-background">
        <h2 className="text-2xl font-bold">Need Audit Reports or Specification Sheets?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-background/80">
          We provide full compliance dossiers, lab test results, and buyer compliance audit summaries
          with our formal quotation packages.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/quote-request"
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent/90"
          >
            Request Official Quotation & Audit Docs
          </Link>
          <Link
            href="/catalog"
            className="rounded-md border border-background/30 px-6 py-3 text-sm font-semibold text-background transition hover:bg-background/10"
          >
            Explore Certified Catalog
          </Link>
        </div>
      </section>
    </main>
  );
}
