import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';

const isDualConfigured = !!process.env.DUAL_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const provider = getDataProvider();
    const ticket = await provider.getTicket(params.id);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // DUAL network does not have action history API
    return NextResponse.json({
      data: { ...ticket, actions: [] },
    });
  } catch (error) {
    console.error('Failed to fetch ticket from DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket from DUAL API' },
      { status: 500 }
    );
  }
}
