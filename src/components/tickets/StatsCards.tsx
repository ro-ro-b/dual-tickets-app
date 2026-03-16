'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Ticket, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

export function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{stat.value}</p>
              {stat.change && (
                <p className="text-xs text-green-600 font-medium mt-0.5">{stat.change}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ConsumerStats({ ticketCount, upcomingCount, totalSpent }: { ticketCount: number; upcomingCount: number; totalSpent: number }) {
  const stats: Stat[] = [
    { label: 'Total Tickets', value: ticketCount, icon: <Ticket size={18} className="text-brand-600" />, color: 'bg-brand-50' },
    { label: 'Upcoming', value: upcomingCount, icon: <Calendar size={18} className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: <DollarSign size={18} className="text-amber-600" />, color: 'bg-amber-50' },
    { label: 'Portfolio Value', value: formatCurrency(totalSpent * 1.12), change: '+12%', icon: <TrendingUp size={18} className="text-purple-600" />, color: 'bg-purple-50' },
  ];

  return <StatsCards stats={stats} />;
}
