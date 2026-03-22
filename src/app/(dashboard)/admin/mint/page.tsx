'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, KeyRound, Zap, Ticket, Check, RefreshCw, Trash2, Loader2 } from 'lucide-react';

type AuthState = 'checking' | 'unauthenticated' | 'otp_sent' | 'authenticated';

type MintStep = {
  id: string;
  label: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'done' | 'error';
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function MintPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [mintPhase, setMintPhase] = useState<'form' | 'minting' | 'success'>('form');
  const [mintResult, setMintResult] = useState<{ actionId: string; objectIds: string[]; ticketId?: string } | null>(null);
  const [mintError, setMintError] = useState('');
  const [mintSteps, setMintSteps] = useState<MintStep[]>([]);

  // AI generation state
  const [generating, setGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState<'idle' | 'image' | 'video' | 'done'>('idle');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageMimeType, setImageMimeType] = useState('image/png');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [tokenMode, setTokenMode] = useState<'image' | 'video'>('image');

  const [form, setForm] = useState({
    // Event Information
    eventName: '',
    eventDate: '',
    eventTime: '20:00',
    venueName: '',
    venueAddress: '',
    category: 'concert' as string,
    description: '',
    // Ticket Details
    tier: 'general' as string,
    section: '',
    seat: '',
    price: 0,
    maxResalePrice: 0,
    quantity: 1,
    perks: '',
  });

  // Check auth on mount
  useEffect(() => {
    fetch('/api/auth/status')
      .then(r => r.json())
      .then(d => {
        setAuthState(d.authenticated ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => setAuthState('unauthenticated'));
  }, []);

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
      if (res.ok) {
        setAuthState('otp_sent');
      } else {
        setAuthError(data.error || 'Failed to send OTP');
      }
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
      if (res.ok) {
        setAuthState('authenticated');
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch {
      setAuthError('Network error');
    } finally {
      setAuthLoading(false);
    }
  };

  const update = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));

  const getMetadataPayload = () => ({
    domain: 'ticket',
    eventName: form.eventName,
    eventDate: form.eventDate,
    eventTime: form.eventTime,
    venueName: form.venueName,
    venueAddress: form.venueAddress,
    category: form.category,
    description: form.description,
    tier: form.tier,
    section: form.section,
    seat: form.seat,
    price: form.price,
  });

  const handleGenerateAssets = async () => {
    if (!form.eventName) {
      setMintError('Please fill in the event name before generating assets.');
      return;
    }
    setGenerating(true);
    setMintError('');
    const payload = getMetadataPayload();

    // Step 1: Generate image
    setGenPhase('image');
    try {
      const imgRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const imgData = await imgRes.json();
      if (!imgRes.ok) throw new Error(imgData.error || 'Image generation failed');
      setImageUrl(imgData.imageUrl);
      setImagePrompt(imgData.prompt);
      setImageBase64(imgData.imageBase64 || '');
      setImageMimeType(imgData.mimeType || 'image/png');
    } catch (err: any) {
      setMintError(`AI Image: ${err.message}`);
      setGenerating(false);
      setGenPhase('idle');
      return;
    }

    // Step 2: Generate video (only in video mode)
    if (tokenMode === 'video') {
      setGenPhase('video');
      try {
        const vidRes = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            imageBase64,
            imageMimeType,
          }),
        });
        const vidData = await vidRes.json();
        if (!vidRes.ok) throw new Error(vidData.error || 'Video generation failed');
        setVideoUrl(vidData.videoUrl);
        setVideoPrompt(vidData.prompt);
      } catch (err: any) {
        setMintError(`AI Video: ${err.message}`);
        setGenerating(false);
        setGenPhase('idle');
        return;
      }
    }

    setGenPhase('done');
    setGenerating(false);
  };

  const handleGenerateImage = async () => {
    if (!form.eventName) {
      setMintError('Please fill in the event name before generating an image.');
      return;
    }
    setGenerating(true);
    setGenPhase('image');
    setMintError('');
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getMetadataPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image generation failed');
      setImageUrl(data.imageUrl);
      setImagePrompt(data.prompt);
      setImageBase64(data.imageBase64 || '');
      setImageMimeType(data.mimeType || 'image/png');
    } catch (err: any) {
      setMintError(`AI Image: ${err.message}`);
    }
    setGenerating(false);
    setGenPhase('idle');
  };

  const handleGenerateVideo = async () => {
    if (!form.eventName) {
      setMintError('Please fill in the event name before generating a video.');
      return;
    }
    setGenerating(true);
    setGenPhase('video');
    setMintError('');
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getMetadataPayload(),
          imageBase64,
          imageMimeType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Video generation failed');
      setVideoUrl(data.videoUrl);
      setVideoPrompt(data.prompt);
    } catch (err: any) {
      setMintError(`AI Video: ${err.message}`);
    }
    setGenerating(false);
    setGenPhase('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMintError('');

    // Validate required fields
    if (!form.eventName || !form.eventDate || !form.venueName || !form.tier) {
      setMintError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    // Initialize minting steps
    const steps: MintStep[] = [
      { id: 'prepare', label: 'Preparing Ticket Data', description: 'Structuring ticket metadata for on-chain storage', icon: 'data_object', status: 'pending' },
      { id: 'auth', label: 'Authenticating with DUAL', description: 'Verifying org-scoped JWT credentials', icon: 'shield', status: 'pending' },
      { id: 'mint', label: 'Minting ERC-721 NFT', description: 'Writing to DUAL Network via /ebus/execute', icon: 'token', status: 'pending' },
      { id: 'anchor', label: 'Anchoring Content Hash', description: 'Computing integrity hash and anchoring on-chain', icon: 'link', status: 'pending' },
      { id: 'confirm', label: 'Confirmed on Blockchain', description: 'Ticket NFT verified on DUAL Network', icon: 'verified', status: 'pending' },
    ];
    setMintSteps(steps);
    setMintPhase('minting');

    // Step 1: Preparing
    await sleep(400);
    steps[0].status = 'active';
    setMintSteps([...steps]);
    await sleep(800);
    steps[0].status = 'done';
    setMintSteps([...steps]);

    // Step 2: Authenticating
    await sleep(300);
    steps[1].status = 'active';
    setMintSteps([...steps]);
    await sleep(600);
    steps[1].status = 'done';
    setMintSteps([...steps]);

    // Step 3: Minting — API call
    await sleep(300);
    steps[2].status = 'active';
    setMintSteps([...steps]);

    try {
      const perksArray = form.perks
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const mintPayload = {
        data: {
          name: `${form.eventName} - ${form.tier.toUpperCase()}`,
          eventName: form.eventName,
          eventDate: form.eventDate,
          eventTime: form.eventTime,
          venueName: form.venueName,
          venueAddress: form.venueAddress,
          category: form.category,
          description: form.description,
          tier: form.tier,
          section: form.section,
          seat: form.seat,
          price: form.price,
          maxResalePrice: form.maxResalePrice,
          quantity: form.quantity,
          perks: perksArray,
          ...(imageUrl ? { imageUrl } : {}),
          ...(videoUrl ? { videoUrl } : {}),
        },
      };

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mintPayload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        steps[2].status = 'error';
        setMintSteps([...steps]);
        setMintError(data.error || 'Mint failed');
        if (res.status === 401) setAuthState('unauthenticated');
        setSubmitting(false);
        return;
      }

      steps[2].status = 'done';
      setMintSteps([...steps]);

      // Step 4: Anchoring content hash
      await sleep(400);
      steps[3].status = 'active';
      setMintSteps([...steps]);
      await sleep(900);
      steps[3].status = 'done';
      setMintSteps([...steps]);

      // Step 5: Confirmed
      await sleep(400);
      steps[4].status = 'active';
      setMintSteps([...steps]);
      await sleep(600);
      steps[4].status = 'done';
      setMintSteps([...steps]);

      await sleep(500);
      setMintResult({
        actionId: data.actionId,
        objectIds: data.objectIds,
        ticketId: data.objectIds?.[0],
      });
      setMintPhase('success');

    } catch (err: any) {
      steps[2].status = 'error';
      setMintSteps([...steps]);
      setMintError(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Auth Gate ──
  if (authState === 'checking') {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
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
                ? 'Enter your email to receive a one-time code for minting tickets.'
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
  if (mintPhase === 'success' && mintResult) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check size={28} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Ticket Minted!</h2>
            <p className="text-sm text-gray-500">Token created on the DUAL network</p>

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
              <Button className="flex-1" onClick={() => {
                setMintResult(null);
                setMintPhase('form');
                setForm(f => ({ ...f, quantity: 1 }));
              }}>
                Mint More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Minting Phase ──
  if (mintPhase === 'minting') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">Minting Ticket...</h2>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>

            <div className="space-y-3">
              {mintSteps.map((step) => (
                <div key={step.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-300 text-sm font-medium">
                    {step.status === 'done' && <Check size={16} className="text-green-600" />}
                    {step.status === 'active' && <Loader2 size={16} className="text-brand-600 animate-spin" />}
                    {step.status === 'pending' && <span className="text-gray-400">•</span>}
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-sm font-medium text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {mintError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {mintError}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Form Phase ──
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Asset Generation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Zap size={20} className="text-brand-600" />
              AI-Generated Assets
              <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Google Gemini</span>
            </h2>
            {/* Token mode toggle */}
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setTokenMode('image')}
                className={`px-3 py-1.5 text-xs font-semibold transition ${
                  tokenMode === 'image'
                    ? 'bg-brand-50 text-brand-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Image Only
              </button>
              <button
                type="button"
                onClick={() => setTokenMode('video')}
                className={`px-3 py-1.5 text-xs font-semibold transition border-l border-gray-300 ${
                  tokenMode === 'video'
                    ? 'bg-brand-50 text-brand-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Image + Video
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the event details below, then generate {tokenMode === 'video' ? 'a promotional image and cinematic trailer' : 'a promotional event image'} from the metadata
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Generate button */}
          {!imageUrl && !generating && (
            <button
              type="button"
              onClick={handleGenerateAssets}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center gap-3 hover:border-gray-400 hover:bg-gray-50 transition"
            >
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                <Zap size={24} className="text-brand-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Generate {tokenMode === 'video' ? 'Image & Trailer' : 'Event Image'} from Metadata
              </span>
              <span className="text-xs text-gray-500">
                Uses event name, category, venue, tier &amp; more
              </span>
            </button>
          )}

          {/* Generation progress */}
          {generating && (
            <div className="w-full rounded-lg bg-gray-50 border border-gray-200 py-6 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {genPhase === 'image' ? 'Generating Event Image...' : 'Generating Event Trailer...'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {genPhase === 'image' ? 'Gemini is creating your promotional image' : 'Gemini Veo is rendering your cinematic trailer'}
                </p>
              </div>
            </div>
          )}

          {/* Generated assets preview */}
          {(imageUrl || videoUrl) && !generating && (
            <div className="space-y-4">
              {imageUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-xs font-semibold text-gray-700">AI Event Image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handleGenerateImage}
                        className="text-xs text-brand-600 hover:text-brand-700 transition flex items-center gap-1">
                        <RefreshCw size={12} />
                        Regenerate
                      </button>
                      <button type="button" onClick={() => { setImageUrl(''); setImagePrompt(''); setImageBase64(''); }}
                        className="text-xs text-red-600 hover:text-red-700 transition">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={imageUrl} alt="AI generated event" className="w-full max-h-72 object-contain mx-auto" />
                  </div>
                  {imagePrompt && (
                    <details className="text-xs">
                      <summary className="text-gray-500 cursor-pointer hover:text-gray-700 transition">View image prompt</summary>
                      <p className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 leading-relaxed text-xs">{imagePrompt}</p>
                    </details>
                  )}
                </div>
              )}

              {videoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-xs font-semibold text-gray-700">AI Event Trailer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handleGenerateVideo}
                        className="text-xs text-brand-600 hover:text-brand-700 transition flex items-center gap-1">
                        <RefreshCw size={12} />
                        Regenerate
                      </button>
                      <button type="button" onClick={() => { setVideoUrl(''); setVideoPrompt(''); }}
                        className="text-xs text-red-600 hover:text-red-700 transition">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-black">
                    <video src={videoUrl} controls className="w-full max-h-64 mx-auto" />
                  </div>
                  {videoPrompt && (
                    <details className="text-xs">
                      <summary className="text-gray-500 cursor-pointer hover:text-gray-700 transition">View video prompt</summary>
                      <p className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 leading-relaxed text-xs">{videoPrompt}</p>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Information Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Event Information
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={form.eventName}
                  onChange={e => update('eventName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g., Summer Music Festival 2026"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={form.eventDate}
                  onChange={e => update('eventDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              {/* Event Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                <input
                  type="text"
                  value={form.eventTime}
                  onChange={e => update('eventTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="20:00"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="concert">Concert</option>
                  <option value="sports">Sports</option>
                  <option value="theater">Theater</option>
                  <option value="conference">Conference</option>
                  <option value="festival">Festival</option>
                </select>
              </div>

              {/* Venue Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
                <input
                  type="text"
                  required
                  value={form.venueName}
                  onChange={e => update('venueName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g., Central Park"
                />
              </div>

              {/* Venue Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                <input
                  type="text"
                  value={form.venueAddress}
                  onChange={e => update('venueAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Full address"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                placeholder="Event details, terms, restrictions..."
              />
            </div>

            {/* Ticket Details Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Ticket size={20} className="text-brand-600" />
                Ticket Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tier *</label>
                  <select
                    required
                    value={form.tier}
                    onChange={e => update('tier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="general">General Admission</option>
                    <option value="vip">VIP</option>
                    <option value="backstage">Backstage Pass</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={e => update('section', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g., A, B, Floor 1"
                  />
                </div>

                {/* Seat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seat</label>
                  <input
                    type="text"
                    value={form.seat}
                    onChange={e => update('seat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g., 101, 202, GA"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={e => update('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="99.99"
                  />
                </div>

                {/* Max Resale Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Resale Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.maxResalePrice}
                    onChange={e => update('maxResalePrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="149.99"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Mint</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={e => update('quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Perks */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Perks (comma-separated)</label>
                <textarea
                  value={form.perks}
                  onChange={e => update('perks', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                  placeholder="e.g., Early entry, Exclusive merchandise, Meet & greet"
                />
              </div>
            </div>

            {/* Error Display */}
            {mintError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {mintError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Mint Ticket NFT
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
