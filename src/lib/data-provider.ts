/**
 * Data Provider — Tickets App
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

/** Demo data provider — uses hardcoded sample data */
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

/** DUAL SDK data provider — uses live DUAL Platform API */
class DualDataProvider implements DataProvider {
  async listTickets() {
    const client = getDualClient();
    const result = await client.objects.listObjects({ limit: 100 });
    return result?.data || result || [];
  }

  async getTicket(id: string) {
    try {
      const client = getDualClient();
      return await client.objects.getObject(id);
    } catch {
      return null;
    }
  }

  async listEvents() {
    const client = getDualClient();
    const result = await client.templates.listTemplates({ limit: 100 });
    return result?.data || result || [];
  }

  async getEvent(id: string) {
    try {
      const client = getDualClient();
      return await client.templates.getTemplate(id);
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
