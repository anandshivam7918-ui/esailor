import { NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/admin-store';
import { getAdminSession } from '@/lib/admin-auth';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to process site content request.';
}

export async function GET(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, content });
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
    const { section, data } = body;
    const updated = await updateSiteContent(section, data, (session as { username?: string }).username || 'Admin');
    return NextResponse.json({ success: true, content: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 400 });
  }
}
