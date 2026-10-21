import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { categories as seedCategories } from '../../seed-data/categories.js';
import { products as seedProducts } from '../../seed-data/products.js';
import { certifications as seedCertifications } from '../../seed-data/certifications.js';
import { isCertificationActiveAndValid, getCertificationStatus } from './certifications.js';
import { sanityClient } from './sanity.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const memStore = new Map();
const fileLocks = new Map();

const hasSanityCatalogCredentials = () => Boolean(process.env.SANITY_API_TOKEN);
const sanityCatalogClient = () => sanityClient.withConfig({ useCdn: false });

async function sanityCatalogHasCategories() {
  if (!hasSanityCatalogCredentials()) return false;
  const categories = await sanityCatalogClient().fetch(sanityCategoriesQuery);
  if (!Array.isArray(categories)) throw new Error('Sanity returned an invalid category catalog.');
  return categories.length > 0;
}

export async function getProductCatalogSource() {
  return await sanityCatalogHasCategories() ? 'sanity' : 'local';
}

const sanityProductsQuery = `*[_type == "product"] | order(_createdAt desc) {
  ..., "createdAt": coalesce(createdAt, _createdAt), "updatedAt": coalesce(updatedAt, _updatedAt),
  category->{_id, name, slug}, images[]{..., asset->{_ref, _id, url}}
}`;

const sanityCategoriesQuery = `*[_type == "category"] | order(displayOrder asc, name asc) {
  ..., parentCategory->{_id, name, slug}
}`;

function categoryIdOf(category) {
  if (typeof category === 'string') return category;
  return category?._ref || category?._id || '';
}

function slugifyProduct(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function validateOptionalNumber(value, label, { integer = false, min = 0 } = {}) {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || (integer && !Number.isInteger(number))) {
    throw new Error(`${label} must be ${integer ? 'a whole number ' : ''}greater than or equal to ${min}.`);
  }
  return number;
}

function normalizeStringList(value, label) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`${label} must be a list of non-empty values.`);
  }
  return [...new Set(value.map((item) => item.trim()))];
}

function cloneJsonValue(value) {
  return JSON.parse(JSON.stringify(value));
}

async function withFileLock(key, operation) {
  const previous = fileLocks.get(key) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => {
    release = resolve;
  });
  fileLocks.set(key, current);
  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (fileLocks.get(key) === current) fileLocks.delete(key);
  }
}

export const SLUG_ALIASES = {
  'agro-burlap-sack': 'heavy-industrial-burlap-sacks',
  'classic-jute-tote': 'natural-jute-tote-bag',
  'wine-bottle-carrier': 'luxury-jute-wine-gift-bag',
  'printed-designer-tote': 'printed-jute-promotional-bag',
  'juco-fashion-shopper': 'juco-fine-weave-canvas-tote',
  'jute-shopping-bag': 'natural-jute-tote-bag',
  'jute-drawstring-bag': 'heavy-industrial-burlap-sacks',
  'wine-bottle-bag': 'luxury-jute-wine-gift-bag',
  'promotional-bag': 'juco-fine-weave-canvas-tote',
};

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Graceful handling for read-only serverless environments or existing folders
  }
}

async function readJsonFile(filename, defaultData = []) {
  if (memStore.has(filename)) {
    return cloneJsonValue(memStore.get(filename));
  }

  const filePath = path.join(DATA_DIR, filename);
  let content;
  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw new Error('Unable to read admin data. Check the server storage configuration.');
    }
    const fallback = cloneJsonValue(defaultData);
    memStore.set(filename, fallback);
    return cloneJsonValue(fallback);
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Admin data file is invalid JSON and was left unchanged.');
  }
  memStore.set(filename, parsed);
  return cloneJsonValue(parsed);
}

async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const temporaryPath = path.join(
    DATA_DIR,
    '.' + filename + '.' + process.pid + '.' + Date.now() + '.' + Math.random().toString(36).slice(2) + '.tmp'
  );
  try {
    await ensureDataDir();
    await fs.writeFile(temporaryPath, JSON.stringify(data, null, 2), { encoding: 'utf-8', flag: 'wx' });
    try {
      await fs.rename(temporaryPath, filePath);
    } catch (error) {
      // Windows may reject replacing an existing destination with rename().
      if (process.platform !== 'win32' || !['EPERM', 'EEXIST'].includes(error?.code)) throw error;
      await fs.copyFile(temporaryPath, filePath);
      await fs.rm(temporaryPath, { force: true });
    }
    memStore.set(filename, cloneJsonValue(data));
  } catch (error) {
    try {
      await fs.rm(temporaryPath, { force: true });
    } catch {
      // Keep the original persistence error as the user-visible failure.
    }
    throw new Error('Unable to persist admin changes. Check the server data storage configuration.', { cause: error });
  }
}

let cachedRevalidatePath = null;
async function getRevalidatePath() {
  if (cachedRevalidatePath) return cachedRevalidatePath;
  try {
    const mod = await import('next/cache');
    cachedRevalidatePath = mod.revalidatePath;
    return cachedRevalidatePath;
  } catch {
    return null;
  }
}

/**
 * Trigger Next.js cache revalidation across public website routes
 */
