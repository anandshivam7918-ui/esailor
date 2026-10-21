import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  verifyAdminSessionToken,
  getAdminSessionFromRequest,
  SESSION_COOKIE_NAME,
  isAdminAuthConfigured,
} from '../src/lib/admin-auth.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getQuoteRequests,
  updateQuoteRequestStatus,
  generateQuoteRequestsCSV,
  updateOrderStatus,
  updateProductionProgress,
  updateInventoryQty,
} from '../src/lib/admin-store.js';

process.env.ADMIN_USER = 'test-admin';
process.env.ADMIN_PASSWORD = 'test-only-password';
process.env.SESSION_SECRET = 'test-only-session-secret-with-more-than-32-characters';
process.env.SANITY_API_TOKEN = '';
describe('Phase 11: Admin CMS & Dashboard Functional & Integration Tests', () => {
  // ========================================================
  // 1. AUTHENTICATION & SESSION MANAGEMENT
  // ========================================================
  describe('1. Admin Authentication & Session Management', () => {
    it('fails closed when the session signing secret is missing or too short', () => {
      const configuredSecret = process.env.SESSION_SECRET;
      try {
        delete process.env.SESSION_SECRET;
        assert.equal(isAdminAuthConfigured(), false);
        assert.equal(verifyAdminCredentials('test-admin', 'test-only-password'), false);
        process.env.SESSION_SECRET = 'too-short';
        assert.equal(isAdminAuthConfigured(), false);
      } finally {
        process.env.SESSION_SECRET = configuredSecret;
      }
      assert.equal(isAdminAuthConfigured(), true);
    });

    it('verifies valid admin credentials and rejects invalid ones', () => {
      assert.equal(verifyAdminCredentials('test-admin', 'test-only-password'), true);
      assert.equal(verifyAdminCredentials('test-admin', 'wrong-password'), false);
      assert.equal(verifyAdminCredentials('wrong-user', 'test-only-password'), false);
      assert.equal(verifyAdminCredentials('', ''), false);
    });

    it('creates and verifies a signed HMAC admin session token', () => {
      const token = createAdminSessionToken('test-admin', 'admin');
      assert.ok(token);
      assert.ok(token.includes('.'));

      const verified = verifyAdminSessionToken(token);
      assert.equal(verified.valid, true);
      assert.equal(verified.user?.username, 'test-admin');
      assert.equal(verified.user?.role, 'admin');
    });

    it('rejects tampered or forged session tokens', () => {
      const token = createAdminSessionToken('test-admin', 'admin');
      const parts = token.split('.');
      const tampered = `${parts[0]}.forgedsignature12345`;

      const result = verifyAdminSessionToken(tampered);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Invalid token signature');

      const garbageResult = verifyAdminSessionToken('not-even-a-token');
      assert.equal(garbageResult.valid, false);
    });

    it('extracts admin session correctly from Request cookie or Bearer header', () => {
      const token = createAdminSessionToken('test-admin', 'admin');

      // Test cookie header extraction
      const reqWithCookie = {
        headers: new Headers({
          cookie: `other_cookie=123; ${SESSION_COOKIE_NAME}=${token}; theme=dark`,
        }),
      };
      const sessionFromCookie = getAdminSessionFromRequest(reqWithCookie);
      assert.equal(sessionFromCookie.valid, true);
      assert.equal(sessionFromCookie.user?.username, 'test-admin');

      // Test Bearer header extraction
      const reqWithBearer = {
        headers: new Headers({
          authorization: `Bearer ${token}`,
        }),
      };
      const sessionFromBearer = getAdminSessionFromRequest(reqWithBearer);
      assert.equal(sessionFromBearer.valid, true);
      assert.equal(sessionFromBearer.user?.username, 'test-admin');

      // Test unauthenticated request
      const unauthReq = { headers: new Headers() };
      const unauthSession = getAdminSessionFromRequest(unauthReq);
      assert.equal(unauthSession.valid, false);
    });
  });

  // ========================================================
  // 2. CATEGORY CRUD & DELETION SAFEGUARD
  // ========================================================
  describe('2. Category CRUD & Deletion Safeguard', () => {
    let testCategoryId = '';
    let testProductId = '';

    it('creates and reads a new category', async () => {
      const uniqueSuffix = Date.now().toString(36);
      const created = await createCategory({
        name: `Test Luxury Jute ${uniqueSuffix}`,
        description: 'Premium organic jute packaging for luxury exports',
        displayOrder: 99,
      });

      assert.ok(created._id);
      assert.equal(created.name, `Test Luxury Jute ${uniqueSuffix}`);
      assert.ok(created.slug.current.includes('test-luxury-jute'));
      testCategoryId = created._id;


      const allCats = await getCategories();
      const found = allCats.find((c) => c._id === testCategoryId);
      assert.ok(found);
    });

    it('updates an existing category', async () => {
      const updated = await updateCategory(testCategoryId, {
        description: 'Updated luxury description for tests',
        displayOrder: 88,
      });

      assert.equal(updated.description, 'Updated luxury description for tests');
      assert.equal(updated.displayOrder, 88);
    });

    it('SAFEGUARD: blocks category deletion when products are still assigned to it', async () => {
      // Create a test product assigned to this category
      const prod = await createProduct({
        name: `Assigned Product ${Date.now()}`,
        category: { _ref: testCategoryId, name: `Test Luxury Jute` },
        images: [{ url: '/images/test-bag.webp', alt: 'Test' }],
        moq: 200,
        isActive: true,
      });
      testProductId = prod._id;

      // Attempt to delete category while product is assigned -> MUST FAIL
      let errorThrown = null;
      try {
        await deleteCategory(testCategoryId);
      } catch (err) {
        errorThrown = err;
      }

      assert.ok(errorThrown, 'Expected deletion to be blocked');
      assert.equal(errorThrown.code, 'CATEGORY_IN_USE');
      assert.ok(errorThrown.message.includes('product(s) are currently assigned'));

      // Verify category still exists
      const catsAfter = await getCategories();
      assert.ok(catsAfter.some((c) => c._id === testCategoryId));
    });

    it('allows category deletion after assigned products are removed', async () => {
      // Clean up product first
      if (testProductId) {
        await deleteProduct(testProductId);
      }

      // Deleting category should now succeed
      const deleteResult = await deleteCategory(testCategoryId);
      assert.equal(deleteResult.success, true);

      // Verify it is gone
      const catsAfter = await getCategories();
      assert.equal(catsAfter.some((c) => c._id === testCategoryId), false);
    });
  });

  // ========================================================
  // 3. PRODUCT CRUD & ZERO-IMAGE WARNING SAFEGUARD
  // ========================================================
  describe('3. Product CRUD & Zero-Image Warning Safeguard', () => {
    let testProductId = '';

    it('validates category and MOQ, enforces unique slugs, and keeps drafts private', async () => {
      const category = (await getCategories())[0];
      const slug = `catalog-test-${Date.now()}`;
      const draft = await createProduct({
        name: `Catalog Test ${Date.now()}`, slug, category: category._id, moq: 1000,
        status: 'Draft', isActive: true, images: [],
      });
      assert.equal((await getProducts(false)).some((product) => product._id === draft._id), false);

      await assert.rejects(
        createProduct({ name: 'Invalid category product', category: 'missing-category', moq: 1000, status: 'Draft' }),
        /category that exists/
      );
      await assert.rejects(
        createProduct({ name: 'Duplicate slug product', slug, category: category._id, moq: 1000, status: 'Draft' }),
        /slug is already in use/
      );
      await assert.rejects(
        updateProduct(draft._id, { moq: 0 }),
        /MOQ must be a whole number/
      );

      const published = await updateProduct(draft._id, {
        status: 'Published', isActive: true, images: [{ url: '/images/products/jute-tote-studio.jpg', alt: 'Catalog test' }],
      });
      assert.equal((await getProducts(false)).some((product) => product._id === published._id), true);
      await deleteProduct(draft._id);
    });

    it('SAFEGUARD: warns and blocks publishing active product with zero images', async () => {
      let errorThrown = null;
      try {
        await createProduct({
          name: `Unimaged Product ${Date.now()}`,
          category: (await getCategories())[0]._id,
          moq: 1000,
          images: [], // Zero images!
          isActive: true, // Attempting to publish
          confirmZeroImages: false,
        });
      } catch (err) {
        errorThrown = err;
      }

      assert.ok(errorThrown, 'Expected zero-image warning to be triggered');
      assert.equal(errorThrown.code, 'ZERO_IMAGES_WARNING');
      assert.equal(errorThrown.requiresConfirmation, true);
    });

    it('allows publishing zero-image product when editor explicitly confirms', async () => {
      const prod = await createProduct({
        name: `Override Product ${Date.now()}`,
        category: (await getCategories())[0]._id,
        moq: 1000,
        images: [],
        isActive: true,
        confirmZeroImages: true, // Explicit override
      });

      assert.ok(prod._id);
      assert.equal(prod.images.length, 0);
      assert.equal(prod.isActive, true);
      testProductId = prod._id;
    });

    it('creates product with valid image array without warning', async () => {
      const prodWithImg = await createProduct({
        name: `Tote Bag With Image ${Date.now()}`,
        category: (await getCategories())[0]._id,
        moq: 1000,
        images: [{ url: '/images/products/jute-tote-hero.webp', alt: 'Hero' }],
        isActive: true,
      });

      assert.ok(prodWithImg._id);
      assert.equal(prodWithImg.images.length, 1);
      await deleteProduct(prodWithImg._id);
    });

    it('updates product and deletes cleanly', async () => {
      const updated = await updateProduct(testProductId, {
        description: 'Updated description for zero image test product',
        moq: 1500,
        confirmZeroImages: true,
      });

      assert.equal(updated.moq, 1500);
      assert.equal(updated.description, 'Updated description for zero image test product');

      const delResult = await deleteProduct(testProductId);
      assert.equal(delResult.success, true);
      const allProds = await getProducts();
      assert.equal(allProds.some((p) => p._id === testProductId), false);
    });
  });

  // ========================================================
  // 4. CERTIFICATIONS CRUD
  // ========================================================
  describe('4. Certifications CRUD', () => {
    let testCertId = '';

    it('creates, updates, and validates a certification', async () => {
      const created = await createCertification({
        name: 'Fair Trade Organic Standard',
        code: 'FT-ORG-99',
        issuingBody: 'Fair Trade USA',
        issueDate: '2024-01-01',
        expiryDate: '2028-12-31',
        isActive: true,
      });

      assert.ok(created._id);
      assert.equal(created.isValid, true);
      assert.equal(created.statusDetail?.statusText, 'Active');
      testCertId = created._id;

      const updated = await updateCertification(testCertId, {
        expiryDate: '2020-01-01', // Expired!
      });

      assert.equal(updated.isValid, false);
      assert.equal(updated.statusDetail?.statusText, 'Expired');

      const delResult = await deleteCertification(testCertId);
      assert.equal(delResult.success, true);

      const allCerts = await getCertifications();
      assert.equal(allCerts.some((c) => c._id === testCertId), false);
    });
  });

  // ========================================================
  // 5. QUOTE REQUEST MANAGEMENT & CSV EXPORT
  // ========================================================
  describe('5. Quote Requests Management & RFC-4180 CSV Export', () => {
    it('retrieves quote requests and updates lead status', async () => {
      const requests = await getQuoteRequests();
      assert.ok(Array.isArray(requests));

      if (requests.length > 0) {
        const target = requests[0];
        const updated = await updateQuoteRequestStatus(target._id || target.quoteRefId, 'contacted');
        assert.equal(updated.status, 'contacted');
      }
    });

    it('generates an RFC-4180 compliant CSV export file', () => {
      const sampleRecords = [
        {
          quoteRefId: 'QR-TEST-001',
          createdAt: '2026-09-18T10:00:00.000Z',
          buyerName: 'Alexander Wright',
          companyName: 'Nordic Eco Living, AB', // Contains comma!
          country: 'Sweden',
          buyerType: 'international',
          email: 'alexander@nordic.se',
          phone: '+46 8 123 4567',
          productOfInterest: 'Heavy Duty Natural Jute Tote Bag',
          quantity: 2500,
          status: 'new',
          notesString: 'Includes "Pantone 7489C" logo print,\nwith reinforced handles.', // Contains quotes, comma, newline!
        },
        {
          quoteRefId: 'QR-TEST-002',
          createdAt: '2026-09-18T11:00:00.000Z',
          buyerName: 'Rajesh Patel',
          companyName: 'Patel Exports',
          country: 'India',
          buyerType: 'domestic',
          email: 'rajesh@patel.com',
          phone: '+91 98765 43210',
          productOfInterest: 'Printed Jute Shopping Bag',
          quantity: 5000,
          status: 'quoted',
          notesString: 'Standard packaging.',
        },
      ];

      const csvOutput = generateQuoteRequestsCSV(sampleRecords);

      // 1. Verify UTF-8 BOM is present for Excel
      assert.ok(csvOutput.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM');

      // 2. Verify Headers
      const lines = csvOutput.replace('\uFEFF', '').split('\r\n');
      assert.equal(
        lines[0],
        'Reference ID,Date Submitted,Buyer Name,Company Name,Country,Buyer Type,Email,Phone,Product of Interest,Quantity,Status,Customization Notes'
      );

      // 3. Verify escaping of commas in company name
      assert.ok(lines[1].includes('"Nordic Eco Living, AB"'));

      // 4. Verify escaping of double-quotes in notes
      assert.ok(csvOutput.includes('""Pantone 7489C""'));

      // 5. Verify row count
      assert.ok(lines.length >= 3);
    });
  });

  describe('6. Admin input validation', () => {
    it('rejects invalid order, production, and inventory updates before touching stored records', async () => {
      await assert.rejects(updateOrderStatus('missing-order', 'Invented'), /status is invalid/);
      await assert.rejects(updateProductionProgress('missing-order', 101, 'Planning'), /from 0 to 100/);
      await assert.rejects(updateProductionProgress('ODR-1042', 10, 'Invented'), /status is invalid/);
      await assert.rejects(updateInventoryQty('inv-1', -1), /non-negative/);
      await assert.rejects(updateInventoryQty('inv-1', Number.NaN), /non-negative/);
    });
  });
});
