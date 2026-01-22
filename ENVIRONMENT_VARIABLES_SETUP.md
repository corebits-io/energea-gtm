# How to Fix Your Vercel App: Adding Environment Variables (Non-Technical Guide)

Your Next.js app built successfully but needs **environment variables** to work. Follow these simple steps to add them.

---

## Step 1: Go to Your Vercel Project Settings

1. Open your browser and go to **vercel.com**
2. Log in to your account
3. Click on your project name (energea-gtm)
4. Click the **Settings** tab at the top

---

## Step 2: Find Environment Variables

1. In the left sidebar, click **Environment Variables**
2. You'll see a page to add variables

---

## Step 3: Add Each Variable (One at a Time)

You need to add 5 variables. For each one:

1. Click the **"Add New"** button (or the **"+"** button)
2. Type the **Name** (exactly as shown below)
3. Paste the **Value**
4. Make sure all three checkboxes are selected (Production, Preview, Development)
5. Click **"Add"**

---

## The 5 Variables to Add

### Variable 1: HEYREACH_MCP_URL
- **Name:** `HEYREACH_MCP_URL`
- **Value:** `https://mcp.heyreach.io/mcp`
- Click "Add"

### Variable 2: HEYREACH_MCP_KEY
- **Name:** `HEYREACH_MCP_KEY`
- **Value:** `SFvkj7RqIIGUKNkdDugDC4dc3yUcOfoRd8O7WhhTLx8=`
- Click "Add"

### Variable 3: INSTANTLY_MCP_URL
- **Name:** `INSTANTLY_MCP_URL`
- **Value:** `https://mcp.instantly.ai/mcp`
- Click "Add"

### Variable 4: INSTANTLY_MCP_KEY
- **Name:** `INSTANTLY_MCP_KEY`
- **Value:** Get this from your Instantly account
  - Go to https://app.instantly.ai/
  - Click **Integrations** → **API Keys**
  - Copy your API key
  - Paste it here
- Click "Add"

### Variable 5: OPENAI_API_KEY
- **Name:** `OPENAI_API_KEY`
- **Value:** Get this from OpenAI
  - Go to https://platform.openai.com/api-keys/
  - Click **"Create new secret key"**
  - Copy the key (it starts with `sk-`)
  - Paste it here
- Click "Add"

---

## Step 4: Redeploy Your App

1. Go to the **Deployments** tab at the top
2. Find your latest deployment (should say "Building" or show a time)
3. Click the three dots **"..."** on the right
4. Click **"Redeploy"**
5. Wait 2-3 minutes for it to redeploy

---

## Step 5: Check If It Works

1. Once redeployment is complete, visit your app URL (usually `https://your-project-name.vercel.app`)
2. The page should now load instead of showing 404
3. You should see your dashboard with campaign data

---

## If It Still Doesn't Work

**Go back to Environment Variables and check:**
- [ ] All 5 variables are listed
- [ ] No extra spaces in the values
- [ ] API keys are complete (didn't accidentally copy partial keys)
- [ ] All three checkboxes (Production, Preview, Development) are checked

Then redeploy again.

---

**That's it!** Your app should now be working.
