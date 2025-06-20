import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  const apiKey = process.env.NEXT_APP_TON_CENTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'NEXT_APP_TON_CENTER_API_KEY is not set' },
      { status: 500 }
    );
  }

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://toncenter.com/api/v2/getAddressBalance?address=${address}`,
      {
        headers: {
          accept: 'application/json',
          'X-API-Key': apiKey,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
