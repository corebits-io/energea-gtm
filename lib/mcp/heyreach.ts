import { getMCPManager, MCPConfig } from './client';
import { HeyreachCampaign } from '@/types/campaign';

const HEYREACH_SERVER = 'heyreach';

// Initialize Heyreach MCP connection
export async function initHeyreachMCP() {
  const manager = getMCPManager();

  // Check if already connected
  if (manager.isConnected(HEYREACH_SERVER)) {
    return;
  }

  // Get configuration from environment
  const mcpUrl = process.env.HEYREACH_MCP_URL || 'https://mcp.heyreach.io/mcp';
  const mcpKey = process.env.HEYREACH_MCP_KEY;

  if (!mcpKey) {
    throw new Error('HEYREACH_MCP_KEY environment variable is not set');
  }

  // Build the full URL with the key
  const fullUrl = `${mcpUrl}?xMcpKey=${encodeURIComponent(mcpKey)}`;

  const config: MCPConfig = {
    type: 'http',
    url: fullUrl,
  };

  await manager.connectToServer(HEYREACH_SERVER, config);
}

// Get list of campaigns from Heyreach
export async function getHeyreachCampaigns(): Promise<HeyreachCampaign[]> {
  try {
    // Ensure connection is established
    await initHeyreachMCP();

    const manager = getMCPManager();

    // List available tools to understand what's available
    const tools = await manager.listTools(HEYREACH_SERVER);
    console.log('Available Heyreach tools:', tools);

    // Try different possible tool names for getting campaigns
    const possibleToolNames = [
      'get_campaigns',
      'list_campaigns',
      'campaigns_list',
      'fetch_campaigns',
      'heyreach_get_campaigns',
    ];

    for (const toolName of possibleToolNames) {
      try {
        const result: unknown = await manager.callTool(HEYREACH_SERVER, toolName, {});

        // Parse the result based on MCP response format
        if (result.content && Array.isArray(result.content)) {
          const textContent = result.content.find((c: unknown) => c.type === 'text');
          if (textContent && textContent.text) {
            const data = JSON.parse(textContent.text);
            return Array.isArray(data) ? data : data.campaigns || [];
          }
        }

        // If we successfully called a tool, return even if empty
        return [];
      } catch (error: unknown) {
        // If tool not found, try next name
        if (error.message?.includes('not found') || error.message?.includes('unknown')) {
          continue;
        }
        throw error;
      }
    }

    console.warn('No suitable campaign tool found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error fetching Heyreach campaigns:', error);
    throw error;
  }
}

// Get details for a specific campaign
export async function getHeyreachCampaignDetails(campaignId: string): Promise<HeyreachCampaign | null> {
  try {
    await initHeyreachMCP();
    const manager = getMCPManager();

    const possibleToolNames = [
      'get_campaign_details',
      'campaign_details',
      'get_campaign',
      'fetch_campaign',
    ];

    for (const toolName of possibleToolNames) {
      try {
        const result: unknown = await manager.callTool(HEYREACH_SERVER, toolName, {
          campaign_id: campaignId,
          campaignId: campaignId,
          id: campaignId,
        });

        if (result.content && Array.isArray(result.content)) {
          const textContent = result.content.find((c: unknown) => c.type === 'text');
          if (textContent && textContent.text) {
            return JSON.parse(textContent.text);
          }
        }

        return null;
      } catch (error: unknown) {
        if (error.message?.includes('not found') || error.message?.includes('unknown')) {
          continue;
        }
        throw error;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching Heyreach campaign details:', error);
    throw error;
  }
}

// Get overall statistics
export async function getHeyreachStats(): Promise<unknown> {
  try {
    await initHeyreachMCP();
    const manager = getMCPManager();

    const possibleToolNames = [
      'get_stats',
      'stats',
      'get_statistics',
      'statistics',
      'get_metrics',
    ];

    for (const toolName of possibleToolNames) {
      try {
        const result: unknown = await manager.callTool(HEYREACH_SERVER, toolName, {});

        if (result.content && Array.isArray(result.content)) {
          const textContent = result.content.find((c: unknown) => c.type === 'text');
          if (textContent && textContent.text) {
            return JSON.parse(textContent.text);
          }
        }

        return {};
      } catch (error: unknown) {
        if (error.message?.includes('not found') || error.message?.includes('unknown')) {
          continue;
        }
        throw error;
      }
    }

    return {};
  } catch (error) {
    console.error('Error fetching Heyreach stats:', error);
    throw error;
  }
}
