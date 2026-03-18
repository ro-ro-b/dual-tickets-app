/**
 * Data Provider â Tickets App
 * Abstracts data access: uses DUAL SDK when configured, falls back to demo data.
 */
import { getDualClient, isDualConfigured } from './dual-client';
import { demoTickets, demoEvents, demoActions, demoStats } from './demo-data';

export interface DataProvider {
  listTickets(): Promise<any[]>;
  getTicket(id: string): Promise<any | null>;
  listEvents(): Promise<any[]>;
  getEvent(id: string): Promise<any | null>;
  getStats(): Promise<any>;
  executeAction(objectId: string, actionType: string, payload?: any): Promise<any>;
}

/** Demo data provider â uses hardcoded sample data */
class DemoDataProvider implements DataProvider {
  async listTickets() { return demoTickets; }
  async getTicket(id: string) { return demoTickets.find((t: any) => t.id === id) || null; }
  async listEvents() { return demoEvents; }
  async getEvent(id: string) { return demoEvents.find((e: any) => e.id === id) || null; }
  async getStats() { return demoStats; }
  async executeAction(objectId: string, actionType: string, payload?: any) {
    return { success: true, demo: true, objectId, actionType };
  }
}



// Gateway Object Mappers - enriched with realistic event data
const EVENT_CATALOG = [
  { eventName: 'Vivid Sydney 2026', venue: 'Sydney Opera House', tier: 'VIP Lounge', price: 195, imageUrl: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=400&h=250&fit=crop', category: 'arts' },
  { eventName: 'Tame Impala World Tour', venue: 'Qudos Bank Arena', tier: 'Gold Circle', price: 189, imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop', category: 'music' },
  { eventName: 'A-League Grand Final', venue: 'Accor Stadium', tier: 'Category A', price: 120, imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=250&fit=crop', category: 'sport' },
  { eventName: 'AI & Web3 Summit 2026', venue: 'ICC Sydney', tier: 'Pro Pass', price: 599, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop', category: 'tech' },
  { eventName: 'Sunrise Yoga on Bondi Beach', venue: 'Bondi Beach Pavilion', tier: 'Premium', price: 85, imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop', category: 'wellness' },
  { eventName: 'Blue Mountains Helicopter Tour', venue: 'Blue Mountains Helipad', tier: 'Flight + Champagne', price: 650, imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&h=250&fit=crop', category: 'adventure' },
  { eventName: 'Sydney Comedy Gala', venue: 'State Theatre', tier: 'Premium Stalls', price: 95, imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=250&fit=crop', category: 'comedy' },
  { eventName: 'Hunter Valley Wine Masterclass', venue: "Tyrrell's Wines", tier: 'Premium + Bottle', price: 295, imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=250&fit=crop', category: 'food-wine' },
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mapGatewayToTicket(obj: any): any {
  const m = obj.metadata || {};
  const idx = hashCode(obj.id || '') % EVENT_CATALOG.length;
  const seed = EVENT_CATALOG[idx];
  const hasReal = m.eventName || m.venue;
  const e = hasReal ? m : seed;
  return {
    id: obj.id || '',
    templateId: obj.template_id || '',
    templateName: 'dual-tickets::event-ticket::v1',
    organizationId: obj.org_id || '',
    ownerWallet: obj.owner || '',
    eventId: obj.template_id || '',
    tierId: 'tier-' + idx,
    tierName: e.tier || 'General Admission',
    ticketData: {
      eventName: e.eventName || m.name || 'Live Event',
      eventDate: m.eventDate || obj.when_created || new Date().toISOString(),
      venue: e.venue || 'TBD',
      purchasePrice: e.price || 0,
      currentPrice: e.price || 0,
      status: 'valid',
      purchasedAt: obj.when_created || new Date().toISOString(),
      transferHistory: [],
      qrCode: obj.content_hash || obj.id || '',
    },
    faces: [{ id: obj.id + '-face', type: 'image', url: e.imageUrl || '' }],
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
    onChainStatus: obj.content_hash ? 'anchored' : 'pending',
  };
}

function mapGatewayToEvent(obj: any): any {
  const m = obj.object?.metadata || obj.metadata || {};
  return {
    id: obj.id || '',
    name: obj.name || m.name || 'Event Template',
    type: 'event',
    category: m.category || 'general',
    venue: { name: m.venue || 'TBD', address: '', city: 'Sydney', country: 'Australia', capacity: 5000 },
    date: { start: obj.when_created, end: obj.when_created },
    description: m.description || '',
    imageUrl: m.imageUrl || '',
    organizerId: obj.org_id || '',
    tiers: [],
    status: 'on-sale',
    resaleEnabled: false,
    resaleMaxMarkup: 1.0,
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
  };
}


/** DUAL SDK data provider â uses live DUAL Platform API */
class DualDataProvider implements DataProvider {
  async listTickets() {
    const client = getDualClient();
    const result = await client.objects.listObjects({ limit: 100, template_id: process.env.DUAL_TEMPLATE_ID || undefined });
    const objects = result?.objects || result?.data || [];
    return (objects as any[]).map((obj: any) => mapGatewayToTicket(obj));
  }

  async getTicket(id: string) {
    try {
      const client = getDualClient();
      const obj = await client.objects.getObject(id);
      return obj ? mapGatewayToTicket(obj) : null;
    } catch {
      return null;
    }
  }

  async listEvents() {
    const client = getDualClient();
    const result = await client.templates.listTemplates({ limit: 100 });
    const templates = result?.templates || result?.data || [];
    return (templates as any[]).map((t: any) => mapGatewayToEvent(t));
  }

  async getEvent(id: string) {
    try {
      const client = getDualClient();
      const t = await client.templates.getTemplate(id);
      return t ? mapGatewayToEvent(t) : null;
    } catch {
      return null;
    }
  }

  async getStats() {
    try {
      const client = getDualClient();
      return await client.indexer.getPublicStats();
    } catch {
      return demoStats;
    }
  }

  async executeAction(objectId: string, actionType: string, payload?: any) {
    const client = getDualClient();
    return client.ebus.executeAction({ objectId, actionType, ...payload });
  }
}

let provider: DataProvider | null = null;

/** Get the data provider (DUAL SDK or demo, based on env config) */
export function getDataProvider(): DataProvider {
  if (!provider) {
    const useDual = isDualConfigured();
    provider = useDual ? new DualDataProvider() : new DemoDataProvider();
    console.log(`[DUAL] Using ${useDual ? 'DUAL SDK' : 'Demo'} data provider`);
  }
  return provider;
}