export async function invalidateWebsiteCache(paths = ['/', '/catalog', '/certifications', '/process', '/admin']) {
  try {
    const revalidate = await getRevalidatePath();
    if (typeof revalidate === 'function') {
      paths.forEach((p) => {
        try {
          revalidate(p);
        } catch {
          // Safe fallback in static contexts
        }
      });
    }
  } catch {
    // Ignore static context warning
  }
}

// ==========================================
// AUDIT LOG SYSTEM
// ==========================================

export async function getAuditLogs() {
  const logs = await readJsonFile('audit-log.json', []);
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function createAuditLog({ user = 'Ram Kumar (Admin)', action, entity, entityId, oldValue, newValue }) {
  const logs = await readJsonFile('audit-log.json', []);
  const entry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user,
    action,
    entity,
    entityId: String(entityId || ''),
    oldValue: oldValue || null,
    newValue: newValue || null,
    timestamp: new Date().toISOString(),
  };
  logs.push(entry);
  await writeJsonFile('audit-log.json', logs);
  return entry;
}

// ==========================================
// SLUG HISTORY & REDIRECT TABLE
// ==========================================

export async function getSlugHistory() {
  return await readJsonFile('slug-history.json', []);
}

export async function recordSlugChange(oldSlug, newSlug, entityType = 'product') {
  if (!oldSlug || !newSlug || oldSlug === newSlug) return;
  const history = await getSlugHistory();
  const existing = history.find((h) => h.oldSlug === oldSlug);
  if (!existing) {
    history.push({
      oldSlug,
      newSlug,
      entityType,
      createdAt: new Date().toISOString(),
    });
    await writeJsonFile('slug-history.json', history);
  }
}

export async function resolveRedirectSlug(slug) {
  try {
    const history = await getSlugHistory();
    const match = history.find((h) => h.oldSlug === slug);
    if (match) return match.newSlug;
    return null;
  } catch {
    return null;
  }
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
  if (hasSanityCatalogCredentials()) {
    const categories = await sanityCatalogClient().fetch(sanityCategoriesQuery);
    if (!Array.isArray(categories)) throw new Error('Sanity returned an invalid category catalog.');
    if (categories.length > 0) return categories;
  }
  return await readJsonFile('categories.json', normalizeSeedCategories());
}

export async function getCategoryById(id) {
  const categories = await getCategories();
  return categories.find((c) => c._id === id || c.slug?.current === id) || null;
}

export async function createCategory(data, currentUser = 'Admin') {
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

  const categoryFields = {
    name: data.name.trim(),
    slug: { _type: 'slug', current: slugCurrent },
    description: data.description ? data.description.trim() : '',
    displayOrder: Number(data.displayOrder) || categories.length + 1,
    createdAt: new Date().toISOString(),
  };
  let newCategory;
  if (await sanityCatalogHasCategories()) {
    newCategory = await sanityCatalogClient().create({ _type: 'category', ...categoryFields });
  } else {
    newCategory = { _id: `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`, _type: 'category', ...categoryFields };
    categories.push(newCategory);
    categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    await writeJsonFile('categories.json', categories);
  }

  await createAuditLog({
    user: currentUser,
    action: 'CREATE_CATEGORY',
    entity: 'Category',
    entityId: newCategory._id,
    newValue: newCategory,
  });

  await invalidateWebsiteCache(['/catalog', '/admin', '/']);
  return newCategory;
}

export async function updateCategory(id, data, currentUser = 'Admin') {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c._id === id || c.slug?.current === id);
  if (index === -1) {
    throw new Error(`Category "${id}" not found.`);
  }

  const existing = categories[index];
  let newSlug = existing.slug?.current;

  if (data.slug && data.slug.trim()) {
    const slugCurrent = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    if (categories.some((c, idx) => idx !== index && c.slug?.current === slugCurrent)) {
      throw new Error(`Category with slug "${slugCurrent}" already exists.`);
    }
    newSlug = slugCurrent;
  }

  const updated = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : existing.displayOrder,
    slug: { _type: 'slug', current: newSlug },
    updatedAt: new Date().toISOString(),
  };

  let savedCategory;
  if (await sanityCatalogHasCategories()) {
    const patch = { ...updated };
    delete patch._id;
    delete patch._type;
    savedCategory = await sanityCatalogClient().patch(existing._id).set(patch).commit();
    savedCategory = { ...updated, ...savedCategory };
  } else {
    categories[index] = updated;
    categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    await writeJsonFile('categories.json', categories);
    savedCategory = updated;
  }
  if (existing.slug?.current && newSlug !== existing.slug?.current) await recordSlugChange(existing.slug.current, newSlug, 'category');

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_CATEGORY',
    entity: 'Category',
    entityId: savedCategory._id,
    oldValue: existing,
    newValue: savedCategory,
  });

  await invalidateWebsiteCache(['/catalog', `/category/${existing.slug?.current}`, `/category/${newSlug}`, '/admin', '/']);
  return savedCategory;
}

