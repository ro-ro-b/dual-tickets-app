'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventPage() {
  const [tiers, setTiers] = useState([
    { name: 'General Admission', price: 49, capacity: 1000, description: '' },
    { name: 'VIP Backstage', price: 250, capacity: 50, description: '' },
  ]);

  const addTier = () => {
    setTiers([...tiers, { name: '', price: 0, capacity: 100, description: '' }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const totalCapacity = tiers.reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/admin/events" className="text-[#ec5b13] hover:text-orange-700">Events</Link>
        <span>/</span>
        <span>Create New Event</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-sm text-gray-600 mt-1">Set up a new ticketing event with tiers</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 border border-slate-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="px-6 py-3 bg-[#ec5b13] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm">
            Create Event & Mint
          </button>
        </div>
      </div>

      {/* Section 01: Event Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#ec5b13] text-white text-sm font-bold mr-3">01</span>
          Event Details
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Event Name</label>
            <input type="text" placeholder="e.g. Sydney Jazz Festival 2026" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea rows={4} placeholder="Describe your event..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13] bg-white">
                <option>Music</option>
                <option>Arts</option>
                <option>Sport</option>
                <option>Tech</option>
                <option>Food & Wine</option>
                <option>Wellness</option>
                <option>Adventure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Tags</label>
              <input type="text" placeholder="e.g. live-music, jazz" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 02: Schedule & Venue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#ec5b13] text-white text-sm font-bold mr-3">02</span>
          Schedule & Venue
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Start Date & Time</label>
              <input type="datetime-local" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">End Date & Time</label>
              <input type="datetime-local" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Venue Name</label>
            <input type="text" placeholder="e.g. Sydney Opera House" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
            <input type="text" placeholder="Street address, city, country" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Total Capacity</label>
            <input type="number" placeholder="e.g. 5000" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]" />
          </div>
        </div>
      </div>

      {/* Section 03: Ticketing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#ec5b13] text-white text-sm font-bold mr-3">03</span>
          Ticketing
        </h2>

        {/* Warning */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Blockchain Minting</p>
            <p className="text-xs text-amber-800 mt-1">Tickets will be minted on the blockchain immediately after event creation</p>
          </div>
        </div>

        {/* Tier Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tier Name</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price USD</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tiers.map((tier, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => {
                        const t = [...tiers];
                        t[i].name = e.target.value;
                        setTiers(t);
                      }}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => {
                        const t = [...tiers];
                        t[i].price = Number(e.target.value);
                        setTiers(t);
                      }}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={tier.capacity}
                      onChange={(e) => {
                        const t = [...tiers];
                        t[i].capacity = Number(e.target.value);
                        setTiers(t);
                      }}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => {
                        const t = [...tiers];
                        t[i].description = e.target.value;
                        setTiers(t);
                      }}
                      placeholder="What's included"
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {tiers.length > 1 && (
                      <button
                        onClick={() => removeTier(i)}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addTier}
          className="inline-flex items-center gap-2 text-[#ec5b13] hover:text-orange-700 font-medium text-sm"
        >
          <Plus size={16} />
          Add Tier
        </button>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total capacity: <span className="font-semibold text-gray-900">{totalCapacity.toLocaleString()} tickets</span>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 border border-slate-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Discard
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-[#ec5b13] to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Create Event & Mint Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bar */}
      <div className="h-24" />
    </div>
  );
}
