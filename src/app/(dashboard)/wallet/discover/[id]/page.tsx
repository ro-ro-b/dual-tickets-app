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
      <div className="pb-32 bg-background-light min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pb-32 bg-background-light min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Event not found</p>
      </div>
    );
  }

  const selectedTierData = event.tiers.find((t: any) => t.id === selectedTier);
  const totalPrice = selectedTierData ? selectedTierData.price * quantity : 0;

  return (
    <div className="pb-40 md:pb-0 bg-background-light min-h-screen">
      {/* Hero Image */}
      <div className="relative h-72 bg-slate-200 overflow-hidden">
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
            className="p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        {/* Event type badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 rounded-full wine-gradient text-white text-xs font-bold uppercase tracking-wider">
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
        <h1 className="text-3xl font-black text-slate-900">{event.name}</h1>

        {/* Location and date */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-lg">location_on</span>
            <span className="text-sm">{event.venue.name}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span className="text-sm">{formatDate(event.date.start)}</span>
          </div>
        </div>

        {/* Price and availability pills */}
        <div className="flex gap-2 flex-wrap">
          <div className="px-3 py-1 rounded-full bg-primary-consumer/10 border border-primary-consumer/20 text-primary-consumer text-xs font-semibold">
            FROM {formatCurrency(Math.min(...event.tiers.map((t: any) => t.price)))}
          </div>
          {event.status === 'sold-out' ? (
            <div className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              SOLD OUT
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-xs font-semibold">
              ON SALE
            </div>
          )}
        </div>

        {/* Tabs (simplified) */}
        <div className="flex gap-6 border-b border-slate-200 pt-4">
          <button className="pb-3 text-slate-900 font-semibold border-b-2 border-primary-consumer">Details</button>
          <button className="pb-3 text-slate-500 hover:text-slate-700 transition-colors">Venue</button>
          <button className="pb-3 text-slate-500 hover:text-slate-700 transition-colors">Reviews</button>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-slate-900 font-black text-lg mb-2">About This Event</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Venue details */}
        <div>
          <h2 className="text-slate-900 font-black text-lg mb-2">Venue</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-3 space-y-1 text-sm shadow-sm">
            <p className="font-semibold text-slate-900">{event.venue.name}</p>
            <p className="text-slate-600">{event.venue.address}</p>
            <p className="text-slate-600">{event.venue.city}, {event.venue.country}</p>
            <p className="text-slate-500 text-xs pt-2">Capacity: {event.venue.capacity.toLocaleString()}</p>
          </div>
        </div>

        {/* Tiers/Tickets */}
        <div>
          <h2 className="text-slate-900 font-black text-lg mb-3">Choose Your Tier</h2>
          <div className="space-y-2">
            {event.tiers.map(( tier: any) => {
              const avail = tierAvailability(tier.sold, tier.capacity);
              const isSoldOut = tier.sold >= tier.capacity;
              const isSelected = selectedTier === tier.id;

              return (
                <button
                  key={tier.id}
                  onClick={() => !isSoldOut && setSelectedTier(tier.id)}
                  disabled={isSoldOut || event.status !== 'on-sale'}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-primary-consumer bg-primary-consumer/5'
                      : isSoldOut
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-primary-consumer/30 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-black text-slate-900 text-sm">{tier.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                    </div>
                    <p className="font-black text-primary-consumer text-lg">{formatCurrency(tier.price)}</p>
                  </div>

                  {/* Availability bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className={avail.color}>{avail.label}</span>
                      <span className="text-slate-500">{tier.capacity - tier.sold} left</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          avail.percent >= 80
                            ? 'bg-red-500'
                            : avail.percent >= 50
                              ? 'bg-amber-500'
                              : 'bg-gold-600'
                        }`}
                        style={{ width: `${Math.min(avail.percent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Perks */}
                  {tier.perks.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tier.perks.slice(0, 2).map(( perk: any) => (
                        <span key={perk} className="text-[10px] text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
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
        <div className="bg-blue-50 rounded-xl p-3 flex gap-2 text-sm border border-blue-200">
          <span className="material-symbols-outlined text-blue-600 flex-shrink-0">info</span>
          <div>
            <p className="text-blue-900">Accessible seating available. Contact venue for details.</p>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar on mobile, inline on desktop */}
      {selectedTier && (
        <div className="fixed bottom-0 left-0 right-0 md:static bg-white border-t border-slate-200 p-4 md:px-4 md:py-6 shadow-lg">
          {/* Quantity selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-600 text-sm">Quantity</span>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="px-4 text-slate-900 font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>

          {/* Buy button */}
          <button className="w-full wine-gradient text-white font-black py-3 rounded-xl transition-all active:scale-95 hover:shadow-lg">
            Buy Tickets · {formatCurrency(totalPrice)}
          </button>
        </div>
      )}
    </div>
  );
}
