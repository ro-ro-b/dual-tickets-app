'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { demoEvents } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { Check, Ticket, Zap } from 'lucide-react';

export default function MintPage() {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [minted, setMinted] = useState(false);

  const event = demoEvents.find(e => e.id === selectedEvent);
  const tier = event?.tiers.find(t => t.id === selectedTier);
  const remaining = tier ? tier.capacity - tier.sold : 0;

  const handleMint = () => {
    setMinted(true);
    setTimeout(() => setMinted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Zap size={18} className="text-brand-600" /> Batch Mint Tickets
          </h2>
          <p className="text-xs text-gray-500 mt-1">Create DUAL tokens for an event tier. Each ticket becomes a unique on-chain asset.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => { setSelectedEvent(e.target.value); setSelectedTier(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">Select an event...</option>
              {demoEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled').map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Tier selector */}
          {event && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <div className="space-y-2">
                {event.tiers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTier(t.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedTier === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{t.name}</span>
                      <span className="text-sm font-bold">{formatCurrency(t.price)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{t.sold} sold / {t.capacity} capacity — {t.capacity - t.sold} remaining</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {tier && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={remaining}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Number(e.target.value), remaining))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <span className="text-sm text-gray-500">of {remaining} available</span>
              </div>
            </div>
          )}

          {/* Summary */}
          {tier && quantity > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">Mint Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Event</span>
                <span className="font-medium">{event?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tier</span>
                <span className="font-medium">{tier.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{quantity} tickets</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Template</span>
                <span className="font-mono text-xs">dual-tickets::event-ticket::v1</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                <span className="font-medium">Total Face Value</span>
                <span className="font-bold text-brand-600">{formatCurrency(tier.price * quantity)}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!tier || quantity < 1 || minted}
            onClick={handleMint}
          >
            {minted ? (
              <span className="flex items-center gap-2"><Check size={18} /> {quantity} Tickets Minted!</span>
            ) : (
              <span className="flex items-center gap-2"><Ticket size={18} /> Mint {quantity} Ticket{quantity > 1 ? 's' : ''}</span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
