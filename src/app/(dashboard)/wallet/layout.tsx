'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function WalletLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/wallet', label: 'Tickets', icon: 'confirmation_number' },
    { href: '/wallet/discover', label: 'Discover', icon: 'explore' },
    { href: '/wallet/scan', label: 'SCAN', icon: 'qr_code_2', isScan: true },
    { href: '/wallet/activity', label: 'Transfers', icon: 'swap_horiz' },
    { href: '/wallet/profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <div className="mx-auto max-w-7xl min-h-screen bg-background-light flex flex-col md:flex-row relative shadow-2xl">
      {/* Main content - adjust for sidebar on desktop */}
      <div className="flex-1 overflow-y-auto md:flex-1">
        {children}
      </div>

      {/* Bottom navigation on mobile, sidebar on desktop */}
      <nav className="fixed bottom-0 left-0 right-0 md:static bg-white/95 backdrop-blur-md border-t border-slate-200 md:border-t-0 md:border-l md:border-l-slate-200 z-50 md:h-screen md:flex md:flex-col md:w-24">
        {/* Mobile bottom nav */}
        <div className="md:hidden flex items-center justify-between relative h-20 px-2">
          {/* Left items (0-1) */}
          <div className="flex gap-2 flex-1">
            {navItems.slice(0, 2).map(( item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all ${
                  isActive(item.href)
                    ? 'text-primary-consumer'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Center SCAN button - elevated with gold accent */}
          <Link
            href="/wallet/scan"
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2
              flex items-center justify-center w-16 h-16
              rounded-full wine-gradient
              border-4 border-background-light
              shadow-lg hover:shadow-lg
              text-white font-bold transition-all hover:scale-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl">qr_code_2</span>
          </Link>

          {/* Right items (3-4) */}
          <div className="flex gap-2 flex-1 justify-end">
            {navItems.slice(3).map(( item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all ${
                  isActive(item.href)
                    ? 'text-primary-consumer'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop sidebar nav */}
        <div className="hidden md:flex md:flex-col md:flex-1 md:items-center md:gap-2 md:py-4">
          {navItems.map(( item: any) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 p-3 transition-all ${
                isActive(item.href)
                  ? 'text-primary-consumer'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title={item.label}
            >
              {item.isScan ? (
                <div className="w-14 h-14 rounded-full wine-gradient flex items-center justify-center text-white shadow-lg hover:shadow-lg transition-all hover:scale-110 active:scale-95">
                  <span className="material-symbols-outlined text-2xl">
                    {item.icon}
                  </span>
                </div>
              ) : (
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
