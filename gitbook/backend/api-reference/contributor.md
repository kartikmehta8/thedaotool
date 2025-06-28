# Contributor API

Requires JWT token with the `contributor` role.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/contributor/apply` | Apply to a bounty. Body: `bountyId`. |
| `POST` | `/api/contributor/submit` | Submit work for a bounty. Body: `bountyId`, `submittedLink`. |
| `GET` | `/api/contributor/bounties/:uid` | List bounties open or assigned to the contributor. |
| `GET` | `/api/contributor/profile/:uid` | Get contributor profile. |
| `PUT` | `/api/contributor/profile/:uid` | Update profile fields. |
| `PUT` | `/api/contributor/unassign` | Remove yourself from a bounty. Body: `bountyId`. |
| `GET` | `/api/contributor/payments/:uid` | View payment history. |
| `GET` | `/api/contributor/analytics/:uid` | Retrieve contributor statistics. |
