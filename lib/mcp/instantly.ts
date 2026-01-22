import { getMCPManager, MCPConfig } from './client';
import { InstantlyCampaign } from '@/types/campaign';

const INSTANTLY_SERVER = 'instantly';

// Initialize Instantly MCP connection
export async function initInstantlyMCP() {
  const manager = getMCPManager();

  // Check if already connected
  if (manager.isConnected(INSTANTLY_SERVER)) {
    return;
  }

  // Get configuration from environment
  const mcpUrl = process.env.INSTANTLY_MCP_URL || 'https://mcp.instantly.ai/mcp';
  const mcpKey = process.env.INSTANTLY_MCP_KEY;

  if (!mcpKey) {
    throw new Error('INSTANTLY_MCP_KEY environment variable is not set');
  }

  const config: MCPConfig = {
    type: 'http',
    url: mcpUrl,
    headers: {
      'Authorization': mcpKey,
    },
  };

  await manager.connectToServer(INSTANTLY_SERVER, config);
}

// Get list of campaigns from Instantly
export async function getInstantlyCampaigns(): Promise<InstantlyCampaign[]> {
  try {
    // Ensure connection is established
    await initInstantlyMCP();

    const manager = getMCPManager();

    // List available tools to understand what's available
    const tools = await manager.listTools(INSTANTLY_SERVER);
    console.log('Available Instantly tools:', tools);

    // Try different possible tool names for getting campaigns
    const possibleToolNames = [
      'get_campaigns',
      'list_campaigns',
      'campaigns_list',
      'fetch_campaigns',
      'instantly_get_campaigns',
      'campaigns_get',
    ];

    for (const toolName of possibleToolNames) {
      try {
        const result = await manager.callTool(INSTANTLY_SERVER, toolName, {}) as any;

        // Parse the result based on MCP response format
        if (result.content && Array.isArray(result.content)) {
          const textContent = result.content.find((c: any) => c.type === 'text');
          if (textContent && textContent.text) {
            const data = JSON.parse(textContent.text);
            return Array.isArray(data) ? data : data.campaigns || [];
          }
        }

        // If we successfully called a tool, return even if empty
        return [];
      } catch (error: unknown) {
        // If tool not found, try next name
        if (error instanceof Error && (error.message?.includes('not found') || error.message?.includes('unknown'))) {
          continue;
        }
        throw error;
      }
    }

    console.warn('No suitable campaign tool found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error fetching Instantly campaigns:', error);
    throw error;
  }
}

// Get details for a specific campaign
export async function getInstantlyCampaignDetails(campaignId: string): Promise<InstantlyCampaign | null> {
  try {
    await initInstantlyMCP();
    const manager = getMCPManager();

    const possibleToolNames = [
      'get_campaign_details',
      'campaign_details',
      'get_campaign',
      'fetch_campaign',
    ];

    for (const toolName of possibleToolNames) {
      try {
        const result = await manager.callTool(INSTANTLY_SERVER, toolName, {
          campaign_id: campaignId,
          campaignId: campaignId,
          id: campaignId,
        }) as any;

        if (result.content && Array.isArray(result.content)) {
          const textContent = result.content.find((c: any) => c.type === 'text');
          if (textContent && textContent.text) {
            return JSON.parse(textContent.text);
          }
        }

        return null;
      } catch (error: unknown) {
        if (error instanceof Error && (error.message?.includes('not found') || error.message?.includes('unknown'))) {
          continue;
        }
        throw error;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching Instantly campaign details:', error);
    throw error;
  }
}

// Get overall statistics
export async function getInstantlyStats(): Promise<unknown> {
  try {
    await initInstantlyMCP();
    const manager = getMCPManager();

    const possibleToolNames = [
      'get_stats',
      'stats',
      'get_statistics',
      'statistics',
      'get_metrics',
      'get_analytics',
      'analytics',
    ];

    for (const toolName of possibleToolNames) {
      try {
        const result = await manager.callTool(INSTANTLY_SERVER, toolName, {}) as any;

        if (result.content && Array.isArray(result.content)) {
          const textContent = result.content.find((c: any) => c.type === 'text');
          if (textContent && textContent.text) {
            return JSON.parse(textContent.text);
          }
        }

        return {};
      } catch (error: unknown) {
        if (error instanceof Error && (error.message?.includes('not found') || error.message?.includes('unknown'))) {
          continue;
        }
        throw error;
      }
    }

    return {};
  } catch (error) {
    console.error('Error fetching Instantly stats:', error);
    throw error;
  }
}
