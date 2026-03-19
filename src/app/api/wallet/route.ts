import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function getWallet(): string[] {
  const cookieStore = cookies();
  const raw = cookieStore.get('dual_wallet')?.value;
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export async function GET() {
  const wallet = getWallet();
  return NextResponse.json({ objectIds: wallet, count: wallet.length });
}
