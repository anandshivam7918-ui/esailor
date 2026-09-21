"use client";

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { InputField } from './ui/InputField';
import { PremiumButton } from './ui/PremiumButton';

type QuoteRequestFormProps = {
  defaultProduct?: string;
};

interface FormState {
  buyerName: string;
  companyName: string;
  country: string;
  buyerType: 'international' | 'domestic' | '';
  product: string;
  quantity: string;
  email: string;
  phone: string;
  customizationNotes: string;
  website_hp: string; // Honeypot field
}

export function QuoteRequestForm({ defaultProduct = '' }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState<FormState>({
    buyerName: '',
    companyName: '',
    country: '',
    buyerType: '',
    product: defaultProduct,
    quantity: '1000',
    email: '',
    phone: '',
    customizationNotes: '',
    website_hp: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    quoteRefId: string;
    buyerName: string;
    product: string;
    quantity: string;
    email: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setFieldErrors(result.errors);
          setServerError('Please review the highlighted fields below.');
        } else {
          setServerError(
            result.message || 'Unable to submit enquiry. Your entered data has been preserved. Please retry.'
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      setSubmittedData({
        quoteRefId: result.quoteRefId || 'QR-CONFIRMED',
        buyerName: formData.buyerName,
        product: formData.product,
        quantity: formData.quantity,
        email: formData.email,
      });
    } catch (err: unknown) {
      console.error('Submission error:', err);
      setServerError(
        'Network communication error. Your form details are saved. Please click "Retry Submission" to try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Direct Manufacturer Pricing
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Request Wholesale FOB Quote
        </h1>
        <p className="mt-3 text-base text-foreground/80">
          Provide your order specifications, target volume, and branding requirements. Our export desk
          will calculate freight estimates and provide a formal quotation within 24 hours.
        </p>
      </div>

    {submittedData ? (
      /* Confirmation State */
      <div className="rounded-2xl border border-success/40 bg-surface p-8 shadow-sm sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-2xl text-success">
            ✓
          </span>
          <div>
            <h2 className="text-2xl font-bold text-primary">Enquiry Successfully Logged</h2>
            <p className="text-xs text-foreground/60">
              Reference ID: <strong className="font-mono text-primary">{submittedData.quoteRefId}</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface-muted p-5 text-sm">
          <h3 className="font-bold text-primary">Summary of Request:</h3>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-foreground/80">
            <p>
              <strong>Buyer:</strong> {submittedData.buyerName}
            </p>
            <p>
              <strong>Confirmation Email:</strong> {submittedData.email}
            </p>
            <p>
              <strong>Product of Interest:</strong> {submittedData.product}
            </p>
            <p>
              <strong>Quantity:</strong> {submittedData.quantity} units
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-sm text-foreground/75">
          <p>
            ⚡ <strong>What happens next:</strong> Our foreign trade specialists will review your
            specifications, calculate FOB Kolkata port container freight, and email a complete quotation dossier
            within 24 business hours.
          </p>
          <p>
            Need immediate urgent assistance? You can also message our sales desk on WhatsApp quoting
            reference <strong>{submittedData.quoteRefId}</strong>.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 border-t border-border pt-6">
          <Link
            href="/catalog"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-background shadow hover:bg-primary/90"
          >
            Browse More Products
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmittedData(null);
              setFormData({
                buyerName: '',
                companyName: '',
                country: '',
                buyerType: '',
                product: '',
                quantity: '1000',
                email: '',
                phone: '',
                customizationNotes: '',
                website_hp: '',
              });
            }}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    ) : (
      /* Form State */
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10"
      >
        {/* Failure / Error Alert with Retry */}
        {serverError && (
          <div className="mb-8 rounded-xl border border-error/30 bg-error/10 p-5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-error">Submission Notice</h3>
                  <p className="mt-0.5 text-foreground/80">{serverError}</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-error px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-error/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Retrying...' : 'Retry Now'}
              </button>
            </div>
          </div>
        )}

        {/* Hidden Honeypot Field (Spam Bot Protection) */}
        <div className="hidden" aria-hidden="true" tabIndex={-1}>
          <label htmlFor="website_hp">Leave this empty</label>
          <input
            type="text"
            id="website_hp"
            name="website_hp"
            autoComplete="off"
            value={formData.website_hp}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <InputField
              id="buyerName"
              name="buyerName"
              type="text"
              label="Full Name"
              placeholder="e.g. Johnathan Davis"
              value={formData.buyerName}
              onChange={handleChange}
              error={fieldErrors.buyerName}
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <InputField
              id="companyName"
              name="companyName"
              type="text"
              label="Company / Organization"
              placeholder="e.g. GreenLife Retailers Ltd."
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          {/* Country */}
          <div>
            <InputField
              id="country"
              name="country"
              type="text"
              label="Destination Country"
              placeholder="e.g. United Kingdom, Germany, USA"
              value={formData.country}
              onChange={handleChange}
              error={fieldErrors.country}
              required
            />
          </div>

          {/* Buyer Type */}
          <div>
            <label htmlFor="buyerType" className="block text-sm font-medium text-primary">
              Buyer Classification <span className="text-error">*</span>
            </label>
            <select
              id="buyerType"
              name="buyerType"
              required
              value={formData.buyerType}
              onChange={handleChange}
              className={`mt-2 w-full rounded-md border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                fieldErrors.buyerType
                  ? 'border-error focus:ring-error'
                  : 'border-border focus:border-primary'
              }`}
            >
              <option value="" disabled>
                Select buyer type
              </option>
              <option value="international">
                International Importer / Brand (Global Freight)
              </option>
              <option value="domestic">
                Domestic Buyer (India GST Billing)
              </option>
            </select>
            {fieldErrors.buyerType && (
              <p className="mt-1 text-xs text-error">{fieldErrors.buyerType}</p>
            )}
          </div>

          {/* Product of Interest */}
          <div className="md:col-span-2">
            <InputField
              id="product"
              name="product"
              type="text"
              label="Product(s) of Interest"
              placeholder="e.g. 100% Organic Jute Tote Bag, Drawstring Burlap Bags"
              value={formData.product}
              onChange={handleChange}
              error={fieldErrors.product}
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <InputField
              id="quantity"
              name="quantity"
              type="number"
              label="Target Quantity (Units)"
              placeholder="1000"
              value={formData.quantity}
              onChange={handleChange}
              error={fieldErrors.quantity}
              required
              min="1"
            />
          </div>

          {/* Email */}
          <div>
            <InputField
              id="email"
              name="email"
              type="email"
              label="Business Email"
              placeholder="buyer@company.com"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="md:col-span-2">
            <InputField
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number (with Country Code)"
              placeholder="+44 20 7123 4567 or +1 (555) 019-2834"
              value={formData.phone}
              onChange={handleChange}
              error={fieldErrors.phone}
              required
            />
          </div>

          {/* Customization Notes */}
          <div className="md:col-span-2">
            <InputField
              id="customizationNotes"
              name="customizationNotes"
              type="textarea"
              label="Customization & Packaging Notes"
              placeholder="Include custom bag dimensions (L x W x H), Pantone color matching, logo print positions, handle material (rope vs webbing), or export packing requirements."
              value={formData.customizationNotes}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-foreground/60">
            🔒 Your commercial details are protected and shared solely with our export pricing team.
          </p>

          <PremiumButton
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-accent px-8 py-3.5 text-base font-semibold text-background shadow transition hover:bg-accent/90 disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? 'Submitting Enquiry...' : 'Submit Quote Request →'}
          </PremiumButton>
        </div>
      </form>
    )}
  </div>
  );
}