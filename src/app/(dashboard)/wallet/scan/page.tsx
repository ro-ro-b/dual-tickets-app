'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { demoTickets, demoEvents } from '@/lib/demo-data';
import { formatDate, truncateAddress } from '@/lib/utils';

type ScanState = 'scanning' | 'verifying' | 'result';
type VerifyResult = {
  status: 'valid' | 'used' | 'invalid';
  ticket: typeof demoTickets[0] | null;
  event: typeof demoEvents[0] | null;
  scannedData: string;
  verifiedAt: string;
  blockConfirmations: number;
  chainHash: string;
};

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
    setTimeout(() => {
      // Try to match against demo ticket IDs, otherwise pick a random valid ticket
      let matchedTicket = demoTickets.find(t => decodedText.includes(t.id));
      if (!matchedTicket) {
        // Pick a random valid ticket for demo purposes
        const validTickets = demoTickets.filter(t => t.ticketData.status === 'valid');
        matchedTicket = validTickets[Math.floor(Math.random() * validTickets.length)];
      }

      const matchedEvent = matchedTicket
        ? demoEvents.find(e => e.id === matchedTicket!.eventId) || null
        : null;

      const status = matchedTicket
        ? matchedTicket.ticketData.status === 'valid'
          ? 'valid'
          : 'used'
        : 'invalid';

      setResult({
        status,
        ticket: matchedTicket || null,
        event: matchedEvent,
        scannedData: decodedText,
        verifiedAt: new Date().toISOString(),
        blockConfirmations: Math.floor(Math.random() * 50) + 12,
        chainHash: generateChainHash(),
      });
      setScanState('result');
    }, 1800);
  }, []);

  const startScanner = useCallback(async () => {
    hasScanned.current = false;
    setCameraError(null);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          handleScanResult(decodedText);
        },
        () => {
          // QR code not found — keep scanning
        }
      );
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err?.message?.includes('Permission') || err?.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access and try again.');
      } else if (err?.message?.includes('NotFound') || err?.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. You can use the demo scan below.');
      }
    }
  }, [handleScanResult]);

  useEffect(() => {
    if (scanState === 'scanning') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => startScanner(), 300);
      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          try {
            scannerRef.current.stop().catch(() => {});
          } catch {}
        }
      };
    }
  }, [scanState, startScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, []);

  const handleDemoScan = () => {
    handleScanResult('dual-ticket://tkt-001/verify?sig=demo_signature_abc123');
  };

  const handleScanAgain = () => {
    setResult(null);
    setScanState('scanning');
  };

  // ── SCANNING STATE ────────────────────────────────────────────
  if (scanState === 'scanning') {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent px-4 py-4 flex items-center justify-between">
          <Link
            href="/wallet"
            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </Link>
          <h1 className="text-lg font-bold text-white">Scan Ticket</h1>
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`p-2 -mr-2 transition-colors ${torchOn ? 'text-amber-400' : 'text-white/80 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-2xl">
              {torchOn ? 'flashlight_on' : 'flashlight_off'}
            </span>
          </button>
        </div>

        {/* Camera viewfinder */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* QR Scanner container */}
          <div ref={videoContainerRef} className="w-full h-full absolute inset-0">
            <div id="qr-reader" className="w-full h-full" />
          </div>

          {/* Custom overlay on top of the scanner */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark overlay with cutout */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Top dark */}
              <div className="absolute top-0 left-0 right-0 h-[calc(50%-140px)] bg-black/60" />
              {/* Bottom dark */}
              <div className="absolute bottom-0 left-0 right-0 h-[calc(50%-140px)] bg-black/60" />
              {/* Left dark */}
              <div className="absolute top-[calc(50%-140px)] bottom-[calc(50%-140px)] left-0 w-[calc(50%-140px)] bg-black/60" />
              {/* Right dark */}
              <div className="absolute top-[calc(50%-140px)] bottom-[calc(50%-140px)] right-0 w-[calc(50%-140px)] bg-black/60" />

              {/* Scanning frame */}
              <div className="w-[280px] h-[280px] relative">
                {/* Animated corners */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                {/* Scanning line animation */}
                <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-scan-line" />
              </div>
            </div>
          </div>

          {/* Camera error state */}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-center px-8 max-w-sm">
                <span className="material-symbols-outlined text-5xl text-amber-400 mb-4 block">
                  videocam_off
                </span>
                <p className="text-white/80 text-sm mb-6">{cameraError}</p>
                <button
                  onClick={startScanner}
                  className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors mb-3 w-full"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-8 px-6">
          <p className="text-white/60 text-center text-sm mb-6">
            Point your camera at a ticket QR code
          </p>

          {/* Demo scan button */}
          <button
            onClick={handleDemoScan}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold rounded-xl
              hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            Demo: Simulate Scan
          </button>

          <p className="text-white/30 text-center text-xs mt-3">
            Or scan any QR code to see the verification flow
          </p>
        </div>

        {/* Hide the html5-qrcode default UI */}
        <style jsx global>{`
          #qr-reader {
            border: none !important;
            width: 100% !important;
            height: 100% !important;
          }
          #qr-reader video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 0 !important;
          }
          #qr-reader img {
            display: none !important;
          }
          #qr-reader__scan_region {
            min-height: 100% !important;
          }
          #qr-reader__scan_region > br,
          #qr-reader__scan_region > img,
          #qr-reader__header_message,
          #qr-reader__dashboard,
          #qr-reader__dashboard_section,
          #qr-reader__dashboard_section_csr,
          #qr-reader__dashboard_section_fsr,
          #qr-reader__status_span,
          #qr-reader__camera_selection,
          #html5-qrcode-button-camera-permission,
          #html5-qrcode-button-camera-start,
          #html5-qrcode-button-camera-stop,
          #html5-qrcode-button-file-selection,
          #html5-qrcode-anchor-scan-type-change,
          #qr-reader__dashboard_section_swaplink {
            display: none !important;
          }
          #qr-reader__scan_region video {
            object-fit: cover !important;
          }
          #qr-shaded-region {
            display: none !important;
          }
          @keyframes scan-line {
            0% { top: 8px; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: calc(100% - 8px); opacity: 0; }
          }
          .animate-scan-line {
            animation: scan-line 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // ── VERIFYING STATE ───────────────────────────────────────────
  if (scanState === 'verifying') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center px-8">
          {/* Animated verification ring */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-amber-400">
                qr_code_scanner
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Verifying Ticket</h2>
          <p className="text-slate-400 text-sm mb-6">
            Checking DUAL Network for authenticity...
          </p>

          {/* Verification steps */}
          <div className="space-y-3 text-left max-w-xs mx-auto">
            <VerifyStep label="QR Code decoded" status="done" />
            <VerifyStep label="Querying DUAL blockchain" status="active" />
            <VerifyStep label="Validating ownership" status="pending" />
            <VerifyStep label="Confirming ticket status" status="pending" />
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT STATE ──────────────────────────────────────────────
  if (!result) return null;

  const isValid = result.status === 'valid';
  const isUsed = result.status === 'used';

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 z-40 px-4 py-4 flex items-center justify-between">
        <Link
          href="/wallet"
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold text-white">Scan Result</h1>
        <div className="w-10" />
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* Status banner */}
        <div className={`rounded-2xl p-6 text-center ${
          isValid
            ? 'bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 border border-emerald-500/30'
            : isUsed
              ? 'bg-gradient-to-br from-amber-600/20 to-amber-600/5 border border-amber-500/30'
              : 'bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-500/30'
        }`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isValid
              ? 'bg-emerald-500/20'
              : isUsed
                ? 'bg-amber-500/20'
                : 'bg-red-500/20'
          }`}>
            <span className={`material-symbols-outlined text-5xl ${
              isValid
                ? 'text-emerald-400'
                : isUsed
                  ? 'text-amber-400'
                  : 'text-red-400'
            }`}>
              {isValid ? 'verified' : isUsed ? 'history' : 'gpp_bad'}
            </span>
          </div>

          <h2 className={`text-2xl font-black mb-1 ${
            isValid ? 'text-emerald-300' : isUsed ? 'text-amber-300' : 'text-red-300'
          }`}>
            {isValid ? 'VALID TICKET' : isUsed ? 'ALREADY USED' : 'INVALID TICKET'}
          </h2>
          <p className={`text-sm ${
            isValid ? 'text-emerald-400/70' : isUsed ? 'text-amber-400/70' : 'text-red-400/70'
          }`}>
            {isValid
              ? 'Verified on DUAL Network'
              : isUsed
                ? 'This ticket has already been checked in'
                : 'No matching ticket found on DUAL Network'}
          </p>
        </div>

        {/* Ticket details */}
        {result.ticket && result.event && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Event image */}
            <div className="relative h-36">
              <img
                src={result.event.imageUrl}
                alt={result.event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-white font-bold text-lg leading-tight">{result.event.name}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Tier</p>
                <p className="text-white font-semibold text-sm">{result.ticket.tierName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Date</p>
                <p className="text-white font-semibold text-sm">{formatDate(result.ticket.ticketData.eventDate)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Venue</p>
                <p className="text-white font-semibold text-sm">{result.ticket.ticketData.venue}</p>
              </div>
              {result.ticket.ticketData.seatInfo && (
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Seat</p>
                  <p className="text-white font-semibold text-sm">{result.ticket.ticketData.seatInfo}</p>
                </div>
              )}
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Owner</p>
                <p className="text-white font-semibold text-sm font-mono">
                  {truncateAddress(result.ticket.ownerWallet)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Ticket ID</p>
                <p className="text-white font-semibold text-sm font-mono">
                  {result.ticket.id}
                </p>
              </div>
            </div>

            {/* Dotted divider */}
            <div className="dotted-divider mx-4" />

            {/* Blockchain verification */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-blue-400 text-lg">link</span>
                <p className="text-blue-300 font-semibold text-sm">On-Chain Verification</p>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Chain Hash</span>
                  <span className="text-slate-300 truncate ml-4 max-w-[180px]">{result.chainHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confirmations</span>
                  <span className="text-emerald-400">{result.blockConfirmations} blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified At</span>
                  <span className="text-slate-300">
                    {new Date(result.verifiedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">On-Chain Status</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    result.ticket.onChainStatus === 'anchored'
                      ? 'bg-emerald-600/30 text-emerald-300'
                      : result.ticket.onChainStatus === 'verified'
                        ? 'bg-blue-600/30 text-blue-300'
                        : 'bg-amber-600/30 text-amber-300'
                  }`}>
                    {result.ticket.onChainStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No ticket found */}
        {!result.ticket && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Scanned data:</p>
            <p className="text-white font-mono text-xs break-all bg-slate-900/80 rounded-lg p-3">
              {result.scannedData}
            </p>
            <p className="text-slate-500 text-xs mt-3">
              This QR code does not match any ticket in the DUAL Network.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          {isValid && result.ticket && (
            <Link
              href={`/wallet/ticket/${result.ticket.id}`}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl
                hover:from-blue-400 hover:to-blue-500 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">confirmation_number</span>
              View Full Ticket
            </Link>
          )}

          <button
            onClick={handleScanAgain}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold rounded-xl
              hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            Scan Another Ticket
          </button>

          <Link
            href="/wallet"
            className="w-full py-3 border border-slate-700 text-slate-300 font-semibold rounded-xl
              hover:bg-slate-800/50 transition-all text-sm flex items-center justify-center gap-2"
          >
            Back to Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Verification step indicator ─────────────────────────────────
function VerifyStep({ label, status }: { label: string; status: 'done' | 'active' | 'pending' }) {
  return (
    <div className="flex items-center gap-3">
      {status === 'done' && (
        <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
      )}
      {status === 'active' && (
        <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      )}
      {status === 'pending' && (
        <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
      )}
      <span className={`text-sm ${
        status === 'done'
          ? 'text-emerald-300'
          : status === 'active'
            ? 'text-amber-300'
            : 'text-slate-500'
      }`}>
        {label}
      </span>
    </div>
  );
}
