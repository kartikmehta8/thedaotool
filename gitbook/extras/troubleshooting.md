# Troubleshooting

- Ensure environment variables are set correctly. Missing credentials often result in startup failures.
- If Redis is not running the queues will fail to process jobs.
- For CORS errors on the frontend, verify that `FRONTEND_URL` in the server `.env` matches the client origin.
