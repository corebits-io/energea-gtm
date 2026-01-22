import { NextResponse } from 'next/server';
import { getHeyreachCampaigns } from '@/lib/api/heyreach';
import { getInstantlyCampaigns } from '@/lib/api/instantly';
import { CampaignMetrics } from '@/types/campaign';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch data from both platforms in parallel
    const [heyreachCampaigns, instantlyCampaigns] = await Promise.all([
      getHeyreachCampaigns().catch(() => []),
      getInstantlyCampaigns().catch(() => []),
    ]);

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

    // Calculate metrics for Instantly
    const instantlyMetrics = {
      totalCampaigns: instantlyCampaigns.length,
      activeCampaigns: instantlyCampaigns.filter((c) => c.status === 'active').length,
      totalEmailsSent: instantlyCampaigns.reduce((sum, c) => sum + (c.emailsSent || 0), 0),
      totalEmailsOpened: instantlyCampaigns.reduce((sum, c) => sum + (c.emailsOpened || 0), 0),
      averageOpenRate: 0,
      totalReplies: instantlyCampaigns.reduce((sum, c) => sum + (c.repliesReceived || 0), 0),
      averageReplyRate: 0,
      campaigns: instantlyCampaigns,
    };

    // Calculate open rate
    if (instantlyMetrics.totalEmailsSent > 0) {
      instantlyMetrics.averageOpenRate =
        (instantlyMetrics.totalEmailsOpened / instantlyMetrics.totalEmailsSent) * 100;
    }

    // Calculate reply rate
    if (instantlyMetrics.totalEmailsSent > 0) {
      instantlyMetrics.averageReplyRate =
        (instantlyMetrics.totalReplies / instantlyMetrics.totalEmailsSent) * 100;
    }

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
