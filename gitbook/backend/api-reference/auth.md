# Authentication API

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/auth/login` | Login with email and password. Returns JWT token. |
| `POST` | `/api/auth/signup` | Create a new user. Body requires `email`, `password` and `role`. |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP to email. |
| `POST` | `/api/auth/reset-password` | Reset password using OTP token. |
| `POST` | `/api/auth/verify-email` | Send email verification OTP. |
| `POST` | `/api/auth/verify-token` | Verify an OTP token. |
