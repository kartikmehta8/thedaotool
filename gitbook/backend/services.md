# Services

Services in `server/services` encapsulate application logic and integrations.

## Database
- **FirestoreService** – wrapper around Firebase Firestore used for storing users, bounties and organizations. Handles encryption of sensitive fields.
- **RealtimeDatabaseService** – lightweight access to Firebase Realtime Database used for ephemeral data like chats and login attempts.

## Integrations
- **GithubService** – handles OAuth flow, repository selection and issue retrieval.
- **DiscordService** – manages Discord OAuth and channel management.
- **PrivyService** – wraps the Privy wallet API and provides Solana transactions.

## Misc
- **EmailService** – sends transactional emails using Nodemailer via the `EmailQueue`.
- **CacheService** – simple Redis client used by cache middleware.
- **AnalyticsService** – generates organization and contributor statistics.
- **LoginThrottleService** and **OTPTokenService** – assist with authentication flows.

## User Services
- **UserService**, **ContributorService**, **OrganizationService** and **WalletService** coordinate user-level operations.
