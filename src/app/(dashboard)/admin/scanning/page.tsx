'use client';

import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import { Search, RefreshCw, CheckCircle2, AlertCircle, Clock, Activity } from 'lucide-react';

const mockScans = [
  { id: 'scan-2901', status: 'VALID', ticketId: 'TKT-89234', holder: 'Sarah Chen', zone: 'Section A, Row 12', timestamp: '2026-03-16T14:45:23Z' },
  { id: 'scan-2900', status: 'VIP', ticketId: 'TKT-89233', holder: 'Michael Smith', zone: 'VIP Lounge', timestamp: '2026-03-16T14:44:15Z' },
  { id: 'scan-2899', status: 'VALID', ticketId: 'TKT-89232', holder: 'Jessica Brown', zone: 'Section B, Row 8', timestamp: '2026-03-16T14:43:42Z' },
  { id: 'scan-2898', status: 'ALREADY_USED', ticketId: 'TKT-89231', holder: 'David Wilson', zone: 'Section C, Row 5', timestamp: '2026-03-16T14:42:10Z' },
  { id: 'scan-2897', status: 'VIP', ticketId: 'TKT-89230', holder: 'Emily Rodriguez', zone: 'VIP Lounge', timestamp: '2026-03-16T14:41:35Z' },
  { id: 'scan-2896', status: 'INVALID', ticketId: 'TKT-89229', holder: 'James Park', zone: 'Denied', timestamp: '2026-03-16T14:40:12Z' },
];

const statusConfig = {
  VALID: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Valid' },
  VIP: { color: 'bg-amber-100 text-amber-700', icon: Activity, label: 'VIP' },
  ALREADY_USED: { color: 'bg-orange-100 text-orange-700', icon: Clock, label: 'Already Used' },
  INVALID: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Invalid' },
};

export default function ScanningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('vivid-sydney');

  const filteredScans = mockScans.filter((scan) =>
    scan.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.holder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCheckIns = 1842;
  const capacity = 2500;
  const checkInPercent = (totalCheckIns / capacity) * 100;

  const validScans = filteredScans.filter((s) => s.status === 'VALID').length;
  const vipScans = filteredScans.filter((s) => s.status === 'VIP').length;
  const failedScans = filteredScans.filter((s) => s.status === 'INVALID').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Live Check-in Monitoring</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE SYSTEM CONNECTED
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Real-time venue scanning and check-in data</p>
        </div>
      </div>

      {/* Event Selector and Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
          >
            <option value="vivid-sydney">Vivid Sydney 2026 — Opening Night</option>
            <option value="tame-impala">Tame Impala — World Tour 2026</option>
            <option value="nba-finals">NBA Finals 2026 — Game 7</option>
          </select>
        </div>
        <button className="px-6 py-2.5 bg-[#ec5b13] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-sm">
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Check-ins with Progress */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Total Check-ins</p>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">{totalCheckIns.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">of {capacity.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#ec5b13] to-orange-600"
              style={{ width: `${checkInPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 font-medium">{Math.round(checkInPercent)}% capacity</p>
        </div>

        {/* Gate Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Gate Activity</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Scanners</span>
              <span className="text-lg font-bold text-gray-900">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Processing</span>
              <span className="text-lg font-bold text-gray-900">12.4s</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <p className="text-xs text-gray-600 mb-1">VIP Scans</p>
                <p className="text-lg font-bold text-amber-600">{vipScans}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Failed Scans</p>
                <p className="text-lg font-bold text-red-600">{failedScans}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Traffic Trend */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">Live Traffic Trend</p>
          <div className="space-y-3">
            {[12, 15, 8, 14, 11, 18, 16].map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded h-2 overflow-hidden">
                  <div
                    className="h-2 bg-[#ec5b13] rounded"
                    style={{ width: `${(val / 20) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-6 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Scan Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Real-time Scan Feed</h2>
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search scans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
          {filteredScans.map((scan) => {
            const config = statusConfig[scan.status as keyof typeof statusConfig];
            const Icon = config.icon;
            return (
              <div key={scan.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${config.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{scan.holder}</p>
                        <p className="text-xs text-gray-600 font-mono">{scan.ticketId}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{scan.zone}</span>
                      <span className="font-mono">{formatDateTime(scan.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <button className="text-[#ec5b13] hover:text-orange-700 text-sm font-medium">
          VIEW ALL SESSION HISTORY
        </button>
      </div>
    </div>
  );
}
