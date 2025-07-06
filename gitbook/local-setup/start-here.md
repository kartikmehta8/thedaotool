# Start Here

Alright. No fluff. No theory. Just pure setup.

If you're here, you're probably ready to run this locally and see what the magic looks like behind the scenes. So let’s skip the unnecessary intros (finally) and just get your terminal moving.

## Step 1: Fork & Clone

You can start by forking the main repo so you can break things safely (and maybe even contribute back!).

```bash
# Fork the repo on GitHub first, then clone your fork.
git clone https://github.com/YOUR_USERNAME/thedaotool.git
cd thedaotool
```

```bash
# If you just want to clone the main repository. (read-only)
git clone https://github.com/kartikmehta8/thedaotool.git
cd thedaotool
```

## Step 2: Install Dependencies

Install the frontend and backend packages in one go.

```bash
# For client.
cd client
npm install

# Then, server.
cd ../server
npm install
```

## Step 3: Set Up Environment Variables

From the `/server` & `/client` directories, create your `.env` file:

```bash
cp .env.example .env
```

Now edit `.env` and fill in the following:

### Core App Config

* `PORT=5050`\
  The port your backend server will run on.
* `NODE_ENV=development`\
  Indicates whether you’re in `development` or `production` mode.
* `FRONTEND_URL=http://localhost:3000`\
  Where your frontend client is running. Important for CORS and cookie settings.
* `SERVER_URL=http://localhost:5050`\
  The base URL for your backend API.

### Firebase Config

* `FB_STORAGE_BUCKET=`\
  Firebase Cloud Storage bucket URL used for file uploads.
* `FB_REALTIME_DATABASE=`\
  Realtime Database URL used for live chat and real-time features.

{% hint style="warning" %}
You will need to download a _Service Account file_ as well — this will be covered on the next page.
{% endhint %}

### Redis

* `REDIS_URL=redis://localhost:6379`\
  A Redis instance is used for background queues such as GitHub sync, email dispatch, and OTP jobs. When using Docker, the URL will be `redis://redis:6379`.

### Email Configuration

* `SMTP_USER=`\
  SMTP (Simple Mail Transfer Protocol) username for sending emails - Google in our case.
* `SMTP_PASS=`\
  Password or API key to authenticate with your email provider.

### GitHub OAuth

* `GITHUB_CLIENT_ID=`\
  Client ID from your GitHub OAuth App — used for repo access and issue syncing.
* `GITHUB_CLIENT_SECRET=`\
  Secret key for verifying GitHub logins and tokens.

### Discord Bot Integration

* `DISCORD_CLIENT_ID=`\
  Bot client ID from the Discord Developer Portal.
* `DISCORD_CLIENT_SECRET=`\
  Secret for authenticating Discord OAuth.
* `DISCORD_BOT_TOKEN=`\
  Token used by the bot to post messages like bounty announcements into channels.

### JWT Auth & Security

* `JWT_SECRET=itisasecret`\
  Secret string for signing JWT tokens. Keep this **very secret**.
* `JWT_EXPIRATION=1d`\
  Token validity period. You can use formats like `1d`, `12h`, `30m`.
* `MAX_LOGIN_ATTEMPTS=3`\
  Security feature to prevent brute-force attacks by locking out users after failed attempts.
* `ENCRYPTION_SECRET=anothersecret`\
  Additional layer of encryption for sensitive data like verification tokens.

### Wallet & Payments (Privy + Solana)

* `PRIVY_APP_ID=`\
  Your app ID from Privy, used for wallet authentication and linking.
* `PRIVY_APP_SECRET=`\
  App secret for verifying Privy token integrity.
* `SOLANA_CAIP2=`\
  Chain identifier in [CAIP-2 format](https://github.com/ChainAgnostic/CAIPs). Example: `solana:mainnet`.
* `SOLANA_RPC_URL=`\
  URL of your Solana RPC endpoint (via Helius, Triton, or public RPCs) to trigger on-chain USDC payments.

In your `/client` directory, you'll also need a `.env` file. The main variable required here is:

### `REACT_APP_BACKEND_URL`

This is the URL the React frontend will use to communicate with your backend server.

*   In local development, this is usually:

    ```
    REACT_APP_BACKEND_URL=http://localhost:5050
    ```
*   In production or staging, point it to your deployed backend:

    ```
    REACT_APP_BACKEND_URL=https://api.thedaotool.com (This is our instance.)
    ```

{% hint style="danger" %}
Make sure this URL matches what you’ve set in CORS config on the server side, otherwise requests from the frontend will get blocked.
{% endhint %}

That’s it! You’re now fully equipped with the environment configuration for both frontend and backend. From here, you're ready to continue with Firebase setup.
