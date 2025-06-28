# Wallet API

Authenticated contributors or organizations can check balances and send payments.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api/wallet/balance` | Returns SOL balance of the authenticated user. |
| `POST` | `/api/wallet/send` | Send SOL to another address. Body: `toAddress`, `amount`. |
