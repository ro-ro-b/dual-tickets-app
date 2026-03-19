import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { dualClient } from '@/lib/dual-client';

const isDualConfigured = !!process.env.DUAL_API_KEY;
const templateId = process.env.DUAL_TEMPLATE_ID || '69b9c1ce4dfa44768e8d6e5f';
const orgId = process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const status = searchParams.get('status');
  const owner = searchParams.get('owner');

  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const response = await dualClient.listObjects({
      template_id: templateId,
      organization_id: orgId,
    });
    let tickets = response.data || [];

    if (eventId) tickets = tickets.filter((t: any) => t.template_id === eventId);
    if (status) tickets = tickets.filter((t: any) => !t.content_hash || t.content_hash === '0x0000000000000000000000000000000000000000' ? 'pending' : 'anchored' === status);
    if (owner) tickets = tickets.filter((t: any) => t.owner === owner);

    return NextResponse.json({ data: tickets, total: tickets.length });
  } catch (error) {
    console.error('Failed to fetch from DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets from DUAL API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const response = await dualClient.mintObject({
      template_id: templateId,
      ...body,
    });
    return NextResponse.json({
      data: response,
      message: 'Ticket minted on DUAL network',
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to mint via DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to mint ticket on DUAL network' },
      { status: 500 }
    );
  }
}
