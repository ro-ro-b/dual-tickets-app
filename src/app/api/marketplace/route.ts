import { NextRequest, NextResponse } from 'next/server';
import { demoTickets, demoEvents } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const listedTickets = demoTickets.filter(t => t.ticketData.status === 'listed');

  const listings = listedTickets.map(ticket => {
    const event = demoEvents.find(e => e.id === ticket.eventId);
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
      markup: ticket.ticketData.purchasePrice > 0
        ? ((ticket.ticketData.currentPrice - ticket.ticketData.purchasePrice) / ticket.ticketData.purchasePrice * 100).toFixed(0) + '%'
        : '0%',
    };
  });

  return NextResponse.json({ data: listings, total: listings.length });
}
