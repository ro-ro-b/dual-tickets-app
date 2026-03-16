import { NextRequest, NextResponse } from 'next/server';
import { demoEvents, demoTickets } from '@/lib/demo-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = demoEvents.find(e => e.id === params.id);
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const eventTickets = demoTickets.filter(t => t.eventId === params.id);

  return NextResponse.json({
    data: {
      ...event,
      ticketCount: eventTickets.length,
      ticketsSold: event.tiers.reduce((sum, t) => sum + t.sold, 0),
      totalCapacity: event.tiers.reduce((sum, t) => sum + t.capacity, 0),
      revenue: event.tiers.reduce((sum, t) => sum + (t.sold * t.price), 0),
    },
  });
}
