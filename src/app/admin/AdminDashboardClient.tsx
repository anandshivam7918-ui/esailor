'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Tab = 'quotes' | 'products' | 'categories' | 'certifications';

interface AdminUser {
  username: string;
  role: string;
}

interface QuoteRequest {
  _id: string;
  quoteRefId?: string;
  createdAt?: string;
  fallbackSavedAt?: string;
  buyerName: string;
  companyName?: string;
  country: string;
  buyerType: 'international' | 'domestic';
  email: string;
  phone: string;
  productOfInterest?: string;
  product?: string;
  quantity: number;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  notesString?: string;
  customizationNotes?: unknown;
}

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  displayOrder?: number;
  productCount?: number;
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  category?: string | { _ref?: string; _id?: string; name?: string; slug?: { current: string } };
  description?: string;
  materialComposition?: string;
  gsmWeight?: number;
  dimensions?: string;
  moq?: number;
  indicativePriceRangeMin?: number;
  indicativePriceRangeMax?: number;
  currency?: string;
  images?: Array<{ url: string; alt?: string }>;
  isActive: boolean;
}

interface Certification {
  _id: string;
  name: string;
  code: string;
  slug: { current: string };
  issuingBody?: string;
  issueDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  description?: string;
  isActive: boolean;
  isValid?: boolean;
  statusDetail?: {
    isValid: boolean;
    isExpired: boolean;
    isInactive: boolean;
    statusText: string;
  };
}

