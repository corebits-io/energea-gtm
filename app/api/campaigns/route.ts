import { NextResponse } from 'next/server';
import { getHeyreachCampaigns } from '@/lib/api/heyreach';
import { getInstantlyCampaigns, getInstantlyCampaignAnalytics } from '@/lib/api/instantly';
import { CampaignMetrics } from '@/types/campaign';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch data from both platforms in parallel
    const [heyreachCampaigns, instantlyCampaigns, instantlyAnalytics] = await Promise.all([
      getHeyreachCampaigns().catch(() => []),
      getInstantlyCampaigns().catch(() => []),
      getInstantlyCampaignAnalytics().catch(() => null),
    ]);

    console.log('Instantly analytics response:', JSON.stringify(instantlyAnalytics).substring(0, 500));

    // Calculate metrics for Heyreach
    const heyreachMetrics = {
      totalCampaigns: heyreachCampaigns.length,
      activeCampaigns: heyreachCampaigns.filter((c) => c.status === 'active').length,
      totalConnectionsSent: heyreachCampaigns.reduce((sum, c) => sum + (c.connectionsSent || 0), 0),
      totalConnectionsAccepted: heyreachCampaigns.reduce((sum, c) => sum + (c.connectionsAccepted || 0), 0),
      averageAcceptanceRate: 0,
      totalReplies: heyreachCampaigns.reduce((sum, c) => sum + (c.repliesReceived || 0), 0),
      averageReplyRate: 0,
      campaigns: heyreachCampaigns,
    };

    // Calculate acceptance rate
    if (heyreachMetrics.totalConnectionsSent > 0) {
      heyreachMetrics.averageAcceptanceRate =
        (heyreachMetrics.totalConnectionsAccepted / heyreachMetrics.totalConnectionsSent) * 100;
    }

    // Calculate reply rate (based on messages sent)
    const totalMessagesSent = heyreachCampaigns.reduce((sum, c) => sum + (c.messagesSent || 0), 0);
    if (totalMessagesSent > 0) {
      heyreachMetrics.averageReplyRate = (heyreachMetrics.totalReplies / totalMessagesSent) * 100;
    }

    // Calculate metrics for Instantly using analytics data
    let totalEmailsSent = 0;
    let totalEmailsOpened = 0;
    let totalReplies = 0;

    // Parse analytics response - handle different possible formats
    if (instantlyAnalytics) {
      if (Array.isArray(instantlyAnalytics)) {
        // If analytics is an array of campaign stats
        totalEmailsSent = instantlyAnalytics.reduce((sum: number, stat: any) => sum + (stat.sent || stat.emails_sent || 0), 0);
        totalEmailsOpened = instantlyAnalytics.reduce((sum: number, stat: any) => sum + (stat.opened || stat.emails_opened || 0), 0);
        totalReplies = instantlyAnalytics.reduce((sum: number, stat: any) => sum + (stat.replies || stat.replied || 0), 0);
      } else if (typeof instantlyAnalytics === 'object') {
        // If analytics is a summary object
        totalEmailsSent = instantlyAnalytics.total_sent || instantlyAnalytics.sent || instantlyAnalytics.emails_sent || 0;
        totalEmailsOpened = instantlyAnalytics.total_opened || instantlyAnalytics.opened || instantlyAnalytics.emails_opened || 0;
        totalReplies = instantlyAnalytics.total_replies || instantlyAnalytics.replies || instantlyAnalytics.replied || 0;

        // Check if it has a data/items field with the actual stats
        const dataField = instantlyAnalytics.data || instantlyAnalytics.items || instantlyAnalytics.campaigns;
        if (Array.isArray(dataField)) {
          totalEmailsSent = dataField.reduce((sum: number, stat: any) => sum + (stat.sent || stat.emails_sent || 0), 0);
          totalEmailsOpened = dataField.reduce((sum: number, stat: any) => sum + (stat.opened || stat.emails_opened || 0), 0);
          totalReplies = dataField.reduce((sum: number, stat: any) => sum + (stat.replies || stat.replied || 0), 0);
        }
      }
    }

    console.log('Parsed Instantly stats:', { totalEmailsSent, totalEmailsOpened, totalReplies });

    const instantlyMetrics = {
      totalCampaigns: instantlyCampaigns.length,
      activeCampaigns: instantlyCampaigns.filter((c) => c.status === 'active').length,
      totalEmailsSent,
      totalEmailsOpened,
      averageOpenRate: totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0,
      totalReplies,
      averageReplyRate: totalEmailsSent > 0 ? (totalReplies / totalEmailsSent) * 100 : 0,
      campaigns: instantlyCampaigns,
    };

    const metrics: CampaignMetrics = {
      heyreach: heyreachMetrics,
      instantly: instantlyMetrics,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
