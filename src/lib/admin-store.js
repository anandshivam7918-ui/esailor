import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { categories as seedCategories } from '../../seed-data/categories.js';
import { products as seedProducts } from '../../seed-data/products.js';
import { certifications as seedCertifications } from '../../seed-data/certifications.js';
import { isCertificationActiveAndValid, getCertificationStatus } from './certifications.js';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile(filename, defaultData = []) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

async function writeJsonFile(filename, data) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==========================================
// CATEGORIES
// ==========================================

function normalizeSeedCategories() {
  return seedCategories.map((c, i) => ({
    _id: c._id || `cat-${c.slug?.current || i + 1}`,
    _type: 'category',
    name: c.name,
    slug: typeof c.slug === 'string' ? { current: c.slug } : c.slug || { current: c.name.toLowerCase().replace(/\s+/g, '-') },
    description: c.description || '',
    displayOrder: c.displayOrder || i + 1,
    createdAt: c.createdAt || new Date('2026-01-01').toISOString(),
  }));
}

export async function getCategories() {
  return await readJsonFile('categories.json', normalizeSeedCategories());
}

export async function getCategoryById(id) {
  const categories = await getCategories();
  return categories.find((c) => c._id === id || c.slug?.current === id) || null;
}

export async function createCategory(data) {
  if (!data?.name || data.name.trim().length < 2) {
    throw new Error('Category name is required (minimum 2 characters).');
  }

  const categories = await getCategories();
  const slugCurrent = (data.slug || data.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (categories.some((c) => c.slug?.current === slugCurrent)) {
    throw new Error(`Category with slug "${slugCurrent}" already exists.`);
  }

  const newCategory = {
    _id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    _type: 'category',
    name: data.name.trim(),
    slug: { _type: 'slug', current: slugCurrent },
    description: data.description ? data.description.trim() : '',
    displayOrder: Number(data.displayOrder) || categories.length + 1,
    createdAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  await writeJsonFile('categories.json', categories);
  return newCategory;
}

export async function updateCategory(id, data) {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c._id === id || c.slug?.current === id);
  if (index === -1) {
    throw new Error(`Category "${id}" not found.`);
  }

  const existing = categories[index];
  const updated = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : existing.displayOrder,
    updatedAt: new Date().toISOString(),
  };

  if (data.slug && data.slug.trim()) {
    const slugCurrent = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    if (categories.some((c, idx) => idx !== index && c.slug?.current === slugCurrent)) {
      throw new Error(`Category with slug "${slugCurrent}" already exists.`);
    }
    updated.slug = { _type: 'slug', current: slugCurrent };
  }

  categories[index] = updated;
  categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  await writeJsonFile('categories.json', categories);
  return updated;
}

/**
 * SAFEGUARD: Blocks category deletion while products are still assigned to it.
 */
export async function deleteCategory(id) {
  const categories = await getCategories();
  const targetCategory = categories.find((c) => c._id === id || c.slug?.current === id);
  if (!targetCategory) {
    throw new Error(`Category "${id}" not found.`);
  }

  const products = await getProducts();
  const assignedProducts = products.filter((p) => {
    if (!p.category) return false;
    if (typeof p.category === 'string') {
      return p.category === targetCategory._id || p.category === targetCategory.slug?.current || p.category === targetCategory.name;
    }
    return (
      p.category._ref === targetCategory._id ||
      p.category._id === targetCategory._id ||
      p.category.slug?.current === targetCategory.slug?.current ||
      p.category.name === targetCategory.name
    );
  });

  if (assignedProducts.length > 0) {
    const productNames = assignedProducts.slice(0, 3).map((p) => `"${p.name}"`).join(', ');
    const countNote = assignedProducts.length > 3 ? ` and ${assignedProducts.length - 3} others` : '';
    const err = new Error(
      `Cannot delete category "${targetCategory.name}": ${assignedProducts.length} product(s) are currently assigned to it (${productNames}${countNote}). Reassign or delete these products first.`
    );
    err.code = 'CATEGORY_IN_USE';
    err.assignedCount = assignedProducts.length;
    throw err;
  }

  const filtered = categories.filter((c) => c._id !== targetCategory._id);
  await writeJsonFile('categories.json', filtered);
  return { success: true, deletedId: targetCategory._id };
}

