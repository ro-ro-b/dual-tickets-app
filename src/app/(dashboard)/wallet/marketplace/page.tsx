'use client';

import { demoTickets, demoEvents } from '@/lib/demo-data';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EventTypeBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency, getEventTypeColor } from '@/lib/utils';
import { Calendar, MapPin, TrendingUp, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const listedTickets = demoTickets.filter(t => t.ticketData.status === 'listed');

  const listings = listedTickets.map(ticket => {
    const event = demoEvents.find(e => e.id === ticket.eventId);
    const markup = ticket.ticketData.purchasePrice > 0
      ? ((ticket.ticketData.currentPrice - ticket.ticketData.purchasePrice) / ticket.ticketData.purchasePrice * 100)
      : 0;
    return { ticket, event, markup };
  });

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <Card className="bg-brand-50 border-brand-200">
        <CardContent className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-brand-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-brand-900">DUAL-Protected Marketplace</p>
            <p className="text-xs text-brand-700">All resale tickets are verified on-chain. Resale prices are capped by the event organiser to prevent scalping.</p>
          </div>
        </CardContent>
      </Card>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tickets currently listed for resale</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(({ ticket, event, markup }) => (
            <Card key={ticket.id} hover>
              <CardContent className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={ticket.faces[0]?.url || ''}
                    alt={ticket.ticketData.eventName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    {event && <EventTypeBadge type={event.type} />}
                    <Badge className="bg-amber-100 text-amber-800">
                      <TrendingUp size={10} className="mr-1" /> +{markup.toFixed(0)}%
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{ticket.ticketData.eventName}</h3>
                  <p className="text-sm text-brand-600 font-medium">{ticket.tierName}</p>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(ticket.ticketData.eventDate)}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {ticket.ticketData.venue}</span>
                    {ticket.ticketData.seatInfo && (
                      <span>{ticket.ticketData.seatInfo}</span>
                    )}
                  </div>

                  {event?.resaleMaxMarkup && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Max resale: {formatCurrency(ticket.ticketData.purchasePrice * event.resaleMaxMarkup)} ({((event.resaleMaxMarkup - 1) * 100).toFixed(0)}% cap)
                    </p>
                  )}
                </div>

                {/* Price + Buy */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 line-through">{formatCurrency(ticket.ticketData.purchasePrice)}</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(ticket.ticketData.currentPrice)}</p>
                  </div>
                  <Button size="sm">Buy Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
