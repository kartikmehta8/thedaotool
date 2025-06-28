# Backend Documentation Overview

The backend is an Express application located in the `server/` directory. It exposes REST APIs, manages queues, schedules cron jobs and integrates with external services like GitHub, Discord and Privy.

Main modules:

- **Controllers** – handle request logic
- **Routes** – register endpoints and apply middleware
- **Services** – encapsulate business logic and external integrations
- **Middlewares** – reusable Express middleware classes
- **Queues** – background jobs powered by Bull and Redis
- **Cron Jobs** – scheduled tasks using `node-cron`

Configuration is controlled via environment variables loaded from `.env` (see [Environment Variables](../configuration/environment-variables.md)).
