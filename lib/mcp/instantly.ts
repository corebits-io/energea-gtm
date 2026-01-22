import { getMCPManager } from './client';
import { InstantlyCampaign } from '@/types/campaign';

const INSTANTLY_SERVER = 'instantly';

export async function initInstantlyMCP(config: { command: string; args: string[] }) {
  const manager = getMCPManager();
  await manager.connectToServer(INSTANTLY_SERVER, config);
}

export async function getInstantlyCampaigns(): Promise<InstantlyCampaign[]> {
  try {
    const manager = getMCPManager();

    // List available tools to see what's available
    const tools = await manager.listTools(INSTANTLY_SERVER);
    console.log('Available Instantly tools:', tools);

    // Call the appropriate tool to fetch campaigns
    // Note: The exact tool name and parameters will depend on the MCP server implementation
    const result = await manager.callTool(INSTANTLY_SERVER, 'get_campaigns', {});

    return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
  } catch (error) {
    console.error('Error fetching Instantly campaigns:', error);
    throw error;
  }
}

export async function getInstantlyCampaignDetails(campaignId: string): Promise<InstantlyCampaign | null> {
  try {
    const manager = getMCPManager();

    const result = await manager.callTool(INSTANTLY_SERVER, 'get_campaign_details', {
      campaign_id: campaignId,
    });

    return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
  } catch (error) {
    console.error('Error fetching Instantly campaign details:', error);
    throw error;
  }
}

export async function getInstantlyStats(): Promise<unknown> {
  try {
    const manager = getMCPManager();

    const result = await manager.callTool(INSTANTLY_SERVER, 'get_stats', {});

    return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : {};
  } catch (error) {
    console.error('Error fetching Instantly stats:', error);
    throw error;
  }
}
