const API_BASE = process.env.NEXT_PUBLIC_DUAL_API_URL || 'https://blockv-labs.io';

class DualClient {
  private token: string | null = null;
  private apiKey: string | null = null;

  constructor(config?: { token?: string; apiKey?: string }) {
    this.token = config?.token || null;
    this.apiKey = config?.apiKey || null;
  }

  private async request<T>(
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    if (this.apiKey) headers['X-Api-Key'] = this.apiKey;

    const res = await fetch(API_BASE + path, { ...options, headers });
    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: res.statusText }));
      throw new DualApiError(
        res.status,
        error.message || res.statusText,
        error,
      );
    }
    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string }>('/wallets/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Templates
  async createTemplate(data: any) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify({ template: data }),
    });
  }

  async getTemplate(id: string) {
    return this.request('/templates/' + id);
  }

  async listTemplates(orgId: string) {
    return this.request('/templates?organization_id=' + orgId);
  }

  // Objects (Tickets)
  async mintObject(data: any) {
    return this.request('/objects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getObject(id: string) {
    return this.request('/objects/' + id);
  }

  async listObjects(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    return this.request('/objects?' + qs);
  }

  async searchObjects(query: any) {
    return this.request('/objects/search', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  // Actions
  async executeAction(data: any) {
    return this.request('/ebus/actions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActionTypes() {
    return this.request('/ebus/action-types');
  }

  // Faces
  async addFace(templateId: string, face: any) {
    return this.request('/templates/' + templateId + '/faces', {
      method: 'POST',
      body: JSON.stringify(face),
    });
  }

  // Webhooks
  async createWebhook(data: any) {
    return this.request('/webhooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listWebhooks(orgId: string) {
    return this.request('/webhooks?organization_id=' + orgId);
  }

  // Indexer
  async getOnChainState(objectId: string) {
    return this.request('/indexer/objects/' + objectId);
  }

  // Payments
  async getPaymentConfig() {
    return this.request('/payments/config');
  }

  setToken(token: string) {
    this.token = token;
  }
}

class DualApiError extends Error {
  status: number;
  details: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const dualClient = new DualClient({
  apiKey: process.env.DUAL_API_KEY,
});

export { DualClient, DualApiError };
