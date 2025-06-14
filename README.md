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

## Web3Auth Setup

Payments are processed using [Web3Auth](https://web3auth.io). Create a Web3Auth project and obtain a client ID. Then set it in `client/.env`:

```bash
REACT_APP_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

Start the client and server normally after setting up the `.env` files.

## License

This project is licensed under the [MIT License](LICENSE).
