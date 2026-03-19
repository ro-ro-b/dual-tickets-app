'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Phase = 'verifying' | 'info' | 'claiming' | 'success' | 'already_claimed' | 'error';

export default function ClaimPage() {
  const { objectId } = useParams<{ objectId: string }>();
  const [phase, setPhase] = useState<Phase>('verifying');
  const [ticket, setTicket] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!objectId) return;
    fetch(`/api/tickets/${objectId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setTicket(d.data);
          setPhase('info');
        } else {
          setError('Ticket not found on the DUAL network.');
          setPhase('error');
        }
      })
      .catch(() => {
        setError('Could not verify this ticket.');
        setPhase('error');
      });
  }, [objectId]);

  const handleClaim = async () => {
    setPhase('claiming');
    try {
      const res = await fetch('/api/wallet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectId }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setPhase('already_claimed');
      } else if (res.ok) {
        setPhase('success');
      } else {
        setError(data.error || 'Claim failed');
        setPhase('error');
      }
    } catch {
      setError('Network error during claim.');
      setPhase('error');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Verifying */}
        {phase === 'verifying' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full wine-gradient flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl">🎫</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Verifying Ticket</h2>
            <p className="text-sm text-slate-500 mt-2">Checking the DUAL blockchain...</p>
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-consumer"
                  style={{ animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info / Ready to claim */}
        {phase === 'info' && ticket && (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="wine-gradient p-6 text-center">
              <span className="text-4xl">🎫</span>
              <h2 className="text-lg font-bold text-white mt-2">{ticket.ticketData?.eventName || 'DUAL Ticket'}</h2>
              <p className="text-wine-200 text-sm mt-1">{ticket.ticketData?.venue || 'DUAL Network'}</p>
            </div>

            <div className="p-6 space-y-4">
              {ticket.onChainStatus === 'anchored' && (
                <div className="flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-xl px-4 py-3">
                  <span className="text-gold-600 text-lg">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-gold-800">Blockchain Verified</p>
                    <p className="text-xs text-gold-600">Anchored on BLOCKv EVM</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{ticket.ticketData?.status || 'valid'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">On-Chain</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{ticket.onChainStatus || 'pending'}</p>
                </div>
              </div>

              <button
                onClick={handleClaim}
                className="w-full py-4 rounded-2xl wine-gradient text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
              >
                Claim to My Wallet
              </button>
              <p className="text-xs text-slate-400 text-center">
                This ticket will be added to your session wallet
              </p>
            </div>
          </div>
        )}

        {/* Claiming */}
        {phase === 'claiming' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center animate-spin">
              <span className="text-white text-2xl">⛓️</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Claiming Ticket</h2>
            <p className="text-sm text-slate-500 mt-2">Adding to your session wallet...</p>
          </div>
        )}

        {/* Success */}
        {phase === 'success' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold-100 border-4 border-gold-300 flex items-center justify-center">
              <span className="text-gold-600 text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ticket Claimed!</h2>
            <p className="text-sm text-slate-500 mt-2">
              {ticket?.ticketData?.eventName || 'Your ticket'} is now in your wallet.
            </p>
            <Link
              href="/wallet"
              className="inline-block mt-6 px-8 py-3 rounded-2xl wine-gradient text-white font-bold hover:opacity-90 transition-opacity"
            >
              View My Wallet
            </Link>
          </div>
        )}

        {/* Already Claimed */}
        {phase === 'already_claimed' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold-500/10 border-4 border-gold-500/30 flex items-center justify-center">
              <span className="text-gold-500 text-3xl">🎫</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Already in Your Wallet</h2>
            <p className="text-sm text-slate-500 mt-2">
              This ticket has already been claimed to your session wallet.
            </p>
            <Link
              href="/wallet"
              className="inline-block mt-6 px-8 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
            >
              Go to Wallet
            </Link>
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center">
              <span className="text-red-400 text-3xl">✕</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
            <Link
              href="/wallet"
              className="inline-block mt-6 px-8 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
            >
              Go to Wallet
            </Link>
          </div>
        )}

        {/* DUAL branding footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Secured by <span className="font-semibold text-primary-consumer">DUAL</span> · Decentralised Universal Asset Ledger
          </p>
        </div>
      </div>
    </div>
  );
}
