import { randomUUID } from 'node:crypto';
import { mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { sanityClient } from '@/lib/sanity';

export const runtime = 'nodejs';

const mediaDir = path.join(process.cwd(), 'public', 'admin-media');
const allowedTypes: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};
const maxUploadBytes = 5 * 1024 * 1024;

export async function GET(request: Request) {
  if (!(await getAdminSession(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await mkdir(mediaDir, { recursive: true });
    const entries = await readdir(mediaDir);
    const assets = await Promise.all(entries.filter((name) => /^asset-[a-f0-9-]+\.(jpg|png|webp|gif)$/i.test(name)).map(async (name) => {
      const details = await stat(path.join(mediaDir, name));
      return { id: name, name, type: path.extname(name).slice(1).toUpperCase(), size: details.size, url: `/admin-media/${name}` };
    }));
    return NextResponse.json({ success: true, assets });
  } catch {
    return NextResponse.json({ error: 'Unable to read the media directory.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await getAdminSession(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select an image file to upload.' }, { status: 400 });
    const extension = allowedTypes[file.type];
    if (!extension) return NextResponse.json({ error: 'Upload a JPEG, PNG, WebP, or GIF image.' }, { status: 400 });
    if (file.size < 1 || file.size > maxUploadBytes) return NextResponse.json({ error: 'Images must be between 1 byte and 5 MB.' }, { status: 400 });

    if (form.get('storage') === 'sanity') {
      if (!process.env.SANITY_API_TOKEN) return NextResponse.json({ error: 'Sanity image storage is not configured.' }, { status: 503 });
      const asset = await sanityClient.withConfig({ useCdn: false }).assets.upload('image', Buffer.from(await file.arrayBuffer()), {
        filename: file.name.replace(/[\r\n"\\]/g, '_'),
        contentType: file.type,
      });
      return NextResponse.json({
        success: true,
        asset: { id: asset._id, url: asset.url, type: file.type, size: file.size },
        image: { asset: { _type: 'reference', _ref: asset._id }, url: asset.url, alt: file.name.replace(/\.[^.]+$/, '') },
      }, { status: 201 });
    }

    await mkdir(mediaDir, { recursive: true });
    const name = `asset-${randomUUID()}${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(mediaDir, name), bytes, { flag: 'wx' });
    return NextResponse.json({ success: true, asset: { id: name, name, type: file.type, size: bytes.length, url: `/admin-media/${name}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to save this image to local media storage.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^asset-[a-f0-9-]+\.(jpg|png|webp|gif)$/i.test(id)) return NextResponse.json({ error: 'Media asset was not found.' }, { status: 400 });
  try {
    await unlink(path.join(mediaDir, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unable to delete this media asset.' }, { status: 404 });
  }
}
