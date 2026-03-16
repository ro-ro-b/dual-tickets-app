import { NextRequest, NextResponse } from 'next/server';
import { demoTickets, DEMO_CONSUMER_WALLET } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const status = searchParams.get('status');
  const owner = searchParams.get('owner');

  let tickets = [...demoTickets];

  if (eventId) tickets = tickets.filter(t => t.eventId === eventId);
  if (status) tickets = tickets.filter(t => t.ticketData.status === status);
  if (owner) tickets = tickets.filter(t => t.ownerWallet === owner);

  return NextResponse.json({ data: tickets, total: tickets.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    data: { id: 'tkt-new-' + Date.now(), ...body },
    message: 'Tickets minted',
  }, { status: 201 });
}
