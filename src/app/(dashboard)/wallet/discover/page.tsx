'use client';

import { useState } from 'react';
import Link from 'next/link';
import { demoEvents } from '@/lib/demo-data';
import { formatCurrency, cn } from '@/lib/utils';
import type { EventCategory } from '@/types';

type CategoryType = EventCategory | 'all';

export default function DiscoverPage() {
  const [category, setCategory] = useState<CategoryType>('all');

  const categories: { value: CategoryType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'music', label: 'Music' },
    { value: 'sport', label: 'Sports' },
    { value: 'arts', label: 'Theatre' },
    { value: 'tech', label: 'Tech' },
    { value: 'adventure', label: 'Experiences' },
  ];

  let filtered = [...demoEvents];
  if (category !== 'all') {
    filtered = filtered.filter((e) => e.category === category);
  }

  // Separate into featured and popular
  const featured = filtered.filter((e) => e.status === 'on-sale').slice(0, 5);
  const popular = filtered
    .filter((e) => e.status === 'on-sale')
    .sort((a, b) => {
      const aAvailable = a.tiers[0]?.sold || 0;
      const bAvailable = b.tiers[0]?.sold || 0;
      return bAvailable - aAvailable;
    })
    .slice(0, 6);

  return (
    <div className="pb-32 bg-slate-950 min-h-screen">
      {/* Header with location and search */}
      <div className="sticky top-0 bg-slate-950 border-b border-slate-800 z-40">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="material-symbols-outlined text-xl">location_on</span>
              <span className="font-semibold">Sydney, AU</span>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 mb-3">
            <span className="material-symbols-outlined text-slate-500 text-lg">search</span>
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm whitespace-nowrap font-medium transition-all',
                  category === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pt-4">
        {/* Featured Events - Horizontal Carousel */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-white font-black text-lg mb-3">Featured Events</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {featured.map((event) => {
                const availability = event.tiers[0] ?
                  ((event.tiers[0].sold / event.tiers[0].capacity) * 100) : 0;
                const minPrice = Math.min(...event.tiers.map((t) => t.price));

                return (
                  <Link
                    key={event.id}
                    href={`/wallet/discover/${event.id}`}
                    className="flex-shrink-0 w-[280px] rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <div className="relative h-56 bg-slate-800 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Badges */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div className="flex flex-col gap-2">
                          {availability >= 80 && (
                            <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                              SELLING FAST
                            </span>
                          )}
                          {event.status === 'sold-out' && (
                            <span className="inline-block bg-slate-800 text-white px-2 py-1 rounded text-xs font-bold">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                        {event.status === 'on-sale' && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                            FROM {formatCurrency(minPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular Near You - responsive grid */}
        {popular.length > 0 && (
          <div>
            <h2 className="text-white font-black text-lg mb-3">Popular Near You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {popular.map((event) => {
                const minPrice = Math.min(...event.tiers.map((t) => t.price));

                return (
                  <Link
                    key={event.id}
                    href={`/wallet/discover/${event.id}`}
                    className="rounded-xl overflow-hidden group"
                  >
                    <div className="relative aspect-[3/4] bg-slate-800 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Title and price */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-black text-sm line-clamp-2 mb-1">
                          {event.name}
                        </h3>
                        {event.status === 'on-sale' && (
                          <p className="text-yellow-400 text-xs font-bold">
                            FROM {formatCurrency(minPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Experiences */}
        {filtered.filter((e) => e.type === 'experience').length > 0 && (
          <div>
            <h2 className="text-white font-black text-lg mb-3">Upcoming Experiences</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {filtered
                .filter((e) => e.type === 'experience')
                .slice(0, 4)
                .map((event) => {
                  const minPrice = Math.min(...event.tiers.map((t) => t.price));

                  return (
                    <Link
                      key={event.id}
                      href={`/wallet/discover/${event.id}`}
                      className="flex-shrink-0 w-[240px] rounded-lg overflow-hidden group"
                    >
                      <div className="relative h-32 bg-slate-800">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="text-white font-bold text-xs line-clamp-1">
                            {event.name}
                          </h4>
                          <p className="text-amber-400 text-xs font-semibold">
                            FROM {formatCurrency(minPrice)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No events found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
