# Running with Docker

This section will help you get The DAO Tool backend running using Docker and Docker Compose.

![DOCKER SETUP](../.gitbook/assets/docker/docker-banner.png)

## Prerequisites

- Make sure you have **Docker** and **Docker Compose** installed.  
  👉 [Download Docker](https://www.docker.com/products/docker-desktop)

## Steps

1. Navigate to the `server` directory:

```bash
cd server/
```

2. **Update your `.env` file** with all required values:
   - Firebase credentials
   - GitHub OAuth details
   - Privy keys
   - SMTP credentials
   - Solana variables
   - JWT + encryption secrets

3. **Use the following `docker-compose.yml`:**

```yaml
services:
  bizzynetwork:
    build: .
    container_name: bizzy-backend
    environment:
      - PORT=5050
      - NODE_ENV=production
      - FB_STORAGE_BUCKET=${FB_STORAGE_BUCKET}
      - FB_REALTIME_DATABASE=${FB_REALTIME_DATABASE}
      - FRONTEND_URL=${FRONTEND_URL}
      - GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
      - GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
      - SERVER_URL=${SERVER_URL}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
      - DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
      - DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRATION=${JWT_EXPIRATION}
      - MAX_LOGIN_ATTEMPTS=${MAX_LOGIN_ATTEMPTS}
      - ENCRYPTION_SECRET=${ENCRYPTION_SECRET}
      - REDIS_URL=redis://redis:6379
      - PRIVY_APP_ID=${PRIVY_APP_ID}
      - PRIVY_APP_SECRET=${PRIVY_APP_SECRET}
      - SOLANA_CAIP2=${SOLANA_CAIP2}
      - SOLANA_RPC_URL=${SOLANA_RPC_URL}
    restart: unless-stopped
    ports:
      - "5050:5050"
    depends_on:
      - redis

  redis:
    image: redis:alpine
    restart: unless-stopped
```

4. **Build and run the services:**

```bash
docker compose build
docker compose up -d
```

Your backend should now be live at `http://localhost:5050`.

Need help? Ping us in [Telegram](https://t.me/thedaotool) or open an [issue](https://github.com/kartikmehta8/thedaotool/issues) on GitHub.
