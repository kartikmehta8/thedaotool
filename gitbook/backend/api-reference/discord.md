# Discord API

Used to connect an organization account with Discord and select a channel for bounty notifications.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api/discord/oauth?userId=<uid>` | Initiate OAuth flow, returns redirect URL. |
| `GET` | `/api/discord/callback` | OAuth callback to exchange code for a token. |
| `GET` | `/api/discord/channels/:uid` | List channels where the bot and user share guilds. Requires organization auth. |
| `PUT` | `/api/discord/channel/:uid` | Save channel ID for posting updates. |
