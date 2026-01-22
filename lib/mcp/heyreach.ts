import { getMCPManager } from './client';
import { HeyreachCampaign } from '@/types/campaign';

const HEYREACH_SERVER = 'heyreach';

export async function initHeyreachMCP(config: { command: string; args: string[] }) {
  const manager = getMCPManager();
  await manager.connectToServer(HEYREACH_SERVER, config);
}

export async function getHeyreachCampaigns(): Promise<HeyreachCampaign[]> {
  try {
    const manager = getMCPManager();

    // List available tools to see what's available
    const tools = await manager.listTools(HEYREACH_SERVER);
    console.log('Available Heyreach tools:', tools);

    // Call the appropriate tool to fetch campaigns
    // Note: The exact tool name and parameters will depend on the MCP server implementation
    const result = await manager.callTool(HEYREACH_SERVER, 'get_campaigns', {});

    return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
  } catch (error) {
    console.error('Error fetching Heyreach campaigns:', error);
    throw error;
  }
}

export async function getHeyreachCampaignDetails(campaignId: string): Promise<HeyreachCampaign | null> {
  try {
    const manager = getMCPManager();

    const result = await manager.callTool(HEYREACH_SERVER, 'get_campaign_details', {
      campaign_id: campaignId,
    });

    return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
  } catch (error) {
    console.error('Error fetching Heyreach campaign details:', error);
    throw error;
  }
}

export async function getHeyreachStats(): Promise<unknown> {
  try {
    const manager = getMCPManager();

    const result = await manager.callTool(HEYREACH_SERVER, 'get_stats', {});

    return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : {};
  } catch (error) {
    console.error('Error fetching Heyreach stats:', error);
    throw error;
  }
}
