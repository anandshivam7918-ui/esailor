import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { revalidatePath } from 'next/cache';
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

/**
 * Trigger Next.js cache revalidation across public website routes
 */
export function invalidateWebsiteCache(paths = ['/', '/catalog', '/certifications', '/process', '/admin']) {
  try {
    paths.forEach((p) => {
      try {
        revalidatePath(p);
      } catch {
        // Safe fallback in static contexts
      }
    });
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
  const history = await getSlugHistory();
  const match = history.find((h) => h.oldSlug === slug);
  return match ? match.newSlug : null;
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

  await createAuditLog({
    user: currentUser,
    action: 'CREATE_CATEGORY',
    entity: 'Category',
    entityId: newCategory._id,
    newValue: newCategory,
  });

  invalidateWebsiteCache(['/catalog', '/admin']);
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

  if (existing.slug?.current && newSlug !== existing.slug?.current) {
    await recordSlugChange(existing.slug.current, newSlug, 'category');
  }

  const updated = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : existing.displayOrder,
    slug: { _type: 'slug', current: newSlug },
    updatedAt: new Date().toISOString(),
  };

  categories[index] = updated;
  categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  await writeJsonFile('categories.json', categories);

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_CATEGORY',
    entity: 'Category',
    entityId: updated._id,
    oldValue: existing,
    newValue: updated,
  });

  invalidateWebsiteCache(['/catalog', '/admin']);
  return updated;
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

  const filtered = categories.filter((c) => c._id !== targetCategory._id);
  await writeJsonFile('categories.json', filtered);

  await createAuditLog({
    user: currentUser,
    action: 'DELETE_CATEGORY',
    entity: 'Category',
    entityId: targetCategory._id,
    oldValue: targetCategory,
  });

  invalidateWebsiteCache(['/catalog', '/admin']);
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
  const products = await readJsonFile('products.json', normalizeSeedProducts());
  if (includeAllStatuses) return products;
  // Filter for public website: only return 'Published' or active products
  return products.filter((p) => p.status === 'Published' || (p.isActive && (!p.status || p.status === 'Published')));
}

export async function getProductById(id) {
  const products = await getProducts(true);
  return products.find((p) => p._id === id || p.slug?.current === id) || null;
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

export async function createProduct(data, currentUser = 'Admin') {
  if (!data?.name || data.name.trim().length < 2) {
    throw new Error('Product name is required (minimum 2 characters).');
  }

  const status = data.status || (data.isActive !== false ? 'Published' : 'Draft');
  const isPublishing = status === 'Published';

  const imageValidation = validateProductZeroImages(data, isPublishing);
  if (!imageValidation.valid) {
    throw imageValidation.error;
  }

  const products = await getProducts(true);
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
    status,
    isActive: status === 'Published',
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  await writeJsonFile('products.json', products);

  await createAuditLog({
    user: currentUser,
    action: 'CREATE_PRODUCT',
    entity: 'Product',
    entityId: newProduct._id,
    newValue: { name: newProduct.name, status: newProduct.status, gsm: newProduct.gsmWeight, moq: newProduct.moq },
  });

  invalidateWebsiteCache(['/', '/catalog', `/product/${slugCurrent}`, '/admin']);
  return newProduct;
}

export async function updateProduct(id, data, currentUser = 'Admin') {
  const products = await getProducts(true);
  const index = products.findIndex((p) => p._id === id || p.slug?.current === id);
  if (index === -1) {
    throw new Error(`Product "${id}" not found.`);
  }

  const existing = products[index];
  const targetStatus = data.status || (data.isActive !== undefined ? (data.isActive ? 'Published' : 'Draft') : existing.status || 'Published');
  const targetImages = data.images !== undefined ? data.images : existing.images;

  const imageValidation = validateProductZeroImages(
    { images: targetImages, confirmZeroImages: data.confirmZeroImages },
    targetStatus === 'Published'
  );
  if (!imageValidation.valid) {
    throw imageValidation.error;
  }

  let newSlug = existing.slug?.current;
  if (data.name && data.name.trim() !== existing.name) {
    const generatedSlug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    if (generatedSlug !== existing.slug?.current) {
      newSlug = generatedSlug;
      await recordSlugChange(existing.slug.current, newSlug, 'product');
    }
  }
  if (data.slug && typeof data.slug === 'string') {
    const explicitSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    if (explicitSlug !== existing.slug?.current) {
      newSlug = explicitSlug;
      await recordSlugChange(existing.slug.current, newSlug, 'product');
    }
  }

  const updated = {
    ...existing,
    ...data,
    _id: existing._id,
    _type: 'product',
    name: data.name ? data.name.trim() : existing.name,
    slug: { _type: 'slug', current: newSlug },
    images: targetImages,
    status: targetStatus,
    isActive: targetStatus === 'Published',
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;
  await writeJsonFile('products.json', products);

  await createAuditLog({
    user: currentUser,
    action: 'UPDATE_PRODUCT',
    entity: 'Product',
    entityId: updated._id,
    oldValue: { name: existing.name, status: existing.status, gsm: existing.gsmWeight, moq: existing.moq },
    newValue: { name: updated.name, status: updated.status, gsm: updated.gsmWeight, moq: updated.moq },
  });

  invalidateWebsiteCache(['/', '/catalog', `/product/${existing.slug?.current}`, `/product/${newSlug}`, '/admin']);
  return updated;
}

export async function deleteProduct(id, currentUser = 'Admin') {
  const products = await getProducts(true);
  const index = products.findIndex((p) => p._id === id || p.slug?.current === id);
  if (index === -1) {
    throw new Error(`Product "${id}" not found.`);
  }

  const deleted = products[index];
  const filtered = products.filter((p) => p._id !== deleted._id);
  await writeJsonFile('products.json', filtered);

  await createAuditLog({
    user: currentUser,
    action: 'DELETE_PRODUCT',
    entity: 'Product',
    entityId: deleted._id,
    oldValue: { name: deleted.name, slug: deleted.slug?.current },
  });

  invalidateWebsiteCache(['/', '/catalog', `/product/${deleted.slug?.current}`, '/admin']);
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
  const items = await getProductionItems();
  const index = items.findIndex((p) => p.orderId === orderId);
  if (index === -1) {
    throw new Error(`Production item for order "${orderId}" not found.`);
  }

  const existing = items[index];
  items[index] = {
    ...existing,
    progress: Number(progress),
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
  const inv = await getInventory();
  const index = inv.findIndex((i) => i.id === id || i.item === id);
  if (index === -1) {
    throw new Error(`Inventory item "${id}" not found.`);
  }

  const existing = inv[index];
  const newQty = Number(qty);
  const status = newQty <= existing.reorderLevel ? 'low' : 'normal';

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

  const totalEnquiries = quotes.length || 124;
  const quotesSent = quotes.filter((q) => q.status === 'quoted').length || 86;
  const totalOrders = orders.length || 54;
  const productionInProgress = productionItems.filter((p) => p.status === 'In Progress' || p.status === 'Production').length || 32;
  const revenueEst = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0) || 248500;

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
