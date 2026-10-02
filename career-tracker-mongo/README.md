# Career Tracker

A multi-user roadmap tracker for going from a **2-year Node.js/Angular
developer** to **internationally employable** as a remote full-stack engineer:
TypeScript/Node depth, NestJS, PostgreSQL, a shipped flagship project, proper
CI/CD and deployment, interview readiness, public proof (open source + writing),
English, and a systematic international job search.

Built from a personal 16-week roadmap (see [lib/roadmap-seed.ts](lib/roadmap-seed.ts)
for the full source). Same design as the other trackers in this repo: one "Do
this next" card, a "Done when" line on every step, time estimates, and your
progress and notes saved per user. It is a **separate app** with its own
database, its own login cookie and its own colour theme (warm stone + amber,
with a monospace brand).

Next.js 14 (front end + back end in one app) + MongoDB.

## The roadmap

7 stages, 24 modules, about 90 steps, across 16 weeks (assumes ~6 focused
hours a day, 6 days a week — adjust the pace to your own schedule).

1. Reposition: resume, GitHub, LinkedIn, portfolio site, first 10 local applications (Week 1)
2. Backend depth: JS/Node internals + TypeScript, NestJS, PostgreSQL, testing/security/Redis (Weeks 2–5)
3. Flagship project: the knowledge-sharing platform with AI summarisation, design to launch (Weeks 6–10)
4. Ship like a professional: Docker, CI/CD, cloud + observability, git habits (Weeks 9–12)
5. Interview readiness: DSA by pattern, system design, take-homes, behavioural stories, mock interviews (Weeks 11–14)
6. Public proof and English: 2 merged open-source PRs, technical writing, daily spoken English, IELTS (Weeks 3–16, ongoing)
7. International applications: platforms, weekly volume and outreach, market routing, practical setup (Weeks 6–16+)

Every step has what to learn, keywords, a "Done when" check, a time estimate,
direct links to real resources, and ready-made YouTube / web searches. Every
module ends with a project (mini or major).

## What is saved in the database

Database name: `career_tracker` (same Atlas cluster as the other trackers in
this repo, separate database, so accounts and progress are independent).

| Collection | Contents |
| --- | --- |
| `stages`, `modules` | The roadmap itself: every module, step, project, keyword, link and search. |
| `users` | Email, bcrypt password hash, `createdAt`, and `startedAt` (the day you began). |
| `progress` | One document per checked step per user, with `doneAt`. |
| `notes` | One document per note per user (on a module, step or project). |

Every read and write of progress and notes is scoped to the signed-in user's id.

## Environment variables

| Name | What to put |
| --- | --- |
| `MONGODB_URI` | Your Atlas connection string (Atlas → Connect → Drivers) |
| `AUTH_SECRET` | A long random string. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MONGODB_USERNAME`, `MONGODB_PASSWORD` | Optional. If both are set they override credentials in `MONGODB_URI` |
| `MONGODB_DB` | Optional. Defaults to `career_tracker` |

This project's `.env` reuses the same Atlas cluster credentials as the other
trackers in this repo, with its own `MONGODB_DB`, so no new database user was
needed. `.env` and `.env.local` are git-ignored. Keep them out of chats too.

## Run locally

```bash
pnpm install
pnpm seed      # copies the roadmap into MongoDB (reads .env)
pnpm dev       # http://localhost:3003
```

It runs on port **3003** so it can sit next to the other trackers on 3000–3002.
The login cookie is named `career_session` so the apps never log each other
out on `localhost`.

**Atlas must allow your IP.** If `pnpm seed` fails with an SSL/TLS error, go to
Atlas → Network Access → Add IP Address → "Add current IP address".

## Changing the roadmap

The content lives in [lib/roadmap-seed.ts](lib/roadmap-seed.ts). Edit it and run
`pnpm seed`; that updates the `stages` and `modules` collections only. It never
touches users, progress or notes. Keep a step's `id` the same when you reword it:
progress and notes are saved by id.

If the database has no roadmap yet, the app seeds it by itself on the first
page load, so `pnpm seed` is for updates.

## Deploy to Vercel

1. **Atlas network access**: allow `0.0.0.0/0` (Vercel has no fixed IPs).
2. Push this folder to GitHub, import it at https://vercel.com/new as its own
   project (not one of the other trackers').
3. Add `MONGODB_URI`, `AUTH_SECRET` (and `MONGODB_DB=career_tracker`) as
   Environment Variables → Deploy.
