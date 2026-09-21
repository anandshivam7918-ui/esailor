import { ReactNode } from 'react';

interface CertificationBadgeProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  className?: string;
  description?: string;
}

export const CertificationBadge = ({
  title,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  description,
}: CertificationBadgeProps) => {
  const baseClasses = `
    flex
    items-center
    justify-center
    rounded-badge
    border
    text-xs
    font-medium
    transition-all
    duration-200
    hover-lift
  `;

  const variantClasses = {
    primary: `
      bg-primary/10
      text-primary
      border-primary
      hover:bg-primary/20
    `,
    secondary: `
      bg-secondary/15
      text-secondary
      border-secondary
      hover:bg-secondary/25
    `,
    accent: `
      bg-accent/15
      text-accent
      border-accent
      hover:bg-accent/25
    `,
    success: `
      bg-success/15
      text-success
      border-success
      hover:bg-success/25
    `,
    outline: `
      text-transparent
      bg-transparent
      border-0
      hover:bg-primary/5
    `,
  }[variant] || '';

  const sizeClasses = {
    sm: `h-8 w-8 text-[10px]`,
    md: `h-9 w-9 text-xs`,
    lg: `h-10 w-10 text-sm`,
  }[size] || 'h-9 w-9 text-xs';

  return (
    <div className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}>
      {children}
      {description && (
        <div className="mt-2 text-center text-xs">
          <p className="font-medium">{title}</p>
          <p className="text-foreground/60">{description}</p>
        </div>
      )}
      {!description && title && (
        <span className="text-center">{title}</span>
      )}
    </div>
  );
};