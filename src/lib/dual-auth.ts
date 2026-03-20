/**
 * DUAL Auth Helper — Server-side JWT management
 *
 * Flow: OTP → login → org switch → org-scoped JWT
 * The org-scoped JWT is cached in memory and auto-refreshed.
 */
import { DualClient } from './dual-sdk';

const BASE_URL = process.env.NEXT_PUBLIC_DUAL_API_URL || 'https://gateway-48587430648.europe-west6.run.app';
const ORG_ID = process.env.DUAL_ORG_ID || '';
const API_KEY = process.env.DUAL_API_KEY || '';

// ─── JWT Token Cache ───
interface TokenCache {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // ms timestamp
}

let _tokenCache: TokenCache | null = null;

function isTokenValid(): boolean {
  if (!_tokenCache) return false;
  return Date.now() < _tokenCache.expiresAt - 300_000;
}

function parseJwtExp(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return (payload.exp || 0) * 1000;
  } catch {
    return Date.now() + 3600_000;
  }
}

// ─── Auth Flow ───

export async function sendOtp(email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `OTP send failed: ${res.status}`);
  }
}

export async function loginWithOtp(email: string, otp: string): Promise<TokenCache> {
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!loginRes.ok) {
    const err = await loginRes.json().catch(() => ({}));
    throw new Error(err.message || `Login failed: ${loginRes.status}`);
  }
  const loginData = await loginRes.json();
  const systemToken = loginData.access_token;

  if (!ORG_ID) {
    _tokenCache = {
      accessToken: systemToken,
      refreshToken: loginData.refresh_token,
      expiresAt: parseJwtExp(systemToken),
    };
    return _tokenCache;
  }

  const switchRes = await fetch(`${BASE_URL}/organizations/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${systemToken}`,
    },
    body: JSON.stringify({ id: ORG_ID }),
  });
  if (!switchRes.ok) {
    const err = await switchRes.json().catch(() => ({}));
    throw new Error(err.message || `Org switch failed: ${switchRes.status}`);
  }
  const switchData = await switchRes.json();
  const orgToken = switchData.access_token;

  _tokenCache = {
    accessToken: orgToken,
    refreshToken: loginData.refresh_token,
    expiresAt: parseJwtExp(orgToken),
  };
  return _tokenCache;
}

async function refreshJwt(): Promise<boolean> {
  if (!_tokenCache?.refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: _tokenCache.refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    const newToken = data.access_token;

    if (ORG_ID) {
      const switchRes = await fetch(`${BASE_URL}/organizations/switch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
        body: JSON.stringify({ id: ORG_ID }),
      });
      if (switchRes.ok) {
        const switchData = await switchRes.json();
        _tokenCache = {
          accessToken: switchData.access_token,
          refreshToken: data.refresh_token || _tokenCache.refreshToken,
          expiresAt: parseJwtExp(switchData.access_token),
        };
        return true;
      }
    }

    _tokenCache = {
      accessToken: newToken,
      refreshToken: data.refresh_token || _tokenCache.refreshToken,
      expiresAt: parseJwtExp(newToken),
    };
    return true;
  } catch {
    return false;
  }
}

export async function getAuthenticatedClient(): Promise<DualClient | null> {
  if (_tokenCache && !isTokenValid()) {
    const refreshed = await refreshJwt();
    if (!refreshed) {
      _tokenCache = null;
      return null;
    }
  }

  if (!_tokenCache) return null;

  return new DualClient({
    baseUrl: BASE_URL,
    token: _tokenCache.accessToken,
    apiKey: API_KEY,
    timeout: 30000,
    retry: { maxAttempts: 2, backoffMs: 500 },
  });
}

export function isAuthenticated(): boolean {
  return isTokenValid();
}

export function clearAuth(): void {
  _tokenCache = null;
}