export async function deleteCategory(id, currentUser = 'Admin') {
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

  if (await sanityCatalogHasCategories()) {
    await sanityCatalogClient().delete(targetCategory._id);
  } else {
    const filtered = categories.filter((c) => c._id !== targetCategory._id);
    await writeJsonFile('categories.json', filtered);
  }

  await createAuditLog({
    user: currentUser,
    action: 'DELETE_CATEGORY',
    entity: 'Category',
    entityId: targetCategory._id,
    oldValue: targetCategory,
  });

  await invalidateWebsiteCache(['/catalog', `/category/${targetCategory.slug?.current}`, '/admin', '/']);
  return { success: true, deletedId: targetCategory._id };
}

// ==========================================
// PRODUCTS (FULL SYNC + STATUS PIPELINE + REDIRECTS)
// ==========================================

function normalizeSeedProducts() {
  return seedProducts.map((p, i) => ({
    _id: p._id || `prod-${p.slug?.current || i + 1}`,
    _type: 'product',
    name: p.name,
    slug: typeof p.slug === 'string' ? { current: p.slug } : p.slug || { current: p.name.toLowerCase().replace(/\s+/g, '-') },
    category: p.category || { _ref: 'cat-jute-bags', name: 'Jute Bags', slug: { current: 'jute-bags' } },
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
    images: p.images || [{ url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=600&auto=format&fit=crop', alt: p.name }],
    status: p.status || (p.isActive !== false ? 'Published' : 'Draft'),
    isActive: p.isActive !== false,
    createdAt: p.createdAt || new Date('2026-01-01').toISOString(),
  }));
}

export async function getProducts(includeAllStatuses = true) {
  const products = await sanityCatalogHasCategories()
    ? await sanityCatalogClient().fetch(sanityProductsQuery)
    : await readJsonFile('products.json', normalizeSeedProducts());
  if (!Array.isArray(products)) throw new Error('The product catalog returned an invalid response.');
  if (includeAllStatuses) return products;
  return products.filter((product) =>
    product.status === 'Published'
      ? product.isActive !== false
      : !product.status && product.isActive !== false
  );
}

export async function getProductById(id, includeAllStatuses = true) {
  if (!id) return null;
  const products = await getProducts(includeAllStatuses);

  // 1. Direct match by _id or slug
  let found = products.find((p) => p._id === id || p.slug?.current === id || p.slug === id);
  if (found) return found;

  // 2. Check alias map
  const targetSlug = SLUG_ALIASES[id];
  if (targetSlug) {
    found = products.find((p) => p._id === targetSlug || p.slug?.current === targetSlug || p.slug === targetSlug);
    if (found) {
      return {
        ...found,
        slug: { current: id },
        canonicalSlug: found.slug?.current || targetSlug,
      };
    }
  }

  // 3. Case-insensitive / trimmed match or alias array match
  const cleanId = String(id).toLowerCase().trim();
  found = products.find((p) => {
    const s = typeof p.slug === 'string' ? p.slug : p.slug?.current;
    if (s && s.toLowerCase() === cleanId) return true;
    if (p._id && p._id.toLowerCase() === cleanId) return true;
    if (Array.isArray(p.aliases) && p.aliases.some((a) => String(a).toLowerCase() === cleanId)) return true;
    return false;
  });

  return found || null;
}

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

const PRODUCT_WRITE_FIELDS = [
  'sku', 'shortDescription', 'description', 'productType', 'collection', 'tags',
  'materialComposition', 'gsmWeight', 'dimensions', 'length', 'width', 'gusset', 'depth',
  'handleType', 'colorOptions', 'printOptions', 'finishType', 'weavingType',
  'packagingDetails', 'certifications', 'additionalSpecifications', 'moq', 'unit',
  'pricingMode', 'unitPrice', 'currency', 'priceTiers', 'indicativePriceRangeMin',
  'indicativePriceRangeMax', 'sampleAvailable', 'customizationAvailable', 'productionLeadTime',
  'isFeatured', 'showOnHomepage', 'seoTitle', 'seoDescription', 'status', 'isActive', 'images',
];

async function prepareProductWrite(data, existing, products) {
  const useSanity = await sanityCatalogHasCategories();
  const name = typeof data.name === 'string' ? data.name.trim() : existing?.name;
  if (!name || name.length < 2) throw new Error('Product name is required (minimum 2 characters).');
  for (const key of ['shortDescription', 'description', 'productType', 'collection', 'materialComposition', 'dimensions', 'handleType', 'finishType', 'weavingType', 'packagingDetails', 'unit', 'currency', 'productionLeadTime', 'seoTitle', 'seoDescription']) {
    if (data[key] !== undefined && typeof data[key] !== 'string') throw new Error(`${key} must be text.`);
  }
  if (data.sku !== undefined && (typeof data.sku !== 'string' || data.sku.trim().length > 80)) throw new Error('SKU must be text up to 80 characters.');
  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') throw new Error('Availability must be true or false.');
  for (const key of ['sampleAvailable', 'customizationAvailable', 'isFeatured', 'showOnHomepage']) {
    if (data[key] !== undefined && typeof data[key] !== 'boolean') throw new Error(`${key} must be true or false.`);
  }
  const categoryValue = data.category !== undefined ? data.category : existing?.category;
  if (!categoryValue) throw new Error('Choose a product category.');
  const categories = await getCategories();
  const categoryId = categoryIdOf(categoryValue);
  const category = categories.find((item) => item._id === categoryId || item.slug?.current === categoryId || item.name === categoryId);
  if (!category) throw new Error('Choose a category that exists in the catalog.');

  const slugCurrent = slugifyProduct(data.slug || (data.name ? name : existing?.slug?.current || existing?.slug) || name);
  if (!slugCurrent) throw new Error('Product slug must contain at least one letter or number.');
  const sku = data.sku !== undefined ? String(data.sku).trim() : String(existing?.sku || '').trim();
  const duplicate = products.find((item) => item._id !== existing?._id && (
    slugifyProduct(item.slug?.current || item.slug) === slugCurrent ||
    (sku && String(item.sku || '').trim().toLowerCase() === sku.toLowerCase())
  ));
  if (duplicate) throw new Error(duplicate.sku && sku && String(duplicate.sku).toLowerCase() === sku.toLowerCase() ? 'That SKU is already used by another product.' : 'That product URL slug is already in use.');

  const status = data.status || existing?.status || (existing ? (existing.isActive === false ? 'Draft' : 'Published') : (data.isActive === false ? 'Draft' : 'Published'));
  if (!['Draft', 'Published', 'Archived'].includes(status)) throw new Error('Choose Draft, Published, or Archived status.');
  const isActive = data.isActive === undefined ? (existing ? existing.isActive !== false : true) : Boolean(data.isActive);
  const images = data.images === undefined ? (existing?.images || []) : data.images;
  if (!Array.isArray(images) || images.some((image) => !image || typeof image !== 'object' ||
      (typeof image.url !== 'string' && typeof image.asset?._ref !== 'string'))) {
    throw new Error('Product images must be valid uploaded media assets.');
  }
  if (images.some((image) => image.url && !image.url.startsWith('/images/') && !image.url.startsWith('/admin-media/') && !/^https?:\/\//i.test(image.url))) {
    throw new Error('Product image URLs must use the site media library or a secure HTTP(S) URL.');
  }
  const imageValidation = validateProductZeroImages({ images, confirmZeroImages: data.confirmZeroImages }, status === 'Published' && isActive);
  if (!imageValidation.valid) throw imageValidation.error;

  const moq = validateOptionalNumber(data.moq !== undefined ? data.moq : existing?.moq, 'MOQ', { integer: true, min: 1 });
  if (moq === undefined) throw new Error('Minimum order quantity must be a positive whole number.');
  const gsmWeight = validateOptionalNumber(data.gsmWeight !== undefined ? data.gsmWeight : existing?.gsmWeight, 'GSM', { min: 0.01 });
  const unitPrice = validateOptionalNumber(data.unitPrice !== undefined ? data.unitPrice : existing?.unitPrice, 'Unit price', { min: 0.01 });
  const pricingMode = data.pricingMode ?? existing?.pricingMode ?? 'quote';
  if (!['quote', 'fixed'].includes(pricingMode)) throw new Error('Pricing mode must be quote-based or fixed.');
  if (pricingMode === 'fixed' && unitPrice === undefined) throw new Error('Enter a unit price for fixed pricing.');
  const categoryForStore = useSanity
    ? { _type: 'reference', _ref: category._id }
    : { _ref: category._id, _id: category._id, name: category.name, slug: category.slug };
  if (useSanity && images.some((image) => typeof image.asset?._ref !== 'string')) {
    throw new Error('Product images must be uploaded to the configured Sanity image library.');
  }

  const values = { ...existing, ...Object.fromEntries(PRODUCT_WRITE_FIELDS.filter((key) => data[key] !== undefined).map((key) => [key, data[key]])) };
  values.name = name;
  values.slug = { _type: 'slug', current: slugCurrent };
  values.category = categoryForStore;
  values.sku = sku || undefined;
  values.status = status;
  values.isActive = isActive;
  values.moq = moq;
  values.gsmWeight = gsmWeight;
  values.pricingMode = pricingMode;
  values.unitPrice = pricingMode === 'fixed' ? unitPrice : undefined;
  values.currency = values.currency || 'USD';
  values.images = useSanity
    ? images.map((image) => ({ _type: 'image', asset: { _type: 'reference', _ref: image.asset._ref }, ...(image.alt ? { alt: image.alt } : {}) }))
    : images;

  for (const key of ['tags', 'colorOptions', 'printOptions', 'certifications']) {
    const normalized = normalizeStringList(values[key], key);
    if (normalized !== undefined) values[key] = normalized;
  }
  if (values.additionalSpecifications !== undefined && (!Array.isArray(values.additionalSpecifications) || values.additionalSpecifications.some((item) => !item || typeof item.key !== 'string' || typeof item.value !== 'string'))) {
    throw new Error('Additional specifications must have a name and value.');
  }
  if (values.additionalSpecifications?.some((item) => item.key.length > 80 || item.value.length > 500)) throw new Error('Additional specification names are limited to 80 characters and values to 500.');
  if (values.currency && !/^[A-Z]{3}$/.test(values.currency)) throw new Error('Currency must be a three-letter currency code.');
  for (const key of ['indicativePriceRangeMin', 'indicativePriceRangeMax', 'length', 'width', 'gusset', 'depth']) {
    const number = validateOptionalNumber(values[key], key, { min: 0 });
    if (number !== undefined) values[key] = number;
  }
  if (values.indicativePriceRangeMin !== undefined && values.indicativePriceRangeMax !== undefined && values.indicativePriceRangeMin > values.indicativePriceRangeMax) {
    throw new Error('The minimum indicative price cannot exceed the maximum.');
  }
  if (values.pricingMode !== 'fixed') delete values.unitPrice;
  return values;
}

function toSanityProductDocument(product) {
  const document = { _type: 'product' };
  for (const key of ['name', 'slug', 'category', ...PRODUCT_WRITE_FIELDS]) {
    if (product[key] !== undefined) document[key] = product[key];
  }
  return document;
}

export async function createProduct(data, currentUser = 'Admin') {
  const products = await getProducts(true);
  const fields = await prepareProductWrite(data || {}, null, products);
  const now = new Date().toISOString();
  let newProduct;
  if (await sanityCatalogHasCategories()) {
    newProduct = await sanityCatalogClient().create({
      ...toSanityProductDocument(fields),
      createdAt: now,
      updatedAt: now,
    });
    newProduct = { ...fields, ...newProduct, category: (await getCategories()).find((category) => category._id === categoryIdOf(fields.category)) || fields.category };
  } else {
    newProduct = {
      ...fields,
      _id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      _type: 'product',
      description: fields.description || '',
      createdAt: now,
      updatedAt: now,
    };
    products.push(newProduct);
    await writeJsonFile('products.json', products);
  }

  await createAuditLog({
    user: currentUser,
    action: 'CREATE_PRODUCT',
    entity: 'Product',
    entityId: newProduct._id,
    newValue: { name: newProduct.name, status: newProduct.status, sku: newProduct.sku || null, moq: newProduct.moq },
  });

  await invalidateWebsiteCache(['/', '/catalog', `/product/${fields.slug.current}`, '/admin', '/sitemap.xml', ...((fields.category?.slug?.current) ? [`/category/${fields.category.slug.current}`] : [])]);
  return newProduct;
}

export async function updateProduct(id, data, currentUser = 'Admin') {
  const products = await getProducts(true);
  const index = products.findIndex((p) => p._id === id || p.slug?.current === id);
  if (index === -1) {
    throw new Error(`Product "${id}" not found.`);
  }

  const existing = products[index];
  const fields = await prepareProductWrite(data || {}, existing, products);
  const now = new Date().toISOString();
  const previousSlug = existing.slug?.current || existing.slug;
  const newSlug = fields.slug.current;
  if (newSlug !== previousSlug) await recordSlugChange(previousSlug, newSlug, 'product');
  let updated;
  if (await sanityCatalogHasCategories()) {
    const patch = { ...toSanityProductDocument(fields), updatedAt: now };
    delete patch._type;
    updated = await sanityCatalogClient().patch(existing._id).set(patch).commit();
    updated = { ...fields, ...updated, category: (await getCategories()).find((category) => category._id === categoryIdOf(fields.category)) || fields.category };
  } else {
    updated = { ...existing, ...fields, _id: existing._id, _type: 'product', updatedAt: now };
    products[index] = updated;
    await writeJsonFile('products.json', products);
  }

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_PRODUCT',
    entity: 'Product',
    entityId: updated._id,
    oldValue: { name: existing.name, status: existing.status, sku: existing.sku || null, moq: existing.moq },
    newValue: { name: updated.name, status: updated.status, sku: updated.sku || null, moq: updated.moq },
  });

  const oldCategorySlug = existing.category?.slug?.current;
  const newCategorySlug = fields.category?.slug?.current;
  await invalidateWebsiteCache(['/', '/catalog', `/product/${previousSlug}`, `/product/${newSlug}`, '/admin', '/sitemap.xml', ...[oldCategorySlug, newCategorySlug].filter(Boolean).map((slug) => `/category/${slug}`)]);
  return updated;
}

export async function deleteProduct(id, currentUser = 'Admin') {
  const products = await getProducts(true);
  const index = products.findIndex((p) => p._id === id || p.slug?.current === id);
  if (index === -1) {
    throw new Error(`Product "${id}" not found.`);
  }

  const deleted = products[index];
  const [orders, quotes] = await Promise.all([getOrders(), getQuoteRequests()]);
  const referencedByOrder = orders.some((order) => order.productId === deleted._id || order.productSlug === deleted.slug?.current || order.product === deleted.name);
  const referencedByQuote = quotes.some((quote) => String(quote.productOfInterest || quote.product || '').split(/[,;\n]/).map((value) => value.trim()).includes(deleted.name));
  if (referencedByOrder || referencedByQuote) throw new Error('This product is referenced by a saved order or quotation. Archive it instead to preserve business history.');
  if (await sanityCatalogHasCategories()) {
    await sanityCatalogClient().delete(deleted._id);
  } else {
    const filtered = products.filter((p) => p._id !== deleted._id);
    await writeJsonFile('products.json', filtered);
  }

  await createAuditLog({
    user: currentUser,
    action: 'DELETE_PRODUCT',
    entity: 'Product',
    entityId: deleted._id,
    oldValue: { name: deleted.name, slug: deleted.slug?.current },
  });

  await invalidateWebsiteCache(['/', '/catalog', `/product/${deleted.slug?.current}`, '/admin', '/sitemap.xml', ...(deleted.category?.slug?.current ? [`/category/${deleted.category.slug.current}`] : [])]);
  return { success: true, deletedId: deleted._id };
}

// ==========================================
// ORDERS & FULFILLMENT PIPELINE
// ==========================================

const initialOrdersSeed = [
  {
    _id: 'ODR-1042',
    company: 'GreenMart Ltd.',
    country: 'Germany',
    product: 'Jute Shopping Bag',
    quantity: '10,000 pcs',
    amount: 12500,
    currency: 'USD',
    status: 'In Production',
    date: '2026-04-28',
    createdAt: '2026-04-28T10:00:00.000Z',
  },
  {
    _id: 'ODR-1041',
    company: 'EcoRetail Inc.',
    country: 'USA',
    product: 'Tote Bag',
    quantity: '5,000 pcs',
    amount: 6250,
    currency: 'USD',
    status: 'Shipped',
    date: '2026-04-27',
    createdAt: '2026-04-27T09:30:00.000Z',
  },
  {
    _id: 'ODR-1040',
    company: 'NaturePack',
    country: 'UK',
    product: 'Burlap Sack',
    quantity: '20,000 pcs',
    amount: 18000,
    currency: 'USD',
    status: 'Pending',
    date: '2026-04-26',
    createdAt: '2026-04-26T14:15:00.000Z',
  },
  {
    _id: 'ODR-1038',
    company: 'Global Imports',
    country: 'UAE',
    product: 'Bottle Bag',
    quantity: '3,000 pcs',
    amount: 4500,
    currency: 'USD',
    status: 'Confirmed',
    date: '2026-04-25',
    createdAt: '2026-04-25T11:20:00.000Z',
  },
  {
    _id: 'ODR-1036',
    company: 'Sunrite Trading',
    country: 'Australia',
    product: 'Jute Shopping Bag',
    quantity: '8,000 pcs',
    amount: 9800,
    currency: 'USD',
    status: 'Delivered',
    date: '2026-04-24',
    createdAt: '2026-04-24T16:45:00.000Z',
  },
];

export async function getOrders() {
  return await readJsonFile('orders.json', initialOrdersSeed);
}

export async function createOrder(data, currentUser = 'Admin') {
  if (!data?.company || !data?.product) {
    throw new Error('Order company name and product are required.');
  }

  const orders = await getOrders();
  const newOrder = {
    _id: `ODR-${Date.now().toString().slice(-4)}`,
    company: data.company.trim(),
    country: data.country || 'International',
    product: data.product.trim(),
    quantity: data.quantity || '1,000 pcs',
    amount: Number(data.amount) || 2500,
    currency: data.currency || 'USD',
    status: data.status || 'In Production',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  await writeJsonFile('orders.json', orders);

  await createAuditLog({
    user: currentUser,
    action: 'CREATE_ORDER',
    entity: 'Order',
    entityId: newOrder._id,
    newValue: newOrder,
  });

  invalidateWebsiteCache(['/admin']);
  return newOrder;
}

export async function updateOrderStatus(id, status, currentUser = 'Admin') {
  const validStatuses = ['Pending', 'Confirmed', 'In Production', 'Shipped', 'Delivered'];
  if (!validStatuses.includes(status)) {
    throw new Error('Order status is invalid.');
  }

  const orders = await getOrders();
  const index = orders.findIndex((o) => o._id === id);
  if (index === -1) {
    throw new Error(`Order "${id}" not found.`);
  }

  const existing = orders[index];
  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  await writeJsonFile('orders.json', orders);

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_ORDER_STATUS',
    entity: 'Order',
    entityId: id,
    oldValue: { status: existing.status },
    newValue: { status },
  });

  invalidateWebsiteCache(['/admin']);
  return orders[index];
}

