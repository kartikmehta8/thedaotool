# Queues

Background processing is handled with [Bull](https://github.com/OptimalBits/bull) and Redis.
`QueueManager` loads queue implementations from `server/queues/implementations` and registers processors.

Queues used:

- **EmailQueue** – sends emails via Nodemailer.
- **GitHubSyncQueue** – processes GitHub issue synchronization tasks triggered by cron or API calls.
- **OTPTokenCleanupQueue** – clears expired OTP records.

Each queue defines an `initialize` method where workers are registered (`QueueService.process`).
