# AI Dev Tracker

A multi-user roadmap tracker for going from Node.js developer to training and
fine-tuning AI models. Anyone can sign up with email + password and gets
their own saved progress: an overall progress bar, a bar per phase, and an
"Up next" card showing the one step to do today.

Next.js 14 (front end + back end in one app) + MongoDB.

## How it works

- **Accounts**: `users` collection. Passwords are hashed with bcrypt; the
  plain password is never stored.
- **Login**: a signed JWT (HS256, signed with `AUTH_SECRET`) in an httpOnly
  cookie, valid 30 days. `middleware.ts` sends signed-out visitors to /login.
- **Progress**: `progress` collection, one document per checked step per
  user. Every read and write is scoped to the signed-in user's id.
- **Roadmap text**: `lib/roadmap.ts`. Keep each item's `id` the same when you
  reword it; progress is saved by `id`.
- Indexes (unique email, unique user+step) are created automatically on first
  request. No setup script to run.

## Environment variables

| Name | What to put |
| --- | --- |
| `MONGODB_URI` | Your Atlas connection string (Atlas → Connect → Drivers), with your DB user's password filled in |
| `AUTH_SECRET` | A long random string. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MONGODB_USERNAME`, `MONGODB_PASSWORD` | Optional. If both are set they override credentials in `MONGODB_URI` (no URL-encoding needed) |
| `MONGODB_DB` | Optional. Defaults to `ai_dev_tracker` |

Keep these out of Git and out of chats. `.env.local` is already git-ignored.

## Run locally

```bash
pnpm install
cp .env.local.example .env.local   # fill in MONGODB_URI and AUTH_SECRET
pnpm run dev                        # http://localhost:3000
```

## Deploy to Vercel

1. **Atlas network access**: Atlas → Network Access → Add IP Address →
   "Allow access from anywhere" (`0.0.0.0/0`). Vercel's servers don't have
   fixed IPs, so without this the live app can't reach your database.
2. Push this folder to a GitHub repo.
3. https://vercel.com/new → import the repo → Environment Variables → add
   `MONGODB_URI` and `AUTH_SECRET` → Deploy.

Changing `AUTH_SECRET` later signs everyone out; their accounts and progress
stay.
