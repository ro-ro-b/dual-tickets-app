'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [tiers, setTiers] = useState([
    { name: 'General Admission', price: 50, capacity: 1000, description: '', perks: '' },
  ]);

  const addTier = () => {
    setTiers([...tiers, { name: '', price: 0, capacity: 100, description: '', perks: '' }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    setCreated(true);
    setTimeout(() => setCreated(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              step === s ? 'bg-brand-600 text-white' : step > s ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {step > s ? <Check size={14} /> : s}
            {s === 1 ? 'Details' : s === 2 ? 'Tiers' : 'Review'}
          </button>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Event Details</h2></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input type="text" placeholder="e.g. Sydney Jazz Festival 2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                  <option>Concert</option>
                  <option>Festival</option>
                  <option>Sport</option>
                  <option>Conference</option>
                  <option>Experience</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                  <option>Music</option>
                  <option>Arts</option>
                  <option>Sport</option>
                  <option>Tech</option>
                  <option>Food & Wine</option>
                  <option>Wellness</option>
                  <option>Adventure</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
              <input type="text" placeholder="e.g. Sydney Opera House" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" placeholder="Sydney" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" placeholder="Australia" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} placeholder="Describe your event..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                Enable resale
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Max markup:</label>
                <input type="number" defaultValue={150} min={100} max={300} className="w-20 px-2 py-1 border border-gray-300 rounded text-sm" />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>Next: Tiers</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-gray-900">Ticket Tiers</h2>
            <Button variant="outline" size="sm" onClick={addTier}><Plus size={14} className="mr-1" /> Add Tier</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {tiers.map((tier, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Tier {i + 1}</p>
                  {tiers.length > 1 && (
                    <button onClick={() => removeTier(i)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                    <input type="text" value={tier.name} onChange={(e) => { const t = [...tiers]; t[i].name = e.target.value; setTiers(t); }} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                    <input type="number" value={tier.price} onChange={(e) => { const t = [...tiers]; t[i].price = Number(e.target.value); setTiers(t); }} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Capacity</label>
                    <input type="number" value={tier.capacity} onChange={(e) => { const t = [...tiers]; t[i].capacity = Number(e.target.value); setTiers(t); }} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <input type="text" value={tier.description} onChange={(e) => { const t = [...tiers]; t[i].description = e.target.value; setTiers(t); }} placeholder="What's included" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
                </div>
              </div>
            ))}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next: Review</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Review & Create</h2></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This will create a new event with {tiers.length} tier{tiers.length > 1 ? 's' : ''} and
              a total capacity of {tiers.reduce((s, t) => s + t.capacity, 0).toLocaleString()} tickets.
              Each ticket will be minted as a unique DUAL token.
            </p>
            <div className="space-y-2">
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{tier.name || `Tier ${i + 1}`}</p>
                    <p className="text-xs text-gray-500">{tier.capacity} tickets</p>
                  </div>
                  <p className="font-bold">${tier.price}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleCreate} disabled={created}>
                {created ? <span className="flex items-center gap-2"><Check size={16} /> Event Created!</span> : 'Create Event'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
