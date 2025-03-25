# Bizzy Network – Powered by PaymanAI

![banner](./src/assets/banner.png)

**Bizzy Network** is a full-stack, payman-based task marketplace built to connect businesses with contractors seamlessly. The platform automates the entire workflow—from contract creation and assignment to real-time collaboration and final payment—by integrating Firebase, React, and the powerful **PaymanAI Payment SDK**.

## Key Features

![Workflow](./src/assets/workflow.svg)

- **Create & manage contracts**: Define task details, deadlines, budgets.
- **Assign contractors & track status**: `open`, `assigned`, `pending_payment`, `paid`.
- **Payee creation + direct payments** using PaymanAI SDK.
- **Real-time chat** between business and contractor (per contract).
- **Modern dark-themed UI** with role-based dashboards (business & contractor).
- **Manage profiles**: Users can update tags, skills, and account info.

## Payment Flow

1. Businesses create a **payee profile** for each contractor (once).
2. Upon submission, contractors mark work as `pending_payment`.
3. Businesses review and **send payments** securely using **PaymanAI**.
4. Transaction metadata and tracking are stored for transparency.

## Value for PaymanAI

| Impact Area | Value |
|-------------|--------|
| **Adoption** | Opens up a new **B2B task marketplace** use case |
| **Stickiness** | High-frequency usage for recurring contractors |
| **Expansion** | Room to integrate **Payman Agents**, AI recommendations, escrow |

## SWOT Analysis

| Strengths | Opportunities |
|-----------|---------------|
| Covers full contract lifecycle (create → assign → submit → pay) | Leverage international payout rails |
| Seamless payee creation via PaymanAI SDK | Offer premium features like analytics, escrow, and automation |

| Weaknesses | Threats |
|------------|---------|
| Payee creation still requires some business-side manual input | PaymanAI API downtime could affect payment workflows |
| No deep reporting, summaries (planned for future releases) | Competitors like Deel, Upwork, and Toptal offer similar platforms |

---

## Tech Stack

- **Frontend**: React + Ant Design (dark mode UI)
- **Backend**: Firebase Firestore & Realtime Database
- **Auth**: Firebase Auth
- **Payments**: PaymanAI SDK
- **Deployment**: Vercel

## Folder Structure

```
/.github
  ├── ISSUE_TEMPLATES/
  └── PULL_REQUEST_TEMPLATE.md
/public
/src
  ├── assets/
  ├── pages/
  │   ├── auth/
  │   ├── business/
  │   ├── contractor/
  │   ├── Dashboard.js / Landing.js
  ├── components/
  │   ├── InfoPopup.js
  │   └── Navbar.js
  ├── utils/
  │   └── toast.js
  └── App.js / firebase.js / index.js
.env.sample
.prettierrc
.prettierignore
package.json
README.md
```

## Roadmap

- **Invoice generation**
- **Reporting dashboard**
- **AI-based contractor suggestions**
- **On-chain escrow**
- **Contractor ratings & reviews**
- **Automated Payments**

<h3>
  <p align="center">
    Made with ❤️ by <a href="https://www.mrmehta.in">kartikmehta8</a> for <a href="https://paymanai.com">payman</a> and community
  </p>
</h3>
