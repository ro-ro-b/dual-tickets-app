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
    <div className="pb-32 bg-slate-950 min-h-screen">
      {/* DUAL Network Branded Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-b border-purple-500/20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">D</span>
            </div>
            <div className="text-sm">
              <p className="text-white font-semibold">DUAL Network</p>
              <p className="text-purple-300 text-xs">
                {tickets.length} Tokens · {anchoredCount} Anchored on DUAL
              </p>
            </div>
          </div>
          <a
            href="https://32f.blockv.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors text-xs font-medium"
          >
            View on DUAL →
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-[62px] bg-slate-950 border-b border-slate-800 z-40">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Token Wallet</h1>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
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
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
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
            <p className="text-slate-400">Loading tokens...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No tokens found</p>
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
                  <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
                    {/* Hero Image Area */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-900/40 to-violet-900/20 overflow-hidden group-hover:from-purple-900/60 group-hover:to-violet-900/40 transition-all duration-300">
                      {ticket.faces[0] && (
                        <img
                          src={ticket.faces[0].url}
                          alt={ticket.ticketData.eventName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                      {/* Token ID Badge - Top Right */}
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-purple-500/30 rounded-lg px-2.5 py-1.5">
                        <p className="text-purple-300 font-mono text-xs font-semibold">#{truncatedId}</p>
                      </div>

                      {/* Chain Status Badge - Top Left */}
                      {isAnchored && (
                        <div className="absolute top-3 left-3">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/80 backdrop-blur border border-emerald-400/30 rounded-lg animate-pulse">
                            <span className="inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
                            <p className="text-emerald-50 font-mono text-xs font-semibold">ANCHORED</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                      {/* Token Name */}
                      <div>
                        <h3 className="text-sm font-black text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {ticket.ticketData.eventName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{ticket.ticketData.venue}</p>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-700/30" />

                      {/* Hash Display */}
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-medium">Content Hash</p>
                        <div className="bg-slate-900/60 border border-slate-700/50 rounded px-2.5 py-1.5">
                          <p className="text-slate-300 font-mono text-xs tracking-tight">
                            {truncatedHash}
                          </p>
                        </div>
                      </div>

                      {/* Owner Info */}
                      <div className="bg-slate-900/40 rounded px-2.5 py-2 border border-slate-700/30">
                        <p className="text-xs text-slate-500 mb-1">Owner Address</p>
                        <p className="text-slate-300 font-mono text-xs">
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
                            className="flex-1 px-2 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300 text-xs font-semibold hover:bg-purple-600/40 hover:border-purple-500/50 transition-colors text-center"
                          >
                            View on Chain
                          </a>
                        )}
                        <button className="flex-1 px-2 py-1.5 bg-slate-700/40 border border-slate-600/30 rounded text-slate-300 text-xs font-semibold hover:bg-slate-700/60 transition-colors">
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
