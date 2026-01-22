import { NextResponse } from 'next/server';
import { initHeyreachMCP } from '@/lib/mcp/heyreach';
import { initInstantlyMCP } from '@/lib/mcp/instantly';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Initialize MCP connections
    // These configurations should come from environment variables
    const heyreachConfig = {
      command: process.env.HEYREACH_MCP_COMMAND || 'npx',
      args: (process.env.HEYREACH_MCP_ARGS || '').split(' ').filter(Boolean),
    };

    const instantlyConfig = {
      command: process.env.INSTANTLY_MCP_COMMAND || 'npx',
      args: (process.env.INSTANTLY_MCP_ARGS || '').split(' ').filter(Boolean),
    };

    await Promise.all([
      initHeyreachMCP(heyreachConfig),
      initInstantlyMCP(instantlyConfig),
    ]);

    return NextResponse.json({ success: true, message: 'MCP connections initialized' });
  } catch (error) {
    console.error('Error initializing MCP:', error);
    return NextResponse.json(
      { error: 'Failed to initialize MCP connections' },
      { status: 500 }
    );
  }
}
