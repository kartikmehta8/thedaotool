# The DAO Tool

![Banner](./server/docs/assets/banner.png)
A modern open-source platform to manage bounties, contributors, payments, and DAO workflows — all in one place.

![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Alpha-blue)

## Project Links

| Resource       | Link                                                                                     |
|----------------|------------------------------------------------------------------------------------------|
| Website        | [https://www.thedaotool.com](https://www.thedaotool.com)                                 |
| DAO App        | [https://app.thedaotool.com](https://app.thedaotool.com)                                 |
| Docs           | [https://docs.thedaotool.com](https://docs.thedaotool.com)                               |
| GitHub         | [https://github.com/kartikmehta8/thedaotool](https://github.com/kartikmehta8/thedaotool) |
| X              | [https://x.com/thedaotool](https://x.com/thedaotool)                               |
| Discord        | [https://discord.gg/VsyDp52Saq](https://discord.gg/VsyDp52Saq)                               |

**Follow us on [X](https://x.com/thedaotool) for the latest updates, feature releases, and announcements.**

## Getting Started

```bash
# Check CONTRIBUTING.md or docs for detailed instructions.
git clone https://github.com/kartikmehta8/thedaotool
cd thedaotool

# Install dependencies in client/ and server/
npm install

# Start development server.
npm run dev

# Start development client.
npm start
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5050  

## Tech Stack

- React + Ant Design (Frontend)
- Node.js + Express (Backend)
- Firebase (Database, Misc)
- Solana + Payman (Wallets & Payouts)

## Structured Logging

The backend uses **Pino** for JSON-based structured logging. Configure logging via environment variables:

- `LOG_LEVEL` - log level (default `info`)
- `LOG_TO_FILE` - set to `true` to write logs to `LOG_FILE`
- `LOG_FILE` - path for log file (default `logs/app.log`)

Metrics are exposed for Prometheus scraping at `/metrics`, and a simple `/health` endpoint reports application status.

All HTTP requests and key system actions are logged with user and IP context for
auditability.

## License

This project is licensed under the [MIT License](LICENSE).
