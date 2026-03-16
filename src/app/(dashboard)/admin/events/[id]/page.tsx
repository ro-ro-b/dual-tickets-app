'use client';

import { useParams } from 'next/navigation';
import { demoEvents, demoTickets } from '@/lib/demo-data';
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ec5b13]/10 text-[#ec5b13] uppercase">{event.type}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${event.status === 'on-sale' ? 'bg-emerald-100 text-emerald-700' : event.status === 'sold-out' ? 'bg-red-100 text-red-700' : event.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{event.status}</span>
          </div>
          <h1 className="text-xl font-bold text-white">{event.name}</h1>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="text-center">
            <Users size={18} className="mx-auto text-[#ec5b13] mb-3" />
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tickets Sold</p>
            <p className="text-lg font-bold text-gray-900">{totalSold.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">of {totalCap.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="text-center">
            <DollarSign size={18} className="mx-auto text-emerald-600 mb-3" />
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Revenue</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(revenue)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="text-center">
            <Ticket size={18} className="mx-auto text-blue-600 mb-3" />
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tiers</p>
            <p className="text-lg font-bold text-gray-900">{event.tiers.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="text-center">
            <ArrowRightLeft size={18} className="mx-auto text-amber-600 mb-3" />
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Resale</p>
            <p className="text-lg font-bold text-gray-900">{event.resaleEnabled ? 'Enabled' : 'Disabled'}</p>
            {event.resaleEnabled && <p className="text-xs text-gray-400 mt-1">Max +{((event.resaleMaxMarkup - 1) * 100).toFixed(0)}%</p>}
          </div>
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Tier Breakdown</h2>
        <div className="space-y-4">
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
        </div>
      </div>

      {/* Minted tickets for this event */}
      {eventTickets.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Minted Tickets ({eventTickets.length})</h2>
          <div>
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
                    <tr key={ticket.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                      <td className="py-3 font-mono text-xs text-gray-600">{ticket.id}</td>
                      <td className="py-3 text-sm text-gray-900">{ticket.tierName}</td>
                      <td className="py-3 font-mono text-xs text-gray-600">{truncateAddress(ticket.ownerWallet)}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.ticketData.status === 'valid' ? 'bg-emerald-100 text-emerald-700' :
                          ticket.ticketData.status === 'used' ? 'bg-blue-100 text-blue-700' :
                          ticket.ticketData.status === 'listed' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {ticket.ticketData.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.onChainStatus === 'anchored' ? 'bg-emerald-100 text-emerald-700' :
                          ticket.onChainStatus === 'verified' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {ticket.onChainStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(ticket.ticketData.currentPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Event details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Event Details</h2>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-xs text-gray-500">Event ID</p><p className="font-mono">{event.id}</p></div>
            <div><p className="text-xs text-gray-500">Organiser</p><p className="font-mono">{event.organizerId}</p></div>
            <div><p className="text-xs text-gray-500">Venue</p><p>{event.venue.name}, {event.venue.city}</p></div>
            <div><p className="text-xs text-gray-500">Date</p><p>{formatDate(event.date.start)}</p></div>
            <div className="md:col-span-2"><p className="text-xs text-gray-500">Description</p><p className="text-gray-600">{event.description}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
