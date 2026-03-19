import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';

const isDualConfigured = !!process.env.DUAL_API_KEY;
const templateId = process.env.DUAL_TEMPLATE_ID || '69b9c1ce4dfa44768e8d6e5f';
const orgId = process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71';

export async function GET(request: NextRequest) {
  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const provider = getDataProvider();
    const tickets = await provider.listTickets();
    const events = await provider.listEvents();

    // Filter for listed tickets and enrich with event data
    const listedTickets = tickets.filter((t: any) => t.ticketData?.status === 'listed');

    const listings = listedTickets.map((ticket: any) => {
      const event = events.find((e: any) => e.id === ticket.eventId);
      return {
        ...ticket,
        event: event ? {
          id: event.id,
          name: event.name,
          type: event.type,
          category: event.category,
          venue: event.venue,
          date: event.date,
          imageUrl: event.imageUrl,
          resaleMaxMarkup: event.resaleMaxMarkup,
        } : null,
        markup: ticket.ticketData?.purchasePrice > 0
          ? (((ticket.ticketData?.currentPrice || 0) - (ticket.ticketData?.purchasePrice || 0)) / (ticket.ticketData?.purchasePrice || 1) * 100).toFixed(0) + '%'
          : '0%',
      };
    });

    return NextResponse.json({ data: listings, total: listings.length });
  } catch (error) {
    console.error('Failed to fetch marketplace from DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace from DUAL API' },
      { status: 500 }
    );
  }
}
