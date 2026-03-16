'use client';

import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import { Search, ChevronDown, Calendar, TrendingUp } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-2026-0001', event: 'Vivid Sydney 2026 — Opening Night', buyer: 'Sarah Chen', tickets: 2, amount: 390, status: 'completed', date: '2026-03-15T14:32:00Z' },
  { id: 'ORD-2026-0002', event: 'Tame Impala — World Tour 2026', buyer: 'Michael Thompson', tickets: 4, amount: 756, status: 'completed', date: '2026-03-14T11:15:00Z' },
  { id: 'ORD-2026-0003', event: 'Sydney FC vs Melbourne Victory', buyer: 'James Rodriguez', tickets: 1, amount: 120, status: 'pending', date: '2026-03-14T09:45:00Z' },
  { id: 'ORD-2026-0004', event: 'AI & Web3 Summit 2026', buyer: 'Emily Watson', tickets: 3, amount: 1797, status: 'completed', date: '2026-03-13T16:20:00Z' },
  { id: 'ORD-2026-0005', event: 'Coachella 2026 — Weekend 1', buyer: 'David Park', tickets: 2, amount: 1098, status: 'completed', date: '2026-03-13T13:50:00Z' },
  { id: 'ORD-2026-0006', event: 'NBA Finals 2026 — Game 7', buyer: 'Jessica Brown', tickets: 1, amount: 350, status: 'refunded', date: '2026-03-12T10:30:00Z' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  refunded: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  const activeOrders = filteredOrders.filter((o) => o.status === 'pending').length;
  const totalTickets = filteredOrders.reduce((sum, o) => sum + o.tickets, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders & Transactions</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all ticket orders and payment transactions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[#ec5b13] font-semibold text-sm uppercase tracking-wide">Total Sales</span>
            <span className="text-emerald-600 text-xs font-semibold">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[#ec5b13] font-semibold text-sm uppercase tracking-wide">Active Orders</span>
            <span className="text-amber-600 text-xs font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[#ec5b13] font-semibold text-sm uppercase tracking-wide">Tickets Sold</span>
            <span className="text-emerald-600 text-xs font-semibold">+3.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalTickets.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-[#ec5b13] font-semibold text-sm uppercase tracking-wide">Refund Rate</span>
            <span className="text-red-600 text-xs font-semibold">-0.5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">0.8%</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ec5b13] appearance-none pr-10"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="space-y-0 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        {filteredOrders.map((order, index) => (
          <div key={order.id}>
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-0 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-mono text-sm font-medium text-gray-900">{order.id}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{order.event}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.buyer}</p>
              </div>
              <div className="text-right flex-shrink-0 w-24">
                <p className="font-mono text-sm text-gray-900">{order.tickets} tickets</p>
                <p className="text-xs text-gray-500">{formatCurrency(order.amount)}</p>
              </div>
              <div className="w-6 flex-shrink-0 text-gray-400">
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedId === order.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === order.id && (
              <div className="px-6 py-6 bg-slate-50 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Ticket Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm">Ticket Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-medium text-gray-900">{order.tickets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Price</span>
                        <span className="font-medium text-gray-900">{formatCurrency(order.amount / order.tickets)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(order.amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm">Payment Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method</span>
                        <span className="font-medium text-gray-900">Credit Card</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Card</span>
                        <span className="font-mono text-gray-900">•••• 4242</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp</span>
                        <span className="font-mono text-gray-900 text-xs">{formatDateTime(order.date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Events */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-sm">Blockchain Events</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Anchored
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tx Hash</span>
                        <span className="font-mono text-gray-900 text-xs">0x4f2e...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Block</span>
                        <span className="font-mono text-gray-900">#18,492,031</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
