# Server Controllers (`server/controllers`)

Controllers contain the request handlers for each API route. They use services to perform actions and respond using `ResponseHelper`.
Key controllers include:

- `authController.js` – login, signup and OTP flows.
- `contributorController.js` – contributor dashboard operations.
- `organizationController.js` – bounty management and payments.
- `githubController.js` and `discordController.js` – integration callbacks.
- `walletController.js` – read balances and send SOL.
