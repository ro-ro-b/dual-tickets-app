'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatCurrency, truncateAddress } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then(r => r.json())
      .then(d => setTicket(d.data || null))
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text: string, hashType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hashType);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (loading) {
    return (
      <div className="pb-32 bg-background-light min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading token...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="pb-32 bg-background-light min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Token not found</p>
      </div>
    );
  }

  const isValid = ticket.ticketData.status === 'valid';
  const isAnchored = ticket.onChainStatus === 'anchored';

  return (
    <div className="pb-32 bg-background-light min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 z-40">
        <div className="px-4 py-4 flex items-center justify-between">
          <Link
            href="/wallet"
            className="p-2 -ml-2 text-slate-500 hover:text-primary-consumer transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-lg font-black text-slate-900 flex-1 text-center">Token Details</h1>
          <button className="p-2 -mr-2 text-slate-500 hover:text-primary-consumer transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4 pt-4">
        {/* Hero Section with Image */}
        <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-wine-100 to-wine-50">
          {ticket.faces[0] && (
            <img
              src={ticket.faces[0].url}
              alt={ticket.ticketData.eventName}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

          {/* Chain Status Badge - Overlay */}
          {isAnchored && (
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-gold-50 backdrop-blur border border-gold-200 rounded-lg animate-pulse">
                <span className="inline-block w-2 h-2 bg-gold-700 rounded-full"></span>
                <p className="text-gold-700 font-mono text-sm font-bold">ANCHORED</p>
              </div>
            </div>
          )}

          {/* Token ID Badge */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-3 py-2">
            <p className="text-primary-consumer font-mono text-sm font-semibold">ID: {ticket.id.slice(-8)}</p>
          </div>
        </div>

        {/* Token Identity Section */}
        <div className="bg-gradient-to-br from-wine-50 to-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="space-y-3">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Token Name</p>
              <h2 className="text-2xl font-black text-slate-900">{ticket.ticketData.eventName}</h2>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div>
                <p className="text-slate-500 text-xs mb-1">Category</p>
                <p className="text-slate-700 font-semibold text-sm">{ticket.tierName}</p>
              </div>
              <div className="flex-1">
                <p className="text-slate-500 text-xs mb-1">Network</p>
                <p className="text-slate-700 font-semibold text-sm">{ticket.ticketData.venue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hash Inspection Section */}
        <div className="space-y-3">
          <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">verified_user</span>
            Cryptographic Hashes
          </h3>

          {/* Content Hash */}
          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Content Hash</p>
                <p className="text-slate-700 font-mono text-xs mt-1 break-all leading-relaxed">
                  {ticket.contentHash || 'pending'}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(ticket.contentHash || '', 'content')}
                className="ml-2 p-2 hover:bg-gold-100 rounded transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-gold-600 hover:text-gold-700 text-sm">
                  {copiedHash === 'content' ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            {ticket.explorerLinks?.contentHash && (
              <a
                href={ticket.explorerLinks.contentHash}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-gold-100 border border-gold-300 rounded text-gold-700 text-xs font-semibold hover:bg-gold-200 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View on DUAL
              </a>
            )}
          </div>

          {/* Integrity Hash */}
          {ticket.integrityHash && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Integrity Hash</p>
                  <p className="text-slate-700 font-mono text-xs mt-1 break-all leading-relaxed">
                    {ticket.integrityHash}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(ticket.integrityHash || '', 'integrity')}
                  className="ml-2 p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-slate-500 hover:text-slate-700 text-sm">
                    {copiedHash === 'integrity' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
              {ticket.explorerLinks?.integrityHash && (
                <a
                  href={ticket.explorerLinks.integrityHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs font-semibold hover:bg-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View on DUAL
                </a>
              )}
            </div>
          )}
        </div>

        {/* Owner Section */}
        <div className="space-y-3">
          <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            Owner Information
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Wallet Address</p>
                <p className="text-slate-700 font-mono text-xs break-all leading-relaxed">
                  {ticket.ownerWallet}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(ticket.ownerWallet || '', 'owner')}
                className="ml-2 p-2 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-slate-500 hover:text-slate-700 text-sm">
                  {copiedHash === 'owner' ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            {ticket.explorerLinks?.owner && (
              <a
                href={ticket.explorerLinks.owner}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-slate-200 border border-slate-300 rounded text-slate-700 text-xs font-semibold hover:bg-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View on DUAL
              </a>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-3">
          <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">schedule</span>
            Token Timeline
          </h3>

          <div className="bg-gradient-to-br from-gold-50 to-gold-100/50 border border-gold-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gold-700 text-sm">check_circle</span>
              </div>
              <div>
                <p className="text-slate-600 text-xs">Created</p>
                <p className="text-slate-900 font-semibold text-sm">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            {ticket.updatedAt !== ticket.createdAt && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-gold-700 text-sm">update</span>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Last Updated</p>
                  <p className="text-slate-900 font-semibold text-sm">{formatDate(ticket.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-gradient-to-r from-gold-50 to-gold-100/50 border border-gold-200 rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-gold-700 flex-shrink-0 text-xl">shield_check</span>
          <div className="text-sm">
            <p className="text-gold-700 font-semibold mb-1">Blockchain Verified Asset</p>
            <p className="text-gold-700/80 text-xs">
              This token is cryptographically verified and immutably anchored on the DUAL Network via DUAL.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {isValid && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 px-4 py-3 wine-gradient text-white border border-primary-consumer rounded-xl hover:shadow-lg transition-all font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">swap_horiz</span>
              Transfer
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gold-50 border border-gold-200 text-gold-700 rounded-xl hover:bg-gold-100 transition-all font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Export
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
