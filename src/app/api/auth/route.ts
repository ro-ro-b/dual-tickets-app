import { NextRequest, NextResponse } from 'next/server';
import { DEMO_CONSUMER_WALLET, DEMO_ADMIN_WALLET } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, role } = body;

  // Demo auth — always succeeds
  const isAdmin = role === 'admin' || email?.includes('admin');
  const wallet = isAdmin ? DEMO_ADMIN_WALLET : DEMO_CONSUMER_WALLET;

  return NextResponse.json({
    data: {
      token: 'demo-token-' + Date.now(),
      wallet: {
        id: wallet,
        address: wallet,
        email: email || 'demo@dual-tickets.com',
        displayName: isAdmin ? 'Admin User' : 'Demo User',
        role: isAdmin ? 'admin' : 'consumer',
      },
      organization: {
        id: 'org-demo',
        name: 'DUAL Tickets Demo',
        description: 'Demo organisation',
        createdAt: new Date().toISOString(),
        balance: 10000,
        memberCount: 1,
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  });
}
