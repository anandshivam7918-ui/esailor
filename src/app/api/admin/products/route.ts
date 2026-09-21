import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/admin-store';

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products';
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
    const newProduct = await createProduct(data);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ZERO_IMAGES_WARNING') {
      const customErr = err as unknown as { message: string };
      return NextResponse.json(
        {
          error: customErr.message,
          code: 'ZERO_IMAGES_WARNING',
          requiresConfirmation: true,
        },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : 'Failed to create product';
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
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const updated = await updateProduct(id, data);
    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ZERO_IMAGES_WARNING') {
      const customErr = err as unknown as { message: string };
      return NextResponse.json(
        {
          error: customErr.message,
          code: 'ZERO_IMAGES_WARNING',
          requiresConfirmation: true,
        },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : 'Failed to update product';
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
      return NextResponse.json({ error: 'Product ID query parameter required' }, { status: 400 });
    }

    const result = await deleteProduct(id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

