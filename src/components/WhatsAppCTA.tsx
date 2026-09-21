"use client";

export interface WhatsAppCTAProps {
  className?: string;
  variant?: 'fixed' | 'inline';
  productName?: string;
}

export const WhatsAppCTA = ({
  className = '',
  variant = 'fixed',
  productName = 'eSailor Jute Bags',
}: WhatsAppCTAProps) => {
  const whatsappNumber = "919876543210";
  const message = encodeURIComponent(
    `Hello eSailor export team,\n\nI am interested in ${productName}.\n\nPlease provide quotation details regarding:\n- Wholesale FOB Pricing\n- Minimum Order Quantity (MOQ)\n- Custom Branding / Dimensions\n- Current Production Lead Time\n\nThank you!`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  const isInline = variant === 'inline';

  return (
    <div
      className={[
        isInline
          ? 'relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-[#20ba59]'
          : 'fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-200 hover:scale-110 hover:bg-[#20ba59]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp with eSailor Export Desk"
        className="flex h-full w-full items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={isInline ? "22" : "28"}
          height={isInline ? "22" : "28"}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.075-2.025-.477-1.705-.708-2.793-2.457-2.879-2.571-.083-.114-.69-1.026-.69-1.956 0-.931.479-1.385.65-1.576.171-.191.375-.239.5-.239.125 0 .25.002.359.007.116.006.271-.044.423.323.158.381.542 1.32.59 1.417.049.097.081.21.018.334-.063.125-.095.203-.189.313-.095.11-.199.245-.284.329-.095.093-.194.195-.084.383.111.189.493.813 1.059 1.316.729.648 1.344.85 1.533.943.189.094.3.08.411-.048.113-.127.483-.562.612-.755.128-.192.257-.161.433-.096.176.064 1.116.526 1.308.622.192.096.32.143.367.224.048.08.048.468-.096.873z" />
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10c-1.77 0-3.435-.467-4.887-1.284l-5.113 1.284 1.338-4.908c-.859-1.486-1.338-3.197-1.338-5.092 0-5.514 4.486-10 10-10zm0 2c-4.411 0-8 3.589-8 8 0 1.597.476 3.084 1.293 4.336l-.843 3.094 3.197-.803c1.213.76 2.646 1.373 4.353 1.373 4.411 0 8-3.589 8-8s-3.589-8-8-8z" />
        </svg>
      </a>
    </div>
  );
};