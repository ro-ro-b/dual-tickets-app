'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EventTypeBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatCurrency, getEventTypeColor } from '@/lib/utils';
import { Calendar, MapPin, TrendingUp, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/marketplace');
        if (!res.ok) throw new Error('Failed to fetch marketplace listings');
        const json = await res.json();
        setListings(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Loading marketplace listings from DUAL network...</div>;
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

      {/* Info banner */}
      <Card className="bg-gold-50 border-gold-200">
        <CardContent className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-gold-700 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gold-900">DUAL-Protected Marketplace</p>
            <p className="text-xs text-gold-800">All resale objects are verified on-chain. Resale prices are capped by the organiser to prevent scalping.</p>
          </div>
        </CardContent>
      </Card>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No objects currently listed for resale on the DUAL network</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing: any) => (
            <Card key={listing.id} hover className="bg-white border border-slate-100 rounded-2xl">
              <CardContent className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                  {listing.faces && listing.faces[0]?.url ? (
                    <img
                      src={listing.faces[0].url}
                      alt={listing.ticketData?.eventName || 'Listing'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    {listing.event && <EventTypeBadge type={listing.event.type} />}
                    {listing.markup && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <TrendingUp size={10} className="mr-1" /> {listing.markup}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900">{listing.ticketData?.eventName || listing.name || 'DUAL Object'}</h3>
                  <p className="text-sm text-primary-consumer font-medium">{listing.tierName || 'Token'}</p>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                    {listing.ticketData?.eventDate && (
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(listing.ticketData.eventDate)}</span>
                    )}
                    {listing.ticketData?.venue && (
                      <span className="flex items-center gap-1"><MapPin size={12} /> {listing.ticketData.venue}</span>
                    )}
                    {listing.ticketData?.seatInfo && (
                      <span>{listing.ticketData.seatInfo}</span>
                    )}
                  </div>

                  {listing.event?.resaleMaxMarkup && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Max resale: {formatCurrency((listing.ticketData?.purchasePrice || 0) * listing.event.resaleMaxMarkup)} ({((listing.event.resaleMaxMarkup - 1) * 100).toFixed(0)}% cap)
                    </p>
                  )}
                </div>

                {/* Price + Buy */}
                <div className="flex flex-col md:items-end justify-between">
                  <div className="text-right mb-3 md:mb-0">
                    {listing.ticketData?.purchasePrice > 0 && (
                      <p className="text-xs text-slate-500 line-through">
                        {formatCurrency(listing.ticketData.purchasePrice)}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-primary-consumer">
                      {formatCurrency(listing.ticketData?.currentPrice || 0)}
                    </p>
                  </div>
                  <Button className="w-full md:w-auto" variant="primary">
                    <span className="flex items-center gap-2">
                      <ArrowRightLeft size={16} />
                      View Listing
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
