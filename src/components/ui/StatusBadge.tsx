'use client';

import { Badge } from './Badge';
import { getTicketStatusColor, getEventStatusColor, getOnChainStatusColor, getEventTypeColor } from '@/lib/utils';

export function TicketStatusBadge({ status }: { status: string }) {
  return <Badge className={getTicketStatusColor(status)}>{status}</Badge>;
}

export function EventStatusBadge({ status }: { status: string }) {
  return <Badge className={getEventStatusColor(status)}>{status.replace('-', ' ')}</Badge>;
}

export function OnChainBadge({ status }: { status: string }) {
  return <Badge className={getOnChainStatusColor(status)}>{status}</Badge>;
}

export function EventTypeBadge({ type }: { type: string }) {
  return <Badge className={getEventTypeColor(type)}>{type}</Badge>;
}
