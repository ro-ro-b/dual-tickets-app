'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { TicketStatusBadge, OnChainBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, QrCode, ArrowRightLeft } from 'lucide-react';
import type { Ticket } from '@/types';

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const isPast = ticket.ticketData.status === 'used' || ticket.ticketData.status === 'expired';

  return (
    <Link href={`/wallet/ticket/${ticket.id}`}>
      <Card hover className={`overflow-hidden ${isPast ? 'opacity-75' : ''}`}>
        {/* Ticket header with image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={ticket.faces[0]?.url || ''}
            alt={ticket.ticketData.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-semibold text-sm line-clamp-1">{ticket.ticketData.eventName}</p>
            <p className="text-white/80 text-xs">{ticket.tierName}</p>
          </div>
          <div className="absolute top-3 right-3">
            <TicketStatusBadge status={ticket.ticketData.status} />
          </div>
        </div>

        {/* Tear line */}
        <div className="relative">
          <div className="absolute -left-2 -top-2 w-4 h-4 bg-[#f8fafc] rounded-full" />
          <div className="absolute -right-2 -top-2 w-4 h-4 bg-[#f8fafc] rounded-full" />
          <div className="border-t border-dashed border-gray-200 mx-4" />
        </div>

        {/* Ticket details */}
        <div className="p-4 pt-3">
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{formatDate(ticket.ticketData.eventDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} />
              <span>{ticket.ticketData.venue}</span>
            </div>
            {ticket.ticketData.seatInfo && (
              <div className="flex items-center gap-1.5">
                <QrCode size={13} />
                <span>{ticket.ticketData.seatInfo}</span>
              </div>
            )}
            {ticket.ticketData.transferHistory.length > 0 && (
              <div className="flex items-center gap-1.5">
                <ArrowRightLeft size={13} />
                <span>{ticket.ticketData.transferHistory.length} transfer{ticket.ticketData.transferHistory.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(ticket.ticketData.currentPrice)}</span>
            <OnChainBadge status={ticket.onChainStatus} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
