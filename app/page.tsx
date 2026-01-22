'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { CampaignTable } from '@/components/dashboard/campaign-table';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Mail,
  MessageSquare,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { CampaignMetrics } from '@/types/campaign';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaignData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchCampaignData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching campaign data:', err);
      setError('Failed to load campaign data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchCampaignData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Campaign Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor your Heyreach and Instantly campaigns in real-time
              </p>
            </div>
            <button
              onClick={fetchCampaignData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && !metrics ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : metrics ? (
          <>
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatsCard
                title="Total Heyreach Campaigns"
                value={metrics.heyreach.totalCampaigns}
                description={`${metrics.heyreach.activeCampaigns} active`}
                icon={Users}
              />
              <StatsCard
                title="Connection Acceptance Rate"
                value={`${metrics.heyreach.averageAcceptanceRate.toFixed(1)}%`}
                description={`${metrics.heyreach.totalConnectionsAccepted} / ${metrics.heyreach.totalConnectionsSent} connections`}
                icon={TrendingUp}
              />
              <StatsCard
                title="Total Instantly Campaigns"
                value={metrics.instantly.totalCampaigns}
                description={`${metrics.instantly.activeCampaigns} active`}
                icon={Mail}
              />
              <StatsCard
                title="Email Open Rate"
                value={`${metrics.instantly.averageOpenRate.toFixed(1)}%`}
                description={`${metrics.instantly.totalEmailsOpened} / ${metrics.instantly.totalEmailsSent} emails`}
                icon={Activity}
              />
            </div>

            {/* Performance Chart */}
            <div className="mb-8">
              <PerformanceChart
                heyreachCampaigns={metrics.heyreach.campaigns}
                instantlyCampaigns={metrics.instantly.campaigns}
              />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="campaigns" className="space-y-4">
              <TabsList>
                <TabsTrigger value="campaigns">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-6">
                <CampaignTable
                  campaigns={metrics.heyreach.campaigns}
                  platform="heyreach"
                />
                <CampaignTable
                  campaigns={metrics.instantly.campaigns}
                  platform="instantly"
                />
              </TabsContent>

              <TabsContent value="chat">
                <ChatInterface />
              </TabsContent>
            </Tabs>

            {/* Additional Stats */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Heyreach Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Connections Sent:</span>
                    <span className="font-semibold">{metrics.heyreach.totalConnectionsSent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Replies:</span>
                    <span className="font-semibold">{metrics.heyreach.totalReplies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reply Rate:</span>
                    <span className="font-semibold">{metrics.heyreach.averageReplyRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Instantly Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Emails Sent:</span>
                    <span className="font-semibold">{metrics.instantly.totalEmailsSent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Replies:</span>
                    <span className="font-semibold">{metrics.instantly.totalReplies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reply Rate:</span>
                    <span className="font-semibold">{metrics.instantly.averageReplyRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Campaign Analytics Dashboard &copy; 2024</p>
          <p className="mt-1">Powered by Heyreach & Instantly MCP Servers</p>
        </div>
      </footer>
    </div>
  );
}
