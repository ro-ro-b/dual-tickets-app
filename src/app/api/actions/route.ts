import { NextRequest, NextResponse } from 'next/server';
import { dualClient } from '@/lib/dual-client';

const isDualConfigured = !!process.env.DUAL_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const objectId = searchParams.get('objectId');

  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    // DUAL network does not have a direct actions history API, return empty array
    return NextResponse.json({ data: [], total: 0 });
  } catch (error) {
    console.error('Failed to fetch actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, objectId, actor, parameters } = body;

  const validActions = ['PURCHASE', 'TRANSFER', 'LIST_RESALE', 'PURCHASE_RESALE', 'REDEEM', 'CANCEL', 'VERIFY', 'MINT', 'BURN'];

  if (!validActions.includes(action)) {
    return NextResponse.json({ error: `Invalid action: ${action}. Valid actions: ${validActions.join(', ')}` }, { status: 400 });
  }

  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const response = await dualClient.executeAction(body);
    return NextResponse.json({ data: response, message: 'Action executed on DUAL network' }, { status: 201 });
  } catch (error) {
    console.error('Failed to execute action via DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to execute action on DUAL network' },
      { status: 500 }
    );
  }
}
