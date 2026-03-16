import { NextRequest, NextResponse } from 'next/server';
import { demoTemplates } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({ data: demoTemplates, total: demoTemplates.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    data: { id: 'tmpl-new-' + Date.now(), ...body },
    message: 'Template created',
  }, { status: 201 });
}
