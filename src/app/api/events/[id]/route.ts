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
    const event = await provider.getEvent(params.id);
    if (!event) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const tickets = await provider.listTickets();
    const eventTickets = tickets.filter((t: any) => t.eventId === params.id);

    return NextResponse.json({
      data: {
        ...event,
        ticketCount: eventTickets.length,
        ticketsSold: 0,
        totalCapacity: 0,
        revenue: 0,
      },
    });
  } catch (error) {
    console.error('Failed to fetch template from DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template from DUAL API' },
      { status: 500 }
    );
  }
}
