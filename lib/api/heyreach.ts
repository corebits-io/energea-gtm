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
    // Try to get campaigns - the exact endpoint might vary
    // Common patterns: /campaigns, /campaign/list, /li_campaigns/GetAll
    const possibleEndpoints = [
      '/campaigns',
      '/campaign/list',
      '/li_campaigns/GetAll',
      '/campaign/GetAll',
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        const data = await fetchHeyreach(endpoint);

        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        } else if (data.campaigns && Array.isArray(data.campaigns)) {
          return data.campaigns;
        } else if (data.data && Array.isArray(data.data)) {
          return data.data;
        }
      } catch (error) {
        // If endpoint not found, try next one
        continue;
      }
    }

    console.warn('No suitable Heyreach campaigns endpoint found, returning empty array');
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
