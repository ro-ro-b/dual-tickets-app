import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`)
      );

      // Simulate periodic events
      const interval = setInterval(() => {
        const events = [
          { type: 'ticket_sold', data: { eventId: 'evt-001', tier: 'General Admission', buyer: '0x...abc' } },
          { type: 'ticket_transferred', data: { ticketId: 'tkt-006', from: '0x...def', to: '0x...ghi' } },
          { type: 'ticket_anchored', data: { ticketId: 'tkt-009', status: 'anchored' } },
          { type: 'ticket_redeemed', data: { ticketId: 'tkt-003', venue: 'Accor Stadium' } },
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ ...randomEvent, timestamp: new Date().toISOString() })}\n\n`)
        );
      }, 15000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
