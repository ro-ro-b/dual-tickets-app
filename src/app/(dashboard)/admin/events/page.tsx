'use client';

import { demoEvents } from '@/lib/demo-data';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Plus, ChevronDown, MoreHorizontal } from 'lucide-react';

type EventStatus = 'on-sale' | 'sold-out' | 'draft' | 'completed' | 'cancelled';
type EventCategory = 'music' | 'arts' | 'sport' | 'tech' | 'food-wine' | 'wellness' | 'adventure';

const statusColors: Record<EventStatus, string> = {
  'on-sale': 'bg-emerald-100 text-emerald-700',
  'sold-out': 'bg-red-100 text-red-700',
  'draft': 'bg-slate-100 text-slate-700',
  'completed': 'bg-blue-100 text-blue-700',
  'cancelled': 'bg-red-100 text-red-700',
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter events
  let filteredEvents = demoEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all ticketing events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ec5b13] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ec5b13] appearance-none pr-10"
          >
            <option value="all">All Categories</option>
            <option value="music">Music</option>
            <option value="arts">Arts</option>
            <option value="sport">Sport</option>
            <option value="tech">Tech</option>
            <option value="food-wine">Food & Wine</option>
            <option value="wellness">Wellness</option>
            <option value="adventure">Adventure</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ec5b13] appearance-none pr-10"
          >
            <option value="all">All Status</option>
            <option value="on-sale">On Sale</option>
            <option value="sold-out">Sold Out</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {paginatedEvents.length} of {filteredEvents.length} events
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Venue</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Sold</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedEvents.map((event) => {
              const totalCapacity = event.tiers.reduce((sum, t) => sum + t.capacity, 0);
              const totalSold = event.tiers.reduce((sum, t) => sum + t.sold, 0);
              const sellPercentage = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

              return (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="text-sm font-medium text-[#ec5b13] hover:text-orange-700"
                    >
                      <div>{event.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{event.id}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">{event.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{formatDate(event.date.start)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{event.venue.name}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">{totalCapacity.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={`text-sm font-medium ${
                          sellPercentage >= 90
                            ? 'text-red-600'
                            : sellPercentage >= 70
                            ? 'text-amber-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {totalSold.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[event.status as EventStatus]
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#ec5b13] text-white'
                      : 'border border-slate-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
