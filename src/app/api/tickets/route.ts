import { NextRequest, NextResponse } from 'next/server';
import { demoTickets, DEMO_CONSUMER_WALLET } from '@/lib/demo-data';
import { dualClient } from '@/lib/dual-client';

const isDualConfigured = !!process.env.DUAL_API_KEY;
const templateId = process.env.DUAL_TEMPLATE_ID || '69b9c1ce4dfa44768e8d6e5f';
const orgId = process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const status = searchParams.get('status');
  const owner = searchParams.get('owner');

  let tickets = [...demoTickets];

  // If DUAL_API_KEY is configured, fetch from live API
  if (isDualConfigured) {
    try {
      const response = await dualClient.listObjects({
        template_id: templateId,
        organization_id: orgId,
      });
      tickets = response.data || [...demoTickets];
    } catch (error) {
      console.error('Failed to fetch from DUAL API, falling back to demo data:', error);
      tickets = [...demoTickets];
    }
  }

  if (eventId) tickets = tickets.filter(t => t.eventId === eventId);
  if (status) tickets = tickets.filter(t => t.ticketData.status === status);
  if (owner) tickets = tickets.filter(t => t.ownerWallet === owner);

  return NextResponse.json({ data: tickets, total: tickets.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (isDualConfigured) {
    try {
      const response = await dualClient.mintObject({
        template_id: templateId,
        ...body,
      });
      return NextResponse.json({
        data: response,
        message: 'Tickets minted',
      }, { status: 201 });
    } catch (error) {
      console.error('Failed to mint via DUAL API, falling back to demo:', error);
    }
  }

  return NextResponse.json({
    data: { id: 'tkt-new-' + Date.now(), ...body },
    message: 'Tickets minted',
  }, { status: 201 });
}
