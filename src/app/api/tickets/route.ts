import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { getAuthenticatedClient } from '@/lib/dual-auth';

export const dynamic = 'force-dynamic';

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
    const client = await getAuthenticatedClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Login via admin to mint.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const templateId = body.templateId || body.template_id || process.env.DUAL_TEMPLATE_ID || '';
    const num = body.quantity || body.num || 1;

    const result = await client.ebus.execute({
      action: {
        mint: {
          template_id: templateId,
          num,
          ...(body.data ? { data: body.data } : {}),
        },
      },
    });

    const objectIds = result.steps?.[0]?.output?.ids || [];

    return NextResponse.json({
      success: true,
      actionId: result.action_id,
      objectIds,
      message: `${objectIds.length} ticket(s) minted on DUAL network`,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to mint:', error);
    return NextResponse.json({ error: error?.message || 'Failed to mint ticket' }, { status: 500 });
  }
}
