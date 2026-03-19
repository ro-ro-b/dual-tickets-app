/**
 * DEPRECATED: This file is no longer used.
 *
 * All mock/demo data has been removed from the DUAL Tickets App.
 * All pages now fetch data from live API endpoints:
 *
 * - /api/tickets - Get ticket data and minted tickets
 * - /api/actions - Get transfer and webhook event data
 * - /api/events/:id - Get specific event details
 * - /api/templates - Get DUAL template schemas
 *
 * This file is kept for backward compatibility only.
 * Remove imports from this file and replace with API calls.
 *
 * See updated files:
 * - src/app/(dashboard)/wallet/activity/page.tsx
 * - src/app/(dashboard)/admin/scanning/page.tsx
 * - src/app/(dashboard)/admin/orders/page.tsx
 * - src/app/(dashboard)/admin/templates/page.tsx
 * - src/app/(dashboard)/admin/webhooks/page.tsx
 * - src/app/(dashboard)/admin/events/[id]/page.tsx
 */

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
