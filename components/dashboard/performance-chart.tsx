'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HeyreachCampaign, InstantlyCampaign } from '@/types/campaign';

interface PerformanceChartProps {
  heyreachCampaigns: HeyreachCampaign[];
  instantlyCampaigns: InstantlyCampaign[];
}

export function PerformanceChart({ heyreachCampaigns, instantlyCampaigns }: PerformanceChartProps) {
  // Prepare data for the chart
  const chartData = [
    {
      name: 'Heyreach',
      'Acceptance Rate': heyreachCampaigns.length > 0
        ? heyreachCampaigns.reduce((sum, c) => {
            const rate = c.connectionsSent > 0 ? (c.connectionsAccepted / c.connectionsSent) * 100 : 0;
            return sum + rate;
          }, 0) / heyreachCampaigns.length
        : 0,
      'Reply Rate': heyreachCampaigns.length > 0
        ? heyreachCampaigns.reduce((sum, c) => {
            const rate = c.messagesSent > 0 ? (c.repliesReceived / c.messagesSent) * 100 : 0;
            return sum + rate;
          }, 0) / heyreachCampaigns.length
        : 0,
    },
    {
      name: 'Instantly',
      'Open Rate': instantlyCampaigns.length > 0
        ? instantlyCampaigns.reduce((sum, c) => {
            const rate = c.emailsSent > 0 ? (c.emailsOpened / c.emailsSent) * 100 : 0;
            return sum + rate;
          }, 0) / instantlyCampaigns.length
        : 0,
      'Reply Rate': instantlyCampaigns.length > 0
        ? instantlyCampaigns.reduce((sum, c) => {
            const rate = c.emailsSent > 0 ? (c.repliesReceived / c.emailsSent) * 100 : 0;
            return sum + rate;
          }, 0) / instantlyCampaigns.length
        : 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Performance Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(2) : '0.00'}%`} />
            <Legend />
            <Bar dataKey="Acceptance Rate" fill="#3b82f6" />
            <Bar dataKey="Open Rate" fill="#10b981" />
            <Bar dataKey="Reply Rate" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