// ==========================================
// PRODUCTS
// ==========================================

function normalizeSeedProducts() {
  return seedProducts.map((p, i) => ({
    _id: p._id || `prod-${p.slug?.current || i + 1}`,
    _type: 'product',
    name: p.name,
    slug: typeof p.slug === 'string' ? { current: p.slug } : p.slug || { current: p.name.toLowerCase().replace(/\s+/g, '-') },
    category: p.category || { _ref: 'cat-jute-bags', name: 'Jute Bags' },
    description: typeof p.description === 'string' ? p.description : 'Standard high-durability jute packaging product.',
    materialComposition: p.materialComposition || '100% Natural Jute',
    gsmWeight: p.gsmWeight || 280,
    dimensions: p.dimensions || '40x35x15 cm',
    colorOptions: p.colorOptions || ['Natural Beige'],
    printOptions: p.printOptions || ['Screen Printing'],
    handleType: p.handleType || 'Cotton Webbing',
    moq: p.moq || 100,
    indicativePriceRangeMin: p.indicativePriceRangeMin || 1.5,
    indicativePriceRangeMax: p.indicativePriceRangeMax || 2.5,
    currency: p.currency || 'USD',
    images: p.images || [{ url: '/images/products/jute-tote-hero.webp', alt: p.name }],
    isActive: p.isActive !== false,
    createdAt: p.createdAt || new Date('2026-01-01').toISOString(),
  }));
}

export async function getProducts() {
  return await readJsonFile('products.json', normalizeSeedProducts());
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p._id === id || p.slug?.current === id) || null;
}

/**
 * SAFEGUARD: Warns before publishing a product with zero images.
 */
export function validateProductZeroImages(productData, isPublishing = true) {
  const images = Array.isArray(productData.images) ? productData.images : [];
  const hasZeroImages = images.length === 0;

  if (isPublishing && hasZeroImages && !productData.confirmZeroImages) {
    const err = new Error(
      'Warning: This product has zero images attached. High-conversion B2B catalogs require at least one photo. Set confirmZeroImages: true to override.'
    );
    err.code = 'ZERO_IMAGES_WARNING';
    err.requiresConfirmation = true;
    return { valid: false, warning: err.message, error: err };
  }

  return { valid: true };
}

