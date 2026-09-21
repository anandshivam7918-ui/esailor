import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  // Base button classes
  const baseClasses = `
    font-sans
    font-weight-medium
    rounded
    border
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
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

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim()}
      {...props}
    />
  );
};