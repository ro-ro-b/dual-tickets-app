'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatCurrency, truncateAddress } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then(r => r.json())
      .then(d => setTicket(d.data || null))
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pb-32 bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="pb-32 bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Ticket not found</p>
      </div>
    );
  }

  const isValid = ticket.ticketData.status === 'valid';

  return (
    <div className="pb-32 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-950 border-b border-slate-800 z-40 px-4 py-4 flex items-center justify-between">
        <Link
          href="/wallet"
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-black text-white flex-1 text-center">Ticket Details</h1>
        <button className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4 pt-4">
        {/* Ticket Card */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 rounded-2xl overflow-hidden">
          {/* Header with tier label */}
          <div className="p-4 pb-2">
            <div className="inline-block px-3 py-1 bg-blue-600/30 border border-blue-500/30 rounded-full text-xs font-black text-blue-300 uppercase tracking-widest mb-3">
              {ticket.tierName}
            </div>
            <h2 className="text-xl font-black text-white">{ticket.ticketData.eventName}</h2>
          </div>

          {/* QR Code Area */}
          <div className="px-4 py-6">
            {isValid ? (
              <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center mb-3">
                <div className="grid grid-cols-8 gap-1 p-6">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-sm ${
                        Math.random() > 0.4 ? 'bg-slate-900' : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl h-48 flex items-center justify-center mb-3">
                <div className="text-center">
                  <span className="material-symbols-outlined text-slate-600 text-6xl block mb-2">
                    {ticket.ticketData.status === 'used' ? 'check_circle' : 'block'}
                  </span>
                  <p className="text-slate-400 text-sm">
                    {ticket.ticketData.status === 'used' ? 'Ticket Used' : 'QR Unavailable'}
                  </p>
                </div>
              </div>
            )}
            <p className="text-slate-300 text-xs text-center font-mono mb-2">{ticket.id}</p>
            <p className="text-slate-500 text-xs text-center">Scan at entry</p>
          </div>

          {/* Divider */}
          <div className="dotted-divider mx-4 my-2" />

          {/* Info Grid */}
          <div className="px-4 py-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 text-xs mb-1">Date</p>
              <p className="text-white font-semibold text-sm">{formatDate(ticket.ticketData.eventDate)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Time</p>
              <p className="text-white font-semibold text-sm">7:30 PM</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Venue</p>
              <p className="text-white font-semibold text-sm">{ticket.ticketData.venue}</p>
            </div>
            {ticket.ticketData.seatInfo && (
              <div>
                <p className="text-slate-500 text-xs mb-1">Seat</p>
                <p className="text-white font-semibold text-sm">{ticket.ticketData.seatInfo}</p>
              </div>
            )}
          </div>

          {/* Ticket ID and Purchase date */}
          <div className="px-4 py-3 border-t border-slate-700/50 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Ticket ID:</span>
              <span className="text-slate-300 font-mono">{ticket.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Purchased:</span>
              <span className="text-slate-300">{formatDate(ticket.ticketData.purchasedAt)}</span>
            </div>
          </div>
        </div>

        {/* Owner Badge */}
        <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
            A
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Your Wallet</p>
            <p className="text-slate-400 text-xs font-mono">{truncateAddress(ticket.ownerWallet)}</p>
          </div>
          <span className="inline-block px-2 py-1 bg-emerald-600/30 border border-emerald-500/30 rounded text-emerald-300 text-xs font-bold uppercase tracking-wider">
            DUAL Verified
          </span>
        </div>

        {/* Action buttons */}
        {isValid && (
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/50 transition-colors font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">swap_horiz</span>
              Transfer
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/50 transition-colors font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Download
            </button>
          </div>
        )}

        {/* Apple Wallet */}
        <button className="w-full bg-slate-900 border border-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">add_circle</span>
          Add to Apple Wallet
        </button>

        {/* Security notice */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex gap-3">
          <span className="material-symbols-outlined text-blue-400 flex-shrink-0 text-lg">shield_check</span>
          <div className="text-sm">
            <p className="text-white font-semibold mb-1">Secure & Verified</p>
            <p className="text-slate-400 text-xs">
              This ticket is cryptographically verified on the DUAL network. Learn more about ticket security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
