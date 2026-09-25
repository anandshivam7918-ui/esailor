"use client";

import { useEffect, useState } from 'react';
import { sanityClient } from '@/lib/sanity';
import { StatCounter } from './ui/StatCounter';

interface MetricProofPoint {
  id: string;
  value: string;
  label: string;
  headline: string;
  operationalDetail: string;
  assurancePill: string;
}

const METRIC_PROOF_POINTS: MetricProofPoint[] = [
  {
    id: 'capacity',
    value: '500,000+',
    label: 'Monthly Production Capacity',
    headline: 'High-Volume Production Ready',
    operationalDetail: 'High-speed automated laser cutting and multi-needle stitching lines engineered for seasonal retail rushes.',
    assurancePill: 'Zero Stockout Risk',
  },
  {
    id: 'export',
    value: '28+',
    label: 'Global Export Destinations',
    headline: 'Seamless International Freight',
    operationalDetail: 'FOB, CIF & DDP shipping through Kolkata, Haldia, and Nhava Sheva ports with complete customs documentation.',
    assurancePill: 'Global Port Access',
  },
  {
    id: 'quality',
    value: '99.8%',
    label: 'On-Spec Delivery Rating',
    headline: 'Industrial Grade Assurance',
    operationalDetail: 'Dual-pass metal detection, Box-X handle stress verification, and documented batch lot tracking.',
    assurancePill: 'AQL 1.5 Standard',
  },
  {
    id: 'experience',
    value: '15+',
    label: 'Years of Jute Engineering',
    headline: 'Deep Bengal Delta Mastery',
    operationalDetail: 'Direct farm-level cooperative sourcing of golden jute fibers with in-house lamination and azo-free print labs.',
    assurancePill: 'Direct Manufacturer',
  },
];

export const Stats = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    const statsElement = document.getElementById('stats-proof-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement);
      }
    };
  }, []);

  return (
    <div id="stats-proof-section" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_PROOF_POINTS.map((metric, index) => (
          <div
            key={metric.id}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {metric.assurancePill}
                </span>
                <span className="text-xs font-mono text-foreground/40">
                  0{index + 1}
                </span>
              </div>

              {/* Big Stat Value */}
              <div className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-1">
                <StatCounter
                  value={metric.value}
                  label=""
                  animate={animated}
                  delayMs={index * 120}
                />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                {metric.label}
              </p>

              <h4 className="font-serif text-base font-bold text-foreground mb-2">
                {metric.headline}
              </h4>

              <p className="text-xs text-foreground/75 leading-relaxed">
                {metric.operationalDetail}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-border/70 flex items-center gap-2 text-[11px] text-foreground/60">
              <span className="text-success font-bold">✓</span>
              <span>Verified factory metric</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};