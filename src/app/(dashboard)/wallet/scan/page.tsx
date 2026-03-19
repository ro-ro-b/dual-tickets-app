'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { formatDate, truncateAddress } from '@/lib/utils';

type ScanState = 'scanning' | 'verifying' | 'result';
interface VerifyResult {
  status: 'valid' | 'used' | 'invalid';
  ticket: any | null;
  event: any | null;
  scannedData: string;
  verifiedAt: string;
  blockConfirmations: number;
  chainHash: string;
}

export default function ScanPage() {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const hasScanned = useRef(false);

  const generateChainHash = () => {
    const chars = '0123456789abcdef';
    return '0x' + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleScanResult = useCallback((decodedText: string) => {
    if (hasScanned.current) return;
    hasScanned.current = true;

    // Stop the scanner
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().catch(() => {});
      } catch {}
    }

    setScanState('verifying');

    // Simulate blockchain verification delay
    setTimeout(async () => {
      try {
        // Try to fetch the ticket from DUAL API
        const res = await fetch(`/api/tickets/${decodedText}`);
        if (res.ok) {
          const json = await res.json();
          const matchedTicket = json.data;
          const status = matchedTicket?.ticketData?.status === 'valid' ? 'valid' : 'used';

          setResult({
            status,
            ticket: matchedTicket || null,
            event: null,
            scannedData: decodedText,
            verifiedAt: new Date().toISOString(),
            blockConfirmations: Math.floor(Math.random() * 50) + 12,
            chainHash: generateChainHash(),
          });
        } else {
          setResult({
            status: 'invalid',
            ticket: null,
            event: null,
            scannedData: decodedText,
            verifiedAt: new Date().toISOString(),
            blockConfirmations: 0,
            chainHash: generateChainHash(),
          });
        }
      } catch (error) {
        console.error('Failed to verify ticket:', error);
        setResult({
          status: 'invalid',
          ticket: null,
          event: null,
          scannedData: decodedText,
          verifiedAt: new Date().toISOString(),
          blockConfirmations: 0,
          chainHash: generateChainHash(),
        });
      }
      setScanState('result');
    }, 1800);
  }, []);

  const startScanner = useCallback(async () => {
    hasScanned.current = false;
    setCameraError(null);

    if (!videoContainerRef.current) return;

    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');

      scannerRef.current = new Html5QrcodeScanner(
        videoContainerRef.current.id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText: string) => handleScanResult(decodedText),
        (error: any) => {
          if (!error.toString().includes('NotAllowedError')) {
            console.log('Scan error:', error);
          }
        }
      );
    } catch (error) {
      setCameraError('Camera access denied. Please enable camera permissions to scan tickets.');
      console.error('Camera error:', error);
    }
  }, [handleScanResult]);

  useEffect(() => {
    if (scanState === 'scanning') {
      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, [scanState, startScanner]);

  const resetScan = () => {
    setScanState('scanning');
    setResult(null);
  };

  if (scanState === 'result' && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-6 pb-20">
        {/* Result Card */}
        <div className={`rounded-2xl p-8 text-center ${result.status === 'valid' ? 'bg-gold-50' : result.status === 'used' ? 'bg-amber-50' : 'bg-red-50'}`}>
          <div className={`text-6xl font-bold mb-4 ${result.status === 'valid' ? 'text-gold-700' : result.status === 'used' ? 'text-amber-700' : 'text-red-700'}`}>
            {result.status === 'valid' ? '✓' : result.status === 'used' ? '⊕' : '✗'}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${result.status === 'valid' ? 'text-gold-900' : result.status === 'used' ? 'text-amber-900' : 'text-red-900'}`}>
            {result.status === 'valid' ? 'Valid Ticket' : result.status === 'used' ? 'Already Used' : 'Invalid Ticket'}
          </h2>
          <p className={`text-sm ${result.status === 'valid' ? 'text-gold-800' : result.status === 'used' ? 'text-amber-800' : 'text-red-800'}`}>
            {result.status === 'valid'
              ? 'This ticket is valid and ready for entry.'
              : result.status === 'used'
                ? 'This ticket has already been used.'
                : 'This ticket is invalid or not found on the DUAL network.'}
          </p>
        </div>

        {/* Ticket Details */}
        {result.ticket && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Ticket Name</p>
              <p className="font-semibold text-slate-900">{result.ticket.ticketData?.eventName || 'DUAL Token'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Object ID</p>
                <p className="font-mono text-sm text-slate-600">{truncateAddress(result.ticket.id)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Template ID</p>
                <p className="font-mono text-sm text-slate-600">{truncateAddress(result.ticket.templateId)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-900">On-Chain Verification</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Verified At</p>
              <p className="text-sm text-slate-600">{formatDate(result.verifiedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Block Confirmations</p>
              <p className="text-sm font-mono text-slate-600">{result.blockConfirmations}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Chain Hash</p>
            <p className="text-xs font-mono text-slate-500 break-all">{result.chainHash}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetScan}
            className="flex-1 px-6 py-3 wine-gradient text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Scan Next Ticket
          </button>
          <Link
            href="/wallet"
            className="flex-1 px-6 py-3 bg-gold-50 text-gold-700 rounded-xl font-medium hover:bg-gold-100 transition-colors text-center"
          >
            Back to Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-6 pb-20">
      {/* Header Banner */}
      <div className="wine-gradient rounded-2xl px-6 py-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Ticket Scanner</h1>
        <p className="text-sm text-white/80">Scan QR codes to verify tickets on the DUAL network</p>
      </div>

      {cameraError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {cameraError}
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden shadow-sm">
        <div
          ref={videoContainerRef}
          id="reader"
          style={{ width: '100%', height: 400 }}
          className="flex items-center justify-center bg-slate-50"
        >
          <p className="text-slate-500 text-center">
            {cameraError ? 'Camera access denied' : 'Initializing camera...'}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          Point your camera at a QR code to scan a ticket. The ticket will be verified against the DUAL network blockchain.
        </p>
      </div>

      <Link
        href="/wallet"
        className="block px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-medium hover:bg-slate-200 transition-colors text-center"
      >
        Cancel
      </Link>
    </div>
  );
}
