'use client';

import { formatCurrency, formatDateTime, truncateAddress } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { Ticket } from '@/types';

const statusColors: Record<string, string> = {
  valid: 'bg-gold-50 text-gold-800',
  used: 'bg-slate-100 text-slate-700',
  transferred: 'bg-blue-100 text-blue-700',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  listed: 'bg-amber-100 text-amber-700',
};

const chainStatusColors: Record<string, string> = {
  anchored: 'bg-gold-50 text-gold-700',
  pending: 'bg-amber-50 text-amber-700',
  verified: 'bg-gold-100 text-gold-800',
};

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        const items = data?.data || data || [];
        setTickets(Array.isArray(items) ? items : []);
      } catch (err: any) {
        setError(err.message);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket: any) => {
    const name = ticket.ticketData?.eventName || '';
    const owner = ticket.ownerWallet || '';
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.ticketData?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredTickets.reduce((sum: number, t: any) => sum + (t.ticketData?.purchasePrice || 0), 0);
  const validCount = filteredTickets.filter((t: any) => t.ticketData?.status === 'valid').length;
  const anchoredCount = filteredTickets.filter((t: any) => t.onChainStatus === 'anchored').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders & Tickets</h1>
        <p className="text-sm text-gray-600 mt-1">All minted tickets from the DUAL network</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <span className="text-primary-consumer font-semibold text-sm uppercase tracking-wide">Total Tickets</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{filteredTickets.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <span className="text-primary-consumer font-semibold text-sm uppercase tracking-wide">Valid</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{validCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <span className="text-primary-consumer font-semibold text-sm uppercase tracking-wide">Anchored</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{anchoredCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <span className="text-primary-consumer font-semibold text-sm uppercase tracking-wide">Total Value</span>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-consumer/30"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-consumer/30 appearance-none pr-10"
          >
            <option value="all">All Status</option>
            <option value="valid">Valid</option>
            <option value="used">Used</option>
            <option value="transferred">Transferred</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="space-y-0 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-consumer rounded-full animate-spin" />
            </div>
            <p className="text-slate-500 mt-4">Loading tickets...</p>
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">confirmation_number</span>
            <p className="text-slate-500">No tickets found</p>
            <p className="text-slate-400 text-sm mt-1">Mint tickets via the admin dashboard to see them here</p>
          </div>
        ) : (
          filteredTickets.map((ticket: any) => (
            <div key={ticket.id}>
              <button
                onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-0 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-mono text-sm font-medium text-gray-900">{truncateAddress(ticket.id)}</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[ticket.ticketData?.status] || 'bg-slate-100 text-slate-700'}`}>
                      {ticket.ticketData?.status || 'unknown'}
                    </span>
                    {ticket.onChainStatus && (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${chainStatusColors[ticket.onChainStatus] || 'bg-slate-100 text-slate-600'}`}>
                        {ticket.onChainStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{ticket.ticketData?.eventName || 'Untitled Event'}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{ticket.ownerWallet ? truncateAddress(ticket.ownerWallet) : 'No owner'}</p>
                </div>
                <div className="text-right flex-shrink-0 w-28">
                  <p className="font-semibold text-sm text-gray-900">{formatCurrency(ticket.ticketData?.purchasePrice || 0)}</p>
                  <p className="text-xs text-gray-500">{ticket.ticketData?.venue || ''}</p>
                </div>
                <div className="w-6 flex-shrink-0 text-gray-400">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedId === ticket.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === ticket.id && (
                <div className="px-6 py-6 bg-slate-50 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-sm">Ticket Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Event</span>
                          <span className="font-medium text-gray-900">{ticket.ticketData?.eventName || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Venue</span>
                          <span className="font-medium text-gray-900">{ticket.ticketData?.venue || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date</span>
                          <span className="font-medium text-gray-900">{ticket.ticketData?.eventDate ? formatDateTime(ticket.ticketData.eventDate) : '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seat</span>
                          <span className="font-medium text-gray-900">{ticket.ticketData?.seatInfo || 'General Admission'}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="text-gray-600">Price</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(ticket.ticketData?.purchasePrice || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-sm">Owner</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wallet</span>
                          <span className="font-mono text-gray-900 text-xs">{ticket.ownerWallet || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Template</span>
                          <span className="font-medium text-gray-900">{ticket.templateName || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created</span>
                          <span className="font-mono text-gray-900 text-xs">{ticket.createdAt ? formatDateTime(ticket.createdAt) : '—'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-sm">On-Chain Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status</span>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${chainStatusColors[ticket.onChainStatus] || 'bg-slate-100 text-slate-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ticket.onChainStatus === 'anchored' ? 'bg-gold-500' : 'bg-amber-500'}`} />
                            {ticket.onChainStatus || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token ID</span>
                          <span className="font-mono text-gray-900 text-xs">{truncateAddress(ticket.id)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
