import { NextRequest, NextResponse } from 'next/server';
import { demoActions } from '@/lib/demo-data';
import { dualClient } from '@/lib/dual-client';

const isDualConfigured = !!process.env.DUAL_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const objectId = searchParams.get('objectId');

  let actions = [...demoActions];
  if (objectId) actions = actions.filter(a => a.objectId === objectId);

  actions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ data: actions, total: actions.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, objectId, actor, parameters } = body;

  const validActions = ['PURCHASE', 'TRANSFER', 'LIST_RESALE', 'PURCHASE_RESALE', 'REDEEM', 'CANCEL', 'VERIFY', 'MINT', 'BURN'];

  if (!validActions.includes(action)) {
    return NextResponse.json({ error: `Invalid action: ${action}. Valid actions: ${validActions.join(', ')}` }, { status: 400 });
  }

  // If DUAL_API_KEY is configured, execute action via live API
  if (isDualConfigured) {
    try {
      const response = await dualClient.executeAction(body);
      return NextResponse.json({ data: response, message: 'Action executed' }, { status: 201 });
    } catch (error) {
      console.error('Failed to execute action via DUAL API, falling back to demo:', error);
    }
  }

  const newAction = {
    id: 'act-' + Date.now(),
    objectId,
    type: action,
    actor: actor || 'demo-user',
    timestamp: new Date().toISOString(),
    status: 'completed' as const,
    description: `Action ${action} executed on ticket ${objectId}`,
    parameters: parameters || {},
  };

  return NextResponse.json({ data: newAction, message: 'Action executed' }, { status: 201 });
}
