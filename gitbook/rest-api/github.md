# GitHub API

Routes for GitHub repository management and authentication.

- **GET /api/github/auth** - begin OAuth process
- **GET /api/github/callback** - handle OAuth callback
- **GET /api/github/list-repos** - list repositories for the authenticated user
- **POST /api/github/save-repo** - save a repository to the organization
