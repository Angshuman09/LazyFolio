# Contributing to Lazyfolio

Thank you for your interest in contributing to Lazyfolio! We want contributing to be as friction-free as possible.

**You do NOT need real API keys (Google, GitHub OAuth, Cloudinary, or Dodo Payments) to run or contribute to this project.** Everything works offline with local mock fallbacks and pre-configured development defaults.

---

## ⚡ 1-Command Quickstart

### Option 1: Local Machine

Make sure you have:
- [Node.js 18+](https://nodejs.org/) installed
- [Docker Desktop](https://www.docker.com/) installed and running (for local PostgreSQL), OR your own local PostgreSQL instance

Run the following commands:

```bash
# 1. Clone the repository
git clone https://github.com/Angshuman09/lazyfolio.git
cd lazyfolio

# 2. Install dependencies
npm install

# 3. Initialize everything with one command:
#    (Copies .env.example, starts Postgres, pushes schema, seeds demo user & profile)
npm run setup

# 4. Start the development server
npm run dev
```

Now open:
* **App / Auth Screen**: [http://localhost:3000/auth](http://localhost:3000/auth)
  * Click **"⚡ One-Click Dev Login"** to sign in immediately.
  * Or use: `demo@lazyfolio.dev` / `password123`.
* **Demo Portfolio Page**: [http://localhost:3000/demo](http://localhost:3000/demo)
* **Prisma Studio** (Database GUI): `npm run db:studio`

---

### Option 2: 1-Click Cloud (GitHub Codespaces)

If you don't want to install Docker or PostgreSQL locally:
1. Click **Code** -> **Codespaces** -> **Create codespace on main**.
2. GitHub automatically starts the container, launches PostgreSQL, runs `npm run setup`, and forwards port 3000.
3. Open the preview tab in your browser and you're ready to code!

---

## 🛠 How Mock Modes Work

Lazyfolio is designed with graceful degradation so contributors can work on UI, components, database models, and features without configuring third-party services:

| Feature | Production Service | Local Development Fallback |
| :--- | :--- | :--- |
| **Authentication** | Google & GitHub OAuth | Built-in email/password auth + **"⚡ One-Click Dev Login"** button |
| **Image Uploads** | Cloudinary | Automatically saved to `/public/uploads/` locally |
| **Supporter Features** | Dodo Payments | Mock checkout automatically grants `ACTIVE` status in dev |
| **Analytics Insights** | Cloudflare Worker + Tinybird | Returns mock chart telemetry data in dev mode |
| **Database** | Remote PostgreSQL / Neon | Local Docker PostgreSQL (`localhost:5432/lazyfolio`) |

---

## 🧪 Testing with Real Credentials (Optional)

If you are specifically developing an integration (such as testing live Dodo webhooks or Cloudinary transformations):
1. Create a `.env` file (copied from `.env.example`).
2. Replace the `"mock"` values with your sandbox / test keys:
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (from GitHub Developer Settings)
   - `NEXT_PUBLIC_CLOUDINARY_API_KEY` / `_SECRET` (from Cloudinary Dashboard)
   - `DODO_PAYMENTS_API_KEY` (from Dodo Payments Dashboard in test mode)
3. Never commit `.env` or personal credentials to git. `.env` is already in `.gitignore`.

---

## 📋 Available Scripts

* `npm run dev`: Starts the Next.js development server
* `npm run setup`: Configures environment, starts local DB, pushes schema, and seeds demo data
* `npm run db:push`: Pushes changes in `prisma/schema.prisma` directly to the local database
* `npm run db:generate`: Regenerates the Prisma Client
* `npm run db:seed`: Resets or seeds the demo user, profile, and subscription
* `npm run db:studio`: Opens Prisma Studio at [http://localhost:5555](http://localhost:5555) to visually inspect and edit database records
* `npm run build`: Tests the production Next.js build
* `npm run lint`: Runs ESLint

---

## 🤝 Contribution Guidelines

1. **Keep PRs focused**: A PR should ideally address one bug, feature, or improvement.
2. **Open an issue first**: For significant features or refactors, open an issue to discuss the approach before spending time coding.
3. **Check formatting & linting**: Run `npm run lint` and verify `npm run build` succeeds before opening a pull request.
