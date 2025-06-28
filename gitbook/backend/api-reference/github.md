# GitHub API

Enables GitHub repository integration for organizations.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/api/github/auth?userId=<uid>` | Initiate OAuth and return redirect URL. |
| `GET` | `/api/github/callback` | OAuth callback to store the access token. |
| `GET` | `/api/github/repos/:uid` | List repositories of the authenticated user. Requires organization auth. |
| `POST` | `/api/github/repo/:uid` | Save selected repository and trigger issue sync. |
