import { ReactNode } from 'react';

interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
  flush?: boolean; // Remove horizontal padding
  px?: number; // Custom horizontal padding (uses spacing scale)
  py?: number; // Custom vertical padding (uses spacing scale)
  maxW?: string; // Custom max width
}

export const LayoutContainer = ({
  children,
  className = '',
  flush = false,
  px = 4, // Default px-4
  py = 6, // Default py-6
  maxW = '7xl', // Default max-w-7xl
}: LayoutContainerProps) => {
  return (
    <div className={`${className} mx-auto max-w-${maxW} px-${flush ? 0 : px} py-${py}`}>
      {children}
    </div>
  );
};