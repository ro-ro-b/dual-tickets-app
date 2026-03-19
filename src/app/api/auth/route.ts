import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, role } = body;

  // Get wallet from env or use a default placeholder
  const walletAddress = process.env.DUAL_OWNER_WALLET || '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0';
  const isAdmin = role === 'admin' || email?.includes('admin');
  const wallet = isAdmin ? process.env.DUAL_ADMIN_WALLET || walletAddress : walletAddress;

  return NextResponse.json({
    data: {
      token: 'dual-token-' + Date.now(),
      wallet: {
        id: wallet,
        address: wallet,
        email: email || 'user@dual-network.com',
        displayName: isAdmin ? 'Admin User' : 'Network User',
        role: isAdmin ? 'admin' : 'consumer',
      },
      organization: {
        id: process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71',
        name: 'DUAL Network',
        description: 'DUAL network organization',
        createdAt: new Date().toISOString(),
        balance: 0,
        memberCount: 1,
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  });
}
