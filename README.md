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
- **AI**: OpenAI API (GPT-4o-mini) for conversational queries
- **Data Integration**: MCP (Model Context Protocol) for Heyreach and Instantly
- **Deployment**: Optimized for Vercel

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **OpenAI API Key**: Get one from [Anthropic Console](https://platform.openai.com/api-keys/)
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
# Required: OpenAI API Key for AI chat
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

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

This dashboard uses the Model Context Protocol (MCP) to connect to Heyreach and Instantly data sources via HTTP.

### Heyreach MCP Server

The dashboard connects to the official Heyreach MCP server at `https://mcp.heyreach.io/mcp`.

**Authentication:** Uses MCP key in the URL query parameter (`xMcpKey`)

**Configuration:**
```env
HEYREACH_MCP_URL=https://mcp.heyreach.io/mcp
HEYREACH_MCP_KEY=your_heyreach_mcp_key
```

### Instantly MCP Server

The dashboard connects to the official Instantly MCP server at `https://mcp.instantly.ai/mcp`.

**Authentication:** Uses API key in the Authorization header

**Configuration:**
```env
INSTANTLY_MCP_URL=https://mcp.instantly.ai/mcp
INSTANTLY_MCP_KEY=your_instantly_api_key
```

**Getting your Instantly API key:**
1. Log into your Instantly account
2. Go to Integrations → API Keys
3. Click "Create API Key"
4. Copy and securely store the key

### Tool Discovery

The dashboard automatically discovers available tools from both MCP servers and tries common tool names for fetching campaigns:

**Common tool names it tries:**
- `get_campaigns`, `list_campaigns`, `campaigns_list`, `fetch_campaigns`
- `get_campaign_details`, `campaign_details`, `get_campaign`
- `get_stats`, `stats`, `get_statistics`, `get_analytics`

The integration is flexible and will work with various tool naming conventions.

## Deployment

### Deploy to Vercel (Recommended)

#### Step 1: Create Vercel Account

Go to [Vercel](https://vercel.com) and sign up with your GitHub account.

#### Step 2: Import Your Repository

1. Click "Add New..." → "Project"
2. Select your GitHub repository (`corebits-io/energea-gtm`)
3. Choose the branch: `claude/campaign-stats-dashboard-YBINy` (or `main` after merging)

#### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

**Required:**
- `OPENAI_API_KEY` - Your Claude API key from [Anthropic Console](https://platform.openai.com/api-keys/)
- `HEYREACH_MCP_URL` - `https://mcp.heyreach.io/mcp`
- `HEYREACH_MCP_KEY` - Your Heyreach MCP key (already provided)
- `INSTANTLY_MCP_URL` - `https://mcp.instantly.ai/mcp`
- `INSTANTLY_MCP_KEY` - Your Instantly API key (get from Integrations → API Keys in Instantly)

**To add environment variables in Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add each variable with its value
3. Make sure to select all environments (Production, Preview, Development)

#### Step 4: Deploy

Click "Deploy" and Vercel will build and deploy your dashboard!

Your dashboard will be live at: `https://your-project-name.vercel.app`

### Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (will prompt for environment variables on first deploy)
vercel

# For production deployment
vercel --prod
```

### Environment Variables Reference

Make sure ALL these variables are set in Vercel:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `OPENAI_API_KEY` | Claude API key for AI chat | `sk-ant-xxxxx` |
| `HEYREACH_MCP_URL` | Heyreach MCP endpoint | `https://mcp.heyreach.io/mcp` |
| `HEYREACH_MCP_KEY` | Heyreach MCP authentication key | `SFvkj7...` |
| `INSTANTLY_MCP_URL` | Instantly MCP endpoint | `https://mcp.instantly.ai/mcp` |
| `INSTANTLY_MCP_KEY` | Instantly API key | Your API key from Instantly dashboard |

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

1. Verify your `OPENAI_API_KEY` is set correctly
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
