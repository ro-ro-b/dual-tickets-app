import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const owner = searchParams.get('owner');

  try {
    const provider = getDataProvider();
    let tickets = await provider.listTickets();

    if (status) tickets = tickets.filter((t: any) => t.onChainStatus === status);
    if (owner) tickets = tickets.filter((t: any) => t.ownerWallet === owner);

    return NextResponse.json({ data: tickets, total: tickets.length });
  } catch (error: any) {
    console.error('Failed to fetch tickets:', error);
    const code = error?.message?.includes('not configured') ? 503 : 500;
    return NextResponse.json({ error: error?.message || 'Failed to fetch tickets' }, { status: code });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const provider = getDataProvider();
    const result = await provider.executeAction(body.templateId, 'MINT', body);
    return NextResponse.json({ data: result, message: 'Ticket minted on DUAL network' }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to mint:', error);
    return NextResponse.json({ error: error?.message || 'Failed to mint ticket' }, { status: 500 });
  }
}
