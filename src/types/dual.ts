// ─── DUAL Protocol Base Types ───────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  balance: number;
  memberCount: number;
}

export interface Wallet {
  id: string;
  address: string;
  email: string;
  displayName: string;
  role: 'consumer' | 'admin';
  avatarUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  public: boolean;
  cloneable: boolean;
  properties: TemplateProperty[];
  actions: TemplateAction[];
  faces: Face[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface TemplateAction {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface Face {
  id: string;
  name: string;
  type: 'image' | '3d' | 'web';
  url: string;
  mimeType?: string;
  description?: string;
}

export interface DualObject {
  id: string;
  templateId: string;
  templateName: string;
  organizationId: string;
  ownerWallet: string;
  properties: Record<string, any>;
  faces: Face[];
  createdAt: string;
  updatedAt: string;
  onChainStatus: 'pending' | 'anchored' | 'verified';
}

export interface Action {
  id: string;
  objectId: string;
  action: string;
  actor: string;
  parameters: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  organizationId: string;
  active: boolean;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  event: string;
  objectId: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface AuthSession {
  token: string;
  wallet: Wallet;
  organization: Organization;
  expiresAt: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
