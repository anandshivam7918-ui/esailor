"use client";

import { useState } from 'react';
import { PremiumButton } from './PremiumButton';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  buttonClassName?: string;
}

export const ExpandableSection = ({
  title,
  children,
  defaultExpanded = false,
  className = '',
  buttonClassName = '',
}: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div className={`${className} space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <PremiumButton
          variant="outline"
          size="sm"
          className={buttonClassName}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <span className="ml-2 transition-transform duration-200">
            {isExpanded ? '▲' : '▼'}
          </span>
        </PremiumButton>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};