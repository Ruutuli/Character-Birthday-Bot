# Railway Deployment Guide

This guide will help you deploy your Character Birthday Bot to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A Discord bot token and application
3. Your Discord server (guild) ID
4. A Discord channel ID for birthday posts

## Step 1: Prepare Your Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or use an existing one
3. Go to the "Bot" section and create a bot
4. Copy your bot token
5. Go to "OAuth2" > "URL Generator"
6. Select the following scopes:
   - `bot`
   - `applications.commands`
7. Select the following bot permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Attach Files
8. Copy the generated URL and invite the bot to your server

## Step 2: Get Required IDs

1. **Client ID**: Found in your Discord application's "General Information" page
2. **Guild ID**: Right-click your server name and select "Copy Server ID" (Developer Mode must be enabled)
3. **Birthday Channel ID**: Right-click the channel where you want birthday posts and select "Copy Channel ID"

## Step 3: Deploy to Railway

### Option A: Deploy from GitHub

1. Push your code to a GitHub repository
2. Go to [Railway Dashboard](https://railway.app/dashboard)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will automatically detect it's a Node.js project

### Option B: Deploy from Local Files

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

## Step 4: Configure Environment Variables

In your Railway project dashboard:

1. Go to the "Variables" tab
2. Add the following environment variables:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
BIRTHDAY_CHANNEL_ID=your_channel_id_here
```

## Step 5: Deploy Commands

The bot will automatically deploy slash commands during the build process. If you need to manually deploy commands:

1. Go to your Railway project
2. Open the terminal
3. Run: `npm run deploy`

## Step 6: Verify Deployment

1. Check the Railway logs to ensure the bot started successfully
2. Verify the bot appears online in your Discord server
3. Test the slash commands in your Discord server

## Troubleshooting

### Bot Not Starting
- Check Railway logs for errors
- Verify all environment variables are set correctly
- Ensure your Discord bot token is valid

### Commands Not Working
- Wait up to 1 hour for global commands to propagate
- Check if the bot has the necessary permissions
- Verify the bot is in the correct server

### Bot Going Offline
- Railway will automatically restart the bot if it crashes
- Check logs for any runtime errors
- Ensure your bot token hasn't been regenerated

## Monitoring

- Railway provides built-in monitoring and logging
- Check the "Metrics" tab for performance data
- Use the "Logs" tab to debug issues

## Scaling

Railway automatically scales your application based on demand. You can also manually adjust resources in the project settings.

## Cost

Railway offers a free tier with generous limits. Check their pricing page for current rates and limits. 