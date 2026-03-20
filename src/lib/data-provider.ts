/**
 * Data Provider — Tickets App
 * DUAL network data only. No demo data, no fake enrichment.
 */
import { getDualClient, isDualConfigured } from './dual-client';

export interface DataProvider {
  listTickets(): Promise<any[]>;
  getTicket(id: string): Promise<any | null>;
  listEvents(): Promise<any[]>;
  getEvent(id: string): Promise<any | null>;
  getStats(): Promise<any>;
  executeAction(objectId: string, actionType: string, payload?: any): Promise<any>;
}

/**
 * Maps DUAL gateway object (template instance) to Ticket shape.
 * Reads from obj.metadata (template defaults) + obj.custom (mint-time overrides).
 */
function mapGatewayToTicket(obj: any): any {
  const m = obj.metadata || {};
  const c = obj.custom || {};
  return {
    id: obj.id || '',
    templateId: obj.template_id || '',
    templateName: 'dual-ticket',
    organizationId: obj.org_id || '',
    ownerWallet: obj.owner || '',
    eventId: obj.template_id || '',
    tierId: c.tierId || obj.template_id || '',
    tierName: c.tierName || m.category || 'Token',
    ticketData: {
      eventName: c.eventName || m.name || 'DUAL Token',
      eventDate: c.eventDate || obj.when_created || new Date().toISOString(),
      venue: c.venue || 'DUAL Network',
      section: c.section || '',
      row: c.row || '',
      seat: c.seat || '',
      purchasePrice: c.purchasePrice ? parseFloat(c.purchasePrice) : 0,
      currentPrice: c.currentPrice ? parseFloat(c.currentPrice) : 0,
      status: (c.status || 'valid') as 'valid' | 'used' | 'expired' | 'cancelled',
      purchasedAt: c.purchasedAt || obj.when_created || new Date().toISOString(),
      transferHistory: c.transferHistory || [],
      qrCode: obj.content_hash || obj.id || '',
    },
    faces: m.image?.url ? [{ id: obj.id + '-face', type: 'image', url: m.image.url }] : [{ id: obj.id + '-face', type: 'image', url: '/placeholder-ticket.svg' }],
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
    onChainStatus: obj.content_hash && obj.content_hash !== '0x0000000000000000000000000000000000000000' ? ('anchored' as const) : ('pending' as const),
    contentHash: obj.content_hash,
    integrityHash: obj.integrity_hash,
    explorerLinks: {
      owner: obj.owner ? `https://32f.blockv.io/address/${obj.owner}` : null,
      contentHash: null,
      integrityHash: null,
      org: obj.org_id ? `https://32f.blockv.io/address/0xed75538AeDD6E45FfadF30B9EEC68A3959654bF9` : null,
    },
  };
}

/**
 * Maps DUAL template to Event shape.
 * Uses REAL metadata only.
 */
function mapGatewayToEvent(obj: any): any {
  const m = obj.metadata || {};
  return {
    id: obj.id || '',
    name: m.name || 'DUAL Token Template',
    type: 'event' as const,
    category: m.category || 'general',
    venue: { name: 'DUAL Network', address: '', city: '', country: '', capacity: 0 },
    date: { start: obj.when_created, end: obj.when_created },
    description: m.description || '',
    imageUrl: m.image?.url || '/placeholder-ticket.svg',
    organizerId: obj.org_id || '',
    tiers: [],
    status: 'on-sale' as const,
    resaleEnabled: false,
    resaleMaxMarkup: 1.0,
    createdAt: obj.when_created || new Date().toISOString(),
    updatedAt: obj.when_modified || new Date().toISOString(),
  };
}

/** DUAL SDK data provider — uses live DUAL Platform API only */
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
      const stats = await client.indexer.getPublicStats();
      return stats || { totalEvents: 0, activeEvents: 0, totalTicketsSold: 0, totalRevenue: 0, ticketsByStatus: {}, revenueChange: '0%', topEvent: '' };
    } catch (error) {
      throw new Error('Failed to fetch stats from DUAL API');
    }
  }

  async executeAction(objectId: string, actionType: string, payload?: any) {
    const client = getDualClient();
    return client.ebus.executeAction({ objectId, actionType, ...payload });
  }
}

let provider: DataProvider | null = null;

/** Get the data provider (DUAL SDK only) */
export function getDataProvider(): DataProvider {
  if (!provider) {
    if (!isDualConfigured()) {
      throw new Error('DUAL_API_KEY is not configured. Cannot proceed with DUAL network data.');
    }
    provider = new DualDataProvider();
    console.log('[DUAL] Using DUAL SDK data provider');
  }
  return provider;
}
