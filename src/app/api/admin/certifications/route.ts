import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '@/lib/admin-store';

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const certs = await getCertifications();
    return NextResponse.json({ success: true, certifications: certs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch certifications';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newCert = await createCertification(data);
    return NextResponse.json({ success: true, certification: newCert }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create certification';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
    }
    const updated = await updateCertification(id, data);
    return NextResponse.json({ success: true, certification: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update certification';
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
      return NextResponse.json({ error: 'Certification ID query parameter required' }, { status: 400 });
    }

    const result = await deleteCertification(id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete certification';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

