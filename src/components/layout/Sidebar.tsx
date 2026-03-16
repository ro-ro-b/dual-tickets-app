'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Ticket,
  Compass,
  Store,
  Activity,
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Webhook,
  FileCode,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const consumerNav: NavItem[] = [
  { label: 'My Tickets', href: '/wallet', icon: <Ticket size={20} /> },
  { label: 'Discover', href: '/wallet/discover', icon: <Compass size={20} /> },
  { label: 'Marketplace', href: '/wallet/marketplace', icon: <Store size={20} /> },
  { label: 'Activity', href: '/wallet/activity', icon: <Activity size={20} /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Events', href: '/admin/events', icon: <CalendarDays size={20} /> },
  { label: 'Mint Tickets', href: '/admin/mint', icon: <PlusCircle size={20} /> },
  { label: 'Webhooks', href: '/admin/webhooks', icon: <Webhook size={20} /> },
  { label: 'Templates', href: '/admin/templates', icon: <FileCode size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = pathname.startsWith('/admin');
  const nav = isAdmin ? adminNav : consumerNav;

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <Ticket size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-gray-900 text-sm">DUAL</span>
              <span className="font-medium text-brand-600 text-sm ml-1">Tickets</span>
            </div>
          )}
        </div>
      </div>

      {/* Role switcher */}
      <div className="px-3 py-3 border-b border-gray-100">
        <div className={cn('flex gap-1', collapsed && 'flex-col')}>
          <Link
            href="/wallet"
            className={cn(
              'flex-1 text-center text-xs font-medium py-1.5 rounded-md transition-colors',
              !isAdmin ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700',
              collapsed && 'px-1',
            )}
          >
            {collapsed ? 'C' : 'Consumer'}
          </Link>
          <Link
            href="/admin"
            className={cn(
              'flex-1 text-center text-xs font-medium py-1.5 rounded-md transition-colors',
              isAdmin ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700',
              collapsed && 'px-1',
            )}
          >
            {collapsed ? 'A' : 'Admin'}
          </Link>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/wallet' && item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span>Collapse</span></>}
        </button>
      </div>

      {/* DUAL branding */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-mono">Powered by DUAL Protocol</p>
        </div>
      )}
    </aside>
  );
}
