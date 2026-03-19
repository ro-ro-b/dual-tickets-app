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
    if (status === 'completed') return 'bg-emerald-600/20 border-emerald-500/30 text-emerald-300';
    if (status === 'pending') return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300';
    return 'bg-red-600/20 border-red-500/30 text-red-300';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'COMPLETED';
    if (status === 'pending') return 'PENDING';
    return 'CANCELLED';
  };

  return (
    <div className="pb-32 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-950 border-b border-slate-800 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/wallet"
              className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-lg font-black text-white flex-1 text-center">Transfer History</h1>
            <button className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors">
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
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
            <p className="text-slate-400">No transfers yet</p>
          </div>
        ) : (
          filtered.map((transfer: any) => (
            <div
              key={transfer.id}
              className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors"
            >
              {/* Icon circle */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                  transfer.type === 'sent'
                    ? 'bg-red-600/20 border border-red-500/30'
                    : 'bg-emerald-600/20 border border-emerald-500/30'
                )}
              >
                <span className="material-symbols-outlined text-lg">
                  {transfer.type === 'sent' ? 'north_east' : 'south_west'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm mb-1">{transfer.eventName}</p>
                <p className="text-slate-400 text-xs mb-1">
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
