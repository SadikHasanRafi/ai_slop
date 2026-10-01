# Python FastAPI Tracker

A multi-user roadmap tracker for going from **Node.js/Express developer (2 years)
to a job-ready Python + FastAPI backend engineer**, using only free resources.

It assumes you already know how to program and build APIs, so it skips beginner
material and maps every Python and FastAPI idea to what you know from Node
(`npm → uv`, `Express → FastAPI`, `zod → Pydantic`, `Jest → pytest`,
`Bull → Celery`, `PM2 → Gunicorn/Uvicorn workers`).

Same design as the other trackers in this repo: one "Do this next" card, a
"Done when" line on every step so there is a stopping point, time estimates, and
progress and notes saved per user. It is a **separate app** with its own
database, login cookie, port and colour theme (warm stone + burnt orange, amber
in dark mode, blue for projects, REPL-style `>>>` brand).

Next.js 14 (front end + back end in one app) + MongoDB.

## The roadmap

6 stages, 19 modules, 95 steps, about 25 weeks at 1.5 hours a day (roughly 235
focused hours; real life with debugging runs longer).

1. **Python for a Node developer** (4 wk): language through JS eyes, modern tooling (uv, ruff, mypy, pytest), Pydantic, async/await and the GIL
2. **FastAPI core** (5 wk): routes and docs, structure and errors, dependency injection and middleware, auth (JWT, refresh, RBAC, OWASP)
3. **Databases and background work** (4 wk): SQL and PostgreSQL, SQLAlchemy 2.0 + Alembic (async), Redis, Celery/ARQ, MongoDB (Beanie)
4. **Testing and code quality** (3 wk): pytest for APIs, fixtures and test DBs, mocking, coverage, strict typing, CI
5. **Production** (4 wk): Docker and deploy, profiling and load testing, observability, WebSockets, uploads, webhooks
6. **Job-ready** (5 wk): architecture and system design, CLIs, pandas, LLM APIs and pgvector, interview prep, portfolio and applications

Every step has what to learn, keywords, a "Done when" check, a time estimate,
direct links to free resources, and ready-made YouTube / web searches. Every
module ends with a project (mini or major), and stage 6 ends with a capstone.

## What is saved in the database

Database name: `python_fastapi_tracker` (same Atlas cluster as the other
trackers, separate database, so accounts and progress are independent).

| Collection | Contents |
| --- | --- |
| `stages`, `modules` | The roadmap itself: every module, step, project, keyword, link and search. Keywords live inside each step (`tasks[].keywords`, `project.keywords`). |
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
| `MONGODB_DB` | Optional. Defaults to `python_fastapi_tracker` |

`.env` and `.env.local` are git-ignored. Keep them out of chats too.

## Run locally

```bash
pnpm install
cp .env.local.example .env.local   # fill in MONGODB_URI and AUTH_SECRET
pnpm seed                           # copies the roadmap into MongoDB
pnpm dev                            # http://localhost:3002
```

It runs on port **3002** (AI tracker 3000, DevOps tracker 3001). The login
cookie is named `python_session` so the apps never log each other out on
`localhost`.

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
   project.
3. Add `MONGODB_URI`, `AUTH_SECRET` (and `MONGODB_DB=python_fastapi_tracker`) as
   Environment Variables → Deploy.