export async function createProduct(data) {
  if (!data?.name || data.name.trim().length < 2) {
    throw new Error('Product name is required (minimum 2 characters).');
  }

  const isActive = data.isActive !== false;
  const imageValidation = validateProductZeroImages(data, isActive);
  if (!imageValidation.valid) {
    throw imageValidation.error;
  }

  const products = await getProducts();
  const slugCurrent = (data.slug || data.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newProduct = {
    _id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    _type: 'product',
    name: data.name.trim(),
    slug: { _type: 'slug', current: slugCurrent },
    category: data.category || null,
    description: data.description || '',
    materialComposition: data.materialComposition || '100% Natural Jute',
    gsmWeight: Number(data.gsmWeight) || 280,
    dimensions: data.dimensions || '40x35x15 cm',
    colorOptions: Array.isArray(data.colorOptions) ? data.colorOptions : ['Natural Beige'],
    printOptions: Array.isArray(data.printOptions) ? data.printOptions : ['Screen Printing'],
    handleType: data.handleType || 'Cotton Webbing',
    moq: Number(data.moq) || 100,
    indicativePriceRangeMin: Number(data.indicativePriceRangeMin) || 1.5,
    indicativePriceRangeMax: Number(data.indicativePriceRangeMax) || 3.0,
    currency: data.currency || 'USD',
    images: Array.isArray(data.images) ? data.images : [],
    isActive,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  await writeJsonFile('products.json', products);
  return newProduct;
}

export async function updateProduct(id, data) {
  const products = await getProducts();
  const index = products.findIndex((p) => p._id === id || p.slug?.current === id);
  if (index === -1) {
    throw new Error(`Product "${id}" not found.`);
  }

  const existing = products[index];
  const willBeActive = data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive;
  const targetImages = data.images !== undefined ? data.images : existing.images;

  const imageValidation = validateProductZeroImages(
    { images: targetImages, confirmZeroImages: data.confirmZeroImages },
    willBeActive
  );
  if (!imageValidation.valid) {
    throw imageValidation.error;
  }

  const updated = {
    ...existing,
    ...data,
    _id: existing._id,
    _type: 'product',
    name: data.name ? data.name.trim() : existing.name,
    images: targetImages,
    isActive: willBeActive,
    updatedAt: new Date().toISOString(),
  };

  if (data.slug && typeof data.slug === 'string') {
    updated.slug = { _type: 'slug', current: data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') };
  }

  products[index] = updated;
  await writeJsonFile('products.json', products);
  return updated;
}

export async function deleteProduct(id) {
  const products = await getProducts();
  const index = products.findIndex((p) => p._id === id || p.slug?.current === id);
  if (index === -1) {
    throw new Error(`Product "${id}" not found.`);
  }

  const deleted = products[index];
  const filtered = products.filter((p) => p._id !== deleted._id);
  await writeJsonFile('products.json', filtered);
  return { success: true, deletedId: deleted._id };
}

// ==========================================
// CERTIFICATIONS
// ==========================================

function normalizeSeedCertifications() {
  return seedCertifications.map((c, i) => ({
    _id: c._id || `cert-${c.slug?.current || i + 1}`,
    _type: 'certification',
    name: c.name,
    code: c.code || c.name,
    slug: typeof c.slug === 'string' ? { current: c.slug } : c.slug || { current: c.name.toLowerCase().replace(/\s+/g, '-') },
    issuingBody: c.issuingBody || 'International Compliance Authority',
    issueDate: c.issueDate || '2024-01-01',
    expiryDate: c.expiryDate || '2027-12-31',
    documentUrl: c.documentUrl || '/certificates/sample.pdf',
    description: c.description || 'Verified international export certification.',
    isActive: c.isActive !== false,
    createdAt: c.createdAt || new Date('2026-01-01').toISOString(),
  }));
}

export async function getCertifications() {
  const certs = await readJsonFile('certifications.json', normalizeSeedCertifications());
  return certs.map((c) => ({
    ...c,
    isValid: isCertificationActiveAndValid(c),
    statusDetail: getCertificationStatus(c),
  }));
}

export async function getCertificationById(id) {
  const certs = await getCertifications();
  return certs.find((c) => c._id === id || c.slug?.current === id) || null;
}

export async function createCertification(data) {
  if (!data?.name || data.name.trim().length < 2) {
    throw new Error('Certification name is required.');
  }

  const certs = await readJsonFile('certifications.json', normalizeSeedCertifications());
  const slugCurrent = (data.slug || data.code || data.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newCert = {
    _id: `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    _type: 'certification',
    name: data.name.trim(),
    code: (data.code || data.name).trim(),
    slug: { _type: 'slug', current: slugCurrent },
    issuingBody: (data.issuingBody || 'International Compliance Authority').trim(),
    issueDate: data.issueDate || new Date().toISOString().split('T')[0],
    expiryDate: data.expiryDate || '',
    documentUrl: data.documentUrl || '',
    description: data.description ? data.description.trim() : '',
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
  };

  certs.push(newCert);
  await writeJsonFile('certifications.json', certs);
  return {
    ...newCert,
    isValid: isCertificationActiveAndValid(newCert),
    statusDetail: getCertificationStatus(newCert),
  };
}

export async function updateCertification(id, data) {
  const certs = await readJsonFile('certifications.json', normalizeSeedCertifications());
  const index = certs.findIndex((c) => c._id === id || c.slug?.current === id);
  if (index === -1) {
    throw new Error(`Certification "${id}" not found.`);
  }

  const existing = certs[index];
  const updated = {
    ...existing,
    ...data,
    _id: existing._id,
    _type: 'certification',
    name: data.name ? data.name.trim() : existing.name,
    code: data.code ? data.code.trim() : existing.code,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive,
    updatedAt: new Date().toISOString(),
  };

  certs[index] = updated;
  await writeJsonFile('certifications.json', certs);
  return {
    ...updated,
    isValid: isCertificationActiveAndValid(updated),
    statusDetail: getCertificationStatus(updated),
  };
}

export async function deleteCertification(id) {
  const certs = await readJsonFile('certifications.json', normalizeSeedCertifications());
  const target = certs.find((c) => c._id === id || c.slug?.current === id);
  if (!target) {
    throw new Error(`Certification "${id}" not found.`);
  }

  const filtered = certs.filter((c) => c._id !== target._id);
  await writeJsonFile('certifications.json', filtered);
  return { success: true, deletedId: target._id };
}

// ==========================================
// QUOTE REQUESTS & CSV EXPORT
// ==========================================

export async function getQuoteRequests() {
  return await readJsonFile('quote-requests.json', []);
}

export async function updateQuoteRequestStatus(id, status) {
  const validStatuses = ['new', 'contacted', 'quoted', 'closed'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status "${status}". Allowed: ${validStatuses.join(', ')}`);
  }

  const requests = await getQuoteRequests();
  const index = requests.findIndex((r) => r._id === id || r.quoteRefId === id);
  if (index === -1) {
    throw new Error(`Quote request "${id}" not found.`);
  }

  requests[index].status = status;
  requests[index].updatedAt = new Date().toISOString();
  await writeJsonFile('quote-requests.json', requests);
  return requests[index];
}

export async function deleteQuoteRequest(id) {
  const requests = await getQuoteRequests();
  const filtered = requests.filter((r) => r._id !== id && r.quoteRefId !== id);
  if (filtered.length === requests.length) {
    throw new Error(`Quote request "${id}" not found.`);
  }
  await writeJsonFile('quote-requests.json', filtered);
  return { success: true, deletedId: id };
}

/**
 * Generates an RFC-4180 compliant CSV string from quote request records.
 * Prefixes with UTF-8 BOM (\uFEFF) for immediate compatibility with Microsoft Excel.
 * @param {Array<Object>} records
 * @returns {string} CSV formatted string
 */
export function generateQuoteRequestsCSV(records = []) {
  const headers = [
    'Reference ID',
    'Date Submitted',
    'Buyer Name',
    'Company Name',
    'Country',
    'Buyer Type',
    'Email',
    'Phone',
    'Product of Interest',
    'Quantity',
    'Status',
    'Customization Notes',
  ];

  function escapeCSVCell(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (/[",\r\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const rows = records.map((r) => {
    let notes = r.notesString || '';
    if (!notes && Array.isArray(r.customizationNotes)) {
      notes = r.customizationNotes
        .map((b) => (b.children ? b.children.map((c) => c.text).join(' ') : ''))
        .join(' ');
    }

    return [
      r.quoteRefId || r._id || '',
      r.createdAt || r.fallbackSavedAt || '',
      r.buyerName || '',
      r.companyName || '',
      r.country || '',
      (r.buyerType || '').toUpperCase(),
      r.email || '',
      r.phone || '',
      r.productOfInterest || r.product || '',
      r.quantity || 0,
      (r.status || 'new').toUpperCase(),
      notes,
    ]
      .map(escapeCSVCell)
      .join(',');
  });

  // Include UTF-8 BOM
  return '\uFEFF' + [headers.map(escapeCSVCell).join(','), ...rows].join('\r\n');
}