// ==========================================
// PRODUCTION PROGRESS TRACKER
// ==========================================

const initialProductionSeed = [
  { orderId: 'ODR-1042', product: 'Jute Shopping Bag', quantity: '10,000 pcs', progress: 80, status: 'In Progress', expectedDelivery: '2026-05-05' },
  { orderId: 'ODR-1041', product: 'Tote Bag', quantity: '5,000 pcs', progress: 60, status: 'Planning', expectedDelivery: '2026-05-08' },
  { orderId: 'ODR-1040', product: 'Bottle Bag', quantity: '20,000 pcs', progress: 40, status: 'Production', expectedDelivery: '2026-05-12' },
  { orderId: 'ODR-1038', product: 'Burlap Sack', quantity: '3,000 pcs', progress: 90, status: 'Completed', expectedDelivery: '2026-05-06' },
  { orderId: 'ODR-1036', product: 'Jute Shopping Bag', quantity: '8,000 pcs', progress: 20, status: 'Raw Material', expectedDelivery: '2026-05-10' },
];

export async function getProductionItems() {
  return await readJsonFile('production.json', initialProductionSeed);
}

export async function updateProductionProgress(orderId, progress, status, currentUser = 'Admin') {
  const numericProgress = Number(progress);
  const validStatuses = ['Raw Material', 'Planning', 'Production', 'In Progress', 'Completed'];
  if (!Number.isFinite(numericProgress) || numericProgress < 0 || numericProgress > 100) {
    throw new Error('Production progress must be a number from 0 to 100.');
  }

  const items = await getProductionItems();
  const index = items.findIndex((p) => p.orderId === orderId);
  if (index === -1) {
    throw new Error(`Production item for order "${orderId}" not found.`);
  }

  const existing = items[index];
  if (status && !validStatuses.includes(status)) {
    throw new Error('Production status is invalid.');
  }
  items[index] = {
    ...existing,
    progress: numericProgress,
    status: status || existing.status,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile('production.json', items);

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_PRODUCTION_PROGRESS',
    entity: 'Production',
    entityId: orderId,
    oldValue: { progress: existing.progress, status: existing.status },
    newValue: { progress, status },
  });

  invalidateWebsiteCache(['/admin']);
  return items[index];
}

