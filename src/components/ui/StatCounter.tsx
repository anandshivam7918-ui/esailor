"use client";

import { useEffect, useState } from 'react';

interface StatCounterProps {
  value: string | number;
  label: string;
  animate?: boolean;
  delayMs?: number;
  className?: string;
}

export const StatCounter = ({
  value,
  label,
  animate = true,
  delayMs = 0,
  className = '',
}: StatCounterProps) => {
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, [animate, delayMs]);

  useEffect(() => {
    if (animated) {
      // Simple count-up animation - in a real implementation, this would be more sophisticated
      setDisplayValue(value);
    } else {
      setDisplayValue(value);
    }
  }, [animated, value]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${animated ? 'count-up' : ''} text-4xl font-extrabold text-primary sm:text-5xl`}>
        {displayValue}
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-foreground/75">
        {label}
      </p>
    </div>
  );
};