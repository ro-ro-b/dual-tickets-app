'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tickets')
      .then((r) => r.json())
      .then((d) => setTickets(d.data || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background-light p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary-consumer">DUAL Tickets Demo</h1>
          <p className="text-slate-500 mt-1">Scan any QR code to claim a ticket to your session wallet</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading tickets from DUAL network...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-slate-400">No tickets found. Mint some tickets via the admin dashboard first.</p>
            <Link href="/admin" className="inline-block mt-4 text-primary-consumer underline">
              Go to Admin →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket: any) => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="wine-gradient p-4 text-center">
                  <span className="text-2xl">🎫</span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {ticket.ticketData?.eventName || 'DUAL Ticket'}
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-center">
                    <img
                      src={`/api/qr/${ticket.id}`}
                      alt={`QR for ${ticket.id}`}
                      className="w-48 h-48"
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    {ticket.onChainStatus === 'anchored' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gold-500/10 border border-gold-500/30 text-gold-700 px-2.5 py-1 rounded-full">
                        ⛓ Anchored
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 text-center font-mono truncate">
                    {ticket.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
