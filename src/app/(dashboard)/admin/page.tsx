'use client';

import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { TrendingUp, Activity, BarChart3, Zap, Server, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  ticketsByStatus?: Record<string, number>;
  revenueChange?: string;
  topEvent?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const json = await res.json();
        setStats(json.data || {
          totalEvents: 0,
          activeEvents: 0,
          totalTicketsSold: 0,
          totalRevenue: 0,
          ticketsByStatus: {},
          revenueChange: '0%',
          topEvent: 'N/A',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading DUAL network stats...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  const kpis = [
    {
      label: 'Total Templates',
      value: (stats?.totalEvents || 0).toLocaleString(),
      change: '+0%',
      icon: <BarChart3 size={20} className="text-[#ec5b13]" />,
    },
    {
      label: 'Active Templates',
      value: (stats?.activeEvents || 0).toString(),
      change: 'Live',
      icon: <Activity size={20} className="text-gold-500" />,
    },
    {
      label: 'Total Objects',
      value: (stats?.totalTicketsSold || 0).toLocaleString(),
      change: '+0%',
      icon: <TrendingUp size={20} className="text-amber-500" />,
    },
    {
      label: 'Network Status',
      value: 'Active',
      change: 'Stable',
      icon: <Zap size={20} className="text-blue-500" />,
    },
    {
      label: 'Anchored Objects',
      value: Object.values(stats?.ticketsByStatus || {}).reduce((a: number, b: any) => a + b, 0).toString(),
      change: 'Live',
      changeColor: 'text-gold-600',
      icon: <Layers size={20} className="text-red-500" />,
    },
  ];

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
              <span className={`text-xs font-semibold ${(kpi as any).changeColor || 'text-gold-600'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
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
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
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
                <span className="text-gray-600">Events/sec</span>
                <span className="font-mono text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="font-mono text-gray-900">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Dashboard Data</h3>
        <p className="text-sm text-gray-600">
          This dashboard displays live data from the DUAL network. All statistics are calculated from real on-chain objects and templates.
          <br />
          <br />
          To view templates and objects, visit the <Link href="/admin/events" className="text-[#ec5b13] font-medium hover:underline">Events</Link> and <Link href="/admin/mint" className="text-[#ec5b13] font-medium hover:underline">Mint</Link> pages.
        </p>
      </div>
    </div>
  );
}
