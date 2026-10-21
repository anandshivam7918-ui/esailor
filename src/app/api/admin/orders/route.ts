import { NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus } from '@/lib/admin-store';
import { getAdminSession } from '@/lib/admin-auth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to process order request.';
}

export async function GET(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: Record<string, unknown> = await req.json();
    const newOrder = await createOrder(body, (session as { username?: string }).username || 'Admin');
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: Record<string, unknown> = await req.json();
    const { id, status } = body;
    const updated = await updateOrderStatus(id, status, (session as { username?: string }).username || 'Admin');
    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 400 });
  }
}
