import { NextResponse } from 'next/server';
import { getInventory, updateInventoryQty } from '@/lib/admin-store';
import { getAdminSession } from '@/lib/admin-auth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to process inventory request.';
}

export async function GET(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inventory = await getInventory();
    return NextResponse.json({ success: true, inventory });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: Record<string, unknown> = await req.json();
    const { id, qty } = body;
    const updated = await updateInventoryQty(id, qty, (session as { username?: string }).username || 'Admin');
    return NextResponse.json({ success: true, item: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 400 });
  }
}