// ==========================================
// INVENTORY STORE
// ==========================================

const initialInventorySeed = [
  { id: 'inv-1', item: 'Jute Fibre (Raw Grade A)', category: 'Raw Material', qty: 4500, unit: 'kg', reorderLevel: 5000, status: 'low' },
  { id: 'inv-2', item: 'Standard Handles (Cotton Braid)', category: 'Components', qty: 25000, unit: 'pcs', reorderLevel: 10000, status: 'normal' },
  { id: 'inv-3', item: 'Eco Lamination Roll 120cm', category: 'Packaging', qty: 120, unit: 'rolls', reorderLevel: 50, status: 'normal' },
  { id: 'inv-4', item: 'Natural Jute Yarn Spools', category: 'Raw Material', qty: 1200, unit: 'spools', reorderLevel: 500, status: 'normal' },
];

export async function getInventory() {
  return await readJsonFile('inventory.json', initialInventorySeed);
}

export async function updateInventoryQty(id, qty, currentUser = 'Admin') {
  const newQty = Number(qty);
  if (!Number.isFinite(newQty) || newQty < 0) {
    throw new Error('Inventory quantity must be a non-negative number.');
  }

  return withFileLock('inventory.json', async () => {
    const inv = await getInventory();
    const index = inv.findIndex((i) => i.id === id || i.item === id);
    if (index === -1) {
      throw new Error('Inventory item was not found.');
    }

    const existing = inv[index];
    const status = newQty <= Number(existing.reorderLevel || 0) ? 'low' : 'normal';
    inv[index] = {
      ...existing,
      qty: newQty,
      status,
      updatedAt: new Date().toISOString(),
    };

    await writeJsonFile('inventory.json', inv);
    await createAuditLog({
      user: currentUser,
      action: 'UPDATE_INVENTORY_QTY',
      entity: 'Inventory',
      entityId: id,
      oldValue: { qty: existing.qty },
      newValue: { qty: newQty, status },
    });

    invalidateWebsiteCache(['/admin']);
    return inv[index];
  });
}

