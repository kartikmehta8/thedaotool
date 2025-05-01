# API Security Checklist

Checklist of the most important security countermeasures when designing, testing, and releasing API.

## Authentication

- [x] Don't use `Basic Auth`. Use standard authentication instead (e.g., [JWT](https://jwt.io/)).
- [x] Don't reinvent the wheel in `Authentication`, `token generation`, `password storage`. Use the standards.
- [x] Use `Max Retry` and jail features in Login along with Rate Limiter.
- [x] Use encryption on all sensitive data.

## JWT (JSON Web Token)

- [x] Use a random complicated key (`JWT Secret`) to make brute forcing the token very hard.
- [x] Don't extract the algorithm from the header. Force the algorithm in the backend (`HS256` or `RS256`).
- [x] Make token expiration (`TTL`, `RTTL`) as short as possible.
- [x] Don't store sensitive data in the JWT payload, it can be decoded [easily](https://jwt.io/#debugger-io).
- [x] Avoid storing too much data. JWT is usually shared in headers and they have a size limit.

## Access

- [x] Limit requests (Throttling) to avoid DDoS / brute-force attacks.
- [x] Use HTTPS on server side with TLS 1.2+ and secure ciphers to avoid MITM (Man in the Middle Attack).
- [x] Use `HSTS` header with SSL to avoid SSL Strip attacks.
- [x] Turn off directory listings.
- [x] For private APIs, allow access only from safelisted IPs/hosts.

## Authorization

### OAuth

- [ ] Always validate `redirect_uri` server-side to allow only safelisted URLs.
- [ ] Always try to exchange for code and not tokens (don't allow `response_type=token`).
- [ ] Use `state` parameter with a random hash to prevent CSRF on the OAuth authorization process.
- [ ] Define the default scope, and validate scope parameters for each application.
