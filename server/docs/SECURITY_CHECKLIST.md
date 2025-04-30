# API Security Checklist

Checklist of the most important security countermeasures when designing, testing, and releasing API.

## Authentication

- [x] Don't use `Basic Auth`. Use standard authentication instead (e.g., [JWT](https://jwt.io/)).
- [x] Don't reinvent the wheel in `Authentication`, `token generation`, `password storage`. Use the standards.
- [x] Use `Max Retry` and jail features in Login along with Rate Limiter.
- [x] Use encryption on all sensitive data.
