import { ReactNode } from 'react';

interface SectionDividerProps {
  variant?: 'solid' | 'dashed' | 'dotted' | 'textured' | 'branded';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const SectionDivider = ({
  variant = 'solid',
  orientation = 'horizontal',
  className = '',
}: SectionDividerProps) => {
  const baseClasses = `${orientation === 'horizontal' ? 'h-px' : 'w-px'} flex-shrink-0 transition-colors duration-200`;

  const variantClasses = {
    solid: 'bg-border',
    dashed: 'bg-[repeating-linear-gradient(to_right,var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_3px)]',
    dotted: 'bg-[repeating-radial-gradient(var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_2px)]',
    textured: 'bg-[url("/textures/jute-divider.png")] bg-contain',
    branded: 'bg-gradient-to-r from-primary/20 via-transparent to-primary/20',
  }[variant] || 'bg-border';

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} aria-orientation={orientation} role="separator" />
  );
};