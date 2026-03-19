'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, formatCurrency, cn, truncateAddress } from '@/lib/utils';
import type { TicketStatus } from '@/types';

type FilterType = 'all' | 'today' | 'week' | 'upcoming' | 'past';

export default function MyTicketsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(d => setTickets(d.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: TicketStatus) => {
    const colors: Record<TicketStatus, string> = {
      valid: 'bg-gold-50 text-gold-800 border border-gold-200',
      used: 'bg-slate-50 text-slate-600 border border-slate-200',
      transferred: 'bg-blue-50 text-blue-700 border border-blue-200',
      expired: 'bg-red-50 text-red-700 border border-red-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
      listed: 'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return colors[status] || 'bg-slate-50 text-slate-600 border border-slate-200';
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
    (ticket: any) => isDateInRange(ticket.ticketData.eventDate)
  );

  const anchoredCount = tickets.filter((t: any) => t.onChainStatus === 'anchored').length;

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  return (
    <div className="pb-32 bg-background-light min-h-screen">
      {/* DUAL Network Branded Banner */}
      <div className="wine-gradient border-b border-slate-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-primary-consumer font-black text-xs">D</span>
            </div>
            <div className="text-sm">
              <p className="text-white font-semibold">DUAL Network</p>
              <p className="text-white/80 text-xs">
                {tickets.length} Tokens · {anchoredCount} Anchored on DUAL
              </p>
            </div>
          </div>
          <a
            href="https://32f.blockv.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors text-xs font-medium"
          >
            View on DUAL →
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-[62px] bg-white border-b border-slate-200 z-40">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-consumer flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900">Token Wallet</h1>
              </div>
            </div>
            <button className="text-slate-500 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {filters.map((f: any) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm whitespace-nowrap font-medium transition-all',
                  filter === f.value
                    ? 'bg-primary-consumer text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tokens grid */}
      <div className="px-4 pt-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading tokens...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No tokens found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((ticket: any) => {
              const isAnchored = ticket.onChainStatus === 'anchored';
              const truncatedHash = ticket.contentHash
                ? `${ticket.contentHash.slice(0, 6)}...${ticket.contentHash.slice(-4)}`
                : 'pending';
              const truncatedId = ticket.id.slice(-6);

              return (
                <Link
                  key={ticket.id}
                  href={`/wallet/ticket/${ticket.id}`}
                  className="block group"
                >
                  {/* Premium Token Card */}
                  <div className="h-full bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary-consumer/30 hover:shadow-lg">
                    {/* Hero Image Area */}
                    <div className="relative h-48 bg-gradient-to-br from-wine-100 to-wine-50 overflow-hidden group-hover:from-wine-100 group-hover:to-wine-50 transition-all duration-300">
                      {ticket.faces[0] && (
                        <img
                          src={ticket.faces[0].url}
                          alt={ticket.ticketData.eventName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                      {/* Token ID Badge - Top Right */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-2.5 py-1.5">
                        <p className="text-primary-consumer font-mono text-xs font-semibold">#{truncatedId}</p>
                      </div>

                      {/* Chain Status Badge - Top Left */}
                      {isAnchored && (
                        <div className="absolute top-3 left-3">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gold-50 backdrop-blur border border-gold-200 rounded-lg animate-pulse">
                            <span className="inline-block w-1.5 h-1.5 bg-gold-700 rounded-full"></span>
                            <p className="text-gold-700 font-mono text-xs font-semibold">ANCHORED</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                      {/* Token Name */}
                      <div>
                        <h3 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-primary-consumer transition-colors">
                          {ticket.ticketData.eventName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{ticket.ticketData.venue}</p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-200" />

                      {/* Hash Display */}
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-medium">Content Hash</p>
                        <div className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5">
                          <p className="text-slate-600 font-mono text-xs tracking-tight">
                            {truncatedHash}
                          </p>
                        </div>
                      </div>

                      {/* Owner Info */}
                      <div className="bg-slate-50 rounded px-2.5 py-2 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Owner Address</p>
                        <p className="text-slate-600 font-mono text-xs">
                          {truncateAddress(ticket.ownerWallet)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1">
                        {ticket.explorerLinks?.contentHash && (
                          <a
                            href={ticket.explorerLinks.contentHash}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e: any) => e.preventDefault()}
                            className="flex-1 px-2 py-1.5 bg-gold-50 border border-gold-200 rounded text-gold-700 text-xs font-semibold hover:bg-gold-100 hover:border-gold-300 transition-colors text-center"
                          >
                            View on Chain
                          </a>
                        )}
                        <button className="flex-1 px-2 py-1.5 bg-slate-100 border border-slate-200 rounded text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors">
                          Details
                        </button>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-slate-500 text-center pt-1">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
