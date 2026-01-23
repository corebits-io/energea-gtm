import { HeyreachCampaign } from '@/types/campaign';

const HEYREACH_API_BASE_URL = process.env.HEYREACH_API_URL || 'https://api.heyreach.io/api/public';
const HEYREACH_API_KEY = process.env.HEYREACH_MCP_KEY;

async function fetchHeyreach(endpoint: string, options: RequestInit = {}) {
  if (!HEYREACH_API_KEY) {
    throw new Error('HEYREACH_MCP_KEY environment variable is not set');
  }

  const response = await fetch(`${HEYREACH_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'X-API-KEY': HEYREACH_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Heyreach API error on ${endpoint}: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Heyreach API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// Get list of campaigns from Heyreach
export async function getHeyreachCampaigns(): Promise<HeyreachCampaign[]> {
  try {
    // Try to get campaigns - testing multiple endpoint patterns
    const possibleEndpoints = [
      '/li_campaign/GetAll',
      '/campaign/GetAll',
      '/campaigns',
      '/campaign/list',
      '/li_campaigns/GetAll',
      '/Campaign/GetAll',
      '/v1/campaigns',
      '/api/campaigns',
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying Heyreach endpoint: ${endpoint}`);
        const data = await fetchHeyreach(endpoint);

        console.log(`Heyreach response from ${endpoint}:`, JSON.stringify(data).substring(0, 200));

        // Handle different response formats
        if (Array.isArray(data)) {
          console.log(`Success! Found campaigns array at ${endpoint}`);
          return data;
        } else if (data.campaigns && Array.isArray(data.campaigns)) {
          console.log(`Success! Found data.campaigns at ${endpoint}`);
          return data.campaigns;
        } else if (data.data && Array.isArray(data.data)) {
          console.log(`Success! Found data.data at ${endpoint}`);
          return data.data;
        } else if (data.items && Array.isArray(data.items)) {
          console.log(`Success! Found data.items at ${endpoint}`);
          return data.items;
        }
      } catch (error) {
        // Log the error and try next endpoint
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.log(`Heyreach endpoint ${endpoint} failed: ${errorMsg}`);
        continue;
      }
    }

    console.warn('No suitable Heyreach campaigns endpoint found after trying all options');
    return [];
  } catch (error) {
    console.error('Error fetching Heyreach campaigns:', error);
    return [];
  }
}

// Get details for a specific campaign
export async function getHeyreachCampaignDetails(campaignId: string): Promise<HeyreachCampaign | null> {
  try {
    const data = await fetchHeyreach(`/campaigns/${campaignId}`);
    return data;
  } catch (error) {
    console.error('Error fetching Heyreach campaign details:', error);
    return null;
  }
}

// Get overall statistics
export async function getHeyreachStats(): Promise<unknown> {
  try {
    const data = await fetchHeyreach('/stats');
    return data;
  } catch (error) {
    console.error('Error fetching Heyreach stats:', error);
    return {};
  }
}