// ==========================================
// DYNAMIC SITE CONTENT & STATISTICS
// ==========================================

const initialSiteContentSeed = {
  hero: {
    title: 'Certified B2B Jute Bag Manufacturer & Global Exporter',
    subtitle: 'Direct manufacturing of premium eco-friendly jute totes, burlap sacks & promotional packaging with RCMC, IEC & GST compliance.',
    ctaPrimaryText: 'Request Wholesale Quote',
    ctaPrimaryLink: '/quote-request',
    ctaSecondaryText: 'Browse Catalog',
    ctaSecondaryLink: '/catalog',
    heroImageUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=1200&auto=format&fit=crop',
  },
  stats: [
    { label: 'Countries Served', value: '50+', icon: 'Globe' },
    { label: 'Years Experience', value: '15+', icon: 'Award' },
    { label: 'Bags / Month Capacity', value: '2M+', icon: 'Factory' },
    { label: 'Government Registrations', value: '4', icon: 'ShieldCheck' },
  ],
  manufacturingStages: [
    { step: '01', title: 'Raw Jute Sourcing', description: 'Procuring 100% biodegradable golden jute fibre from verified West Bengal farms.' },
    { step: '02', title: 'Fibre Preparation & Softening', description: 'Batching and emulsifying raw fibres for uniform tensile strength.' },
    { step: '03', title: 'Yarn Spinning & Winding', description: 'Precision spinning into high-count jute yarn spools.' },
    { step: '04', title: 'Weaving & Lamination', description: 'High-speed loom weaving with optional bio-PLA internal waterproofing.' },
    { step: '05', title: 'Precision Cutting & Printing', description: 'Azo-free eco dye screen printing and automated laser cutting.' },
    { step: '06', title: 'Stitching & Quality Inspection', description: 'Reinforced Box-X handle stitching with dual metal-detector scanning.' },
  ],
  globalReach: [
    { country: 'Germany', region: 'Europe', status: 'Active' },
    { country: 'United States', region: 'North America', status: 'Active' },
    { country: 'United Kingdom', region: 'Europe', status: 'Active' },
    { country: 'United Arab Emirates', region: 'Middle East', status: 'Active' },
    { country: 'Australia', region: 'Oceania', status: 'Active' },
  ],
};

