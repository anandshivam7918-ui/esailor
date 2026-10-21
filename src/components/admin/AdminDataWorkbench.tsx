'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Search, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

type Resource = 'products' | 'enquiries' | 'quotes' | 'orders' | 'production' | 'inventory' | 'certifications' | 'website-content' | 'customers' | 'reports' | 'media' | 'settings';
type Row = Record<string, unknown>;

const fields: Record<Resource, string[]> = {
  products: ['name', 'category', 'materialComposition', 'gsmWeight', 'moq', 'status'],
  enquiries: ['quoteRefId', 'buyerName', 'companyName', 'email', 'phone', 'productOfInterest', 'quantity', 'status'],
  quotes: ['quoteRefId', 'buyerName', 'companyName', 'email', 'phone', 'productOfInterest', 'quantity', 'status'],
  orders: ['_id', 'company', 'country', 'product', 'quantity', 'amount', 'currency', 'status', 'date'],
  production: ['orderId', 'product', 'quantity', 'progress', 'status', 'expectedDelivery'],
  inventory: ['item', 'category', 'qty', 'unit', 'reorderLevel', 'status'],
  certifications: ['name', 'code', 'issuingBody', 'expiryDate', 'isActive'],
  'website-content': ['section', 'content'],
  customers: ['companyName', 'buyerName', 'email', 'phone', 'country', 'enquiries'],
  reports: ['metric', 'value'],
  media: ['name', 'type', 'size', 'url'],
  settings: ['setting', 'value'],
};

const listKeys: Partial<Record<Resource, string>> = {
  products: 'products', enquiries: 'quoteRequests', quotes: 'quoteRequests', orders: 'orders',
  production: 'items', inventory: 'inventory', certifications: 'certifications', media: 'assets',
};

const apiFor: Partial<Record<Resource, string>> = {
  products: '/api/admin/products', enquiries: '/api/admin/quote-requests', quotes: '/api/admin/quote-requests',
  orders: '/api/admin/orders', production: '/api/admin/production', inventory: '/api/admin/inventory',
  certifications: '/api/admin/certifications', 'website-content': '/api/admin/site-content',
  media: '/api/admin/media', settings: '/api/admin/settings',
};

