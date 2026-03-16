'use client';

import { demoStats, demoEvents } from '@/lib/demo-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { TrendingUp, Activity, BarChart3, Zap, Server, Layers } from 'lucide-react';

export default function AdminDashboardPage() {
  // KPI Cards Data
  const kpis = [
    {
      label: 'Total Events',
      value: demoStats.totalEvents.toLocaleString(),
      change: '+12%',
      icon: <BarChart3 size={20} className="text-[#ec5b13]" />,
    },
    {
      label: 'Tickets Sold',
      value: demoStats.totalTicketsSold.toLocaleString(),
      change: '+8%',
      icon: <Activity size={20} className="text-emerald-500" />,
    },
    {
      label: 'Revenue',
      value: formatCurrency(demoStats.totalRevenue),
      change: '+24%',
      icon: <TrendingUp size={20} className="text-amber-500" />,
    },
    {
      label: 'Active Events',
      value: demoStats.activeEvents.toString(),
      change: 'Stable',
      icon: <Zap size={20} className="text-blue-500" />,
    },
    {
      label: 'Check-ins Today',
      value: '1,120',
      change: 'Live',
      changeColor: 'text-red-500',
      icon: <Layers size={20} className="text-red-500" />,
    },
  ];

  // Sales by Event Category
  const salesByCategory = [
    { category: 'Music', value: 8420, percent: 32 },
    { category: 'Sports', value: 6210, percent: 24 },
    { category: 'Theatre', value: 4800, percent: 18 },
    { category: 'Comedy', value: 3150, percent: 12 },
    { category: 'Festival', value: 2900, percent: 11 },
  ];

  const maxSales = 8420;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>{kpi.icon}</div>
              <span className={`text-xs font-semibold ${kpi.changeColor || 'text-emerald-600'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Event */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Sales by Event</h3>
          <div className="space-y-4">
            {salesByCategory.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  <span className="text-sm text-gray-600">{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#ec5b13]"
                    style={{ width: `${(item.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Revenue Distribution</h3>
          <div className="space-y-3">
            {['January', 'February', 'March', 'April', 'May'].map((month, i) => {
              const baseValue = 45000 + i * 5000;
              return (
                <div key={month}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">{month}</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {formatCurrency(baseValue)}
                    </span>
                  </div>
                  <div className="h-6 bg-slate-50 rounded-lg overflow-hidden flex">
                    <div
                      className="bg-[#ec5b13]"
                      style={{ width: '40%' }}
                    />
                    <div
                      className="bg-emerald-500"
                      style={{ width: '35%' }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{ width: '25%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DUAL Network Integration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-6">DUAL Network Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Core API Gateway */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-[#ec5b13]" />
              <h4 className="font-medium text-gray-900">Core API Gateway</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  OPERATIONAL
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Latency</span>
                <span className="font-mono text-gray-900">42ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="font-mono text-gray-900">99.99%</span>
              </div>
            </div>
          </div>

          {/* Blockchain Node */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-blue-500" />
              <h4 className="font-medium text-gray-900">Blockchain Node</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  SYNCED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Block Height</span>
                <span className="font-mono text-gray-900">#18,492,031</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Validator</span>
                <span className="font-mono text-gray-900">Active</span>
              </div>
            </div>
          </div>

          {/* Webhooks Relay */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-amber-500" />
              <h4 className="font-medium text-gray-900">Webhooks Relay</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  LISTENING
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Queued</span>
                <span className="font-mono text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Failure Rate</span>
                <span className="font-mono text-gray-900">0.02%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pb-4">
        © 2024 DUAL Tickets. Built on DUAL Protocol.
      </div>
    </div>
  );
}