export async function getSiteContent() {
  return await readJsonFile('site-content.json', initialSiteContentSeed);
}

export async function updateSiteContent(section, data, currentUser = 'Admin') {
  const current = await getSiteContent();
  const updated = {
    ...current,
    [section]: data,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile('site-content.json', updated);

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_SITE_CONTENT',
    entity: 'SiteContent',
    entityId: section,
    newValue: data,
  });

  invalidateWebsiteCache(['/', '/about', '/process', '/certifications', '/admin']);
  return updated;
}

// ==========================================
// CALCULATED DASHBOARD KPIS (SINGLE TRUTH)
// ==========================================

export async function getDashboardCalculatedStats() {
  const [quotes, orders, productionItems, products] = await Promise.all([
    readJsonFile('quote-requests.json', []),
    getOrders(),
    getProductionItems(),
    getProducts(true),
  ]);

  const totalEnquiries = quotes.length;
  const quotesSent = quotes.filter((q) => q.status === 'quoted').length;
  const totalOrders = orders.length;
  const productionInProgress = productionItems.filter((p) => p.status === 'In Progress' || p.status === 'Production').length;
  const revenueEst = orders.reduce((sum, o) => sum + (Number.isFinite(Number(o.amount)) ? Number(o.amount) : 0), 0);

  return {
    totalEnquiries,
    quotesSent,
    totalOrders,
    productionInProgress,
    revenueEst,
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === 'Published').length,
  };
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

