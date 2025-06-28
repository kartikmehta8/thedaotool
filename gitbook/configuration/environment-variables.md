# Environment Variables

Both the server and client read variables from a `.env` file. See the provided `.env.sample` files for reference.

## Server `.env`

```
PORT=5050
NODE_ENV=production
FB_STORAGE_BUCKET=<firebase-bucket>
FB_REALTIME_DATABASE=<firebase-rtdb-url>
FRONTEND_URL=<frontend-url>
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-pass>
GITHUB_CLIENT_ID=<github-client-id>
GITHUB_CLIENT_SECRET=<github-client-secret>
SERVER_URL=<public-server-url>
DISCORD_CLIENT_ID=<discord-client-id>
DISCORD_CLIENT_SECRET=<discord-secret>
DISCORD_BOT_TOKEN=<bot-token>
JWT_SECRET=<random-secret>
JWT_EXPIRATION=12h
MAX_LOGIN_ATTEMPTS=3
ENCRYPTION_SECRET=<secret-for-encryption>
REDIS_URL=redis://redis:6379
PRIVY_APP_ID=<privy-app-id>
PRIVY_APP_SECRET=<privy-secret>
SOLANA_CAIP2=<solana-caip2>
SOLANA_RPC_URL=<solana-rpc>
```

## Client `.env`

```
REACT_APP_BACKEND_URL=http://localhost:5050
```
