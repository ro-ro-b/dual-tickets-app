import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
import { dualClient } from '@/lib/dual-client';

const isDualConfigured = !!process.env.DUAL_API_KEY;

export async function GET() {
  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const provider = getDataProvider();
    const templates = await provider.listEvents();
    return NextResponse.json({ data: templates, total: templates.length });
  } catch (error) {
    console.error('Failed to fetch templates from DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates from DUAL API' },
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
    const response = await dualClient.createTemplate(body);
    return NextResponse.json({
      data: response,
      message: 'Template created on DUAL network',
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create template via DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to create template on DUAL network' },
      { status: 500 }
    );
  }
}
