import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import { getDashboardCalculatedStats } from '@/lib/admin-store';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to load dashboard statistics.';
}

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request).valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getDashboardCalculatedStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
