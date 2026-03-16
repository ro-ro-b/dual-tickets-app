import { NextRequest, NextResponse } from 'next/server';
import { demoTickets, demoActions } from '@/lib/demo-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticket = demoTickets.find(t => t.id === params.id);
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const ticketActions = demoActions.filter(a => a.objectId === params.id);

  return NextResponse.json({
    data: { ...ticket, actions: ticketActions },
  });
}
