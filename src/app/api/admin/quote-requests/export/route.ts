import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import { getQuoteRequests, generateQuoteRequestsCSV } from '@/lib/admin-store';

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required to export customer data' },
      { status: 401 }
    );
  }

  try {
    const records = await getQuoteRequests();
    const csvContent = generateQuoteRequestsCSV(records);

    const now = new Date().toISOString().split('T')[0];
    const filename = `esailor-quote-requests-${now}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to export CSV';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
