import { NextResponse } from 'next/server';
import { getInventory, updateInventoryQty } from '@/lib/admin-store';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const inventory = await getInventory();
    return NextResponse.json({ success: true, inventory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, qty } = body;
    const updated = await updateInventoryQty(id, qty, (session as any).username || 'Admin');
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
