import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import {
  getQuoteRequests,
  updateQuoteRequestStatus,
  deleteQuoteRequest,
} from '@/lib/admin-store';

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const requests = await getQuoteRequests();
    return NextResponse.json({ success: true, quoteRequests: requests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch quote requests';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }
    const updated = await updateQuoteRequestStatus(id, status);
    return NextResponse.json({ success: true, quoteRequest: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update quote request status';
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
      return NextResponse.json({ error: 'Quote Request ID query parameter required' }, { status: 400 });
    }

    const result = await deleteQuoteRequest(id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete quote request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

