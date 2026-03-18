import { NextRequest, NextResponse } from 'next/server';
import { getDataProvider } from '@/lib/data-provider';
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

  let events = [...(await getDataProvider().listEvents())];

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
      })) || [...(await getDataProvider().listEvents())];
    } catch (error) {
      console.error('Failed to fetch from DUAL API, falling back to demo data:', error);
      events = [...(await getDataProvider().listEvents())];
    }
  }

  if (type && type !== 'all') events = events.filter((e: any) => e.type === type);
  if (category && category !== 'all') events = events.filter((e: any) => e.category === category);
  if (city && city !== 'all') events = events.filter((e: any) => e.venue.city.toLowerCase() === city.toLowerCase());
  if (status && status !== 'all') events = events.filter((e: any) => e.status === status);

  switch (sortBy) {
    case 'date-asc':
      events.sort((a: any, b: any) => new Date(a.date.start).getTime() - new Date(b.date.start).getTime());
      break;
    case 'date-desc':
      events.sort((a: any, b: any) => new Date(b.date.start).getTime() - new Date(a.date.start).getTime());
      break;
    case 'price-asc':
      events.sort((a: any, b: any) => Math.min(...a.tiers.map((t: any) => t.price)) - Math.min(...b.tiers.map((t: any) => t.price)));
      break;
    case 'price-desc':
      events.sort((a: any, b: any) => Math.max(...b.tiers.map((t: any) => t.price)) - Math.max(...a.tiers.map((t: any) => t.price)));
      break;
    case 'popularity':
      events.sort((a: any, b: any) => b.tiers.reduce((s: any, t: any) => s + t.sold, 0) - a.tiers.reduce((s: any, t: any) => s + t.sold, 0));
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
