'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import type { TicketStatus } from '@/types';

type FilterType = 'today' | 'week' | 'upcoming' | 'past';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/tickets').then(r => r.json()).then(d => setTickets(d.tickets || d || [])).catch(() => {});
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.events || d || [])).catch(() => {});
  }, []);

  const [filter, setFilter] = useState<FilterType>('upcoming');

  const getStatusColor = (status: TicketStatus) => {
    const colors: Record<TicketStatus, string> = {
      valid: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700',
      used: 'bg-slate-800/40 text-slate-400 border border-slate-700',
      transferred: 'bg-blue-900/40 text-blue-300 border border-blue-700',
      expired: 'bg-red-900/40 text-red-300 border border-red-700',
      cancelled: 'bg-red-900/40 text-red-300 border border-red-700',
      listed: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700',
    };
    return colors[status] || 'bg-slate-800/40 text-slate-400 border border-slate-700';
  };

  const getStatusLabel = (status: TicketStatus) => {
    const labels: Record<TicketStatus, string> = {
      valid: 'Valid',
      used: 'Used',
      transferred: 'Transferred',
      expired: 'Expired',
      cancelled: 'Cancelled',
      listed: 'Listed',
    };
    return labels[status] || status;
  };

  const isDateInRange = (eventDate: string) => {
    const event = new Date(eventDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(event.getFullYear(), event.getMonth(), event.getDate());

    const daysUntilEvent = Math.ceil((eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    switch (filter) {
      case 'today':
        return daysUntilEvent === 0;
      case 'week':
        return daysUntilEvent >= 0 && daysUntilEvent <= 7;
      case 'upcoming':
        return daysUntilEvent >= 0;
      case 'past':
        return daysUntilEvent < 0;
      default:
        return true;
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) => ticket.ownerWallet === '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0'
      && isDateInRange(ticket.ticketData.eventDate)
  );

  const filters: { value: FilterType; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  return (
    <div className="pb-32 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-950 border-b border-slate-800 z-40">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <h1 className="text-xl font-black text-white">My Tickets</h1>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm whitespace-nowrap font-medium transition-all',
                  filter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets list */}
      <div className="px-4 space-y-4 pt-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No tickets found</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const event = events.find((e) => e.id === ticket.eventId);
            const isUpcoming = new Date(ticket.ticketData.eventDate) > new Date();
            const isUsed = ticket.ticketData.status === 'used';
            const isTransferred = ticket.ticketData.status === 'transferred';

            return (
              <Link
                key={ticket.id}
                href={`/wallet/ticket/${ticket.id}`}
                className={cn(
                  'block rounded-xl overflow-hidden transition-all hover:shadow-lg',
                  isUsed && 'opacity-80 scale-[0.98]'
                )}
              >
                {/* Ticket Card */}
                <div className="bg-white text-slate-900">
                  {/* Top section with event image */}
                  <div className="relative h-40 bg-slate-200 overflow-hidden">
                    {ticket.faces[0] && (
                      <img
                        src={ticket.faces[0].url}
                        alt={ticket.ticketData.eventName}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Main content */}
                  <div className="p-4">
                    {/* Status badge and order number */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          'px-2 py-1 rounded text-xs font-bold uppercase tracking-wide',
                          getStatusColor(ticket.ticketData.status)
                        )}
                      >
                        {getStatusLabel(ticket.ticketData.status)}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        #{ticket.id.slice(-6)}
                      </span>
                    </div>

                    {/* Event name */}
                    <h3 className="text-xl font-black mb-2 line-clamp-2">
                      {ticket.ticketData.eventName}
                    </h3>

                    {/* Venue and date */}
                    <div className="space-y-1 text-sm mb-4">
                      <p className="text-slate-600">{ticket.ticketData.venue}</p>
                      <p className={isUpcoming ? 'text-blue-600 font-semibold' : 'text-slate-500'}>
                        {formatDate(ticket.ticketData.eventDate)}
                      </p>
                    </div>

                    {/* Dotted divider tear line */}
                    <div className="dotted-divider my-3" />

                    {/* Seat/Venue info grid and QR button */}
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-2 gap-3 text-xs flex-1">
                        {ticket.ticketData.seatInfo && (
                          <>
                            <div>
                              <p className="text-slate-500 text-xs mb-0.5">Seat</p>
                              <p className="font-semibold">{ticket.ticketData.seatInfo}</p>
                            </div>
                          </>
                        )}
                        <div>
                          <p className="text-slate-500 text-xs mb-0.5">Price</p>
                          <p className="font-semibold">{formatCurrency(ticket.ticketData.purchasePrice)}</p>
                        </div>
                      </div>

                      {/* QR button for valid tickets */}
                      {ticket.ticketData.status === 'valid' && (
                        <button className="ml-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                          <span className="material-symbols-outlined text-slate-900 text-xl">qr_code_2</span>
                        </button>
                      )}
                      {isUsed && (
                        <div className="ml-2 p-2 opacity-50">
                          <span className="material-symbols-outlined text-slate-400 text-xl">check_circle</span>
                        </div>
                      )}
                    </div>

                    {/* Transferred message */}
                    {isTransferred && (
                      <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                        Sent to @{ticket.ownerWallet.slice(-4)} on {formatDate(ticket.ticketData.transferHistory[0]?.timestamp || ticket.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
