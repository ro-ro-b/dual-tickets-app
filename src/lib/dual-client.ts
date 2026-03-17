/**
 * DUAL SDK Client — Tickets App
 * Uses the official @dual/sdk for all DUAL Platform API communication.
 * Falls back to demo data when DUAL_CONFIGURED is not set.
 */
import { DualClient, DualConfig, DualError } from './dual-sdk';

export { DualClient, DualError };
export type { DualConfig };

/** Check if DUAL SDK is configured with real credentials */
export function isDualConfigured(): boolean {
  return !!(process.env.DUAL_API_KEY || process.env.DUAL_API_TOKEN);
}

let client: DualClient | null = null;

/** Get or create the singleton DualClient instance */
export function getDualClient(): DualClient {
  if (!client) {
    client = new DualClient({
      token: process.env.DUAL_API_TOKEN || undefined,
      apiKey: process.env.DUAL_API_KEY || undefined,
      baseUrl: process.env.NEXT_PUBLIC_DUAL_API_URL || 'https://gateway-48587430648.europe-west6.run.app',
      timeout: 30000,
      retry: { maxAttempts: 3, backoffMs: 1000 },
    });
  }
  return client;
}

/** Singleton client for direct use in route handlers */
export const dualClient = {
  listTemplates: async (orgId?: string) => {
    const q: Record<string, any> = { limit: 100 };
    if (orgId) q.organization_id = orgId;
    return getDualClient().templates.listTemplates(q);
  },
  createTemplate: async (body: Record<string, unknown>) =>
    getDualClient().templates.createTemplate(body),
  listObjects: async (query: Record<string, unknown>) =>
    getDualClient().objects.listObjects(query),
  mintObject: async (body: Record<string, unknown>) =>
    getDualClient().executeAction({ actionType: 'MINT', ...body }),
  executeAction: async (body: Record<string, unknown>) =>
    getDualClient().executeAction(body),
};
