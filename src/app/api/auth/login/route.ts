import { NextRequest, NextResponse } from 'next/server';
import { loginWithOtp } from '@/lib/dual-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    const tokenCache = await loginWithOtp(email, otp);
    return NextResponse.json({
      success: true,
      message: 'Authenticated with org context',
      expiresAt: tokenCache.expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 401 });
  }
}
