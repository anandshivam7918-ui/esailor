import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getProducts, getCategories, getCertifications } from '../src/lib/admin-store.js';

describe('Phase 13: QA, Security & SEO Consistency Audit Tests', () => {
  // ========================================================
  // 1. SEO INFRASTRUCTURE & METADATA AUDIT
  // ========================================================
  describe('1. SEO & Sitemap Generation Audit', () => {
    it('verifies robots.txt disallows admin paths and references sitemap', async () => {
      const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
      const content = await fs.readFile(robotsPath, 'utf-8');

      assert.ok(content.includes("disallow: ['/admin', '/api/admin/']"), 'Robots must disallow /admin and /api/admin/');
      assert.ok(content.includes("allow: '/'"), 'Robots must allow public crawling');
      assert.ok(content.includes('/sitemap.xml'), 'Robots must reference sitemap.xml');
    });

    it('verifies sitemap includes all static routes, categories, and active products', async () => {
      const [products, categories] = await Promise.all([getProducts(), getCategories()]);

      assert.ok(products.length >= 10, 'Expected at least 10 products in catalog');
      assert.ok(categories.length >= 5, 'Expected at least 5 categories');

      const sitemapPath = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
      const content = await fs.readFile(sitemapPath, 'utf-8');

      // Check required static route URLs
      assert.ok(content.includes('/catalog'));
      assert.ok(content.includes('/quote-request'));
      assert.ok(content.includes('/certifications'));
      assert.ok(content.includes('/process'));
      assert.ok(content.includes('/about'));
      assert.ok(content.includes('/contact'));

      // Check dynamic mapping logic exists
      assert.ok(content.includes('/category/'));
      assert.ok(content.includes('/product/'));

      // Verify admin routes are NOT exposed in sitemap
      assert.equal(content.includes("url: `${baseUrl}/admin`"), false, 'Admin must not be in sitemap');
    });

    it('verifies JSON-LD structured schema markup is present in layout', async () => {
      const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
      const content = await fs.readFile(layoutPath, 'utf-8');

      assert.ok(content.includes('<JsonLd />'), 'Layout must render JsonLd component');
    });
  });

  // ========================================================
  // 2. SECURITY & ENVIRONMENT PRIVACY AUDIT
  // ========================================================
  describe('2. Security & Environment Privacy Audit', () => {
    it('verifies .gitignore blocks private customer leads and env files', async () => {
      const gitignorePath = path.join(process.cwd(), '.gitignore');
      const content = await fs.readFile(gitignorePath, 'utf-8');

      assert.ok(content.includes('.env*'), '.gitignore must ignore .env*');
      assert.ok(content.includes('data/quote-requests.json'), '.gitignore must ignore quote-requests.json for GDPR/privacy');
    });

    it('verifies .env.example contains no hardcoded production secrets', async () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      const content = await fs.readFile(envExamplePath, 'utf-8');

      assert.ok(!content.includes('sk_live_'), 'No live API keys in .env.example');
      assert.ok(!content.includes('re_live_'), 'No live Resend keys in .env.example');
    });
  });

  // ========================================================
  // 3. ASSET & DOCUMENTATION AUDIT
  // ========================================================
  describe('3. Public Assets & Compliance Audit', () => {
    it('verifies compliance dossier PDF exists with valid PDF header', async () => {
      const pdfPath = path.join(process.cwd(), 'public', 'certificates', 'compliance-dossier.pdf');
      const buffer = await fs.readFile(pdfPath);

      assert.ok(buffer.length > 100, 'Compliance dossier PDF must not be empty');
      const header = buffer.subarray(0, 5).toString('ascii');
      assert.equal(header, '%PDF-', 'Must be a valid PDF file');
    });

    it('verifies product catalog PDF exists with valid PDF header', async () => {
      const pdfPath = path.join(process.cwd(), 'public', 'catalog.pdf');
      const buffer = await fs.readFile(pdfPath);

      assert.ok(buffer.length > 100, 'Catalog PDF must not be empty');
      const header = buffer.subarray(0, 5).toString('ascii');
      assert.equal(header, '%PDF-', 'Must be a valid PDF file');
    });

    it('verifies client acceptance checklist document is complete', async () => {
      const docPath = path.join(process.cwd(), 'docs', 'client-acceptance-checklist.md');
      const content = await fs.readFile(docPath, 'utf-8');

      assert.ok(content.includes('Criterion 1: Real Product Catalog Content'));
      assert.ok(content.includes('Criterion 2: Verified Certification Compliance'));
      assert.ok(content.includes('Criterion 3: Quote Request Conversion Engine'));
      assert.ok(content.includes('Criterion 4: WhatsApp B2B CTA Routing'));
      assert.ok(content.includes('Criterion 5: Responsive Mobile Experience'));
      assert.ok(content.includes('Criterion 6: Admin CMS & Dashboard Portal'));
    });
  });

  // ========================================================
  // 4. DATA INTEGRITY & SPECIFICATION AUDIT
  // ========================================================
  describe('4. Data Integrity & Specification Audit', () => {
    it('verifies all 10 products have complete B2B manufacturing specifications', async () => {
      const products = await getProducts();
      assert.equal(products.length >= 10, true);

      for (const p of products) {
        assert.ok(p.name, `Product missing name: ${JSON.stringify(p)}`);
        assert.ok(p.slug?.current, `Product missing slug: ${p.name}`);
        assert.ok(p.dimensions, `Product missing dimensions: ${p.name}`);
        assert.ok(typeof p.gsmWeight === 'number' && p.gsmWeight >= 200, `Product missing valid GSM weight: ${p.name}`);
        assert.ok(typeof p.moq === 'number' && p.moq >= 50, `Product missing valid MOQ: ${p.name}`);
        assert.ok(p.indicativePriceRangeMin > 0, `Product missing min FOB price: ${p.name}`);
        assert.ok(p.indicativePriceRangeMax >= p.indicativePriceRangeMin, `Product min price exceeds max: ${p.name}`);
        assert.ok(Array.isArray(p.images) && p.images.length > 0, `Product missing images: ${p.name}`);
      }
    });

    it('verifies all 5 export certifications are active and unexpired', async () => {
      const certs = await getCertifications();
      assert.ok(certs.length >= 5, 'Must have at least 5 verified certifications');

      const validCerts = certs.filter((c) => c.isValid);
      assert.equal(validCerts.length, certs.length, 'All active compliance certifications must be unexpired');
    });
  });
});