function display(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function rowId(row: Row) {
  return String(row._id || row.id || row.orderId || row.quoteRefId || '');
}

function unwrap(resource: Resource, data: Row): Row[] {
  if (resource === 'settings') {
    const settings = data.settings as Row | undefined;
    return settings ? Object.entries(settings).map(([setting, value]) => ({ setting, value })) : [];
  }
  if (resource === 'website-content') {
    const content = data.content as Row | undefined;
    return content ? Object.entries(content).filter(([key]) => key !== 'updatedAt').map(([section, value]) => ({ section, content: value })) : [];
  }
  if (resource === 'customers') {
    const requests = (data.quoteRequests as Row[] | undefined) || [];
    const grouped = new Map<string, Row>();
    for (const request of requests) {
      const key = String(request.email || request.companyName || request.buyerName || 'Unknown');
      const old = grouped.get(key);
      if (old) old.enquiries = Number(old.enquiries) + 1;
      else grouped.set(key, { ...request, enquiries: 1 });
    }
    return [...grouped.values()];
  }
  if (resource === 'reports') {
    const orders = (data.orders as Row[] | undefined) || [];
    const requests = (data.quoteRequests as Row[] | undefined) || [];
    const products = (data.products as Row[] | undefined) || [];
    const revenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    return [
      { metric: 'Orders', value: orders.length },
      { metric: 'Enquiries', value: requests.length },
      { metric: 'Products', value: products.length },
      { metric: 'Order value (recorded)', value: revenue.toLocaleString('en-IN') },
    ];
  }
  const key = listKeys[resource];
  return key && Array.isArray(data[key]) ? data[key] as Row[] : [];
}

export function AdminDataWorkbench({ resource, title, description }: { resource: Resource; title: string; description: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let result: Row;
      if (resource === 'reports' || resource === 'customers') {
        const [quotes, orders, products] = await Promise.all([
          fetch('/api/admin/quote-requests', { cache: 'no-store' }),
          fetch('/api/admin/orders', { cache: 'no-store' }),
          fetch('/api/admin/products', { cache: 'no-store' }),
        ]);
        const payloads = await Promise.all([quotes.json(), orders.json(), products.json()]);
        const failed = [quotes, orders, products].find((response) => !response.ok);
        if (failed) throw new Error('Unable to load admin records. Check your session and retry.');
        result = { quoteRequests: payloads[0].quoteRequests, orders: payloads[1].orders, products: payloads[2].products };
      } else {
        const response = await fetch(apiFor[resource]!, { cache: 'no-store' });
        result = await response.json();
        if (!response.ok) throw new Error(String(result.error || 'Unable to load this admin section.'));
      }
      setRows(unwrap(resource, result));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load this admin section.');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function send(url: string, method: string, body?: Row) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(String(result.error || 'The change could not be saved.'));
      setNotice('Saved successfully.');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The change could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  function nextStatus(row: Row) {
    const id = rowId(row);
    const status = String(row.status || '');
    if (resource === 'enquiries' || resource === 'quotes') {
      const choices = ['new', 'contacted', 'quoted', 'closed'];
      const next = choices[(choices.indexOf(status) + 1) % choices.length];
      return send('/api/admin/quote-requests', 'PUT', { id, status: next });
    }
    if (resource === 'orders') {
      const choices = ['Pending', 'Confirmed', 'In Production', 'Shipped', 'Delivered'];
      const next = choices[(choices.indexOf(status) + 1) % choices.length];
      return send('/api/admin/orders', 'PUT', { id, status: next });
    }
    if (resource === 'production') {
      const progress = window.prompt('Set production progress (0–100)', String(row.progress ?? 0));
      if (progress === null) return;
      return send('/api/admin/production', 'PUT', { orderId: row.orderId, progress: Number(progress), status: row.status });
    }
    if (resource === 'inventory') {
      const qty = window.prompt('Set stock quantity', String(row.qty ?? 0));
      if (qty === null) return;
      return send('/api/admin/inventory', 'PUT', { id: row.id || row.item, qty: Number(qty) });
    }
    if (resource === 'products') {
      const name = window.prompt('Product name', String(row.name || ''));
      if (!name?.trim()) return;
      return send('/api/admin/products', 'PUT', { id, name: name.trim() });
    }
    if (resource === 'certifications') {
      return send('/api/admin/certifications', 'PUT', { id, isActive: !row.isActive });
    }
    if (resource === 'website-content') {
      const source = window.prompt(`Edit ${String(row.section)} JSON`, JSON.stringify(row.content));
      if (source === null) return;
      try { return send('/api/admin/site-content', 'PUT', { section: row.section, data: JSON.parse(source) }); }
      catch { setError('Enter valid JSON content.'); }
    }
  }

  async function createRecord() {
    if (resource === 'products') {
      const name = window.prompt('Product name');
      if (!name?.trim()) return;
      return send('/api/admin/products', 'POST', { name: name.trim(), status: 'Draft', confirmZeroImages: true });
    }
    if (resource === 'certifications') {
      const name = window.prompt('Certification name');
      if (!name?.trim()) return;
      const code = window.prompt('Certification code');
      if (!code?.trim()) return;
      return send('/api/admin/certifications', 'POST', { name: name.trim(), code: code.trim(), isActive: false });
    }
    if (resource === 'orders') {
      const company = window.prompt('Customer company');
      if (!company?.trim()) return;
      const product = window.prompt('Product');
      if (!product?.trim()) return;
      return send('/api/admin/orders', 'POST', { company: company.trim(), product: product.trim() });
    }
  }

  async function uploadMedia() {
    if (!selectedFile) { setError('Choose an image first.'); return; }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const form = new FormData();
      form.set('file', selectedFile);
      const response = await fetch('/api/admin/media', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(String(result.error || 'Upload failed.'));
      setSelectedFile(null);
      setNotice('Image uploaded successfully.');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  const columns = resource === 'products' ? ['image', 'name', 'category', 'gsmWeight', 'moq', 'status'] : fields[resource];
  const writable = ['products', 'orders', 'production', 'inventory', 'certifications', 'enquiries', 'quotes', 'website-content', 'media'].includes(resource);
  const canCreate = ['products', 'orders', 'certifications'].includes(resource);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader title={title} subtitle={description} badge={resource === 'products' ? 'Catalog Manager' : resource === 'certifications' ? 'ESAILOR Admin' : undefined} dateRangeText="" />
        <div className="flex gap-2">
          {(resource === 'enquiries' || resource === 'quotes') && <a className="inline-flex items-center gap-2 rounded-xl border border-[#D7E2DC] bg-white px-3 py-2 text-xs font-semibold text-[#1B4D3E]" href="/api/admin/quote-requests/export"><Download size={16} /> Export CSV</a>}
          {canCreate && <button disabled={busy} onClick={() => void createRecord()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"><Plus size={16} /> {resource === 'products' ? 'Add Product' : 'Add'}</button>}
          {resource === 'media' && <><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} className="max-w-56 text-xs text-slate-300" /><button disabled={busy || !selectedFile} onClick={() => void uploadMedia()} className="rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">Upload image</button></>}
          <button disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-[#D7E2DC] bg-white px-3 py-2 text-xs font-semibold text-[#1B4D3E]"><RefreshCw size={16} /> Refresh</button>
        </div>
      </div>
      <label className="flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-400 shadow-sm"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" className="w-full bg-transparent text-xs text-slate-800 outline-none" /></label>
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {(resource === 'media' || resource === 'settings') && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">{resource === 'settings' ? 'Sensitive values are not shown or editable here; configure secrets through the hosting environment.' : 'Uploaded images use the local app filesystem. Configure shared persistent storage before multi-instance production use.'}</p>}
      {resource === 'media' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{loading ? <p className="text-sm text-slate-500">Loading media...</p> : filtered.map((row) => <article key={rowId(row)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex h-40 items-center justify-center bg-slate-50">{String(row.type).startsWith('image/') && <img src={String(row.url)} alt={String(row.name)} className="h-full w-full object-contain" />}</div><div className="p-4"><a href={String(row.url)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 hover:underline">{String(row.name)}</a><p className="mt-1 text-xs text-slate-500">{display(row.type)} · {Math.ceil(Number(row.size || 0) / 1024)} KB</p><div className="mt-3 flex justify-end"><button disabled={busy} onClick={() => { if (window.confirm('Delete this image?')) void send(`/api/admin/media?id=${encodeURIComponent(rowId(row))}`, 'DELETE'); }} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">Delete</button></div></div></article>)}</div>}
      {resource === 'settings' && <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((row) => <div key={String(row.setting)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{String(row.setting)}</dt><dd className="mt-3 text-sm font-semibold text-[#0D281E]">{display(row.value)}</dd></div>)}</dl>}
      {resource === 'certifications' && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{loading ? <p className="text-sm text-slate-500">Loading certifications...</p> : filtered.map((row) => <article key={rowId(row)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EBF2EE] text-lg font-bold text-[#1B4D3E]">{String(row.code || row.name || 'C').slice(0, 1)}</div><AdminStatusBadge status={row.isActive ? 'active' : 'inactive'} label={row.isActive ? 'Active' : 'Inactive'} /></div><h2 className="mt-4 font-bold text-[#0D281E]">{display(row.name)}</h2><p className="mt-1 text-xs text-slate-500">{display(row.issuingBody)} · {display(row.code)}</p><p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">Expiry date <span className="float-right text-slate-700">{display(row.expiryDate)}</span></p><div className="mt-4 flex justify-between"><button disabled={busy} onClick={() => void nextStatus(row)} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700">{row.isActive ? 'Deactivate' : 'Activate'}</button><button disabled={busy} aria-label="Delete record" onClick={() => { if (window.confirm('Delete this record? This cannot be undone.')) void send(`/api/admin/certifications?id=${encodeURIComponent(rowId(row))}`, 'DELETE'); }} className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 size={14} /></button></div></article>)}</div>}
      {resource === 'website-content' && <div className="grid gap-4 lg:grid-cols-2">{loading ? <p className="text-sm text-slate-500">Loading website content...</p> : filtered.map((row) => <article key={String(row.section)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><h2 className="font-serif text-lg font-bold capitalize text-[#0D281E]">{String(row.section).replace(/[-_]/g, ' ')}</h2><button disabled={busy} onClick={() => void nextStatus(row)} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700"><Pencil size={13} /> Edit</button></div><pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-[#F7F6F1] p-4 text-xs text-slate-600">{JSON.stringify(row.content, null, 2)}</pre></article>)}</div>}
      {resource === 'reports' && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filtered.map((row) => <article key={String(row.metric)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{String(row.metric)}</p><p className="mt-3 font-serif text-3xl font-bold text-[#0D281E]">{display(row.value)}</p><span className="mt-4 block h-1 w-12 rounded-full bg-blue-600" /></article>)}</div>}
      {resource !== 'media' && resource !== 'settings' && resource !== 'certifications' && resource !== 'website-content' && resource !== 'reports' && <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm"><table className="min-w-full text-left text-xs"><thead className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr>{columns.map((column) => <th key={column} className={`px-4 py-3.5 ${column === 'image' ? 'w-16' : ''}`}>{column === 'image' ? 'Image' : column.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())}</th>)}{writable && <th className="px-4 py-3.5">Actions</th>}</tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{loading ? <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={columns.length + 1}>Loading records…</td></tr> : filtered.map((row, index) => <tr key={rowId(row) || index} className="hover:bg-slate-50/70">{columns.map((column) => <td key={column} className={`max-w-xs px-4 py-3.5 ${column === 'name' ? 'font-bold text-slate-900' : ''}`}>{column === 'image' ? <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">{Boolean(row.image || (Array.isArray(row.images) && row.images.length)) && <img src={String(row.image || (Array.isArray(row.images) ? (row.images[0] as Row)?.url : ''))} alt={String(row.name || 'Product')} className="h-full w-full object-cover" />}</div> : column === 'status' ? <AdminStatusBadge status={String(row.status || 'draft')} /> : column === 'gsmWeight' ? display(row.gsmWeight || row.gsm || row.materialComposition) : display(row[column])}</td>)}{writable && <td className="whitespace-nowrap px-4 py-3"><button disabled={busy} onClick={() => void nextStatus(row)} className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"><Pencil size={13} /> {resource === 'inventory' ? 'Set quantity' : resource === 'production' ? 'Update progress' : resource === 'products' ? 'Edit' : 'Advance status'}</button>{(resource === 'products' || resource === 'enquiries' || resource === 'quotes') && <button disabled={busy} aria-label="Delete record" onClick={() => { if (window.confirm('Delete this record? This cannot be undone.')) void send(`${apiFor[resource]}?id=${encodeURIComponent(rowId(row))}`, 'DELETE'); }} className="ml-2 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-rose-600 hover:bg-rose-100 disabled:opacity-50"><Trash2 size={13} /></button>}</td>}</tr>)}{!loading && filtered.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400">No records found.</td></tr>}</tbody></table></div>}
      <p className="text-xs text-slate-500">{rows.length} records · Changes are saved through the protected admin API.</p>
    </section>
  );
}
