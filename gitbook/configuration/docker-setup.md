# Docker Setup

The backend provides a `Dockerfile` and `docker-compose.yml` inside the `server/` folder.
Running `docker compose up --build` starts the API server and a Redis instance.
Environment variables are loaded from `.env`.

The frontend does not include a Dockerfile but can be run inside a Node container as shown in the installation guide.
