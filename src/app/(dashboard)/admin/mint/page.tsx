'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Check, Ticket, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
}

export default function MintPage() {
  const [events, setEvents] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch templates');
        const json = await res.json();
        setEvents(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleMint = async () => {
    if (!selectedTemplate) return;

    setMinting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: selectedTemplate,
          quantity,
          metadata: {
            quantity,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to mint tickets');
      setMinted(true);
      setTimeout(() => setMinted(false), 3000);
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint tickets');
    } finally {
      setMinting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading templates from DUAL network...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Zap size={18} className="text-brand-600" /> Mint DUAL Tokens
          </h2>
          <p className="text-xs text-gray-500 mt-1">Create new objects from an existing template on the DUAL network. Each minted object becomes a unique on-chain asset.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e: any) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">Select a template...</option>
              {events.map((tmpl: any) => (
                <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          {selectedTemplate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={quantity}
                  onChange={(e: any) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <span className="text-sm text-gray-500">objects to mint</span>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedTemplate && quantity > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">Mint Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Template</span>
                <span className="font-medium">{events.find((e: any) => e.id === selectedTemplate)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Template ID</span>
                <span className="font-mono text-xs">{selectedTemplate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{quantity} object{quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                <span className="font-medium">Total Objects</span>
                <span className="font-bold text-brand-600">{quantity}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedTemplate || quantity < 1 || minting || minted}
            onClick={handleMint}
          >
            {minted ? (
              <span className="flex items-center gap-2"><Check size={18} /> {quantity} Object{quantity > 1 ? 's' : ''} Minted!</span>
            ) : minting ? (
              <span>Minting...</span>
            ) : (
              <span className="flex items-center gap-2"><Ticket size={18} /> Mint {quantity} Object{quantity > 1 ? 's' : ''}</span>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            Minting creates new objects on the DUAL network based on your selected template. Each object is assigned a unique ID and anchored to the blockchain.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
