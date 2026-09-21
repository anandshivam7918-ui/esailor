import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Core catalog filtering logic mirroring CatalogPageClient
function filterProducts(
  products,
  { category = 'all', material = 'all', searchQuery = '' } = {}
) {
  const q = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      category === 'all' || product.category?._id === category;
    const matchesMaterial =
      material === 'all' ||
      product.materialComposition?.toLowerCase() === material.toLowerCase();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      (product.description && product.description.toLowerCase().includes(q)) ||
      (product.materialComposition && product.materialComposition.toLowerCase().includes(q)) ||
      (product.category?.name && product.category.name.toLowerCase().includes(q));

    return matchesCategory && matchesMaterial && matchesSearch;
  });
}

function buildQuoteRequestUrl(product) {
  if (!product?.name) return '/quote-request';
  return `/quote-request?product=${encodeURIComponent(product.name)}`;
}

const mockProducts = [
  {
    _id: 'prod-1',
    name: 'Natural Jute Tote Bag',
    slug: { current: 'natural-jute-tote-bag' },
    category: { _id: 'cat-totes', name: 'Tote Bags' },
    materialComposition: '100% Natural Jute',
    moq: 100,
    indicativePriceRangeMin: 1.5,
    indicativePriceRangeMax: 2.5,
  },
  {
    _id: 'prod-2',
    name: 'Printed Jute Shopping Bag',
    slug: { current: 'printed-jute-shopping-bag' },
    category: { _id: 'cat-shopping', name: 'Shopping Bags' },
    materialComposition: 'Jute-Laminate Blend',
    moq: 200,
    indicativePriceRangeMin: 2.0,
    indicativePriceRangeMax: 3.5,
  },
  {
    _id: 'prod-3',
    name: 'Heavy Duty Jute Sack',
    slug: { current: 'heavy-duty-jute-sack' },
    category: { _id: 'cat-industrial', name: 'Industrial Sacks' },
    materialComposition: '100% Natural Jute',
    moq: 500,
  },
  {
    _id: 'prod-4',
    name: 'Luxury Jute Gift Bag',
    slug: { current: 'luxury-jute-gift-bag' },
    category: { _id: 'cat-totes', name: 'Tote Bags' },
    materialComposition: 'Premium Jute Blend',
    moq: 50,
  },
];

describe('Phase 6: Catalog & Product Detail Functional Tests', () => {
  describe('Category Filtering', () => {
    it('returns all products when category is "all"', () => {
      const results = filterProducts(mockProducts, { category: 'all' });
      assert.equal(results.length, 4);
    });

    it('filters products correctly by specific category ID', () => {
      const results = filterProducts(mockProducts, { category: 'cat-totes' });
      assert.equal(results.length, 2);
      assert.deepEqual(
        results.map((p) => p._id),
        ['prod-1', 'prod-4']
      );
    });

    it('returns empty array when no products match category', () => {
      const results = filterProducts(mockProducts, { category: 'non-existent-cat' });
      assert.equal(results.length, 0);
    });
  });

  describe('Material Filtering', () => {
    it('filters products correctly by material (case-insensitive)', () => {
      const results = filterProducts(mockProducts, { material: '100% natural jute' });
      assert.equal(results.length, 2);
      assert.deepEqual(
        results.map((p) => p._id),
        ['prod-1', 'prod-3']
      );
    });

    it('returns empty array when material has no match', () => {
      const results = filterProducts(mockProducts, { material: 'Synthetic Nylon' });
      assert.equal(results.length, 0);
    });
  });

  describe('Combined Category and Material Filtering', () => {
    it('correctly intersects category and material filters', () => {
      const results = filterProducts(mockProducts, {
        category: 'cat-totes',
        material: '100% Natural Jute',
      });
      assert.equal(results.length, 1);
      assert.equal(results[0]._id, 'prod-1');
    });

    it('returns empty array when category matches but material does not', () => {
      const results = filterProducts(mockProducts, {
        category: 'cat-shopping',
        material: '100% Natural Jute',
      });
      assert.equal(results.length, 0);
    });
  });

  describe('Search Query Filtering', () => {
    it('filters products by keyword in name or category', () => {
      const results = filterProducts(mockProducts, { searchQuery: 'tote' });
      assert.equal(results.length, 2);
      assert.deepEqual(
        results.map((p) => p._id),
        ['prod-1', 'prod-4']
      );

      const specificResult = filterProducts(mockProducts, { searchQuery: 'natural jute tote' });
      assert.equal(specificResult.length, 1);
      assert.equal(specificResult[0]._id, 'prod-1');
    });

    it('filters products by keyword in material composition', () => {
      const results = filterProducts(mockProducts, { searchQuery: 'laminate' });
      assert.equal(results.length, 1);
      assert.equal(results[0]._id, 'prod-2');
    });

    it('filters products by keyword combined with category filter', () => {
      const results = filterProducts(mockProducts, {
        category: 'cat-totes',
        searchQuery: 'luxury',
      });
      assert.equal(results.length, 1);
      assert.equal(results[0]._id, 'prod-4');
    });
  });

  describe('Edge Cases & Data Resilience', () => {
    it('gracefully handles products with missing category or material attributes', () => {
      const sparseProducts = [
        { _id: 'sparse-1', name: 'Undelimited Bag' },
        { _id: 'sparse-2', name: 'Partial Bag', category: null, materialComposition: null },
      ];
      const results = filterProducts(sparseProducts, { category: 'cat-totes' });
      assert.equal(results.length, 0);

      const allResults = filterProducts(sparseProducts, { category: 'all', material: 'all' });
      assert.equal(allResults.length, 2);
    });
  });

  describe('Product Detail & Quote Request Pre-Fill CTA', () => {
    it('properly encodes product name in the quote request query string', () => {
      const product = { name: 'Natural Jute Tote Bag & Sacks' };
      const url = buildQuoteRequestUrl(product);
      assert.equal(
        url,
        '/quote-request?product=Natural%20Jute%20Tote%20Bag%20%26%20Sacks'
      );
    });

    it('handles special characters and spaces safely', () => {
      const product = { name: '100% Organic Jute Bag (Custom 40x35cm)' };
      const url = buildQuoteRequestUrl(product);
      const urlObj = new URL(`https://example.com${url}`);
      assert.equal(
        urlObj.searchParams.get('product'),
        '100% Organic Jute Bag (Custom 40x35cm)'
      );
    });

    it('falls back cleanly if product has no name', () => {
      const url = buildQuoteRequestUrl(null);
      assert.equal(url, '/quote-request');
    });
  });
});
