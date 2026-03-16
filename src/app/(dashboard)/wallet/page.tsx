'use client';

import { demoTickets, demoEvents, DEMO_CONSUMER_WALLET } from '@/lib/demo-data';
import { TicketCard } from '@/components/tickets/TicketCard';
import { ConsumerStats } from '@/components/tickets/StatsCards';
import { useState } from 'react';

export default function MyTicketsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const myTickets = demoTickets.filter(t => t.ownerWallet === DEMO_CONSUMER_WALLET);
  const now = new Date();

  const upcoming = myTickets.filter(t => {
    const eventDate = new Date(t.ticketData.eventDate);
    return eventDate > now && t.ticketData.status !== 'used';
  });
  const past = myTickets.filter(t => {
    const eventDate = new Date(t.ticketData.eventDate);
    return eventDate <= now || t.ticketData.status === 'used';
  });

  const filtered = filter === 'upcoming' ? upcoming : filter === 'past' ? past : myTickets;
  const totalSpent = myTickets.reduce((sum, t) => sum + t.ticketData.purchasePrice, 0);

  return (
    <div className="space-y-6">
      <ConsumerStats
        ticketCount={myTickets.length}
        upcomingCount={upcoming.length}
        totalSpent={totalSpent}
      />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'past'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? `All (${myTickets.length})` : f === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {/* Ticket grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tickets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
