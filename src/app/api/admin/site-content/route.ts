import { NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/admin-store';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, content });
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
    const { section, data } = body;
    const updated = await updateSiteContent(section, data, (session as any).username || 'Admin');
    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