export async function createCertification(data, currentUser = 'Admin') {
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

  await createAuditLog({
    user: currentUser,
    action: 'CREATE_CERTIFICATION',
    entity: 'Certification',
    entityId: newCert._id,
    newValue: newCert,
  });

  invalidateWebsiteCache(['/certifications', '/admin']);
  return {
    ...newCert,
    isValid: isCertificationActiveAndValid(newCert),
    statusDetail: getCertificationStatus(newCert),
  };
}

export async function updateCertification(id, data, currentUser = 'Admin') {
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

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_CERTIFICATION',
    entity: 'Certification',
    entityId: updated._id,
    oldValue: existing,
    newValue: updated,
  });

  invalidateWebsiteCache(['/certifications', '/admin']);
  return {
    ...updated,
    isValid: isCertificationActiveAndValid(updated),
    statusDetail: getCertificationStatus(updated),
  };
}

export async function deleteCertification(id, currentUser = 'Admin') {
  const certs = await readJsonFile('certifications.json', normalizeSeedCertifications());
  const target = certs.find((c) => c._id === id || c.slug?.current === id);
  if (!target) {
    throw new Error(`Certification "${id}" not found.`);
  }

  const filtered = certs.filter((c) => c._id !== target._id);
  await writeJsonFile('certifications.json', filtered);

  await createAuditLog({
    user: currentUser,
    action: 'DELETE_CERTIFICATION',
    entity: 'Certification',
    entityId: target._id,
    oldValue: target,
  });

  invalidateWebsiteCache(['/certifications', '/admin']);
  return { success: true, deletedId: target._id };
}

// ==========================================
// QUOTE REQUESTS & CSV EXPORT
// ==========================================

export async function getQuoteRequests() {
  return await readJsonFile('quote-requests.json', []);
}

export async function updateQuoteRequestStatus(id, status, currentUser = 'Admin') {
  const validStatuses = ['new', 'contacted', 'quoted', 'closed'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status "${status}". Allowed: ${validStatuses.join(', ')}`);
  }

  const requests = await getQuoteRequests();
  const index = requests.findIndex((r) => r._id === id || r.quoteRefId === id);
  if (index === -1) {
    throw new Error(`Quote request "${id}" not found.`);
  }

  const existing = requests[index];
  requests[index].status = status;
  requests[index].updatedAt = new Date().toISOString();
  await writeJsonFile('quote-requests.json', requests);

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_ENQUIRY_STATUS',
    entity: 'Enquiry',
    entityId: id,
    oldValue: { status: existing.status },
    newValue: { status },
  });

  invalidateWebsiteCache(['/admin']);
  return requests[index];
}

export async function deleteQuoteRequest(id, currentUser = 'Admin') {
  const requests = await getQuoteRequests();
  const filtered = requests.filter((r) => r._id !== id && r.quoteRefId !== id);
  if (filtered.length === requests.length) {
    throw new Error(`Quote request "${id}" not found.`);
  }
  await writeJsonFile('quote-requests.json', filtered);

  await createAuditLog({
    user: currentUser,
    action: 'DELETE_ENQUIRY',
    entity: 'Enquiry',
    entityId: id,
  });

  invalidateWebsiteCache(['/admin']);
  return { success: true, deletedId: id };
}

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

  return '\uFEFF' + [headers.map(escapeCSVCell).join(','), ...rows].join('\r\n');
}
