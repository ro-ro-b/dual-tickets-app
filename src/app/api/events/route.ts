import { NextRequest, NextResponse } from 'next/server';
import { demoEvents } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const city = searchParams.get('city');
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') || 'date-asc';

  let events = [...demoEvents];

  if (type && type !== 'all') events = events.filter(e => e.type === type);
  if (category && category !== 'all') events = events.filter(e => e.category === category);
  if (city && city !== 'all') events = events.filter(e => e.venue.city.toLowerCase() === city.toLowerCase());
  if (status && status !== 'all') events = events.filter(e => e.status === status);

  switch (sortBy) {
    case 'date-asc':
      events.sort((a, b) => new Date(a.date.start).getTime() - new Date(b.date.start).getTime());
      break;
    case 'date-desc':
      events.sort((a, b) => new Date(b.date.start).getTime() - new Date(a.date.start).getTime());
      break;
    case 'price-asc':
      events.sort((a, b) => Math.min(...a.tiers.map(t => t.price)) - Math.min(...b.tiers.map(t => t.price)));
      break;
    case 'price-desc':
      events.sort((a, b) => Math.max(...b.tiers.map(t => t.price)) - Math.max(...a.tiers.map(t => t.price)));
      break;
    case 'popularity':
      events.sort((a, b) => b.tiers.reduce((s, t) => s + t.sold, 0) - a.tiers.reduce((s, t) => s + t.sold, 0));
      break;
  }

  return NextResponse.json({ data: events, total: events.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ data: { id: 'evt-new-' + Date.now(), ...body }, message: 'Event created' }, { status: 201 });
}
