/**
 * Type definitions for ticketing domain.
 * All demo data has been removed. Application now uses DUAL network data only.
 * See src/types/index.ts for the official type definitions.
 */

// This file is deprecated. All types are defined in src/types/index.ts
// Demo data exports have been removed to enforce DUAL-only mode.

// Placeholder exports for backward compatibility (if still needed)
export const demoTickets: any[] = [];
export const demoEvents: any[] = [];
export const demoActions: any[] = [];
export const demoTemplates: any[] = [];
export const demoStats: any = {
  totalEvents: 0,
  activeEvents: 0,
  totalTicketsSold: 0,
  totalRevenue: 0,
  ticketsByStatus: {},
  revenueChange: '0%',
  topEvent: '',
};
export const DEMO_CONSUMER_WALLET = '0x0000000000000000000000000000000000000000';
export const DEMO_ADMIN_WALLET = '0x0000000000000000000000000000000000000000';
