import { NextResponse } from 'next/server';
import { initHeyreachMCP } from '@/lib/mcp/heyreach';
import { initInstantlyMCP } from '@/lib/mcp/instantly';
import { getMCPManager } from '@/lib/mcp/client';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Initialize MCP connections (will use environment variables)
    const results = {
      heyreach: { success: false, error: null as string | null },
      instantly: { success: false, error: null as string | null },
    };

    // Try to initialize Heyreach
    try {
      await initHeyreachMCP();
      results.heyreach.success = true;
    } catch (error: unknown) {
      results.heyreach.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Try to initialize Instantly
    try {
      await initInstantlyMCP();
      results.instantly.success = true;
    } catch (error: unknown) {
      results.instantly.error = error instanceof Error ? error.message : 'Unknown error';
    }

    const manager = getMCPManager();

    // Get connection status
    const status = {
      heyreach: {
        connected: manager.isConnected('heyreach'),
        ...results.heyreach,
      },
      instantly: {
        connected: manager.isConnected('instantly'),
        ...results.instantly,
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error initializing MCP:', error);
    return NextResponse.json(
      { error: 'Failed to initialize MCP connections' },
      { status: 500 }
    );
  }
}
