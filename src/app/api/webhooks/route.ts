import { NextRequest, NextResponse } from 'next/server';

const webhookLog: Array<{ id: string; event: string; objectId: string; data: any; timestamp: string }> = [];

export async function GET() {
  return NextResponse.json({ data: webhookLog, total: webhookLog.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const entry = {
    id: 'wh-' + Date.now(),
    event: body.event || 'unknown',
    objectId: body.objectId || '',
    data: body.data || body,
    timestamp: new Date().toISOString(),
  };

  webhookLog.push(entry);

  return NextResponse.json({ received: true, id: entry.id }, { status: 200 });
}
