import { NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';

export async function GET() {
  const isDualConfigured = !!process.env.DUAL_API_KEY;

  if (!isDualConfigured) {
    return NextResponse.json(
      { error: 'DUAL_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const provider = getDataProvider();
    const stats = await provider.getStats();
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Failed to fetch stats from DUAL API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats from DUAL API' },
      { status: 500 }
    );
  }
}
