<p align="center">
  <!-- Replace the src below with your actual logo path once added -->
  <img src="./public/Logo.png" alt="Lazyfolio Logo" width="120" />
</p>

<h1 align="center">Lazyfolio</h1>

<p align="center">
  Make the internet know you exist.
  <br />
  Build your portfolio in minutes, not after hours of tweaking layouts and writing everything from scratch.
</p>

<p align="center">
  <a href="https://lazy-folio.vercel.app">Live Demo</a> &nbsp;|&nbsp;
  <a href="https://github.com/Angshuman09/lazyfolio/issues">Report Bug</a> &nbsp;|&nbsp;
  <a href="https://github.com/Angshuman09/lazyfolio/issues">Request Feature</a>
</p>

---

<!-- Replace the src below with your actual dashboard preview image once added -->
<p align="center">
  <img src="./public/preview.png" alt="Lazyfolio Dashboard Preview" width="100%" />
</p>

---

## What is Lazyfolio

Lazyfolio is an open-source portfolio and personal page builder heavily inspired by [Linktree](https://linktr.ee) and [Bear Blog](https://bearblog.dev). The idea is simple: you get one clean link that holds everything — your portfolio, your projects, your social links, and your blog posts — without needing to touch a single design tool or write a line of HTML.

You pick a username, choose a template, fill in your details, and your page is live. It is aimed at developers and creators who want to establish an online presence without spending a weekend on it.

**Core capabilities**

One public profile page under `lazyfolio.com/your-username` that you can share anywhere. Beautiful, developer-focused templates that need no customisation beyond your own content. A built-in blogging engine so you can publish articles and writing alongside your work. A built-in analytics dashboard that tracks visitors, link clicks, and engagement over time. A single dashboard where all of this is managed.


## Tech Stack

**Framework**
Next.js 16 with the App Router and React 19

**Language**
TypeScript throughout the codebase

**Styling**
Tailwind CSS v4, shadcn/ui component library, Radix UI primitives, Framer Motion for animations, and rough-notation for hand-drawn highlight effects

**Database**
PostgreSQL via the `pg` driver, with Prisma ORM for schema management and migrations

**Authentication**
better-auth for session-based auth flows

**Image Storage**
Cloudinary for uploading and serving profile images and assets

**Forms and Validation**
React Hook Form with Zod for schema-based validation

**Data Fetching**
TanStack Query (React Query v5) for server state management on the client

**State Management**
Zustand for lightweight global client state

**Charts**
Recharts for the analytics dashboard

**Code Highlighting**
Shiki for syntax-highlighted code blocks in blog posts

**Webhooks and Notifications**
Svix for webhook delivery, react-hot-toast for in-app toasts

**Analytics**
Vercel Analytics

**Deployment**
Vercel


## Getting Started

**Prerequisites**

Node.js 18 or later, a PostgreSQL database, and accounts on Cloudinary and your chosen auth provider.

**Clone the repository**

```bash
git clone https://github.com/Angshuman09/lazyfolio.git
cd lazyfolio
```

**Install dependencies**

```bash
npm install
```

**Set up environment variables**

Create a `.env` file at the root of the project. You will need values for your PostgreSQL connection string, Cloudinary credentials, and better-auth secret.

```env
DATABASE_URL=postgresql://user:password@localhost:5432/lazyfolio
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

**Run database migrations**

```bash
npx prisma migrate dev
```

**Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

**Build for production**

```bash
npm run build
npm start
```


## Project Structure

```
lazyfolio/
  app/              Next.js App Router pages and layouts
  components/       Reusable UI components
  lib/              Auth setup, database client, utility functions
  prisma/           Database schema and migration files
  public/           Static assets including logo and preview images
```


## Inspiration

Lazyfolio is directly inspired by two products that got the philosophy right.

[Linktree](https://linktr.ee) proved that a single shareable link page has enormous value for creators. Lazyfolio extends that idea with portfolio sections, project showcases, and a blogging layer built in from the start.

[Bear Blog](https://bearblog.dev) demonstrated that a writing platform does not need to be complicated. Clean, fast, and focused on the words. Lazyfolio borrows that same spirit for its built-in blog.


## Contributing

Contributions are welcome. Open an issue to discuss what you want to change before submitting a pull request. Please keep PRs focused on a single concern.


## License

Open-source and free. See `LICENSE` for details.

---

<p align="center">Built with ♥ by <a href="https://github.com/Angshuman09">Angshuman</a></p>