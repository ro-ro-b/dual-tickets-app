import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/dual-auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/mint
 * Mint ticket tokens via /ebus/execute.
 * Requires prior OTP authentication.
 *
 * Body: { templateId?, num?, data? }
 */
export async function POST(req: NextRequest) {
  try {
    const client = await getAuthenticatedClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Not authenticated. Send OTP and login first via /api/auth/otp and /api/auth/login.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const templateId = body.templateId || body.template_id || process.env.DUAL_TEMPLATE_ID || '';
    const num = body.num || body.quantity || 1;
    const rawData = body.data || body.metadata || {};

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    // Structure data into metadata + custom
    const mintData: Record<string, any> = {};

    if (rawData.name || rawData.description) {
      mintData.metadata = {
        ...(rawData.name ? { name: rawData.name } : {}),
        ...(rawData.description ? { description: rawData.description } : {}),
      };
    }

    const { name: _n, description: _d, ...customFields } = rawData;
    if (Object.keys(customFields).length > 0) {
      mintData.custom = customFields;
    }

    const actionPayload: any = {
      action: {
        mint: {
          template_id: templateId,
          num,
          ...(Object.keys(mintData).length > 0 ? { data: mintData } : {}),
        },
      },
    };

    const result = await client.ebus.execute(actionPayload);

    return NextResponse.json({
      success: true,
      actionId: result.action_id,
      steps: result.steps,
      objectIds: result.steps?.[0]?.output?.ids || [],
    }, { status: 201 });
  } catch (err: any) {
    const status = err.status || 500;
    const message = err.body?.message || err.message || 'Mint failed';
    return NextResponse.json({ error: message }, { status });
  }
}
