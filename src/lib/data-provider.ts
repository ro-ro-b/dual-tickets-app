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


// ─── Gateway Object Mappers ───
function mapGatewayToTicket(obj: any): any {
  const m = obj.metadata || {};
  return {
    id: obj.id || '',
    templateId: obj.template_id || '',
    templateName: m.templateName || 'dual-tickets::event-ticket::v1',
    organizationId: obj.org_id || '',
    ownerWallet: obj.owner || '',
    eventId: m.eventId || obj.template_id || '',
    tierId: m.tierId || '',
    tierName: m.tierName || m.category || 'General Admission',
    ticketData: {
      eventName: m.name || m.eventName || 'Untitled Event',
      eventDate: m.eventDate || obj.when_created || new Date().toISOString(),
      venue: m.venue || 'TBD',
      seatInfo: m.seatInfo,
      purchasePrice: m.purchasePrice || m.price || 0,
      currentPrice: m.currentPrice || m.price || 0,
      status: m.status || 'valid',
      purchasedAt: obj.when_created || new Date().toISOString(),
      transferHistory: [],
      qrCode: obj.content_hash || obj.id || '',
    },
    faces: m.imageUrl ? [{ id: obj.id + '-face', type: 'image', url: m.imageUrl }] : [],
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
    onChainStatus: obj.content_hash ? 'anchored' : 'pending',
  };
}

function mapGatewayToEvent(obj: any): any {
  const m = obj.metadata || obj.object?.metadata || {};
  return {
    id: obj.id || '',
    name: m.name || obj.name || 'Untitled Event',
    type: m.type || 'event',
    category: m.category || 'general',
    venue: { name: m.venue || 'TBD', address: '', city: '', country: '', capacity: 0 },
    date: { start: m.startDate || obj.when_created, end: m.endDate || obj.when_created },
    description: m.description || '',
    imageUrl: m.imageUrl || '',
    organizerId: obj.org_id || '',
    tiers: [],
    status: m.status || 'on-sale',
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
    const result = await client.objects.listObjects({ limit: 100 });
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
