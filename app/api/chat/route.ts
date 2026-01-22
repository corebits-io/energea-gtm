import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getHeyreachCampaigns } from '@/lib/api/heyreach';
import { getInstantlyCampaigns } from '@/lib/api/instantly';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fetch current campaign data to provide context
    const [heyreachCampaigns, instantlyCampaigns] = await Promise.all([
      getHeyreachCampaigns().catch(() => []),
      getInstantlyCampaigns().catch(() => []),
    ]);

    // Calculate key metrics
    const heyreachConnectionsSent = heyreachCampaigns.reduce((sum, c) => sum + (c.connectionsSent || 0), 0);
    const heyreachConnectionsAccepted = heyreachCampaigns.reduce((sum, c) => sum + (c.connectionsAccepted || 0), 0);
    const heyreachReplies = heyreachCampaigns.reduce((sum, c) => sum + (c.repliesReceived || 0), 0);
    const heyreachMessagesSent = heyreachCampaigns.reduce((sum, c) => sum + (c.messagesSent || 0), 0);

    const instantlyEmailsSent = instantlyCampaigns.reduce((sum, c) => sum + (c.emailsSent || 0), 0);
    const instantlyEmailsOpened = instantlyCampaigns.reduce((sum, c) => sum + (c.emailsOpened || 0), 0);
    const instantlyReplies = instantlyCampaigns.reduce((sum, c) => sum + (c.repliesReceived || 0), 0);

    const acceptanceRate = heyreachConnectionsSent > 0
      ? ((heyreachConnectionsAccepted / heyreachConnectionsSent) * 100).toFixed(2)
      : '0';

    const heyreachReplyRate = heyreachMessagesSent > 0
      ? ((heyreachReplies / heyreachMessagesSent) * 100).toFixed(2)
      : '0';

    const instantlyOpenRate = instantlyEmailsSent > 0
      ? ((instantlyEmailsOpened / instantlyEmailsSent) * 100).toFixed(2)
      : '0';

    const instantlyReplyRate = instantlyEmailsSent > 0
      ? ((instantlyReplies / instantlyEmailsSent) * 100).toFixed(2)
      : '0';

    // Build context for Claude
    const campaignContext = `
Current Campaign Data (as of ${new Date().toISOString()}):

HEYREACH (LinkedIn) CAMPAIGNS:
- Total Campaigns: ${heyreachCampaigns.length}
- Active Campaigns: ${heyreachCampaigns.filter(c => c.status === 'active').length}
- Total Connections Sent: ${heyreachConnectionsSent}
- Total Connections Accepted: ${heyreachConnectionsAccepted}
- Connection Acceptance Rate: ${acceptanceRate}%
- Total Messages Sent: ${heyreachMessagesSent}
- Total Replies: ${heyreachReplies}
- Reply Rate: ${heyreachReplyRate}%

Campaign Details:
${heyreachCampaigns.map(c => `
  - ${c.name} (${c.status})
    * Connections Sent: ${c.connectionsSent || 0}
    * Connections Accepted: ${c.connectionsAccepted || 0}
    * Acceptance Rate: ${c.connectionsSent > 0 ? ((c.connectionsAccepted / c.connectionsSent) * 100).toFixed(2) : '0'}%
    * Messages Sent: ${c.messagesSent || 0}
    * Replies: ${c.repliesReceived || 0}
    * Reply Rate: ${c.messagesSent > 0 ? ((c.repliesReceived / c.messagesSent) * 100).toFixed(2) : '0'}%
`).join('\n')}

INSTANTLY (Email) CAMPAIGNS:
- Total Campaigns: ${instantlyCampaigns.length}
- Active Campaigns: ${instantlyCampaigns.filter(c => c.status === 'active').length}
- Total Emails Sent: ${instantlyEmailsSent}
- Total Emails Opened: ${instantlyEmailsOpened}
- Open Rate: ${instantlyOpenRate}%
- Total Replies: ${instantlyReplies}
- Reply Rate: ${instantlyReplyRate}%

Campaign Details:
${instantlyCampaigns.map(c => `
  - ${c.name} (${c.status})
    * Emails Sent: ${c.emailsSent || 0}
    * Emails Opened: ${c.emailsOpened || 0}
    * Open Rate: ${c.emailsSent > 0 ? ((c.emailsOpened / c.emailsSent) * 100).toFixed(2) : '0'}%
    * Replies: ${c.repliesReceived || 0}
    * Reply Rate: ${c.emailsSent > 0 ? ((c.repliesReceived / c.emailsSent) * 100).toFixed(2) : '0'}%
`).join('\n')}
`;

    // Format conversation history for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a helpful GTM (Go-To-Market) analytics assistant for a B2B lead generation agency. You help analyze campaign performance data from Heyreach (LinkedIn outreach) and Instantly (email outreach) platforms.

Your role is to:
1. Answer questions about campaign performance with specific data and insights
2. Calculate and explain key metrics like reply rates, acceptance rates, open rates
3. Compare campaigns and provide recommendations
4. Identify trends and areas for improvement
5. Speak in a professional but friendly tone
6. Always cite specific numbers from the data when answering

When answering questions:
- Be specific with numbers and percentages
- Compare performance across campaigns when relevant
- Provide actionable insights
- Explain what metrics mean in GTM/sales context

Here's the current campaign data:
${campaignContext}`,
      },
    ];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    });

    // Call OpenAI API with GPT-4o-mini for cost-effective campaign analytics
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages,
    });

    const assistantMessage = response.choices[0]?.message?.content || 'Unable to generate response';

    return NextResponse.json({
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
