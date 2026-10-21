'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowDown, ArrowUp, Copy, ExternalLink, ImagePlus, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

type Category = { _id: string; name: string; slug?: { current: string }; description?: string; productCount?: number };
type ProductImage = { url?: string; alt?: string; asset?: { _ref?: string; _id?: string; url?: string; _type?: string } };
type Specification = { key: string; value: string };
type Product = Record<string, unknown> & {
  _id: string; _type?: string; name: string; slug?: string | { current?: string };
  category?: string | { _id?: string; _ref?: string; name?: string; slug?: { current?: string } };
  images?: ProductImage[]; status?: string; isActive?: boolean; sku?: string;
  createdAt?: string; updatedAt?: string; moq?: number; gsmWeight?: number;
};
type FormValues = {
  name: string; slug: string; sku: string; shortDescription: string; description: string; categoryId: string;
  productType: string; collection: string; tags: string; materialComposition: string; gsmWeight: string; dimensions: string;
  length: string; width: string; gusset: string; handleType: string; colors: string; printing: string;
  finishType: string; weavingType: string; packagingDetails: string; certifications: string;
  specifications: Specification[]; moq: string; unit: string; pricingMode: 'quote' | 'fixed';
  unitPrice: string; currency: string; indicativePriceRangeMin: string; indicativePriceRangeMax: string;
  sampleAvailable: boolean; customizationAvailable: boolean; productionLeadTime: string;
  status: 'Draft' | 'Published' | 'Archived'; isActive: boolean; isFeatured: boolean;
  seoTitle: string; seoDescription: string; images: ProductImage[];
};

const blankForm = (): FormValues => ({
  name: '', slug: '', sku: '', shortDescription: '', description: '', categoryId: '', productType: '', collection: '', tags: '',
  materialComposition: '', gsmWeight: '', dimensions: '', length: '', width: '', gusset: '', handleType: '', colors: '', printing: '',
  finishType: '', weavingType: '', packagingDetails: '', certifications: '', specifications: [], moq: '', unit: 'pcs',
  pricingMode: 'quote', unitPrice: '', currency: 'USD', indicativePriceRangeMin: '', indicativePriceRangeMax: '',
  sampleAvailable: false, customizationAvailable: false, productionLeadTime: '', status: 'Draft', isActive: true,
  isFeatured: false, seoTitle: '', seoDescription: '', images: [],
});

const categoryId = (value: Product['category']) => typeof value === 'string' ? value : value?._id || value?._ref || '';
const productSlug = (product: Product) => typeof product.slug === 'string' ? product.slug : product.slug?.current || '';
const imageUrl = (image?: ProductImage) => image?.url || image?.asset?.url || '';
const cleanNumber = (value: string) => value.trim() === '' ? undefined : Number(value);
const slugify = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const statusOf = (product: Product) => product.status || (product.isActive === false ? 'Inactive' : 'Published');

function textValue(value: unknown) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((block: { children?: unknown }) => typeof block?.children === 'string' ? block.children : Array.isArray(block?.children) ? (block.children as Array<{ text?: string }>).map((child) => child.text || '').join('') : '').join('\n').trim();
  return '';
}

