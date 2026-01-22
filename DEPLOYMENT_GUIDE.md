# Deployment Guide for Campaign Analytics Dashboard

This guide will walk you through deploying your dashboard to Vercel step-by-step.

## Prerequisites Checklist

Before you begin, make sure you have:

- [x] **Heyreach MCP Key**: Already configured (`SFvkj7RqIIGUKNkdDugDC4dc3yUcOfoRd8O7WhhTLx8=`)
- [ ] **Instantly API Key**: Get from [Instantly Dashboard](https://app.instantly.ai/) → Integrations → API Keys
- [ ] **Anthropic API Key**: Get from [Anthropic Console](https://console.anthropic.com/)
- [ ] **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step 1: Get Your Instantly API Key

1. Log into your Instantly account at https://app.instantly.ai/
2. Go to **Integrations** → **API Keys**
3. Click **"Create API Key"**
4. **Copy the key** (you'll need this for Vercel)
5. Keep it safe - treat it like a password!

## Step 2: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in with your account
3. Go to **API Keys** in the dashboard
4. Click **"Create Key"**
5. **Copy the API key** (starts with `sk-ant-`)
6. Save it securely!

## Step 3: Deploy to Vercel

### A. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

### B. Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select your repository: **`corebits-io/energea-gtm`**
3. Select the branch: **`claude/campaign-stats-dashboard-YBINy`**
4. Click **"Import"**

### C. Configure Environment Variables

**IMPORTANT:** Before clicking "Deploy", you need to add environment variables!

1. In the deployment configuration screen, expand **"Environment Variables"**
2. Add the following variables one by one:

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` | From Step 2 (Anthropic Console) |
| `HEYREACH_MCP_URL` | `https://mcp.heyreach.io/mcp` | Copy exactly as shown |
| `HEYREACH_MCP_KEY` | `SFvkj7RqIIGUKNkdDugDC4dc3yUcOfoRd8O7WhhTLx8=` | Already configured |
| `INSTANTLY_MCP_URL` | `https://mcp.instantly.ai/mcp` | Copy exactly as shown |
| `INSTANTLY_MCP_KEY` | Your API key from Step 1 | From Instantly dashboard |

3. For each variable:
   - Click **"Add"** or the **"+"** button
   - Enter the **variable name** (exactly as shown above)
   - Enter the **value**
   - Make sure **all environments** are selected (Production, Preview, Development)
   - Click **"Add"**

### D. Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Vercel will build and deploy your dashboard (takes 2-3 minutes)
3. Once complete, you'll get a live URL like: `https://energea-gtm-xxxx.vercel.app`

## Step 4: Test Your Dashboard

1. Visit your deployed URL
2. The dashboard should load and show:
   - Stats cards at the top
   - Performance charts
   - Campaign tables for Heyreach and Instantly
   - AI chat interface in the "Ask Questions" tab

3. If you see "Failed to fetch campaigns":
   - Check that all environment variables are correctly set in Vercel
   - Make sure there are no extra spaces in the values
   - Verify your API keys are valid

## Step 5: Using the Dashboard

### Viewing Campaigns

- The dashboard automatically refreshes every 5 minutes
- Click **"Refresh Data"** button for manual refresh
- View detailed metrics for each campaign in the tables

### Asking Questions with AI

1. Click the **"Ask Questions"** tab
2. Try these example questions:
   - "How are my campaigns performing?"
   - "What is the reply rate for [campaign name]?"
   - "What is the connection acceptance rate?"
   - "Compare Heyreach and Instantly performance"

3. The AI will analyze your real campaign data and provide insights!

## Troubleshooting

### "Failed to fetch campaigns" Error

**Solution:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Verify all 5 variables are set correctly
3. Check for typos or extra spaces
4. Re-deploy: Deployments → Click "..." → Redeploy

### "ANTHROPIC_API_KEY is not set" Error

**Solution:**
1. Make sure you added `ANTHROPIC_API_KEY` in Vercel
2. The value should start with `sk-ant-`
3. Redeploy after adding it

### Campaigns Show Empty

**Possible reasons:**
- Your Heyreach/Instantly accounts might not have any campaigns yet
- The MCP server might be experiencing issues
- Check the browser console (F12) for detailed errors

### Need to Update Environment Variables

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Find the variable you want to update
3. Click the **"..."** menu → **"Edit"**
4. Update the value
5. Go to Deployments → Click **"..."** on latest deployment → **"Redeploy"**

## Next Steps

### Set Up Custom Domain (Optional)

1. In Vercel, go to your project → Settings → Domains
2. Add your custom domain (e.g., `campaigns.youragency.com`)
3. Follow Vercel's instructions to configure DNS
4. Your dashboard will be available at your custom domain!

### Share with Your Client

Send your client:
- The dashboard URL
- A brief guide on how to use it
- Suggested questions they can ask the AI

### Monitor Usage

- Go to Vercel dashboard to monitor:
  - Number of visits
  - API usage
  - Performance metrics

## Support

If you encounter any issues:

1. **Check Vercel Logs:**
   - Go to your project in Vercel
   - Click "Functions" tab
   - View real-time logs to see errors

2. **Verify MCP Connections:**
   - The dashboard has a diagnostic endpoint: `/api/init`
   - POST to this endpoint to test MCP connections

3. **Review Environment Variables:**
   - Double-check all 5 required variables are set
   - Ensure no trailing spaces or incorrect values

---

## Summary Checklist

- [ ] Got Instantly API key
- [ ] Got Anthropic API key
- [ ] Created Vercel account
- [ ] Imported GitHub repository to Vercel
- [ ] Added all 5 environment variables
- [ ] Successfully deployed
- [ ] Tested dashboard URL
- [ ] Dashboard shows campaign data
- [ ] AI chat is working

**Congratulations!** Your Campaign Analytics Dashboard is now live! 🎉

Your client can now monitor their Heyreach and Instantly campaigns in real-time and ask AI-powered questions about their performance.
