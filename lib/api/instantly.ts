import { InstantlyCampaign } from '@/types/campaign';

const INSTANTLY_API_BASE_URL = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v2';
const INSTANTLY_API_KEY = process.env.INSTANTLY_MCP_KEY;

async function fetchInstantly(endpoint: string, options: RequestInit = {}) {
  if (!INSTANTLY_API_KEY) {
    throw new Error('INSTANTLY_MCP_KEY environment variable is not set');
  }

  const response = await fetch(`${INSTANTLY_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${INSTANTLY_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Instantly API error on ${endpoint}: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Instantly API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// Get list of campaigns from Instantly
export async function getInstantlyCampaigns(): Promise<InstantlyCampaign[]> {
  try {
    const data = await fetchInstantly('/campaigns?limit=100');

    // Handle response format
    if (Array.isArray(data)) {
      return data;
    } else if (data.campaigns && Array.isArray(data.campaigns)) {
      return data.campaigns;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    console.warn('Unexpected Instantly campaigns response format');
    return [];
  } catch (error) {
    console.error('Error fetching Instantly campaigns:', error);
    return [];
  }
}

// Get analytics for campaigns
export async function getInstantlyCampaignAnalytics(campaignIds?: string[]): Promise<unknown> {
  try {
    const endpoint = campaignIds && campaignIds.length > 0
      ? `/analytics/campaign?campaign_ids=${campaignIds.join(',')}`
      : '/analytics/campaign';

    const data = await fetchInstantly(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching Instantly campaign analytics:', error);
    return {};
  }
}

// Get details for a specific campaign
export async function getInstantlyCampaignDetails(campaignId: string): Promise<InstantlyCampaign | null> {
  try {
    const data = await fetchInstantly(`/campaign/${campaignId}`);
    return data;
  } catch (error) {
    console.error('Error fetching Instantly campaign details:', error);
    return null;
  }
}
