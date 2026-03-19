'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatTime, formatCurrency, tierAvailability } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(d => setEvent(d.data || null))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pb-32 bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pb-32 bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Event not found</p>
      </div>
    );
  }

  const selectedTierData = event.tiers.find((t: any) => t.id === selectedTier);
  const totalPrice = selectedTierData ? selectedTierData.price * quantity : 0;

  return (
    <div className="pb-40 md:pb-0 bg-slate-950 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-72 bg-slate-800 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back and action buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Link
            href="/wallet/discover"
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur hover:bg-slate-800 text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-slate-900/80 backdrop-blur hover:bg-slate-800 text-white transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="p-2 rounded-full bg-slate-900/80 backdrop-blur hover:bg-slate-800 text-white transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        {/* Event type badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
            {event.type === 'concert'
              ? 'Live Music'
              : event.type === 'festival'
                ? 'Festival'
                : event.type === 'sport'
                  ? 'Sports'
                  : event.type === 'conference'
                    ? 'Conference'
                    : 'Experience'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4 pt-4">
        {/* Event name */}
        <h1 className="text-3xl font-black text-white">{event.name}</h1>

        {/* Location and date */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-lg">location_on</span>
            <span className="text-sm">{event.venue.name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span className="text-sm">{formatDate(event.date.start)}</span>
          </div>
        </div>

        {/* Price and availability pills */}
        <div className="flex gap-2 flex-wrap">
          <div className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            FROM {formatCurrency(Math.min(...event.tiers.map((t: any) => t.price)))}
          </div>
          {event.status === 'sold-out' ? (
            <div className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-semibold">
              SOLD OUT
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              ON SALE
            </div>
          )}
        </div>

        {/* Tabs (simplified) */}
        <div className="flex gap-6 border-b border-slate-800 pt-4">
          <button className="pb-3 text-white font-semibold border-b-2 border-blue-600">Details</button>
          <button className="pb-3 text-slate-400 hover:text-slate-300 transition-colors">Venue</button>
          <button className="pb-3 text-slate-400 hover:text-slate-300 transition-colors">Reviews</button>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-white font-black text-lg mb-2">About This Event</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Venue details */}
        <div>
          <h2 className="text-white font-black text-lg mb-2">Venue</h2>
          <div className="bg-slate-800/30 rounded-lg p-3 space-y-1 text-sm">
            <p className="font-semibold text-white">{event.venue.name}</p>
            <p className="text-slate-400">{event.venue.address}</p>
            <p className="text-slate-400">{event.venue.city}, {event.venue.country}</p>
            <p className="text-slate-500 text-xs pt-2">Capacity: {event.venue.capacity.toLocaleString()}</p>
          </div>
        </div>

        {/* Tiers/Tickets */}
        <div>
          <h2 className="text-white font-black text-lg mb-3">Choose Your Tier</h2>
          <div className="space-y-2">
            {event.tiers.map((tier) => {
              const avail = tierAvailability(tier.sold, tier.capacity);
              const isSoldOut = tier.sold >= tier.capacity;
              const isSelected = selectedTier === tier.id;

              return (
                <button
                  key={tier.id}
                  onClick={() => !isSoldOut && setSelectedTier(tier.id)}
                  disabled={isSoldOut || event.status !== 'on-sale'}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/10'
                      : isSoldOut
                        ? 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-black text-white text-sm">{tier.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tier.description}</p>
                    </div>
                    <p className="font-black text-blue-400 text-lg">{formatCurrency(tier.price)}</p>
                  </div>

                  {/* Availability bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className={avail.color}>{avail.label}</span>
                      <span className="text-slate-500">{tier.capacity - tier.sold} left</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          avail.percent >= 80
                            ? 'bg-red-500'
                            : avail.percent >= 50
                              ? 'bg-yellow-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(avail.percent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Perks */}
                  {tier.perks.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tier.perks.slice(0, 2).map((perk) => (
                        <span key={perk} className="text-[10px] text-emerald-400 bg-emerald-600/20 px-2 py-0.5 rounded">
                          {perk}
                        </span>
                      ))}
                      {tier.perks.length > 2 && (
                        <span className="text-[10px] text-slate-500">+{tier.perks.length - 2} more</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessibility info */}
        <div className="bg-slate-800/30 rounded-lg p-3 flex gap-2 text-sm">
          <span className="material-symbols-outlined text-blue-400 flex-shrink-0">info</span>
          <div>
            <p className="text-slate-300">Accessible seating available. Contact venue for details.</p>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar on mobile, inline on desktop */}
      {selectedTier && (
        <div className="fixed bottom-0 left-0 right-0 md:static bg-slate-900 border-t border-slate-800 p-4 md:px-4 md:py-6">
          {/* Quantity selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm">Quantity</span>
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="px-4 text-white font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>

          {/* Buy button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black py-3 rounded-lg transition-all active:scale-95">
            Buy Tickets · {formatCurrency(totalPrice)}
          </button>
        </div>
      )}
    </div>
  );
}