function formFromProduct(product: Product, categories: Category[]): FormValues {
  const form = blankForm();
  const specs = product.additionalSpecifications;
  return {
    ...form,
    name: product.name || '', slug: productSlug(product), sku: String(product.sku || ''),
    shortDescription: String(product.shortDescription || ''), description: textValue(product.description),
    categoryId: categoryId(product.category) || categories.find((category) => category.name === (product.category as { name?: string })?.name)?._id || '',
    productType: String(product.productType || ''), collection: String(product.collection || ''), tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
    materialComposition: String(product.materialComposition || ''), gsmWeight: String(product.gsmWeight ?? ''), dimensions: String(product.dimensions || ''),
    length: String(product.length ?? ''), width: String(product.width ?? ''), gusset: String(product.gusset ?? product.depth ?? ''),
    handleType: String(product.handleType || ''), colors: Array.isArray(product.colorOptions) ? product.colorOptions.join(', ') : '',
    printing: Array.isArray(product.printOptions) ? product.printOptions.join(', ') : '', finishType: String(product.finishType || ''),
    weavingType: String(product.weavingType || ''), packagingDetails: String(product.packagingDetails || ''),
    certifications: Array.isArray(product.certifications) ? product.certifications.join(', ') : '',
    specifications: Array.isArray(specs) ? specs.map((item) => ({ key: String(item.key || ''), value: String(item.value || '') })) : [],
    moq: String(product.moq ?? ''), unit: String(product.unit || 'pcs'), pricingMode: product.pricingMode === 'fixed' ? 'fixed' : 'quote',
    unitPrice: String(product.unitPrice ?? ''), currency: String(product.currency || 'USD'),
    indicativePriceRangeMin: String(product.indicativePriceRangeMin ?? ''), indicativePriceRangeMax: String(product.indicativePriceRangeMax ?? ''),
    sampleAvailable: Boolean(product.sampleAvailable), customizationAvailable: Boolean(product.customizationAvailable),
    productionLeadTime: String(product.productionLeadTime || ''), status: (['Draft', 'Published', 'Archived'].includes(String(product.status)) ? product.status : statusOf(product)) as FormValues['status'],
    isActive: product.isActive !== false, isFeatured: Boolean(product.isFeatured || product.showOnHomepage),
    seoTitle: String(product.seoTitle || ''), seoDescription: String(product.seoDescription || ''),
    images: Array.isArray(product.images) ? product.images.map((image) => ({ ...image, url: imageUrl(image) })) : [],
  };
}

function productPayload(form: FormValues, confirmZeroImages = false) {
  return {
    name: form.name.trim(), slug: slugify(form.slug || form.name), sku: form.sku.trim() || undefined,
    shortDescription: form.shortDescription.trim(), description: form.description.trim(), category: form.categoryId,
    productType: form.productType.trim() || undefined, collection: form.collection.trim() || undefined,
    tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
    materialComposition: form.materialComposition.trim() || undefined,
    gsmWeight: cleanNumber(form.gsmWeight), dimensions: form.dimensions.trim() || undefined,
    length: cleanNumber(form.length), width: cleanNumber(form.width), gusset: cleanNumber(form.gusset),
    handleType: form.handleType.trim() || undefined, colorOptions: form.colors.split(',').map((item) => item.trim()).filter(Boolean),
    printOptions: form.printing.split(',').map((item) => item.trim()).filter(Boolean), finishType: form.finishType.trim() || undefined,
    weavingType: form.weavingType.trim() || undefined, packagingDetails: form.packagingDetails.trim() || undefined,
    certifications: form.certifications.split(',').map((item) => item.trim()).filter(Boolean),
    additionalSpecifications: form.specifications.filter((item) => item.key.trim() && item.value.trim()),
    moq: Number(form.moq), unit: form.unit.trim() || 'pcs', pricingMode: form.pricingMode,
    unitPrice: form.pricingMode === 'fixed' ? Number(form.unitPrice) : undefined, currency: form.currency,
    indicativePriceRangeMin: cleanNumber(form.indicativePriceRangeMin), indicativePriceRangeMax: cleanNumber(form.indicativePriceRangeMax),
    sampleAvailable: form.sampleAvailable, customizationAvailable: form.customizationAvailable,
    productionLeadTime: form.productionLeadTime.trim() || undefined, status: form.status, isActive: form.isActive,
    isFeatured: form.isFeatured, showOnHomepage: form.isFeatured,
    seoTitle: form.seoTitle.trim() || undefined, seoDescription: form.seoDescription.trim() || undefined,
    images: form.images, confirmZeroImages,
  };
}

