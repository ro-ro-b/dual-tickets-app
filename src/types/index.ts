// ─── Ticketing Domain Types ─────────────────────────────────────────

export type EventType = 'concert' | 'festival' | 'sport' | 'conference' | 'experience';
export type EventCategory = 'music' | 'arts' | 'sport' | 'tech' | 'food-wine' | 'wellness' | 'adventure';
export type EventStatus = 'draft' | 'on-sale' | 'sold-out' | 'completed' | 'cancelled';
export type TicketStatus = 'valid' | 'used' | 'transferred' | 'expired' | 'cancelled' | 'listed';

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
}

export interface EventDate {
  start: string;
  end: string;
  doors?: string;
}

export interface Tier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  description: string;
  perks: string[];
}

export interface TicketEvent {
  id: string;
  name: string;
  type: EventType;
  category: EventCategory;
  venue: Venue;
  date: EventDate;
  description: string;
  imageUrl: string;
  organizerId: string;
  tiers: Tier[];
  status: EventStatus;
  resaleEnabled: boolean;
  resaleMaxMarkup: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransferRecord {
  from: string;
  to: string;
  price: number | null;
  timestamp: string;
  verified: boolean;
}

export interface TicketData {
  eventName: string;
  eventDate: string;
  venue: string;
  seatInfo?: string;
  purchasePrice: number;
  currentPrice: number;
  status: TicketStatus;
  purchasedAt: string;
  redeemedAt?: string;
  transferHistory: TransferRecord[];
  qrCode: string;
}

export interface Ticket {
  id: string;
  templateId: string;
  templateName: string;
  organizationId: string;
  ownerWallet: string;
  eventId: string;
  tierId: string;
  tierName: string;
  ticketData: TicketData;
  faces: Array<{ id: string; type: string; url: string }>;
  createdAt: string;
  updatedAt: string;
  onChainStatus: 'pending' | 'anchored' | 'verified';
}

export interface TicketAction {
  id: string;
  objectId: string;
  type: string;
  actor: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface TicketTemplate {
  id: string;
  name: string;
  version: string;
  fields: Array<{ name: string; type: string; required: boolean }>;
  createdAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  ticketsByStatus: Record<TicketStatus, number>;
  revenueChange: string;
  topEvent: string;
}

export interface FilterOptions {
  type: EventType | 'all';
  category: EventCategory | 'all';
  status: EventStatus | 'all';
  city: string | 'all';
  sortBy: 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'popularity';
}
