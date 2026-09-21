import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

export const PremiumButton = ({
  variant = 'primary',
  size = 'md',
  className = '',
  asChild = false,
  children,
  ...props
}: PremiumButtonProps) => {
  // Base button classes
  const baseClasses = `
    font-sans
    font-weight-medium
    rounded-btn
    border
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-offset-2
    disabled:pointer-events-none
    disabled:opacity-50
    transition-all
    duration-200
    flex
    items-center
    justify-center
    gap-2
    whitespace-nowrap
    hover-lift
  `;

  // Variant classes
  const variantClasses = {
    primary: `
      bg-primary
      text-background
      border-primary
      hover:bg-primary/90
      focus-visible:ring-primary
      focus-visible:ring-offset-primary/20
    `,
    secondary: `
      bg-secondary
      text-background
      border-secondary
      hover:bg-secondary/90
      focus-visible:ring-secondary
      focus-visible:ring-offset-secondary/20
    `,
    outline: `
      text-primary
      border-primary
      hover:bg-primary/10
      focus-visible:ring-primary
      focus-visible:ring-offset-primary/20
    `,
    ghost: `
      text-primary/80
      hover:bg-primary/5
      hover:text-primary
    `,
  }[variant];

  // Size classes
  const sizeClasses = {
    sm: `
      h-9
      px-3
      text-sm
    `,
    md: `
      h-10
      px-4
      text-base
    `,
    lg: `
      h-11
      px-5
      text-lg
    `,
  }[size];

  // Determine which element to render
  const Component = asChild ? 'span' : 'button';

  return (
    <Component
      {...(props as any)}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
    >
      {children}
    </Component>
  );
};