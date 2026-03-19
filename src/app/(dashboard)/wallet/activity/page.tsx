'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate, truncateAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';

type TabType = 'all' | 'sent' | 'received';

interface Transfer {
  id: string;
  eventName: string;
  type: 'sent' | 'received';
  recipient: string;
  walletAddress: string;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
}

// Mock transfer data
const mockTransfers: Transfer[] = [
  {
    id: '1',
    eventName: 'Tame Impala — World Tour 2026',
    type: 'received',
    recipient: 'Alex Rodriguez',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc026e6f7D30f0',
    status: 'completed',
    timestamp: '2026-03-10T14:30:00Z',
  },
  {
    id: '2',
    eventName: 'Sydney FC vs Melbourne Victory',
    type: 'sent',
    recipient: 'Jordan Smith',
    walletAddress: '0x5f9B2A9F5B3C8D9E1F2G3H4I5J6K7L8M9N0O1P2Q',
    status: 'completed',
    timestamp: '2026-03-08T10:15:00Z',
  },
  {
    id: '3',
    eventName: 'Vivid Sydney 2026 — Opening Night',
    type: 'received',
    recipient: 'Casey Lee',
    walletAddress: '0x8c8D9F5B3C8D9E1F2G3H4I5J6K7L8M9N0O1P2Q',
    status: 'pending',
    timestamp: '2026-03-05T16:45:00Z',
  },
  {
    id: '4',
    eventName: 'AI & Web3 Summit 2026',
    type: 'sent',
    recipient: 'Morgan Davis',
    walletAddress: '0x9e9E0G6C4D9E1F2G3H4I5J6K7L8M9N0O1P2Q3R4',
    status: 'completed',
    timestamp: '2026-03-01T11:20:00Z',
  },
  {
    id: '5',
    eventName: 'Sunrise Yoga on Bondi Beach',
    type: 'sent',
    recipient: 'Taylor Wilson',
    walletAddress: '0x1a1A2H7D5E0F2G3H4I5J6K7L8M9N0O1P2Q3R4S5',
    status: 'cancelled',
    timestamp: '2026-02-28T09:00:00Z',
  },
];

export default function ActivityPage() {
  const [tab, setTab] = useState<TabType>('all');

  const filtered = mockTransfers.filter((t) => {
    if (tab === 'all') return true;
    return t.type === tab;
  });

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-gold-50 border-gold-200 text-gold-700';
    if (status === 'pending') return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-red-50 border-red-200 text-red-700';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'COMPLETED';
    if (status === 'pending') return 'PENDING';
    return 'CANCELLED';
  };

  return (
    <div className="pb-32 bg-background-light min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/wallet"
              className="p-2 -ml-2 text-slate-500 hover:text-primary-consumer transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-lg font-black text-slate-900 flex-1 text-center">Transfer History</h1>
            <button className="p-2 -mr-2 text-slate-500 hover:text-primary-consumer transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-3">
            {(['all', 'sent', 'received'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize',
                  tab === t
                    ? 'bg-primary-consumer text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transfer list */}
      <div className="px-4 space-y-3 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No transfers yet</p>
          </div>
        ) : (
          filtered.map((transfer: any) => (
            <div
              key={transfer.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              {/* Icon circle */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border',
                  transfer.type === 'sent'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-wine-50 border-wine-200 text-wine-700'
                )}
              >
                <span className="material-symbols-outlined text-lg">
                  {transfer.type === 'sent' ? 'north_east' : 'south_west'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-bold text-sm mb-1">{transfer.eventName}</p>
                <p className="text-slate-600 text-xs mb-1">
                  {transfer.type === 'sent' ? 'Sent to ' : 'Received from '}
                  <span className="font-semibold">@{transfer.recipient}</span>
                </p>
                <p className="text-slate-500 text-xs font-mono">{truncateAddress(transfer.walletAddress)}</p>
              </div>

              {/* Status and timestamp */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className={cn(
                    'inline-block px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide',
                    getStatusColor(transfer.status)
                  )}
                >
                  {getStatusLabel(transfer.status)}
                </span>
                <span className="text-slate-500 text-xs">{formatDate(transfer.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
