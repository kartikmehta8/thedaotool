# Database

The project uses Firebase as its persistence layer.

- **Firestore** stores persistent data such as users, bounties and organization profiles. Access is wrapped in [`FirestoreService`](../../server/services/database/FirestoreService.js).
- **Realtime Database** stores ephemeral chat messages and login attempt counters via [`RealtimeDatabaseService`](../../server/services/database/RealtimeDatabaseService.js).

Sensitive fields (e.g. OAuth tokens) are encrypted before being saved using the `EncryptionService`.
