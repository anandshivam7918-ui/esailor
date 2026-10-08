import { NextResponse } from 'next/server';
import { getProductionItems, updateProductionProgress } from '@/lib/admin-store';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const items = await getProductionItems();
    return NextResponse.json({ success: true, items });
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
    const { orderId, progress, status } = body;
    const updated = await updateProductionProgress(orderId, progress, status, (session as any).username || 'Admin');
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
