'use client';

import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, MoreHorizontal } from 'lucide-react';

type EventStatus = 'on-sale' | 'sold-out' | 'draft' | 'completed' | 'cancelled' | 'active';
type EventCategory = 'music' | 'arts' | 'sport' | 'tech' | 'food-wine' | 'wellness' | 'adventure' | 'general';

const statusColors: Record<EventStatus, string> = {
  'on-sale': 'bg-gold-50 text-gold-700',
  'sold-out': 'bg-red-100 text-red-700',
  'draft': 'bg-slate-100 text-slate-700',
  'completed': 'bg-blue-100 text-blue-700',
  'cancelled': 'bg-red-100 text-red-700',
  'active': 'bg-blue-100 text-blue-700',
};

interface TemplateEvent {
  id: string;
  name: string;
  category: string;
  status: EventStatus;
  createdAt: string;
  organizerId: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<TemplateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const json = await res.json();
        setEvents(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  let filteredEvents = events.filter((event: any) => {
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

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading templates from DUAL network...</div>;
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DUAL Templates</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage token templates on the DUAL network</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ec5b13] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Template
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e: any) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e: any) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13] appearance-none pr-10 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="music">Music</option>
            <option value="sport">Sport</option>
            <option value="arts">Arts</option>
            <option value="tech">Tech</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e: any) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13] appearance-none pr-10 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-sale">On Sale</option>
            <option value="sold-out">Sold Out</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Template</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Created</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No templates found
                </td>
              </tr>
            ) : (
              paginatedEvents.map((event: any) => (
                <tr key={event.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{event.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{event.category || 'general'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[event.status as EventStatus] || 'bg-slate-100 text-slate-700'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
