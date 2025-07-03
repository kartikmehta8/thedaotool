# Troubleshooting

![TROUBLESHOOTING](../.gitbook/assets/troubleshooting.png)

We're here to help you troubleshoot The DAO Tool! Below are quick tips and resources for resolving common problems.

## Where to get help

- **Telegram:** [t.me/thedaotool](https://t.me/thedaotool)
- **Discord:** [Join the Community](https://discord.gg/VsyDp52Saq)
- **Email:** [kartikmehta202@gmail.com](mailto:kartikmehta202@gmail.com)

## Documentation references

- **Local Setup Docs**
  - [GitHub](../local-setup/github.md) – configure GitHub OAuth.
  - [Discord Bot](../local-setup/discord-bot.md) – connect your server to Discord.
  - [Firebase](../local-setup/firebase.md) – database configuration.
  - [Privy](../local-setup/privy.md) – wallet setup.
  - [Mail Setup](../local-setup/mail-setup.md) – enable email features.
- **REST API Docs** – reference endpoints for Discord, GitHub, Wallet, and more!
- **Official Guides:**
  - [Discord Developer Docs](https://discord.com/developers/docs/intro)
  - [GitHub Docs](https://docs.github.com)
  - [Firebase Docs](https://firebase.google.com/docs)
  - [Privy Docs](https://docs.privy.io)
  - [npm Docs](https://docs.npmjs.com)

## Common issues and fixes

### Discord integration
- **OAuth not redirecting?** Ensure the callback URL in your Discord app matches `/api/discord/callback`.
- **Channels not showing up?** Check that your bot has permission to view channels in your Discord guild.

### GitHub integration
- **Repo list empty?** Confirm your GitHub token scopes include `repo`.
- **Webhook errors?** Verify the webhook URL and secret in your GitHub settings.

### Firebase
- **Cannot connect to database?** Make sure your Firebase service account credentials are correct and environment variables are loaded.

### Privy wallets
- **Balance shows 0?** The wallet might be on the wrong network. Check your network configuration.
- **Transaction failures?** Verify you have enough SOL for fees and that the Privy API keys are set.

### Packages and setup
- Run `npm install` inside both `client/` and `server/` to install all packages.
- If a package is missing or outdated, delete `node_modules` and reinstall.

## FAQ
- **Where is the code hosted?** The main repository lives at [GitHub](https://github.com/kartikmehta8/thedaotool).
- **Is there a Docker setup?** Yes, see [Running with Docker](../local-setup/docker.md).
- **How do I report a bug?** Open an [issue](https://github.com/kartikmehta8/thedaotool/issues) on GitHub or email us.

These resources should help with most setup and runtime issues. Feel free to reach out on Discord, Telegram, or email if you get stuck.
