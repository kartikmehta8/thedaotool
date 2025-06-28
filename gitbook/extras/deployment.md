# Deployment

1. Build the client: `npm run build` inside `client/` and deploy the static files to your hosting provider.
2. Create a `.env` file in `server/` with production values and run `docker compose up -d` to start the API and Redis.
3. Configure your reverse proxy (e.g. Nginx) to forward HTTPS traffic to the backend container.
