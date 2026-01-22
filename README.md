# Campaign Analytics Dashboard

A comprehensive real-time analytics dashboard for monitoring Heyreach (LinkedIn) and Instantly (Email) outreach campaigns. Built for GTM and B2B lead generation agencies.

## Features

- **Real-time Campaign Monitoring**: Track all your Heyreach and Instantly campaigns in one place
- **Key Metrics Visualization**: View connection acceptance rates, reply rates, open rates, and more
- **AI-Powered Insights**: Ask questions about your campaigns using natural language
- **Beautiful UI**: Clean, professional interface built with Next.js and shadcn/ui
- **Auto-refresh**: Data automatically refreshes every 5 minutes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Framework**: Next.js 14 (React 18) with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **AI**: Claude API (Anthropic) for conversational queries
- **Data Integration**: MCP (Model Context Protocol) for Heyreach and Instantly
- **Deployment**: Optimized for Vercel

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **Anthropic API Key**: Get one from [Anthropic Console](https://console.anthropic.com/)
3. **Heyreach MCP Server**: Access to your Heyreach MCP server configuration
4. **Instantly MCP Server**: Access to your Instantly MCP server configuration
5. **API Keys**: Heyreach and Instantly API keys (if required by your MCP servers)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/energea-gtm.git
cd energea-gtm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Required: Anthropic API Key for AI chat
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Required: Heyreach MCP Server Configuration
HEYREACH_MCP_COMMAND=npx
HEYREACH_MCP_ARGS=-y @your-org/heyreach-mcp-server

# Required: Instantly MCP Server Configuration
INSTANTLY_MCP_COMMAND=npx
INSTANTLY_MCP_ARGS=-y @your-org/instantly-mcp-server

# Optional: API Keys (if needed by your MCP servers)
HEYREACH_API_KEY=your_heyreach_api_key
INSTANTLY_API_KEY=your_instantly_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Dashboard Overview

The dashboard provides several key sections:

1. **Stats Cards**: Quick overview of total campaigns, acceptance rates, and open rates
2. **Performance Chart**: Visual comparison of average performance metrics
3. **Campaign Tables**: Detailed breakdown of each campaign with metrics
4. **AI Chat Interface**: Ask questions about your campaigns in natural language

### Asking Questions

Navigate to the "Ask Questions" tab and try queries like:

- "How are my campaigns performing?"
- "What is the reply rate for [campaign name]?"
- "What is the connection acceptance rate?"
- "Compare Heyreach and Instantly performance"
- "Which campaign has the highest engagement?"

The AI will analyze your current campaign data and provide detailed insights.

## MCP Server Configuration

This dashboard uses the Model Context Protocol (MCP) to connect to Heyreach and Instantly data sources.

### Setting up MCP Servers

You need to provide the command and arguments to run your MCP servers. For example:

**For Heyreach:**
```env
HEYREACH_MCP_COMMAND=npx
HEYREACH_MCP_ARGS=-y @your-org/heyreach-mcp-server
```

**For Instantly:**
```env
INSTANTLY_MCP_COMMAND=npx
INSTANTLY_MCP_ARGS=-y @your-org/instantly-mcp-server
```

### Expected MCP Server Tools

The dashboard expects your MCP servers to provide the following tools:

**Heyreach MCP Server:**
- `get_campaigns`: Returns list of all campaigns
- `get_campaign_details`: Returns details for a specific campaign
- `get_stats`: Returns overall statistics

**Instantly MCP Server:**
- `get_campaigns`: Returns list of all campaigns
- `get_campaign_details`: Returns details for a specific campaign
- `get_stats`: Returns overall statistics

If your MCP servers use different tool names, update the files in `lib/mcp/` accordingly.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Environment Variables in Production

Make sure to add all environment variables from `.env` to your Vercel project:

- `ANTHROPIC_API_KEY`
- `HEYREACH_MCP_COMMAND`
- `HEYREACH_MCP_ARGS`
- `INSTANTLY_MCP_COMMAND`
- `INSTANTLY_MCP_ARGS`
- `HEYREACH_API_KEY` (if needed)
- `INSTANTLY_API_KEY` (if needed)

## Project Structure

```
energea-gtm/
├── app/
│   ├── api/
│   │   ├── campaigns/          # Campaign data API endpoint
│   │   ├── chat/               # AI chat API endpoint
│   │   └── init/               # MCP initialization endpoint
│   ├── page.tsx                # Main dashboard page
│   └── layout.tsx              # Root layout
├── components/
│   ├── dashboard/
│   │   ├── stats-card.tsx      # Stats display cards
│   │   ├── campaign-table.tsx  # Campaign data tables
│   │   └── performance-chart.tsx # Performance charts
│   ├── chat/
│   │   └── chat-interface.tsx  # AI chat interface
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── mcp/
│   │   ├── client.ts           # MCP client manager
│   │   ├── heyreach.ts         # Heyreach MCP integration
│   │   └── instantly.ts        # Instantly MCP integration
│   └── utils.ts                # Utility functions
├── types/
│   └── campaign.ts             # TypeScript type definitions
└── public/                     # Static assets
```

## Customization

### Adding New Metrics

To add new metrics to the dashboard:

1. Update types in `types/campaign.ts`
2. Modify the API routes in `app/api/campaigns/route.ts`
3. Add new stat cards or charts in the main dashboard (`app/page.tsx`)

### Styling

The dashboard uses TailwindCSS. You can customize:

- Colors: Edit `app/globals.css` CSS variables
- Components: Modify shadcn/ui components in `components/ui/`
- Layout: Update `app/page.tsx`

## Troubleshooting

### MCP Connection Issues

If you see "Failed to fetch campaigns" errors:

1. Check that your MCP server commands are correct in `.env`
2. Verify your API keys are valid
3. Check the browser console and server logs for detailed error messages
4. Test your MCP servers independently

### Chat Not Working

If the AI chat doesn't respond:

1. Verify your `ANTHROPIC_API_KEY` is set correctly
2. Check your Anthropic API quota and billing
3. Check the browser console for error messages

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## Support

For issues or questions:

1. Check the [GitHub Issues](https://github.com/your-org/energea-gtm/issues)
2. Review the troubleshooting section above
3. Contact your MCP server provider for integration issues

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Recharts](https://recharts.org/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Made for GTM and B2B Lead Generation Agencies** 🚀
