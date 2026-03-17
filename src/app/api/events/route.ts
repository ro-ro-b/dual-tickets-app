import { NextRequest, NextResponse } from 'next/server';
import { demoEvents } from '@/lib/demo-data';
import { dualClient } from '@/lib/dual-client';

const isDualConfigured = !!process.env.DUAL_API_KEY;
const orgId = process.env.DUAL_ORG_ID || '69b935b4187e903f826bbe71';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const city = searchParams.get('city');
  const status = searchParams.get('status');
  const sortBy = searchParams.get('sortBy') || 'date-asc';

  let events = [...demoEvents];

  // If DUAL_API_KEY is configured, fetch from live API
  if (isDualConfigured) {
    try {
      const response = await dualClient.listTemplates(orgId);
      // Map templates to events shape
      events = response.data?.map((template: any) => ({
        id: template.id,
        name: template.name,
        type: 'template',
        category: 'live',
        venue: { name: 'TBD', address: '', city: '', country: '', capacity: 0 },
        date: { start: template.createdAt, end: template.createdAt },
        description: template.description || '',
        imageUrl: '',
        organizerId: orgId,
        tiers: [],
        status: 'active',
        resaleEnabled: false,
        resaleMaxMarkup: 1.0,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt || template.createdAt,
      })) || [...demoEvents];
    } catch (error) {
      console.error('Failed to fetch from DUAL API, falling back to demo data:', error);
      events = [...demoEvents];
    }
  }

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

  if (isDualConfigured) {
    try {
      const response = await dualClient.createTemplate(body);
      return NextResponse.json({ data: response, message: 'Event created' }, { status: 201 });
    } catch (error) {
      console.error('Failed to create event via DUAL API, falling back to demo:', error);
    }
  }

  return NextResponse.json({ data: { id: 'evt-new-' + Date.now(), ...body }, message: 'Event created' }, { status: 201 });
}
