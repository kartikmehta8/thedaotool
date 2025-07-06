---
icon: rocket
---

# Overview

<figure><img src="../.gitbook/assets/overview.png" alt=""><figcaption><p>OVERVIEW</p></figcaption></figure>

Before we dive into setup steps or explore the internals of the platform, this section will give you a clear, high-level understanding of what The DAO Tool is, why it was built, and what it enables. Whether you're a developer, contributor, or someone managing people inside a DAO, open-source project, or protocol team — this is the perfect place to begin.

## What is The DAO Tool?

{% embed url="https://youtu.be/eG6GO4EMYjc" %}
AS OF JULY 2025
{% endembed %}

The DAO Tool is a modular, open-source coordination system designed to help decentralised teams work more efficiently.&#x20;

{% hint style="success" %}
Instead of relying on multiple disconnected platforms, it brings everything together in one place — task assignment, collaboration, communication, and payments.
{% endhint %}

At its core, The DAO Tool integrates:

* GitHub issues, automatically synced as bounties.
* Discord announcements for real-time bounty visibility.
* Contributor dashboards for tracking applications, progress, and submissions.
* USDC payouts over Solana wallets using Privy.
* A dedicated analytics section in the dashboard to visualise platform activity.

This means no more spreadsheets, DMs, or context-switching across four tools. Just a smooth, async-friendly flow from issue to payout — all self-hosted and customisable.

## Why This Exists?

The idea behind The DAO Tool came from direct experience. While running a contributor program, I found myself constantly switching between GitHub for issues, Discord for updates, Notion for tracking, and spreadsheets to manage wallet addresses and payments. It quickly became a mess — error-prone, unscalable, and exhausting to manage.

I searched for a single, developer-friendly tool to solve this.&#x20;

{% hint style="warning" %}
But nothing existed that was open-source, wallet-native, async-ready, and easy to build on.
{% endhint %}

That’s why The DAO Tool was built — not just as a bounty board, but as a flexible coordination framework that gives teams control over their contributor workflows with transparency and automation baked in.

## What You Can Do With It?

If you're part of an organisation, The DAO Tool gives you a private, role-based dashboard where you can manage contributors, sync GitHub issues, automate Discord updates, and process on-chain USDC payouts — without handing off control to third-party platforms.

If you're a developer, you'll find a clean and extensible codebase built with React, Express, and Firebase. You can explore background queues, REST APIs, role-based access, and easily customise features to match your own use case or workflow.

## Who It's Built For?

The DAO Tool is especially useful for:

* DAO operators and protocol teams managing async contributor programs.
* Open-source maintainers looking to track and reward external contributors.
* Hackathon teams and collectives that need a structured coordination layer.
* Ecosystem leads running bounties, micro-grants, or recurring contributor tasks.
* Builders who want to fork and extend DAO infra for their own needs.

Whether you’re coordinating two people or a whole contributor network, this tool was made with you in mind.

## What’s Next?

In the next few pages, you’ll learn how to:

* Set up the project locally on your machine.
* Configure your environment. (Firebase, GitHub OAuth, Privy)
* Understand the backend / frontend architecture in depth.
* Contribute to the project or build custom features for your own team.

Thanks for checking this out — and welcome to a more efficient way of managing work in Web3.