export function AdminDashboardClient() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('esailor2026!');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<Tab>('quotes');

  // Data State
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // UI Notification Banner
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Modal / Detail States
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quoteFilterStatus, setQuoteFilterStatus] = useState<string>('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productFormImageInput, setProductFormImageInput] = useState('');
  const [confirmZeroImages, setConfirmZeroImages] = useState(false);
  const [zeroImageWarningShown, setZeroImageWarningShown] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Certification Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  const loadAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [quotesRes, prodsRes, catsRes, certsRes] = await Promise.all([
        fetch('/api/admin/quote-requests'),
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/certifications'),
      ]);

      if (quotesRes.ok) {
        const qData = await quotesRes.json();
        setQuotes(qData.quoteRequests || []);
      }
      if (prodsRes.ok) {
        const pData = await prodsRes.json();
        setProducts(pData.products || []);
      }
      if (catsRes.ok) {
        const cData = await catsRes.json();
        setCategories(cData.categories || []);
      }
      if (certsRes.ok) {
        const certData = await certsRes.json();
        setCertifications(certData.certifications || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Initial Auth Check
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        const res = await fetch('/api/admin/auth');
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser(data.user);
          loadAllData();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [loadAllData]);


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        setNotification({ type: 'success', message: 'Welcome back, Administrator!' });
        loadAllData();
      } else {
        setAuthError(data.error || 'Authentication failed. Check credentials.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      setUser(null);
      setNotification({ type: 'success', message: 'Signed out securely.' });
    } catch {
      setIsAuthenticated(false);
    }
  }

  // ==========================================
  // SAFEGUARD 1: Category Deletion
  // ==========================================
  async function handleDeleteCategory(category: Category) {
    if ((category.productCount || 0) > 0) {
      setNotification({
        type: 'error',
        message: `SAFEGUARD ACTIVE: Cannot delete category "${category.name}". There are ${category.productCount} product(s) assigned to it. Reassign or remove products first.`,
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(category._id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setNotification({ type: 'error', message: data.error || 'Failed to delete category' });
      } else {
        setNotification({ type: 'success', message: `Category "${category.name}" deleted successfully.` });
        loadAllData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting category';
      setNotification({ type: 'error', message: msg });
    }
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory?.name) return;

    try {
      const isEdit = Boolean(editingCategory._id);
      const url = '/api/admin/categories';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? { id: editingCategory._id, ...editingCategory }
        : editingCategory;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setNotification({ type: 'error', message: data.error });
      } else {
        setNotification({
          type: 'success',
          message: `Category "${editingCategory.name}" saved successfully.`,
        });
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        loadAllData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving category';
      setNotification({ type: 'error', message: msg });
    }
  }

  // ==========================================
  // SAFEGUARD 2: Product Zero-Images Warning
  // ==========================================
  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct?.name) return;

    const images = editingProduct.images || [];
    const isActive = editingProduct.isActive !== false;

    // Check zero images safeguard
    if (isActive && images.length === 0 && !confirmZeroImages) {
      setZeroImageWarningShown(true);
      setNotification({
        type: 'warning',
        message: 'SAFEGUARD WARNING: Product has zero images attached. Buyers convert 85% less without photos. Confirm override to publish.',
      });
      return;
    }

    try {
      const isEdit = Boolean(editingProduct._id);
      const url = '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const body = {
        ...(isEdit ? { id: editingProduct._id } : {}),
        ...editingProduct,
        confirmZeroImages,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'ZERO_IMAGES_WARNING') {
          setZeroImageWarningShown(true);
          setNotification({ type: 'warning', message: data.error });
        } else {
          setNotification({ type: 'error', message: data.error });
        }
      } else {
        setNotification({
          type: 'success',
          message: `Product "${editingProduct.name}" saved successfully.`,
        });
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setZeroImageWarningShown(false);
        setConfirmZeroImages(false);
        loadAllData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving product';
      setNotification({ type: 'error', message: msg });
    }
  }

  async function handleDeleteProduct(prod: Product) {
    if (!confirm(`Are you sure you want to delete product "${prod.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(prod._id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', message: `Product "${prod.name}" deleted.` });
        loadAllData();
      } else {
        setNotification({ type: 'error', message: data.error });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting product';
      setNotification({ type: 'error', message: msg });
    }
  }

  // ==========================================
  // Certifications CRUD
  // ==========================================
  async function handleSaveCert(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCert?.name) return;

    try {
      const isEdit = Boolean(editingCert._id);
      const url = '/api/admin/certifications';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { id: editingCert._id, ...editingCert } : editingCert;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setNotification({ type: 'error', message: data.error });
      } else {
        setNotification({
          type: 'success',
          message: `Certification "${editingCert.name}" saved.`,
        });
        setIsCertModalOpen(false);
        setEditingCert(null);
        loadAllData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving certification';
      setNotification({ type: 'error', message: msg });
    }
  }

  async function handleDeleteCert(cert: Certification) {
    if (!confirm(`Are you sure you want to delete certification "${cert.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/certifications?id=${encodeURIComponent(cert._id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotification({ type: 'success', message: `Certification "${cert.name}" deleted.` });
        loadAllData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting certification';
      setNotification({ type: 'error', message: msg });
    }
  }

  // ==========================================
  // Quote Requests Management & CSV Export
  // ==========================================
  async function handleUpdateQuoteStatus(id: string, status: QuoteRequest['status']) {
    try {
      const res = await fetch('/api/admin/quote-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) => (q._id === id || q.quoteRefId === id ? { ...q, status } : q))
        );
        setNotification({ type: 'success', message: `Lead status updated to ${status.toUpperCase()}.` });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating status';
      setNotification({ type: 'error', message: msg });
    }
  }

  function handleExportCSV() {
    const link = document.createElement('a');
    link.href = '/api/admin/quote-requests/export';
    link.setAttribute('download', 'esailor-quote-requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================
  // RENDER LOGIN SCREEN IF UNAUTHENTICATED
  // ==========================================
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-2xl mb-4">
              ⚓
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">eSailor Admin Portal</h1>
            <p className="text-sm text-slate-400 mt-1">Direct B2B CMS & Lead Management</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/40 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-xs text-slate-400">
              Demo Credentials: <span className="text-emerald-400 font-mono">admin</span> / <span className="text-emerald-400 font-mono">esailor2026!</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-400 animate-pulse font-medium">
          Verifying administrator credentials...
        </div>
      </div>
    );
  }

  // Filtered Quote Requests
  const filteredQuotes = quotes.filter((q) => {
    if (quoteFilterStatus === 'all') return true;
    return q.status === quoteFilterStatus;
  });

  const activeProductsCount = products.filter((p) => p.isActive).length;
  const activeCertsCount = certifications.filter((c) => c.isValid).length;
  const newQuotesCount = quotes.filter((q) => q.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Admin Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚓</span>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                eSailor CMS
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Admin MVP
                </span>
                {isLoadingData && (
                  <span className="text-[10px] text-emerald-400 animate-pulse font-normal">
                    Syncing...
                  </span>
                )}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Signed in as <strong className="text-slate-200">{user?.username}</strong></span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Notification Toast / Banner */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                : notification.type === 'warning'
                ? 'bg-amber-950/60 border-amber-500/30 text-amber-200'
                : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <span>{notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : '❌'}</span>
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Quote Inquiries</div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              {quotes.length}
              {newQuotesCount > 0 && (
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {newQuotesCount} new
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Active Products</div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
              {activeProductsCount}
              <span className="text-xs font-normal text-slate-500">/ {products.length} total</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Categories</div>
            <div className="text-3xl font-extrabold text-white">{categories.length}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Certifications</div>
            <div className="text-3xl font-extrabold text-emerald-400 flex items-baseline gap-2">
              {activeCertsCount}
              <span className="text-xs font-normal text-slate-500">valid & compliant</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Quote Requests ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'certifications'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Certifications ({certifications.length})
          </button>
        </div>

        {/* TAB 1: QUOTE REQUESTS & CSV EXPORT */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 uppercase font-semibold">Filter:</span>
                <div className="flex gap-1">
                  {['all', 'new', 'contacted', 'quoted', 'closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setQuoteFilterStatus(st)}
                      className={`text-xs px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                        quoteFilterStatus === st
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-colors cursor-pointer"
                >
                  <span>📥</span>
                  <span>Export to CSV (RFC-4180)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Ref / Date</th>
                    <th className="py-3.5 px-4">Buyer & Company</th>
                    <th className="py-3.5 px-4">Country / Type</th>
                    <th className="py-3.5 px-4">Product & Qty</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No quote requests found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((q) => (
                      <tr key={q._id || q.quoteRefId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <div className="font-bold text-slate-200">{q.quoteRefId || q._id}</div>
                          <div className="text-[11px] text-slate-500">
                            {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'Recent'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{q.buyerName}</div>
                          <div className="text-xs text-slate-400">{q.companyName || 'Individual'}</div>
                          <div className="text-[11px] text-slate-500">{q.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{q.country}</div>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${
                              q.buyerType === 'international'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {q.buyerType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{q.productOfInterest || q.product}</div>
                          <div className="text-xs text-slate-400 font-semibold">{q.quantity.toLocaleString()} units</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={q.status || 'new'}
                            onChange={(e) => handleUpdateQuoteStatus(q._id, e.target.value as QuoteRequest['status'])}
                            className="text-xs rounded-md bg-slate-950 border border-slate-700 text-slate-200 px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="quoted">QUOTED</option>
                            <option value="closed">CLOSED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedQuote(q)}
                            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
                          >
                            View Specs
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD & ZERO IMAGE SAFEGUARD */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-sm text-slate-400">
                Manage B2B catalog items, specifications, and wholesale minimums.
              </div>
              <button
                onClick={() => {
                  setEditingProduct({
                    isActive: true,
                    moq: 500,
                    currency: 'USD',
                    indicativePriceRangeMin: 1.5,
                    indicativePriceRangeMax: 3.0,
                    images: [],
                  });
                  setConfirmZeroImages(false);
                  setZeroImageWarningShown(false);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                + Add Product
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">MOQ & Price</th>
                    <th className="py-3.5 px-4">Photos</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((p) => {
                    const imgCount = p.images?.length || 0;
                    const catDisplay = typeof p.category === 'string' ? p.category : p.category?.name || 'Unassigned';
                    return (
                      <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-slate-500 font-mono">slug: {p.slug?.current}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-300">{catDisplay}</td>
                        <td className="py-3.5 px-4 text-xs">
                          <div>MOQ: <strong>{p.moq || 100} units</strong></div>
                          <div className="text-slate-400">
                            ${p.indicativePriceRangeMin?.toFixed(2)} - ${p.indicativePriceRangeMax?.toFixed(2)} {p.currency || 'USD'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {imgCount === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              ⚠️ 0 images
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                              🖼️ {imgCount} photo{imgCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              p.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setConfirmZeroImages(false);
                              setZeroImageWarningShown(false);
                              setIsProductModalOpen(true);
                            }}
                            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="text-xs px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES CRUD & BLOCK DELETION SAFEGUARD */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-sm text-slate-400">
                Organize catalog architecture. Category deletion is strictly blocked if products are assigned.
              </div>
              <button
                onClick={() => {
                  setEditingCategory({ displayOrder: categories.length + 1 });
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                + Add Category
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Order</th>
                    <th className="py-3.5 px-4">Category Name</th>
                    <th className="py-3.5 px-4">Slug</th>
                    <th className="py-3.5 px-4">Assigned Products</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {categories.map((c) => {
                    const hasProducts = (c.productCount || 0) > 0;
                    return (
                      <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                          #{c.displayOrder || 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{c.slug?.current}</td>
                        <td className="py-3.5 px-4">
                          {hasProducts ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                              🔒 {c.productCount} product{c.productCount! > 1 ? 's' : ''} assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                              0 products
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCategory(c);
                              setIsCategoryModalOpen(true);
                            }}
                            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c)}
                            title={hasProducts ? `Safeguard active: Blocked (${c.productCount} products assigned)` : 'Delete category'}
                            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                              hasProducts
                                ? 'bg-slate-800/60 text-slate-500 border-slate-700 cursor-not-allowed'
                                : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/40 cursor-pointer'
                            }`}
                          >
                            {hasProducts ? 'Deletion Blocked' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CERTIFICATIONS CRUD */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-sm text-slate-400">
                Audited export certifications. Status automatically calculates expiry validity.
              </div>
              <button
                onClick={() => {
                  setEditingCert({
                    isActive: true,
                    issuingBody: 'International Standards Body',
                    issueDate: new Date().toISOString().split('T')[0],
                  });
                  setIsCertModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                + Add Certification
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Code / Standard</th>
                    <th className="py-3.5 px-4">Certification Name</th>
                    <th className="py-3.5 px-4">Issuing Body</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4">Validity Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {certifications.map((cert) => {
                    const statusText = cert.statusDetail?.statusText || (cert.isValid ? 'Active' : 'Inactive');
                    const isValid = cert.isValid;
                    return (
                      <tr key={cert._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white font-mono text-xs">
                          {cert.code || cert.name}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">{cert.name}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{cert.issuingBody || 'Authority'}</td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                          {cert.expiryDate || 'No Expiry'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isValid
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCert(cert);
                              setIsCertModalOpen(true);
                            }}
                            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCert(cert)}
                            className="text-xs px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          MODALS & DRAWERS
          ========================================== */}

      {/* 1. QUOTE DETAIL MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedQuote.quoteRefId || selectedQuote._id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedQuote.buyerName}</h3>
                <p className="text-xs text-slate-400">{selectedQuote.companyName} • {selectedQuote.country}</p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">Contact Email</span>
                <a href={`mailto:${selectedQuote.email}`} className="text-emerald-400 font-medium hover:underline">
                  {selectedQuote.email}
                </a>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">Phone Number</span>
                <a href={`tel:${selectedQuote.phone}`} className="text-slate-200 font-medium">
                  {selectedQuote.phone}
                </a>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">Product of Interest</span>
                <strong className="text-white">{selectedQuote.productOfInterest || selectedQuote.product}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">Requested Volume</span>
                <strong className="text-emerald-400">{selectedQuote.quantity.toLocaleString()} units</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Customization & Specifications
              </span>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {selectedQuote.notesString ||
                  (Array.isArray(selectedQuote.customizationNotes)
                    ? (selectedQuote.customizationNotes as Array<{ children?: Array<{ text?: string }> }>)
                        .map((b) => b.children?.map((c) => c.text).join(' '))
                        .join('\n')
                    : 'No additional notes provided.')}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCT EDIT / ADD MODAL WITH ZERO-IMAGE SAFEGUARD */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingProduct._id ? 'Edit Product' : 'Add New Product'}
            </h3>

            {/* SAFEGUARD WARNING BANNER */}
            {zeroImageWarningShown && (
              <div className="mb-4 p-4 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-300 text-sm">
                  <span>⚠️</span> Safeguard Active: Zero Images Attached
                </div>
                <p>
                  High-converting B2B listings require at least one sample image. If published with zero images, international buyers cannot visually verify weave or color.
                </p>
                <label className="flex items-center gap-2 font-semibold text-white pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmZeroImages}
                    onChange={(e) => setConfirmZeroImages(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Confirm: Publish anyway with zero images</span>
                </label>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Heavy Duty Jute Shopper"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={
                      typeof editingProduct.category === 'string'
                        ? editingProduct.category
                        : editingProduct.category?.name || categories[0]?.name || ''
                    }
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">MOQ (Minimum Order Qty)</label>
                  <input
                    type="number"
                    value={editingProduct.moq || 100}
                    onChange={(e) => setEditingProduct({ ...editingProduct, moq: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Min FOB Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.indicativePriceRangeMin || 1.5}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, indicativePriceRangeMin: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Max FOB Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.indicativePriceRangeMax || 3.0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, indicativePriceRangeMax: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Images (URLs)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={productFormImageInput}
                    onChange={(e) => setProductFormImageInput(e.target.value)}
                    placeholder="https://... or /images/..."
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!productFormImageInput.trim()) return;
                      const imgs = editingProduct.images || [];
                      setEditingProduct({
                        ...editingProduct,
                        images: [...imgs, { url: productFormImageInput.trim(), alt: editingProduct.name }],
                      });
                      setProductFormImageInput('');
                      setZeroImageWarningShown(false);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    + Add Image
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editingProduct.images || []).map((img, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                      <span className="truncate max-w-[200px]">{img.url}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const imgs = [...(editingProduct.images || [])];
                          imgs.splice(idx, 1);
                          setEditingProduct({ ...editingProduct, images: imgs });
                        }}
                        className="text-rose-400 font-bold ml-1 hover:text-rose-300 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!editingProduct.images || editingProduct.images.length === 0) && (
                    <span className="text-xs text-slate-500 italic">No images currently attached.</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                  />
                  <span>Active in Catalog (Publish to live website)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CATEGORY EDIT / ADD MODAL */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCategory._id ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Promotional Bags"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CERTIFICATION EDIT / ADD MODAL */}
      {isCertModalOpen && editingCert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCert._id ? 'Edit Certification' : 'Add Certification'}
            </h3>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={editingCert.name || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                  placeholder="e.g. Global Organic Textile Standard"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Standard Code</label>
                <input
                  type="text"
                  value={editingCert.code || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, code: e.target.value })}
                  placeholder="e.g. GOTS-CU-850123"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={editingCert.issueDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={editingCert.expiryDate || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={editingCert.isActive !== false}
                    onChange={(e) => setEditingCert({ ...editingCert, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                  />
                  <span>Active & Verified</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCertModalOpen(false);
                    setEditingCert(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
