import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeyreachCampaign, InstantlyCampaign } from '@/types/campaign';

interface CampaignTableProps {
  campaigns: HeyreachCampaign[] | InstantlyCampaign[];
  platform: 'heyreach' | 'instantly';
}

function isHeyreachCampaign(campaign: HeyreachCampaign | InstantlyCampaign): campaign is HeyreachCampaign {
  return 'connectionsSent' in campaign;
}

export function CampaignTable({ campaigns, platform }: CampaignTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {platform === 'heyreach' ? 'Heyreach (LinkedIn)' : 'Instantly (Email)'} Campaigns
        </CardTitle>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No campaigns found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Campaign Name</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  {platform === 'heyreach' ? (
                    <>
                      <th className="text-right p-2 font-medium">Connections Sent</th>
                      <th className="text-right p-2 font-medium">Accepted</th>
                      <th className="text-right p-2 font-medium">Acceptance Rate</th>
                      <th className="text-right p-2 font-medium">Messages</th>
                      <th className="text-right p-2 font-medium">Replies</th>
                      <th className="text-right p-2 font-medium">Reply Rate</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right p-2 font-medium">Emails Sent</th>
                      <th className="text-right p-2 font-medium">Opened</th>
                      <th className="text-right p-2 font-medium">Open Rate</th>
                      <th className="text-right p-2 font-medium">Clicked</th>
                      <th className="text-right p-2 font-medium">Replies</th>
                      <th className="text-right p-2 font-medium">Reply Rate</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  if (isHeyreachCampaign(campaign)) {
                    const acceptanceRate =
                      campaign.connectionsSent > 0
                        ? ((campaign.connectionsAccepted / campaign.connectionsSent) * 100).toFixed(1)
                        : '0.0';
                    const replyRate =
                      campaign.messagesSent > 0
                        ? ((campaign.repliesReceived / campaign.messagesSent) * 100).toFixed(1)
                        : '0.0';

                    return (
                      <tr key={campaign.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{campaign.name}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="text-right p-2">{campaign.connectionsSent}</td>
                        <td className="text-right p-2">{campaign.connectionsAccepted}</td>
                        <td className="text-right p-2">{acceptanceRate}%</td>
                        <td className="text-right p-2">{campaign.messagesSent}</td>
                        <td className="text-right p-2">{campaign.repliesReceived}</td>
                        <td className="text-right p-2">{replyRate}%</td>
                      </tr>
                    );
                  } else {
                    const instantlyCampaign = campaign as InstantlyCampaign;
                    const openRate =
                      instantlyCampaign.emailsSent > 0
                        ? ((instantlyCampaign.emailsOpened / instantlyCampaign.emailsSent) * 100).toFixed(1)
                        : '0.0';
                    const replyRate =
                      instantlyCampaign.emailsSent > 0
                        ? ((instantlyCampaign.repliesReceived / instantlyCampaign.emailsSent) * 100).toFixed(1)
                        : '0.0';

                    return (
                      <tr key={instantlyCampaign.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{instantlyCampaign.name}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(instantlyCampaign.status)}>
                            {instantlyCampaign.status}
                          </Badge>
                        </td>
                        <td className="text-right p-2">{instantlyCampaign.emailsSent}</td>
                        <td className="text-right p-2">{instantlyCampaign.emailsOpened}</td>
                        <td className="text-right p-2">{openRate}%</td>
                        <td className="text-right p-2">{instantlyCampaign.emailsClicked}</td>
                        <td className="text-right p-2">{instantlyCampaign.repliesReceived}</td>
                        <td className="text-right p-2">{replyRate}%</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
