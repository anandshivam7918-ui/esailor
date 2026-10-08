import { NextResponse } from 'next/server';
import { getDashboardCalculatedStats } from '@/lib/admin-store';

export async function GET() {
  try {
    const stats = await getDashboardCalculatedStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
