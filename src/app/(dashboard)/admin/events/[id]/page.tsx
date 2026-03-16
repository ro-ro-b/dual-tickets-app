'use client';

import { useParams } from 'next/navigation';
import { demoEvents, demoTickets } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EventStatusBadge, EventTypeBadge, TicketStatusBadge, OnChainBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency, tierAvailability, truncateAddress } from '@/lib/utils';
import { Calendar, MapPin, Users, DollarSign, Ticket, ArrowRightLeft, Shield } from 'lucide-react';

export default function AdminEventDetailPage() {
  const { id } = useParams();
  const event = demoEvents.find(e => e.id === id);

  if (!event) {
    return <div className="text-center py-12"><p className="text-gray-500">Event not found</p></div>;
  }

  const eventTickets = demoTickets.filter(t => t.eventId === id);
  const totalSold = event.tiers.reduce((s, t) => s + t.sold, 0);
  const totalCap = event.tiers.reduce((s, t) => s + t.capacity, 0);
  const revenue = event.tiers.reduce((s, t) => s + t.sold * t.price, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex gap-2 mb-2">
            <EventTypeBadge type={event.type} />
            <EventStatusBadge status={event.status} />
          </div>
          <h1 className="text-xl font-bold text-white">{event.name}</h1>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-3">
            <Users size={18} className="mx-auto text-brand-600 mb-1" />
            <p className="text-xs text-gray-500">Tickets Sold</p>
            <p className="text-lg font-bold text-gray-900">{totalSold.toLocaleString()}</p>
            <p className="text-xs text-gray-400">of {totalCap.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-3">
            <DollarSign size={18} className="mx-auto text-green-600 mb-1" />
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(revenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-3">
            <Ticket size={18} className="mx-auto text-purple-600 mb-1" />
            <p className="text-xs text-gray-500">Tiers</p>
            <p className="text-lg font-bold text-gray-900">{event.tiers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-3">
            <ArrowRightLeft size={18} className="mx-auto text-amber-600 mb-1" />
            <p className="text-xs text-gray-500">Resale</p>
            <p className="text-lg font-bold text-gray-900">{event.resaleEnabled ? 'Enabled' : 'Disabled'}</p>
            {event.resaleEnabled && <p className="text-xs text-gray-400">Max +{((event.resaleMaxMarkup - 1) * 100).toFixed(0)}%</p>}
          </CardContent>
        </Card>
      </div>

      {/* Tier breakdown */}
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Tier Breakdown</h2></CardHeader>
        <CardContent className="space-y-4">
          {event.tiers.map((tier) => {
            const avail = tierAvailability(tier.sold, tier.capacity);
            return (
              <div key={tier.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{tier.name}</p>
                    <p className="text-xs text-gray-500">{tier.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(tier.price)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(tier.sold * tier.price)} rev</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${avail.percent >= 90 ? 'bg-red-500' : avail.percent >= 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(avail.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap">{tier.sold} / {tier.capacity}</span>
                  <span className={`text-xs font-medium ${avail.color}`}>{avail.label}</span>
                </div>
                {tier.perks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tier.perks.map(perk => (
                      <span key={perk} className="text-[10px] bg-white text-gray-500 rounded-full px-2 py-0.5">{perk}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Minted tickets for this event */}
      {eventTickets.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Minted Tickets ({eventTickets.length})</h2></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-2 font-medium">ID</th>
                    <th className="pb-2 font-medium">Tier</th>
                    <th className="pb-2 font-medium">Owner</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Chain</th>
                    <th className="pb-2 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eventTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="py-2 font-mono text-xs">{ticket.id}</td>
                      <td className="py-2">{ticket.tierName}</td>
                      <td className="py-2 font-mono text-xs">{truncateAddress(ticket.ownerWallet)}</td>
                      <td className="py-2"><TicketStatusBadge status={ticket.ticketData.status} /></td>
                      <td className="py-2"><OnChainBadge status={ticket.onChainStatus} /></td>
                      <td className="py-2 text-right font-medium">{formatCurrency(ticket.ticketData.currentPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event details */}
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Event Details</h2></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-gray-500">Event ID</p><p className="font-mono">{event.id}</p></div>
            <div><p className="text-xs text-gray-500">Organiser</p><p className="font-mono">{event.organizerId}</p></div>
            <div><p className="text-xs text-gray-500">Venue</p><p>{event.venue.name}, {event.venue.city}</p></div>
            <div><p className="text-xs text-gray-500">Date</p><p>{formatDate(event.date.start)}</p></div>
            <div className="md:col-span-2"><p className="text-xs text-gray-500">Description</p><p className="text-gray-600">{event.description}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
