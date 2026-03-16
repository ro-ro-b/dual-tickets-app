'use client';

import { demoEvents, demoStats, demoTickets, demoActions } from '@/lib/demo-data';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatsCards } from '@/components/tickets/StatsCards';
import { EventStatusBadge, EventTypeBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { CalendarDays, Ticket, DollarSign, TrendingUp, Activity, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Events', value: demoStats.totalEvents, icon: <CalendarDays size={18} className="text-brand-600" />, color: 'bg-brand-50' },
    { label: 'Tickets Sold', value: demoStats.totalTicketsSold.toLocaleString(), icon: <Ticket size={18} className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Total Revenue', value: formatCurrency(demoStats.totalRevenue), change: demoStats.revenueChange, icon: <DollarSign size={18} className="text-amber-600" />, color: 'bg-amber-50' },
    { label: 'Active Events', value: demoStats.activeEvents, icon: <Zap size={18} className="text-purple-600" />, color: 'bg-purple-50' },
  ];

  const recentActions = [...demoActions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-gray-900">Events</h2>
            <Link href="/admin/events" className="text-xs text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoEvents.slice(0, 5).map((event) => {
              const sold = event.tiers.reduce((s, t) => s + t.sold, 0);
              const cap = event.tiers.reduce((s, t) => s + t.capacity, 0);
              const rev = event.tiers.reduce((s, t) => s + t.sold * t.price, 0);
              return (
                <Link href={`/admin/events/${event.id}`} key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <img src={event.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(event.date.start)} &middot; {event.venue.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(rev)}</p>
                    <p className="text-xs text-gray-500">{sold}/{cap}</p>
                  </div>
                  <EventStatusBadge status={event.status} />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${action.status === 'completed' ? 'bg-green-500' : action.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{action.description}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(action.timestamp)}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{action.type}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by tier type */}
      <Card>
        <CardHeader><h2 className="font-semibold text-gray-900">Revenue by Event</h2></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoEvents
              .map(e => ({ name: e.name, revenue: e.tiers.reduce((s, t) => s + t.sold * t.price, 0), type: e.type }))
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 6)
              .map((item, i) => {
                const maxRev = demoEvents.reduce((max, e) => Math.max(max, e.tiers.reduce((s, t) => s + t.sold * t.price, 0)), 0);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <EventTypeBadge type={item.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.name}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div
                          className="h-2 rounded-full bg-brand-500"
                          style={{ width: `${(item.revenue / maxRev) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{formatCurrency(item.revenue)}</span>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
