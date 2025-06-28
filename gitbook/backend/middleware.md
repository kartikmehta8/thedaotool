# Middleware

The backend uses a modular middleware system. `MiddlewareManager` loads implementations from `server/middlewares/implementations` and applies them to the Express app.

Notable middleware:

- **Core** – body parser, HTTP logging with Morgan, compression and centralized error handling.
- **Security** – CORS, Helmet, content type validation and rate limiting.
- **Auth** – JWT authentication, email verification check and ownership enforcement.
- **CacheMiddleware** – caches GET responses in Redis based on the request URL.
- **ValidationMiddleware** – validates request bodies and params using Joi schemas.
