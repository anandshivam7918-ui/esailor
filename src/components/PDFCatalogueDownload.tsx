import Link from 'next/link';
import { PremiumButton } from './ui/PremiumButton';

export const PDFCatalogueDownload = () => {
  return (
    <Link
      href="/catalog.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex
        items-center
        gap-2
        rounded-card
        border
        border-accent
        bg-accent
        text-background
        hover:bg-accent/90
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent
        focus-visible:ring-offset-2
        transition-all
        duration-200
        font-sans
        font-weight-medium
        px-4
        py-2
        text-sm
        flex-wrap
        gap-x-2
        gap-y-1
        hover-lift
      "
    >
      <span className="text-[20px]">📄</span>
      <span className="hidden md:inline-block">
        Download Catalogue
      </span>
      <span className="block md:hidden text-xs text-background/80">
        Product Catalog
      </span>
    </Link>
  );
};