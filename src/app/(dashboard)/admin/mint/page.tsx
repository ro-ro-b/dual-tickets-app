'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { Check, Ticket, Zap, Lock, Mail, KeyRound } from 'lucide-react';

type AuthState = 'checking' | 'unauthenticated' | 'otp_sent' | 'authenticated';

interface Template {
  id: string;
  name: string;
}

export default function MintPage() {
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [events, setEvents] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{ actionId: string; objectIds: string[] } | null>(null);

  // Check auth status on mount
  useEffect(() => {
    fetch('/api/auth/status').then(r => r.json()).then(d => {
      setAuthState(d.authenticated ? 'authenticated' : 'unauthenticated');
    }).catch(() => setAuthState('unauthenticated'));
  }, []);

  // Fetch templates once authenticated
  useEffect(() => {
    if (authState !== 'authenticated') return;
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch templates');
        const json = await res.json();
        setEvents(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [authState]);

  const handleSendOtp = async () => {
    if (!email) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setAuthState('otp_sent');
      else setAuthError(data.error || 'Failed to send OTP');
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) setAuthState('authenticated');
      else setAuthError(data.error || 'Login failed');
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMint = async () => {
    if (!selectedTemplate) return;
    setMinting(true);
    setError(null);
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          num: quantity,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMintResult({ actionId: data.actionId, objectIds: data.objectIds });
      } else {
        setError(data.error || 'Mint failed');
        if (res.status === 401) setAuthState('unauthenticated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint tickets');
    } finally {
      setMinting(false);
    }
  };

  // ── Auth Gate ──
  if (authState === 'checking') {
    return <div className="p-6 text-center text-gray-500">Checking authentication...</div>;
  }

  if (authState === 'unauthenticated' || authState === 'otp_sent') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-brand-600" />
              <h2 className="font-semibold text-gray-900">DUAL Network Auth</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {authState === 'unauthenticated'
                ? 'Enter your email to receive a one-time code for minting tokens.'
                : `Enter the OTP code sent to ${email}`}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{authError}</div>
            )}

            {authState === 'unauthenticated' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="admin@example.com"
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={authLoading || !email}
                  onClick={handleSendOtp}
                >
                  {authLoading ? 'Sending...' : 'Send OTP Code'}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-center tracking-widest font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="Enter code"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={authLoading || !otp}
                  onClick={handleLogin}
                >
                  {authLoading ? 'Authenticating...' : 'Verify & Login'}
                </Button>
                <button
                  onClick={() => { setAuthState('unauthenticated'); setOtp(''); setAuthError(''); }}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Back to email
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Mint Success ──
  if (mintResult) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check size={28} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Tickets Minted!</h2>
            <p className="text-sm text-gray-500">Tokens created on the DUAL network</p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-xs font-mono text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Action ID</span>
                <span className="text-gray-700 truncate ml-4">{mintResult.actionId}</span>
              </div>
              {mintResult.objectIds.map((id, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-400">Object {i + 1}</span>
                  <span className="text-gray-700 truncate ml-4">{id}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={() => { setMintResult(null); setQuantity(1); }}>
                Mint More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Mint Form ──
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading templates from DUAL network...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap size={18} className="text-brand-600" /> Mint DUAL Tokens
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Authenticated
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Create new ticket tokens from an existing template on the DUAL network.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e: any) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">Select a template...</option>
              {events.map((tmpl: any) => (
                <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
              ))}
            </select>
          </div>

          {selectedTemplate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={quantity}
                  onChange={(e: any) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <span className="text-sm text-gray-500">ticket(s) to mint</span>
              </div>
            </div>
          )}

          {selectedTemplate && quantity > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-700">Mint Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Template</span>
                <span className="font-medium">{events.find((e: any) => e.id === selectedTemplate)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Template ID</span>
                <span className="font-mono text-xs">{selectedTemplate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{quantity} ticket{quantity > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedTemplate || quantity < 1 || minting}
            onClick={handleMint}
          >
            {minting ? (
              <span>Minting on DUAL...</span>
            ) : (
              <span className="flex items-center gap-2"><Ticket size={18} /> Mint {quantity} Ticket{quantity > 1 ? 's' : ''}</span>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            Minting creates new ticket tokens on the DUAL network. Each token is assigned a unique ID and anchored to the blockchain via <code className="text-xs">/ebus/execute</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
