'use client';

import { useState } from 'react';
import { demoEvents } from '@/lib/demo-data';
import { EventCard } from '@/components/tickets/EventCard';
import type { EventType, EventCategory } from '@/types';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');

  const eventTypes: Array<EventType | 'all'> = ['all', 'concert', 'festival', 'sport', 'conference', 'experience'];
  const categories: Array<EventCategory | 'all'> = ['all', 'music', 'arts', 'sport', 'tech', 'food-wine', 'wellness', 'adventure'];

  let events = [...demoEvents];

  if (search) {
    const q = search.toLowerCase();
    events = events.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.venue.name.toLowerCase().includes(q) ||
      e.venue.city.toLowerCase().includes(q)
    );
  }
  if (typeFilter !== 'all') events = events.filter(e => e.type === typeFilter);
  if (categoryFilter !== 'all') events = events.filter(e => e.category === categoryFilter);

  // Sort: on-sale first, then by date
  events.sort((a, b) => {
    if (a.status === 'on-sale' && b.status !== 'on-sale') return -1;
    if (a.status !== 'on-sale' && b.status === 'on-sale') return 1;
    return new Date(a.date.start).getTime() - new Date(b.date.start).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-4 py-2.5">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search events, venues, cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Type filters */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                typeFilter === type
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                categoryFilter === cat
                  ? 'bg-accent-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat.replace('-', ' & ')}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-500 mb-4">{events.length} event{events.length !== 1 ? 's' : ''} found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
