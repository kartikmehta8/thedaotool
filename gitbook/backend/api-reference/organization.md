# Organization API

Requires JWT token with the `organization` role.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/organization/bounty` | Create a new bounty. |
| `DELETE` | `/api/organization/bounty/:id` | Delete bounty by ID. |
| `PUT` | `/api/organization/bounty/:id` | Update bounty fields. |
| `GET` | `/api/organization/bounties/:uid` | List all bounties created by the organization. |
| `PUT` | `/api/organization/bounties/:bountyId/unassign` | Remove contributor from bounty. |
| `POST` | `/api/organization/bounties/:bountyId/pay` | Pay a contributor through Privy. |
| `GET` | `/api/organization/contributor/:id` | Get contributor information. |
| `PUT` | `/api/organization/contributor/:id` | Update contributor profile fields. |
| `GET` | `/api/organization/profile/:uid` | Get organization profile. |
| `PUT` | `/api/organization/profile/:uid` | Update organization profile. |
| `GET` | `/api/organization/payments/:uid` | View bounty payment history. |
| `GET` | `/api/organization/analytics/:uid` | Retrieve organization analytics. |
