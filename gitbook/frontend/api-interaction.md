# API Interaction

All HTTP requests are performed using the helper `fetchWithAuth` which automatically adds the stored JWT token. Endpoints are defined under `client/src/api` and use the base URL from the `REACT_APP_BACKEND_URL` environment variable.
