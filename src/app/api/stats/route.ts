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

    // Compute stats from live ticket and event data
    const [tickets, events] = await Promise.all([
      provider.listTickets().catch(() => []),
      provider.listEvents().catch(() => []),
    ]);

    const ticketsByStatus: Record<string, number> = {};
    let totalRevenue = 0;
    let anchoredCount = 0;

    for (const t of tickets) {
      const status = t.ticketData?.status || 'unknown';
      ticketsByStatus[status] = (ticketsByStatus[status] || 0) + 1;
      totalRevenue += t.ticketData?.purchasePrice || 0;
      if (t.onChainStatus === 'anchored') anchoredCount++;
    }

    const stats = {
      totalEvents: events.length,
      activeEvents: events.filter((e: any) => e.status === 'on-sale' || e.status === 'active').length,
      totalTicketsSold: tickets.length,
      totalRevenue,
      ticketsByStatus,
      anchoredCount,
      revenueChange: '0%',
      topEvent: tickets[0]?.ticketData?.eventName || 'N/A',
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Failed to compute stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
