'use client';

import { formatDateTime } from '@/lib/utils';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WebhookEvent {
  id: number;
  event: string;
  payload: Record<string, any>;
  timestamp: string;
}

export default function WebhooksPage() {
  const [autoScroll, setAutoScroll] = useState(true);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch from /api/actions for webhook events
        const response = await fetch('/api/actions');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data || []);
      } catch (err: any) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const successRate = 99.8;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhook Events</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time event streaming and configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            {events.length > 0 ? 'Connected' : 'Listening for events...'}
          </span>
          <button className="px-6 py-2.5 bg-[#ec5b13] text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
            Add Endpoint
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          {/* Configuration Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">Webhook URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value="https://api.example.com/webhooks"
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-slate-200 rounded text-xs font-mono text-gray-600"
                  />
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 uppercase tracking-wide mb-2">SSE Endpoint</label>
                <input
                  type="text"
                  value="https://api.example.com/sse"
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-200 rounded text-xs font-mono text-gray-600"
                />
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-gold-600" />
                    <span className="text-sm text-gold-900">Verification</span>
                  </div>
                  <span className="text-xs font-semibold text-gold-700">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-gold-600" />
                    <span className="text-sm text-gold-900">Connection</span>
                  </div>
                  <span className="text-xs font-semibold text-gold-700">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Success Rate</h3>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-gray-900">{successRate}%</p>
              <p className="text-xs text-gray-600 mt-1">Delivery success</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Delivered</span>
                <span className="font-medium text-gray-900">9,847</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Failed</span>
                <span className="font-medium text-gray-900">19</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                <div className="h-2 rounded-full bg-[#ec5b13]" style={{ width: `${successRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Real-time Stream</h3>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                autoScroll
                  ? 'bg-[#ec5b13] text-white'
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              Auto-scroll
            </button>
          </div>

          {/* Terminal Style Stream */}
          <div className="flex-1 bg-slate-900 rounded-lg p-4 font-mono text-xs overflow-hidden flex flex-col">
            {/* macOS style buttons */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-gold-500" />
            </div>

            {/* Stream content */}
            <div className="flex-1 overflow-y-auto space-y-2 text-slate-300">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-slate-400">Listening for events...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <span className="text-slate-400">Waiting for webhook events...</span>
                </div>
              ) : (
                events.map((log) => (
                  <div key={log.id} className="space-y-1">
                    <div>
                      <span className="text-gold-400">{`[${formatDateTime(log.timestamp)}]`}</span>
                      <span className={log.event.startsWith('TICKET') ? ' text-gold-300' : ' text-blue-300'}>
                        {` → ${log.event}`}
                      </span>
                    </div>
                    <div className="ml-4 text-slate-400">
                      {`{`}
                      <div className="ml-4 space-y-0.5">
                        {Object.entries(log.payload).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-purple-300">"{key}"</span>
                            <span className="text-slate-300">: </span>
                            <span className="text-yellow-300">
                              {typeof value === 'string' ? `"${value}"` : String(value)}
                            </span>
                            <span className="text-slate-300">,</span>
                          </div>
                        ))}
                      </div>
                      <div>{`}`}</div>
                    </div>
                  </div>
                ))
              )}
              {/* Blinking cursor */}
              <div className="flex items-center gap-1">
                <span className="text-slate-300">{">"}</span>
                <span className="w-2 h-4 bg-slate-300 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
