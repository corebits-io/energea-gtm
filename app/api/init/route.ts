import { NextResponse } from 'next/server';
import { getHeyreachCampaigns } from '@/lib/api/heyreach';
import { getInstantlyCampaigns } from '@/lib/api/instantly';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Test API connections by trying to fetch campaigns
    const results = {
      heyreach: { success: false, error: null as string | null },
      instantly: { success: false, error: null as string | null },
    };

    // Try to connect to Heyreach
    try {
      await getHeyreachCampaigns();
      results.heyreach.success = true;
    } catch (error: unknown) {
      results.heyreach.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Try to connect to Instantly
    try {
      await getInstantlyCampaigns();
      results.instantly.success = true;
    } catch (error: unknown) {
      results.instantly.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error testing API connections:', error);
    return NextResponse.json(
      { error: 'Failed to test API connections' },
      { status: 500 }
    );
  }
}
