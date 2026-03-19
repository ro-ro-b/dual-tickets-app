'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, User } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await fetch('/api/wallet', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setWallet(data.wallet || null);
        }
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const getTitle = () => {
    if (pathname === '/wallet') return 'My Tickets';
    if (pathname.startsWith('/wallet/discover')) return 'Discover Events';
    if (pathname.startsWith('/wallet/marketplace')) return 'Marketplace';
    if (pathname.startsWith('/wallet/activity')) return 'Activity';
    if (pathname.startsWith('/wallet/ticket')) return 'Ticket Detail';
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.startsWith('/admin/events/new')) return 'Create Event';
    if (pathname.startsWith('/admin/events')) return 'Events';
    if (pathname.startsWith('/admin/mint')) return 'Mint Tickets';
    if (pathname.startsWith('/admin/webhooks')) return 'Webhooks';
    if (pathname.startsWith('/admin/templates')) return 'Templates';
    return 'DUAL Tickets';
  };

  const displayName = wallet ? 'Connected' : 'Guest';
  const displayAddress = wallet || 'Not connected';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-48"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Wallet */}
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <User size={16} className="text-brand-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 font-mono">
              {loading ? 'Loading...' : truncateAddress(displayAddress)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
