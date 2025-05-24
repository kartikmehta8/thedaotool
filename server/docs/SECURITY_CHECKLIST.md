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
- [x] Validate `content-type` on request Accept header (Content Negotiation) to allow only your supported format (e.g., `application/xml`, `application/json`, etc.) and respond with `406 Not Acceptable` response if not matched.
- [x] Validate `content-type` of posted data as you accept (e.g., `application/x-www-form-urlencoded`, `multipart/form-data`, `application/json`, etc.).
- [ ] Validate user input to avoid common vulnerabilities (e.g., `XSS`, `SQL-Injection`, `Remote Code Execution`, etc.).
- [x] Don't use any sensitive data (`credentials`, `Passwords`, `security tokens`, or `API keys`) in the URL, but use standard Authorization header.
- [x] Use only server-side encryption.

## Processing

- [x] Check if all the endpoints are protected behind authentication to avoid broken authentication process.
- [x] User own resource ID should be avoided. Use `/profile/organization` instead of `/profile/<ID>/organization`.
- [x] Don't auto-increment IDs. Use `UUID` instead.
- [ ] If you are dealing with huge amount of data, use Workers and Queues to process as much as possible in background and return response fast to avoid HTTP Blocking.
- [ ] Do not forget to turn the DEBUG mode OFF.
- [x] Use non-executable stacks when available.

## Output

- [x] Send `X-Content-Type-Options: nosniff` header.
- [x] Send `X-Frame-Options: deny` header.
- [x] Send `Content-Security-Policy: default-src 'none'` header.
- [x] Remove fingerprinting headers - `X-Powered-By`, `Server`, `X-AspNet-Version`, etc.
- [x] Force `content-type` for your response. If you return `application/json`, then your `content-type` response is `application/json`.
- [ ] Don't return sensitive data like `credentials`, `passwords`, or `security tokens`.
- [x] Return the proper status code according to the operation completed. (e.g., `200 OK`, `400 Bad Request`, `401 Unauthorized`, `405 Method Not Allowed`, etc.).

## CI & CD

- [ ] Audit your design and implementation with unit/integration tests coverage.
- [ ] Use a code review process and disregard self-approval.
- [ ] Continuously run security tests (static/dynamic analysis) on your code.
- [ ] Check your dependencies (both software and OS) for known vulnerabilities.
- [ ] Design a rollback solution for deployments.
