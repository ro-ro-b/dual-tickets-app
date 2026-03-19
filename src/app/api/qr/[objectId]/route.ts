import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(
  _req: NextRequest,
  { params }: { params: { objectId: string } }
) {
  const objectId = params.objectId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dual-tickets-app.vercel.app';
  const claimUrl = `${baseUrl}/claim/${objectId}`;

  try {
    const svg = await QRCode.toString(claimUrl, {
      type: 'svg',
      width: 256,
      margin: 2,
      color: { dark: '#791b3a', light: '#ffffff' },
    });

    return new NextResponse(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'QR generation failed' }, { status: 500 });
  }
}
