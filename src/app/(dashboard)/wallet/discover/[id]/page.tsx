'use client';

import { useParams } from 'next/navigation';
import { demoEvents, demoTickets } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EventTypeBadge, EventStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatTime, formatCurrency, tierAvailability, getEventTypeColor } from '@/lib/utils';
import { Calendar, MapPin, Users, Clock, Shield, ArrowRightLeft, Check, Ticket } from 'lucide-react';
import { useState } from 'react';

export default function EventDetailPage() {
  const { id } = useParams();
  const event = demoEvents.find(e => e.id === id);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [purchased, setPurchased] = useState(false);

  if (!event) {
    return <div className="text-center py-12"><p className="text-gray-500">Event not found</p></div>;
  }

  const totalSold = event.tiers.reduce((s, t) => s + t.sold, 0);
  const totalCapacity = event.tiers.reduce((s, t) => s + t.capacity, 0);
  const revenue = event.tiers.reduce((s, t) => s + (t.sold * t.price), 0);

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => setPurchased(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 mb-2">
            <EventTypeBadge type={event.type} />
            <EventStatusBadge status={event.status} />
            {event.resaleEnabled && (
              <Badge className="bg-white/20 text-white border border-white/30">
                <ArrowRightLeft size={12} className="mr-1" /> Resale Enabled
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{event.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="text-center py-3">
                <Calendar size={18} className="mx-auto text-brand-600 mb-1" />
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(event.date.start)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-3">
                <Clock size={18} className="mx-auto text-brand-600 mb-1" />
                <p className="text-xs text-gray-500">Doors</p>
                <p className="text-sm font-semibold text-gray-900">{event.date.doors ? formatTime(event.date.doors) : 'TBA'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-3">
                <MapPin size={18} className="mx-auto text-brand-600 mb-1" />
                <p className="text-xs text-gray-500">Venue</p>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{event.venue.name}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-3">
                <Users size={18} className="mx-auto text-brand-600 mb-1" />
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="text-sm font-semibold text-gray-900">{totalSold.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">About</h2></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>

          {/* Venue info */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">Venue</h2></CardHeader>
            <CardContent>
              <p className="font-medium text-gray-900">{event.venue.name}</p>
              <p className="text-sm text-gray-500">{event.venue.address}</p>
              <p className="text-sm text-gray-500">{event.venue.city}, {event.venue.country}</p>
              <p className="text-sm text-gray-400 mt-2">Capacity: {event.venue.capacity.toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* DUAL token info */}
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">DUAL Tokenisation</h2></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-brand-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Every ticket is a unique on-chain token</p>
                  <p className="text-xs text-gray-500">Cryptographically verified, impossible to counterfeit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRightLeft size={16} className="text-brand-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.resaleEnabled
                      ? `Resale enabled — max ${((event.resaleMaxMarkup - 1) * 100).toFixed(0)}% markup`
                      : 'Resale disabled for this event'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.resaleEnabled
                      ? 'Transfer and resell with built-in price caps to prevent scalping'
                      : 'Tickets are non-transferable'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Ticket size={16} className="text-brand-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Template: {event.type === 'experience' ? 'dual-tickets::experience-ticket::v1' : 'dual-tickets::event-ticket::v1'}</p>
                  <p className="text-xs text-gray-500 font-mono">Org: {event.organizerId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Tiers + Purchase */}
        <div className="space-y-4">
          <Card>
            <CardHeader><h2 className="font-semibold text-gray-900">Select Tier</h2></CardHeader>
            <CardContent className="space-y-3">
              {event.tiers.map((tier) => {
                const avail = tierAvailability(tier.sold, tier.capacity);
                const isSoldOut = tier.sold >= tier.capacity;
                const isSelected = selectedTier === tier.id;

                return (
                  <button
                    key={tier.id}
                    onClick={() => !isSoldOut && setSelectedTier(tier.id)}
                    disabled={isSoldOut || event.status !== 'on-sale'}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50'
                        : isSoldOut
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{tier.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{tier.description}</p>
                      </div>
                      <p className="font-bold text-brand-600">{formatCurrency(tier.price)}</p>
                    </div>

                    {/* Capacity bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className={avail.color}>{avail.label}</span>
                        <span className="text-gray-400">{tier.capacity - tier.sold} left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${avail.percent >= 80 ? 'bg-red-500' : avail.percent >= 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(avail.percent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Perks */}
                    {tier.perks.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tier.perks.map((perk) => (
                          <span key={perk} className="inline-flex items-center gap-0.5 text-[10px] text-gray-500">
                            <Check size={10} className="text-green-500" /> {perk}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Purchase button */}
              {event.status === 'on-sale' && (
                <Button
                  className="w-full mt-2"
                  size="lg"
                  disabled={!selectedTier || purchased}
                  onClick={handlePurchase}
                >
                  {purchased ? (
                    <span className="flex items-center gap-2"><Check size={18} /> Ticket Purchased!</span>
                  ) : selectedTier ? (
                    `Purchase for ${formatCurrency(event.tiers.find(t => t.id === selectedTier)?.price || 0)}`
                  ) : (
                    'Select a tier'
                  )}
                </Button>
              )}

              {event.status === 'sold-out' && (
                <div className="text-center py-2">
                  <p className="text-sm font-medium text-red-600">Sold Out</p>
                  <p className="text-xs text-gray-500 mt-1">Check the marketplace for resale tickets</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
