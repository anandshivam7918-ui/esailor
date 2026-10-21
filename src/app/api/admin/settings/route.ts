import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET(request: Request) {
  if (!(await getAdminSession(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    success: true,
    settings: {
      adminAuthenticationConfigured: Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD && (process.env.SESSION_SECRET || '').length >= 32),
      sanityConfigured: Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET && process.env.SANITY_API_TOKEN),
      mediaStorage: 'local filesystem (public/admin-media)',
      sharedPersistentStorageConfigured: false,
    },
  });
}
