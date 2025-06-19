# Character Birthday Bot 🎂

A Discord bot that automatically posts character birthdays with beautiful embeds and customizable messages. Perfect for anime/manga communities and character fan clubs!

## ✨ Features

- **🎉 Automatic Birthday Posts**: Posts birthday messages at midnight (configurable timezone)
- **🎨 Beautiful Embeds**: Rich, colorful embeds with character images and themed messages
- **📝 Easy Management**: Add, edit, and delete character birthdays with slash commands
- **🔍 Smart Autocomplete**: Quick character selection with autocomplete functionality
- **🛡️ User Permissions**: Users can only manage their own character entries
- **📊 Comprehensive Logging**: Detailed logs for debugging and monitoring
- **⚙️ Configurable**: Easy configuration through environment variables

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- A Discord bot token
- Discord server with appropriate permissions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/character-birthday-bot.git
   cd character-birthday-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Discord bot credentials:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_client_id_here
   GUILD_ID=your_discord_guild_id_here
   BIRTHDAY_CHANNEL_ID=your_birthday_channel_id_here
   ```

4. **Deploy slash commands**
   ```bash
   # Deploy to your test server (guild)
   node deploy.js guild
   # Deploy globally (may take up to 1 hour)
   node deploy.js global
   # Force deploy to both
   node deploy.js force
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## 🚂 Railway Deployment

For easy cloud deployment, you can deploy this bot to Railway:

### Quick Deploy

1. **Fork this repository** to your GitHub account
2. **Sign up** at [Railway](https://railway.app)
3. **Create a new project** and select "Deploy from GitHub repo"
4. **Choose your forked repository**
5. **Add environment variables** in Railway dashboard:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `BIRTHDAY_CHANNEL_ID`
6. **Deploy!** Railway will automatically build and start your bot

### Manual Setup

For detailed Railway deployment instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md).

## 📋 Commands

### `/addbirthday`
Add a new character birthday.

**Options:**
- `name` (required): Character name (max 100 characters)
- `bday` (required): Birthday in MM-DD format (e.g., 01-15)
- `image` (required): Direct image URL of the character

**Example:**
```
/addbirthday name:Naruto bday:10-10 image:https://example.com/naruto.jpg
```

### `/deletebirthday`
Delete a character birthday (only your own entries).

**Options:**
- `name` (required): Character name (with autocomplete)

### `/editbirthday`
Edit a character's birthday (only your own entries).

**Options:**
- `name` (required): Character name (with autocomplete)
- `newbday` (required): New birthday in MM-DD format

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your Discord bot token | Yes |
| `CLIENT_ID` | Your Discord application client ID | Yes |
| `GUILD_ID` | Your Discord server ID | Yes |
| `BIRTHDAY_CHANNEL_ID` | Channel ID for birthday posts | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Customization

You can customize various aspects of the bot by editing `config.js`:

- **Embed Colors**: Change the embed color scheme
- **Scheduling**: Modify posting time and timezone
- **Validation**: Adjust character name and URL length limits
- **Error Messages**: Customize error messages

## 🏗️ Project Structure

```
character-birthday-bot/
├── commands/                 # Slash command implementations
│   └── addBirthdayCommand.mjs
├── services/                 # Business logic layer
│   └── birthdayService.js
├── utils/                    # Utility functions
│   ├── validation.js
│   └── logger.js
├── config.js                 # Configuration management
├── index.mjs                 # Main bot file
├── deploy.js                 # Unified command deployment script
├── birthdays.json            # Birthday data storage
├── package.json
└── README.md
```

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Code Quality
```bash
npm run lint
```

### Adding New Commands

1. Create a new command file in `commands/`
2. Export the command data and execute function
3. Register the command in `index.mjs`
4. Update `deploy.js`

## 📊 Logging

The bot includes comprehensive logging:

- **Info Logs**: Command executions, successful operations
- **Error Logs**: Errors with stack traces
- **Warning Logs**: Potential issues
- **Debug Logs**: Detailed information (development only)

Logs are stored in the `logs/` directory:
- `logs/info.log` - General information
- `logs/errors.log` - Error details

## 🚨 Troubleshooting

### Common Issues

**Bot not responding to commands:**
- Ensure slash commands are deployed: `npm run deploy`
- Check bot permissions in Discord
- Verify bot is online

**Birthday posts not appearing:**
- Check `BIRTHDAY_CHANNEL_ID` is correct
- Verify bot has permission to send messages in the channel
- Check timezone configuration

**Image not displaying:**
- Ensure image URL is direct (not Discord CDN)
- Verify image URL is accessible
- Check image format is supported

**Permission errors:**
- Ensure bot has required permissions
- Check user permissions for commands

### Getting Help

1. Check the logs in `logs/` directory
2. Verify your environment variables
3. Ensure all dependencies are installed
4. Check Discord bot permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Discord.js team for the excellent library
- The Discord developer community
- All contributors and users

---

**Happy Birthday to all your favorite characters! 🎉**

### Deploying Slash Commands

Use the unified deploy script:

- **Guild deploy (fast, for testing):**
  ```bash
  node deploy.js guild
  ```
- **Global deploy (production, may take up to 1 hour):**
  ```bash
  node deploy.js global
  ```
- **Force deploy to both:**
  ```bash
  node deploy.js force
  ```