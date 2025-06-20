import { NextResponse } from 'next/server';

import packageJson from '@/package.json';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const secret = process.env.NEXT_APP_INTERNAL_API_SECRET;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'user-Timezone': req.headers.get('user-Timezone') || '',
    'partner-id': req.headers.get('partner-id') || '',
    'x-forwarded-for': req.headers.get('x-forwarded-for') || '',
    ssr: req.headers.get('ssr') || '',
    'user-agent': req.headers.get('user-agent') || '',
    'accept-language': req.headers.get('accept-language') || '',
    'accept-encoding': req.headers.get('accept-encoding') || '',
    accept: req.headers.get('accept') || '',
    origin: req.headers.get('origin') || '',
    referer: req.headers.get('referer') || '',
    'sentry-trace': req.headers.get('sentry-trace') || '',
  };

  if (secret) {
    headers['x-internal-secret'] = secret;
  } else {
    throw new Error('NEXT_APP_INTERNAL_API_SECRET is not set');
  }

  headers['cookie'] = req.headers.get('cookie') || '';
  headers['x-app-version'] = packageJson.version || '4.0.0';

  // Parse the request body
  const body = await req.json();

  const backendResponse = await fetch(
    `${process.env.NEXT_PUBLIC_GQL_HTTP_URL}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }
  );

  const data = await backendResponse.json();
  return NextResponse.json(data, { status: backendResponse.status });
}
