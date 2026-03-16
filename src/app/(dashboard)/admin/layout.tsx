'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Bell, Search } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    {
      section: 'MAIN MENU',
      items: [
        { label: 'Events', href: '/admin/events', icon: 'calendar_today' },
        { label: 'Operations', href: '/admin/orders', icon: 'settings' },
        { label: 'Scanning', href: '/admin/scanning', icon: 'dns' },
      ],
    },
    {
      section: 'ANALYTICS',
      items: [
        { label: 'Reports', href: '/admin', icon: 'assessment' },
        { label: 'Webhooks', href: '/admin/webhooks', icon: 'people' },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname === '/admin/';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#f8f6f6] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col overflow-hidden border-r border-slate-800`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#ec5b13] flex items-center justify-center font-bold text-white">
              D
            </div>
            <div>
              <p className="font-bold text-white">DUAL Tickets</p>
              <p className="text-xs text-slate-400">ADMIN PORTAL</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navItems.map((section) => (
            <div key={section.section}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">
                {section.section}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                      isActive(item.href)
                        ? 'bg-[#ec5b13] text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ec5b13] to-orange-700 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X size={20} className="text-gray-600" />
            ) : (
              <Menu size={20} className="text-gray-600" />
            )}
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 text-sm text-gray-600">
            <span className="text-gray-400">Admin</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">
              {pathname === '/admin' || pathname === '/admin/'
                ? 'Dashboard'
                : pathname.includes('/events')
                ? 'Events'
                : pathname.includes('/orders')
                ? 'Orders'
                : pathname.includes('/scanning')
                ? 'Scanning'
                : pathname.includes('/webhooks')
                ? 'Webhooks'
                : 'Page'}
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ec5b13]"
              />
            </div>
          </div>

          {/* Notification */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