export function AdminProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [source, setSource] = useState<'sanity' | 'local'>('local');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [page, setPage] = useState(1);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormValues>(blankForm);
  const [formError, setFormError] = useState('');
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        fetch('/api/admin/products', { cache: 'no-store' }), fetch('/api/admin/categories', { cache: 'no-store' }),
      ]);
      const [productResult, categoryResult] = await Promise.all([productResponse.json(), categoryResponse.json()]);
      if (!productResponse.ok) throw new Error(productResult.error || 'Unable to load products.');
      if (!categoryResponse.ok) throw new Error(categoryResult.error || 'Unable to load categories.');
      setProducts(Array.isArray(productResult.products) ? productResult.products : []);
      setCategories(Array.isArray(categoryResult.categories) ? categoryResult.categories : []);
      setSource(productResult.source === 'sanity' ? 'sanity' : 'local');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load the product catalog.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => {
    if (!editorOpen) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [editorOpen]);

  const counts = useMemo(() => ({
    total: products.length,
    published: products.filter((product) => statusOf(product) === 'Published' && product.isActive !== false).length,
    drafts: products.filter((product) => statusOf(product) === 'Draft').length,
    inactive: products.filter((product) => product.isActive === false || statusOf(product) === 'Archived').length,
  }), [products]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = products.filter((product) => {
      const catId = categoryId(product.category);
      const cat = categories.find((item) => item._id === catId || item.slug?.current === catId || item.name === (product.category as { name?: string })?.name);
      const status = statusOf(product);
      const matchesSearch = !needle || [product.name, product.sku, productSlug(product), product._id, product.materialComposition].some((value) => String(value || '').toLowerCase().includes(needle));
      return matchesSearch && (categoryFilter === 'all' || catId === categoryFilter || cat?.slug?.current === categoryFilter) && (statusFilter === 'all' || (statusFilter === 'inactive' ? product.isActive === false : status === statusFilter));
    });
    return matching.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'created') return new Date(String(b.createdAt || '')).getTime() - new Date(String(a.createdAt || '')).getTime();
      if (sortBy === 'moq') return Number(a.moq || 0) - Number(b.moq || 0);
      return new Date(String(b.updatedAt || b.createdAt || '')).getTime() - new Date(String(a.updatedAt || a.createdAt || '')).getTime();
    });
  }, [products, categories, query, categoryFilter, statusFilter, sortBy]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function openCreate(copy?: Product) {
    setEditing(null); setForm(copy ? { ...formFromProduct(copy, categories), name: `${copy.name} copy`, slug: '', sku: '', status: 'Draft', isActive: true } : blankForm());
    setFormError(''); setEditorOpen(true);
  }
  function openEdit(product: Product) { setEditing(product); setForm(formFromProduct(product, categories)); setFormError(''); setEditorOpen(true); }
  function closeEditor() {
    if (!window.confirm('Discard unsaved product changes?')) return;
    setEditorOpen(false); setEditing(null); setFormError('');
  }
  function change<K extends keyof FormValues>(key: K, value: FormValues[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function uploadImage(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setFormError('Choose a JPEG, PNG, WebP, or GIF image no larger than 5 MB.'); return;
    }
    setUploading(true); setFormError('');
    try {
      const data = new FormData(); data.set('file', file); if (source === 'sanity') data.set('storage', 'sanity');
      const response = await fetch('/api/admin/media', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Image upload failed.');
      const uploadedImage = result.image || { url: result.asset.url, alt: file.name.replace(/\.[^.]+$/, '') };
      setForm((current) => ({ ...current, images: [...current.images, uploadedImage] }));
    } catch (cause) { setFormError(cause instanceof Error ? cause.message : 'Image upload failed.'); }
    finally { setUploading(false); }
  }

  async function save(statusOverride?: FormValues['status'], confirmZeroImages = false) {
    setFormError('');
    const next = { ...form, status: statusOverride || form.status };
    if (next.name.trim().length < 2) { setFormError('Enter a product name with at least two characters.'); return; }
    if (!next.categoryId) { setFormError('Choose a product category.'); return; }
    if (!/^\d+$/.test(next.moq) || Number(next.moq) < 1) { setFormError('MOQ must be a positive whole number.'); return; }
    if (next.gsmWeight && (!Number.isFinite(Number(next.gsmWeight)) || Number(next.gsmWeight) <= 0)) { setFormError('GSM must be a positive number.'); return; }
    if (next.pricingMode === 'fixed' && (!Number.isFinite(Number(next.unitPrice)) || Number(next.unitPrice) <= 0)) { setFormError('Enter a positive unit price for fixed pricing.'); return; }
    if (next.indicativePriceRangeMin && next.indicativePriceRangeMax && Number(next.indicativePriceRangeMin) > Number(next.indicativePriceRangeMax)) { setFormError('The minimum indicative price cannot exceed the maximum.'); return; }
    setSaving(true);
    try {
      const payload = productPayload(next, confirmZeroImages);
      const response = await fetch('/api/admin/products', {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: editing._id, ...payload } : payload),
      });
      const result = await response.json();
      if (!response.ok && result.code === 'ZERO_IMAGES_WARNING' && !confirmZeroImages && window.confirm(`${result.error}\n\nContinue without images?`)) {
        setSaving(false); await save(statusOverride, true); return;
      }
      if (!response.ok) throw new Error(result.error || 'The product could not be saved.');
      const saved = result.product as Product;
      setEditorOpen(false); setEditing(null); setNotice(`${saved.name} saved successfully.`);
      await load();
      window.setTimeout(() => setNotice(''), 5000);
    } catch (cause) { setFormError(cause instanceof Error ? cause.message : 'The product could not be saved.'); }
    finally { setSaving(false); }
  }

  async function changeStatus(product: Product, status: FormValues['status']) {
    const label = status === 'Draft' ? 'unpublish' : status === 'Archived' ? 'archive' : 'publish';
    if (!window.confirm(`Are you sure you want to ${label} “${product.name}”?`)) return;
    setError('');
    try {
      const payload = { id: product._id, status, ...(status === 'Published' ? { isActive: true } : {}), confirmZeroImages: false };
      let response = await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      let result = await response.json();
      if (!response.ok && result.code === 'ZERO_IMAGES_WARNING' && window.confirm(`${result.error}\n\nPublish without images?`)) {
        response = await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, confirmZeroImages: true }) });
        result = await response.json();
      }
      if (!response.ok) throw new Error(result.error || 'Status update failed.');
      setNotice(`${product.name} is now ${status.toLowerCase()}.`); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Status update failed.'); }
  }
  async function remove(product: Product) {
    if (!window.confirm(`Permanently delete “${product.name}”? Products referenced by orders or quotations cannot be deleted; archive those instead.`)) return;
    setError('');
    try {
      const response = await fetch(`/api/admin/products?id=${encodeURIComponent(product._id)}`, { method: 'DELETE' });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Product deletion failed.');
      setNotice(`${product.name} was deleted.`); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Product deletion failed.'); }
  }

  const controlClass = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20';
  const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15';
  const sectionClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6';
  const field = (label: string, key: keyof FormValues, options: { required?: boolean; type?: string; placeholder?: string; help?: string } = {}) => (
    <label className="block text-xs font-semibold text-slate-700">{label}{options.required && <span className="ml-1 text-rose-600">*</span>}
      <input required={options.required} type={options.type || 'text'} value={String(form[key] ?? '')} placeholder={options.placeholder} onChange={(event) => change(key, event.target.value as FormValues[typeof key])} className={fieldClass} />
      {options.help && <span className="mt-1 block text-[11px] font-normal text-slate-500">{options.help}</span>}
    </label>
  );
  const area = (label: string, key: 'shortDescription' | 'description' | 'packagingDetails' | 'seoDescription') => <label className="block text-xs font-semibold text-slate-700">{label}<textarea rows={key === 'description' || key === 'seoDescription' ? 4 : 2} value={form[key]} onChange={(event) => change(key, event.target.value)} className={fieldClass} /></label>;

  return <section className="space-y-5">
    <AdminPageHeader title="Products" subtitle="Manage product details, availability, and public catalog listings." badge="Catalog Manager" dateRangeText="" actions={<div className="flex gap-2"><button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-[#D7E2DC] bg-white px-3 py-2 text-xs font-semibold text-[#1B4D3E] disabled:opacity-50"><RefreshCw size={15}/>Refresh</button><button type="button" onClick={() => openCreate()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"><Plus size={15}/>Add Product</button></div>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Total products', counts.total], ['Published', counts.published], ['Draft', counts.drafts], ['Inactive / archived', counts.inactive]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 font-serif text-2xl font-bold text-[#0D281E]">{value}</p></div>)}</div>
    {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {error && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle size={16}/>{error}</p>}
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="relative min-w-56 flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search name, SKU, slug..." className={`${controlClass} w-full pl-9`}/></label>
      <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }} className={controlClass}><option value="all">All categories</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select>
      <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className={controlClass}><option value="all">All statuses</option><option value="Published">Published</option><option value="Draft">Draft</option><option value="Archived">Archived</option><option value="inactive">Inactive</option></select>
      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={controlClass}><option value="updated">Recently updated</option><option value="created">Created date</option><option value="name">Name A–Z</option><option value="moq">MOQ</option></select>
      {(query || categoryFilter !== 'all' || statusFilter !== 'all') && <button type="button" onClick={() => { setQuery(''); setCategoryFilter('all'); setStatusFilter('all'); setPage(1); }} className="rounded-lg px-2 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Clear filters</button>}
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3.5">Product</th><th className="px-4 py-3.5">SKU</th><th className="px-4 py-3.5">Category</th><th className="px-4 py-3.5">Material / GSM</th><th className="px-4 py-3.5">MOQ</th><th className="px-4 py-3.5">Pricing</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Updated</th><th className="px-4 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">
      {loading ? <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-500">Loading catalog…</td></tr> : visible.map((product) => {
        const catId = categoryId(product.category); const category = categories.find((item) => item._id === catId || item.slug?.current === catId || item.name === (product.category as { name?: string })?.name); const url = imageUrl(product.images?.[0]); const status = statusOf(product);
        return <tr key={product._id} className="transition-colors hover:bg-slate-50/70"><td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">{url ? <img src={url} alt={product.images?.[0]?.alt || product.name} className="h-full w-full object-cover"/> : <span className="flex h-full items-center justify-center text-slate-300"><ImagePlus size={17}/></span>}</div><div className="max-w-[240px]"><p className="truncate font-bold text-slate-900">{product.name}</p><p className="mt-0.5 truncate text-[11px] text-slate-500">{productSlug(product) || product._id}</p></div></div></td><td className="px-4 py-3.5">{product.sku || '—'}</td><td className="px-4 py-3.5">{category?.name || (product.category as { name?: string })?.name || 'Uncategorized'}</td><td className="px-4 py-3.5"><span className="block max-w-40 truncate">{String(product.materialComposition || '—')}</span><span className="mt-0.5 block text-slate-500">{product.gsmWeight ? `${product.gsmWeight} GSM` : '—'}</span></td><td className="px-4 py-3.5">{product.moq ? `${product.moq} ${product.unit || 'pcs'}` : '—'}</td><td className="px-4 py-3.5">{product.pricingMode === 'fixed' && product.unitPrice ? `${product.currency || 'USD'} ${product.unitPrice}` : 'Request a quote'}</td><td className="px-4 py-3.5"><AdminStatusBadge status={status} label={product.isActive === false ? 'Inactive' : status}/></td><td className="px-4 py-3.5 text-slate-500">{product.updatedAt || product.createdAt ? new Date(String(product.updatedAt || product.createdAt)).toLocaleDateString() : '—'}</td><td className="px-4 py-3.5"><div className="flex justify-end gap-1.5"><button type="button" title="Edit product" aria-label={`Edit ${product.name}`} onClick={() => openEdit(product)} className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"><Pencil size={14}/></button><button type="button" title="Duplicate as draft" aria-label={`Duplicate ${product.name}`} onClick={() => openCreate(product)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Copy size={14}/></button>{status === 'Published' && <Link title="Preview public listing" aria-label={`Preview ${product.name}`} target="_blank" href={`/product/${productSlug(product)}`} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><ExternalLink size={14}/></Link>}{status === 'Published' ? <button title="Unpublish" aria-label={`Unpublish ${product.name}`} onClick={() => void changeStatus(product, 'Draft')} className="rounded-lg border border-amber-200 bg-amber-50 px-2 text-[10px] font-semibold text-amber-700">Unpublish</button> : status !== 'Archived' && <button title="Publish" aria-label={`Publish ${product.name}`} onClick={() => void changeStatus(product, 'Published')} className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-semibold text-emerald-700">Publish</button>}{status !== 'Archived' && <button title="Archive" aria-label={`Archive ${product.name}`} onClick={() => void changeStatus(product, 'Archived')} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><ArrowDown size={14}/></button>}<button title="Delete" aria-label={`Delete ${product.name}`} onClick={() => void remove(product)} className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><Trash2 size={14}/></button></div></td></tr>;
      })}
      {!loading && visible.length === 0 && <tr><td colSpan={9} className="px-4 py-14 text-center"><p className="font-semibold text-[#0D281E]">{products.length ? 'No products match your filters.' : 'Your catalog is empty.'}</p><p className="mt-1 text-xs text-slate-500">{products.length ? 'Clear filters or try another search.' : 'Add your first product to get started.'}</p>{!products.length && <button onClick={() => openCreate()} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Add Product</button>}</td></tr>}
      </tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500"><span>{filtered.length ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}` : '0 products'} · Source: {source === 'sanity' ? 'Sanity catalog' : 'Local development catalog'}</span><div className="flex items-center gap-2"><button disabled={currentPage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-slate-200 bg-white p-1.5 disabled:opacity-40"><ArrowUp className="rotate-[-90deg]" size={14}/></button><span>Page {currentPage} of {pageCount}</span><button disabled={currentPage >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="rounded-lg border border-slate-200 bg-white p-1.5 disabled:opacity-40"><ArrowDown className="rotate-[-90deg]" size={14}/></button></div></div></div>

    {editorOpen && <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-950/40" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}><aside role="dialog" aria-modal="true" aria-labelledby="product-editor-title" className="flex h-full w-full max-w-4xl flex-col bg-[#F8F7F2] shadow-2xl"><header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B4D3E]">Catalog Manager</p><h2 id="product-editor-title" className="mt-1 font-serif text-xl font-bold text-[#0D281E]">{editing ? 'Edit product' : 'Add product'}</h2></div><button type="button" onClick={closeEditor} aria-label="Close product editor" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18}/></button></header>
      <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-7">
        {formError && <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle size={16} className="mt-0.5 shrink-0"/>{formError}</p>}
        <section className={sectionClass}><h3 className="font-serif text-lg font-bold text-[#0D281E]">Basic information</h3><p className="mt-1 text-xs text-slate-500">Product identity and public catalog description.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{field('Product name', 'name', { required: true })}{field('URL slug', 'slug', { placeholder: form.name ? slugify(form.name) : 'generated-from-product-name', help: 'Unique public URL. Leave blank to generate from the product name.' })}{field('SKU / product code', 'sku', { placeholder: 'Optional unique identifier' })}<label className="block text-xs font-semibold text-slate-700">Category<span className="ml-1 text-rose-600">*</span><select required value={form.categoryId} onChange={(event) => change('categoryId', event.target.value)} className={fieldClass}><option value="">Choose a category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>{field('Product type', 'productType')}{field('Collection', 'collection')}{area('Short description', 'shortDescription')}<div className="sm:col-span-2">{area('Full description', 'description')}</div>{field('Search tags', 'tags', { placeholder: 'Reusable, retail, export' })}</div></section>
        <section className={sectionClass}><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-serif text-lg font-bold text-[#0D281E]">Product images</h3><p className="mt-1 text-xs text-slate-500">Upload to {source === 'sanity' ? 'Sanity’s persistent image library' : 'the local media library'}. Reorder with the arrows.</p></div><label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#D7E2DC] bg-white px-3 py-2 text-xs font-semibold text-[#1B4D3E] ${uploading ? 'opacity-50' : ''}`}><ImagePlus size={15}/>{uploading ? 'Uploading…' : 'Add images'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={uploading} className="sr-only" onChange={async (event) => { const files = Array.from(event.target.files || []); event.currentTarget.value = ''; for (const file of files) await uploadImage(file); }}/></label></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{form.images.map((image, index) => <div key={`${image.asset?._ref || image.url}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">{imageUrl(image) && <img src={imageUrl(image)} alt={image.alt || ''} className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-700">{image.alt || `Image ${index + 1}`}</p><label className="mt-1 block text-[10px] text-slate-500">Alt text<input value={image.alt || ''} onChange={(event) => change('images', form.images.map((item, i) => i === index ? { ...item, alt: event.target.value } : item))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"/></label></div><div className="flex flex-col gap-1"><button type="button" title="Move image up" disabled={index === 0} onClick={() => change('images', form.images.map((item, i, all) => i === index ? all[index - 1] : i === index - 1 ? all[index] : item))} className="rounded border border-slate-200 p-1 text-slate-500 disabled:opacity-30"><ArrowUp size={13}/></button><button type="button" title="Move image down" disabled={index === form.images.length - 1} onClick={() => change('images', form.images.map((item, i, all) => i === index ? all[index + 1] : i === index + 1 ? all[index] : item))} className="rounded border border-slate-200 p-1 text-slate-500 disabled:opacity-30"><ArrowDown size={13}/></button><button type="button" title="Remove image" onClick={() => change('images', form.images.filter((_, i) => i !== index))} className="rounded border border-rose-200 p-1 text-rose-600"><X size={13}/></button></div></div>)}{form.images.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-7 text-center text-xs text-slate-500 sm:col-span-2">No images added yet. Published products without images require explicit confirmation.</p>}</div></section>
        <section className={sectionClass}><h3 className="font-serif text-lg font-bold text-[#0D281E]">Specifications</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{field('Material composition', 'materialComposition', { placeholder: 'e.g. 100% natural jute' })}{field('GSM / weight', 'gsmWeight', { type: 'number', placeholder: 'e.g. 280' })}{field('Length (cm)', 'length', { type: 'number' })}{field('Width (cm)', 'width', { type: 'number' })}{field('Gusset / depth (cm)', 'gusset', { type: 'number' })}{field('Handle type', 'handleType')}{field('Available colors', 'colors', { placeholder: 'Natural, Black' })}{field('Printing options', 'printing', { placeholder: 'Screen print, digital' })}{field('Finish', 'finishType')}{field('Weaving type', 'weavingType')}{field('Certifications', 'certifications', { placeholder: 'Certification names' })}<div className="sm:col-span-2">{area('Packaging details', 'packagingDetails')}</div></div><div className="mt-5 border-t border-slate-100 pt-4"><div className="flex items-center justify-between"><h4 className="text-xs font-bold text-slate-700">Additional specifications</h4><button type="button" onClick={() => change('specifications', [...form.specifications, { key: '', value: '' }])} className="text-xs font-semibold text-blue-700">Add specification</button></div>{form.specifications.map((specification, index) => <div key={index} className="mt-2 grid grid-cols-[1fr_1fr_auto] gap-2"><input aria-label="Specification name" value={specification.key} onChange={(event) => change('specifications', form.specifications.map((item, i) => i === index ? { ...item, key: event.target.value } : item))} placeholder="Name" className={controlClass}/><input aria-label="Specification value" value={specification.value} onChange={(event) => change('specifications', form.specifications.map((item, i) => i === index ? { ...item, value: event.target.value } : item))} placeholder="Value" className={controlClass}/><button type="button" aria-label="Remove specification" onClick={() => change('specifications', form.specifications.filter((_, i) => i !== index))} className="rounded-lg p-2 text-rose-600"><X size={14}/></button></div>)}</div></section>
        <section className={sectionClass}><h3 className="font-serif text-lg font-bold text-[#0D281E]">Dimensions</h3><p className="mt-1 text-xs text-slate-500">Enter structured measurements, or use a custom dimensions string in addition.</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('Custom dimensions', 'dimensions', { placeholder: 'e.g. 40 × 35 × 15 cm' })}</div></section>
        <section className={sectionClass}><h3 className="font-serif text-lg font-bold text-[#0D281E]">Commercial information</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">{field('Minimum order quantity', 'moq', { required: true, type: 'number' })}{field('Unit of measure', 'unit', { required: true, placeholder: 'pcs' })}<label className="block text-xs font-semibold text-slate-700">Pricing mode<select value={form.pricingMode} onChange={(event) => change('pricingMode', event.target.value as FormValues['pricingMode'])} className={fieldClass}><option value="quote">Quotation-based / price on request</option><option value="fixed">Fixed unit price</option></select></label>{form.pricingMode === 'fixed' && <>{field('Unit price', 'unitPrice', { required: true, type: 'number' })}<label className="block text-xs font-semibold text-slate-700">Currency<select value={form.currency} onChange={(event) => change('currency', event.target.value)} className={fieldClass}>{['USD','INR','EUR','GBP'].map((currency) => <option key={currency}>{currency}</option>)}</select></label></>}{field('Indicative price from', 'indicativePriceRangeMin', { type: 'number' })}{field('Indicative price to', 'indicativePriceRangeMax', { type: 'number' })}{field('Production lead time', 'productionLeadTime', { placeholder: 'e.g. 30–45 days' })}<label className="flex items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={form.sampleAvailable} onChange={(event) => change('sampleAvailable', event.target.checked)}/>Samples available</label><label className="flex items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={form.customizationAvailable} onChange={(event) => change('customizationAvailable', event.target.checked)}/>Customization available</label></div></section>
        <section className={sectionClass}><h3 className="font-serif text-lg font-bold text-[#0D281E]">Availability, publication & SEO</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-700">Publication status<select value={form.status} onChange={(event) => change('status', event.target.value as FormValues['status'])} className={fieldClass}><option>Draft</option><option>Published</option><option>Archived</option></select></label><label className="flex items-center gap-2 self-end pb-3 text-xs text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(event) => change('isActive', event.target.checked)}/>Available for new enquiries</label><label className="flex items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={form.isFeatured} onChange={(event) => change('isFeatured', event.target.checked)}/>Feature on homepage</label>{field('SEO title', 'seoTitle') }<div className="sm:col-span-2">{area('SEO description', 'seoDescription')}</div><p className="text-[11px] leading-relaxed text-slate-500 sm:col-span-2">Draft and archived products remain private. A product is publicly listed only when its status is Published and it is available.</p></div></section>
      </div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-8"><button type="button" onClick={closeEditor} disabled={saving || uploading} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 disabled:opacity-50">Cancel</button><div className="flex flex-wrap justify-end gap-2"><button type="button" disabled={saving || uploading} onClick={() => void save('Draft')} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 disabled:opacity-50">Save as Draft</button><button type="button" disabled={saving || uploading} onClick={() => void save()} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save Product' : 'Save Product'}</button>{form.status !== 'Published' && <button type="button" disabled={saving || uploading} onClick={() => void save('Published')} className="rounded-xl bg-[#1B4D3E] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50">Publish Product</button>}</div></footer></aside></div>}
  </section>;
}
