# DevOps Tracker

A multi-user roadmap tracker for going from Node.js developer to **DevOps
engineer** using only free resources: Linux, Git, networking, Docker, CI/CD,
cloud and Terraform, Kubernetes and GitOps, observability, SRE and security.

Same design as [AI Dev Tracker](../ai-dev-tracker-mongo/): one "Do this next"
card, a "Done when" line on every step so there is a stopping point, time
estimates, and your progress and notes saved per user. It is a **separate app**
with its own database, its own login cookie and its own colour theme
(cool slate + indigo, with a monospace brand).

Next.js 14 (front end + back end in one app) + MongoDB.

## The roadmap

7 stages, 20 modules, 92 steps, about 30 weeks at an hour or so a day (roughly
210 focused hours; real life with debugging runs longer).

1. Foundations: Linux and systemd, Bash, Git, networking (DNS, HTTP/TLS, Nginx)
2. Containers: Docker, Compose, multi-stage and secure images, twelve-factor
3. CI/CD and automation: GitHub Actions, release strategies, Ansible
4. Cloud and infrastructure as code: AWS basics, Terraform, managed containers and serverless
5. Kubernetes and GitOps: core objects, config/storage/probes, Helm and Kustomize, Argo CD
6. Observability, reliability, security: Prometheus/Grafana/Loki/OpenTelemetry, SLOs and incidents, DevSecOps and supply chain
7. Platform and career: portfolio, certifications, what to learn next

Every step has what to learn, keywords, a "Done when" check, a time estimate,
direct links to free resources, and ready-made YouTube / web searches. Every
module ends with a project (mini or major).

## What is saved in the database

Database name: `devops_tracker` (same Atlas cluster as the AI tracker, separate
database, so accounts and progress are independent).

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
| `MONGODB_DB` | Optional. Defaults to `devops_tracker` |

`.env` and `.env.local` are git-ignored. Keep them out of chats too.

## Run locally

```bash
pnpm install
cp .env.local.example .env.local   # fill in MONGODB_URI and AUTH_SECRET
pnpm seed                           # copies the roadmap into MongoDB
pnpm dev                            # http://localhost:3001
```

It runs on port **3001** so it can sit next to the AI tracker on 3000. The login
cookie is named `devops_session` so the two apps never log each other out on
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
   project (not the AI tracker's).
3. Add `MONGODB_URI`, `AUTH_SECRET` (and `MONGODB_DB=devops_tracker`) as
   Environment Variables → Deploy.
