'use client';

import { demoEvents } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EventStatusBadge, EventTypeBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Plus, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminEventsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const events = statusFilter === 'all'
    ? demoEvents
    : demoEvents.filter(e => e.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['all', 'on-sale', 'sold-out', 'completed', 'draft', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                statusFilter === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
        <Link href="/admin/events/new">
          <Button size="sm"><Plus size={16} className="mr-1" /> Create Event</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const totalSold = event.tiers.reduce((s, t) => s + t.sold, 0);
          const totalCap = event.tiers.reduce((s, t) => s + t.capacity, 0);
          const revenue = event.tiers.reduce((s, t) => s + t.sold * t.price, 0);
          const soldPercent = Math.round((totalSold / totalCap) * 100);

          return (
            <Link key={event.id} href={`/admin/events/${event.id}`}>
              <Card hover>
                <CardContent className="flex items-center gap-4">
                  <img src={event.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <EventTypeBadge type={event.type} />
                      <EventStatusBadge status={event.status} />
                    </div>
                    <p className="font-semibold text-gray-900 truncate">{event.name}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(event.date.start)}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {event.venue.city}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-500"><Users size={12} className="inline mr-1" />Sold</p>
                      <p className="text-sm font-semibold text-gray-900">{totalSold.toLocaleString()}</p>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className={`h-1.5 rounded-full ${soldPercent >= 90 ? 'bg-red-500' : soldPercent >= 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${soldPercent}%` }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500"><DollarSign size={12} className="inline mr-1" />Revenue</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(revenue)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Tiers</p>
                      <p className="text-sm font-semibold text-gray-900">{event.tiers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
