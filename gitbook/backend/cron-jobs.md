# Cron Jobs

`server/cron` contains scheduled tasks implemented with `node-cron`. `CronManager` loads all jobs from the `implementations/` folder and schedules them when the server starts.

Jobs include:

- **GitHubSyncJob** – every 10 minutes new GitHub issues are fetched and stored in Firestore. See [`GitHubSyncJob.js`](../../server/cron/implementations/GitHubSyncJob.js).
- **LoginAttemptCleanupJob** – runs each minute and removes stale login attempts from the realtime database.
- **OTPTokenCleanupJob** – every 10 minutes removes expired OTP tokens.
