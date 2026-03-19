import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function getWallet(): string[] {
  const cookieStore = cookies();
  const raw = cookieStore.get('dual_wallet')?.value;
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function setWallet(ids: string[]) {
  cookies().set('dual_wallet', JSON.stringify(ids), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { objectId } = await request.json();
    if (!objectId) {
      return NextResponse.json({ error: 'objectId is required' }, { status: 400 });
    }

    const wallet = getWallet();
    if (wallet.includes(objectId)) {
      return NextResponse.json({ error: 'Already claimed', alreadyClaimed: true }, { status: 409 });
    }

    wallet.push(objectId);
    setWallet(wallet);

    return NextResponse.json({ success: true, objectId, walletSize: wallet.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Claim failed' }, { status: 500 });
  }
}
