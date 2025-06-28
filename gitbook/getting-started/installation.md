# Installation Guide

## Prerequisites

- **Node.js** 18 or later
- **npm** 9+
- **Docker** and **docker-compose** (optional for containerised setup)

## Running with Docker

```bash
cd server
cp .env.sample .env     # update values
docker compose up --build
```

The backend will be available on `http://localhost:5050` and Redis will run in a sidecar container.
Start the frontend in another terminal:

```bash
cd client
cp .env.sample .env     # set REACT_APP_BACKEND_URL
docker run --rm -p 3000:3000 -v $(pwd):/app node:18-alpine sh -c "npm install && npm start"
```

## Local Development

Install dependencies and run both apps with Node.js:

```bash
cd server && npm install
npm run dev
```

In a separate terminal:

```bash
cd client && npm install
npm start
```

The frontend runs on `http://localhost:3000` and communicates with the backend at `http://localhost:5050`.
