'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EventTypeBadge, EventStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency, tierAvailability, getEventTypeColor } from '@/lib/utils';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import type { TicketEvent } from '@/types';

export function EventCard({ event }: { event: TicketEvent }) {
  const totalCapacity = event.tiers.reduce((s, t) => s + t.capacity, 0);
  const totalSold = event.tiers.reduce((s, t) => s + t.sold, 0);
  const minPrice = Math.min(...event.tiers.map(t => t.price));
  const { percent, label, color } = tierAvailability(totalSold, totalCapacity);

  return (
    <Link href={`/wallet/discover/${event.id}`}>
      <Card hover className="overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <EventTypeBadge type={event.type} />
            {event.resaleEnabled && (
              <Badge className="bg-white/90 text-gray-700 text-[10px]">Resale OK</Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <EventStatusBadge status={event.status} />
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent h-20" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className={`text-xs font-semibold ${color} bg-white/90 rounded-full px-2 py-0.5 inline-block`}>
              {label} — {percent}% sold
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{event.name}</h3>

          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{formatDate(event.date.start)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span>{event.venue.name}, {event.venue.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={13} />
              <span>{totalSold.toLocaleString()} / {totalCapacity.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-brand-600">
              <Tag size={13} />
              <span className="text-sm font-semibold">From {formatCurrency(minPrice)}</span>
            </div>
            <span className="text-xs text-gray-400">{event.tiers.length} tier{event.tiers.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
