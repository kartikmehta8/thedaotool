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

- [x] Always validate `redirect_uri` server-side to allow only safelisted URLs.
- [x] Always try to exchange for code and not tokens (don't allow `response_type=token`).
- [x] Use `state` parameter with a random hash to prevent CSRF on the OAuth authorization process.
- [x] Define the default scope, and validate scope parameters for each application.

## Input

- [x] Use the proper HTTP method according to the operation: `GET (read)`, `POST (create)`, `PUT/PATCH (replace/update)`, and `DELETE (to delete a record)`, and respond with `405 Method Not Allowed` if the requested method isn't appropriate for the requested resource.
- [ ] Validate `content-type` on request Accept header (Content Negotiation) to allow only your supported format (e.g., `application/xml`, `application/json`, etc.) and respond with `406 Not Acceptable` response if not matched.
- [ ] Validate `content-type` of posted data as you accept (e.g., `application/x-www-form-urlencoded`, `multipart/form-data`, `application/json`, etc.).
- [ ] Validate user input to avoid common vulnerabilities (e.g., `XSS`, `SQL-Injection`, `Remote Code Execution`, etc.).
- [ ] Don't use any sensitive data (`credentials`, `Passwords`, `security tokens`, or `API keys`) in the URL, but use standard Authorization header.
- [x] Use only server-side encryption.
