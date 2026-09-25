import Link from 'next/link';
import { Suspense } from 'react';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';

export default function ContactPage() {
  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent(
    'Hello eSailor export team,\n\nI would like to inquire about your jute bag manufacturing capabilities and pricing.\n\nBest regards,'
  );
  const directWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Global Trade Desk
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Contact Our Export Team
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Connect directly with our international sales desk, schedule a facility visit, or request
          instant production consultations via WhatsApp, email, or telephone.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Direct Communication Channels */}
        <div className="space-y-6">
          {/* Primary Quick Action: WhatsApp & Phone */}
          <div className="rounded-2xl border border-secondary/40 bg-surface p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-primary">Instant Buyer Communication</h2>
            <p className="mt-2 text-sm text-foreground/75">
              For real-time responses to specifications, custom sizing questions, or immediate shipping
              quotes, message our foreign trade team on WhatsApp.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-6 py-3.5 text-base font-semibold text-background transition hover:bg-secondary/90 shadow"
              >
                <span>💬</span>
                Chat on WhatsApp (+91 98765 43210)
              </a>

              <a
                href="tel:+911234567890"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-5 py-3.5 text-base font-semibold text-primary transition hover:bg-primary/5"
              >
                <span>📞</span>
                Call Export Desk
              </a>
            </div>

            <div className="mt-5 border-t border-border pt-4 text-xs text-foreground/60">
              ⚡ Typical response time on WhatsApp: under 2 hours during trade hours (IST / GMT / EST coverage).
            </div>
          </div>

          {/* Contact Details Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Email Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <span className="text-2xl">✉️</span>
              <h3 className="mt-3 text-lg font-bold text-primary">Email Inquiries</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-foreground/70">Export Sales:</p>
                <a
                  href="mailto:export@esailor.in"
                  className="block font-medium text-accent hover:underline"
                >
                  export@esailor.in
                </a>
                <p className="mt-2 text-foreground/70">General Information:</p>
                <a
                  href="mailto:info@esailor.in"
                  className="block font-medium text-accent hover:underline"
                >
                  info@esailor.in
                </a>
              </div>
            </div>

            {/* Hours Card */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <span className="text-2xl">🕒</span>
              <h3 className="mt-3 text-lg font-bold text-primary">Office & Desk Hours</h3>
              <div className="mt-2 space-y-1 text-sm text-foreground/75">
                <p>
                  <strong>Monday – Friday:</strong>
                </p>
                <p>09:00 – 19:00 IST (UTC +5:30)</p>
                <p className="mt-2">
                  <strong>Saturday:</strong>
                </p>
                <p>10:00 – 15:00 IST</p>
                <p className="mt-1 text-xs text-foreground/50">24/7 quote request submission online</p>
              </div>
            </div>
          </div>

          {/* Formal Quote Request CTA Card */}
          <div className="rounded-2xl border border-primary/20 bg-surface-muted p-6 sm:p-8">
            <h3 className="text-xl font-bold text-primary">Need a Detailed Commercial FOB Quote?</h3>
            <p className="mt-2 text-sm text-foreground/80">
              For structured wholesale inquiries with custom branding, specific dimensions, Pantone
              color codes, and volume breakdowns, use our online quote request tool.
            </p>
            <div className="mt-5">
              <Link
                href="/quote-request"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-background transition hover:bg-primary/90"
              >
                Open Quote Request Form →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Facility Location & Port Logistics */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <span className="text-3xl">🏭</span>
            <h2 className="mt-3 text-2xl font-bold text-primary">Manufacturing Facility & Head Office</h2>

            <div className="mt-5 space-y-4 text-foreground/80">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Works & Manufacturing Mill:
                </h3>
                <p className="mt-1 text-base">
                  eSailor Jute Mills & Export Unit
                  <br />
                  Hari Abasan Phase 1, Hanapara
                  <br />
                  North 24 Parganas, Kolkata, West Bengal, 700101
                  <br />
                  India
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                  Corporate Export Office:
                </h3>
                <p className="mt-1 text-base">
                  eSailor Trade House
                  <br />
                  Sector V, Salt Lake City
                  <br />
                  Kolkata, West Bengal 700091
                  <br />
                  India
                </p>
              </div>
            </div>

            {/* Port & Logistics Info */}
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-base font-bold text-primary">Port Logistics & Sea Freight</h3>
              <p className="mt-2 text-sm text-foreground/75">
                Our facilities maintain dedicated daily freight dispatch routes to:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/75">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">⚓</span>
                  <span>
                    <strong>Syama Prasad Mookerjee Port (Kolkata Port):</strong> 38 km — Daily container
                    terminal gate-in.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">⚓</span>
                  <span>
                    <strong>Haldia Dock Complex (Deep Sea Container Port):</strong> 125 km — Direct
                    feeder vessel connectivity to Singapore & Colombo hubs.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">✈️</span>
                  <span>
                    <strong>Netaji Subhash Chandra Bose Int&apos;l Airport (CCU):</strong> 22 km —
                    Courier sample and urgent air freight dispatches.
                  </span>
                </li>
              </ul>
            </div>

            {/* Facility Visit Booking */}
            <div className="mt-6 rounded-xl bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Planning an On-Site Factory Audit?
              </p>
              <p className="mt-1 text-xs text-foreground/70">
                Overseas buyers and third-party inspectors can schedule guided mill inspections. We provide
                local transit assistance from Kolkata airport and nearby commercial hotels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
