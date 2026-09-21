import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
} from '@/lib/admin-store';

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);

    const categoriesWithCount = categories.map((cat: { _id: string; name: string; slug?: { current: string } }) => {
      const assignedCount = products.filter((p: { category?: string | { _ref?: string; _id?: string; slug?: { current: string }; name?: string } }) => {
        if (!p.category) return false;
        if (typeof p.category === 'string') {
          return p.category === cat._id || p.category === cat.slug?.current || p.category === cat.name;
        }
        return (
          p.category._ref === cat._id ||
          p.category._id === cat._id ||
          p.category.slug?.current === cat.slug?.current ||
          p.category.name === cat.name
        );
      }).length;

      return {
        ...cat,
        productCount: assignedCount,
      };
    });

    return NextResponse.json({ success: true, categories: categoriesWithCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newCategory = await createCategory(data);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create category';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const updated = await updateCategory(id, data);
    return NextResponse.json({ success: true, category: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update category';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category ID query parameter required' }, { status: 400 });
    }

    const result = await deleteCategory(id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'CATEGORY_IN_USE') {
      const customErr = err as unknown as { message: string; assignedCount?: number };
      return NextResponse.json(
        {
          error: customErr.message,
          code: 'CATEGORY_IN_USE',
          assignedCount: customErr.assignedCount,
        },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : 'Failed to delete category';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

