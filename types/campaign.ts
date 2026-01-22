// Campaign types for Heyreach and Instantly

export interface HeyreachCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  connectionsSent: number;
  connectionsAccepted: number;
  messagesSent: number;
  repliesReceived: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstantlyCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  repliesReceived: number;
  bounceRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMetrics {
  heyreach: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalConnectionsSent: number;
    totalConnectionsAccepted: number;
    averageAcceptanceRate: number;
    totalReplies: number;
    averageReplyRate: number;
    campaigns: HeyreachCampaign[];
  };
  instantly: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalEmailsSent: number;
    totalEmailsOpened: number;
    averageOpenRate: number;
    totalReplies: number;
    averageReplyRate: number;
    campaigns: InstantlyCampaign[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
