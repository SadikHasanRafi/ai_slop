# AI Dev Tracker

A multi-user roadmap tracker for going from Node.js developer to **fine-tuning
LLMs, vision models and object detectors** with free tools. Built for someone
with 2 years of Node.js, a little Python and no ML background, and for an ADHD
brain: one "Do this next" card, a "Done when" line on every step so there is a
stopping point, and time estimates.

Next.js 14 (front end + back end in one app) + MongoDB.

## The roadmap

6 stages, 18 modules, 78 steps, about 26 weeks at 1–2 hours a day. The hour
estimates are focused time; real life with debugging runs longer.

1. Python and data basics (Python for JS devs, NumPy/Pandas, math, ML vocabulary)
2. Deep learning core (neural nets from scratch, PyTorch)
3. Images: classify and detect objects (transfer learning, YOLO, fine-tune YOLO on your own data, ViT/DETR)
4. LLMs: how they work (tokens, attention, nanoGPT, Hugging Face, Ollama + Node)
5. Fine-tune LLMs and vision-language models (dataset, LoRA/QLoRA with Unsloth, evaluate, GGUF, serve, fine-tune a VLM)
6. Level up and portfolio (Stable Diffusion LoRA, write-ups, open source, portfolio)

Every step has: what to learn, keywords, a "Done when" check, a time estimate,
direct links to free resources, and ready-made YouTube / web searches. Every
module ends with a project (mini or major).

## What is saved in the database

| Collection | Contents |
| --- | --- |
| `stages`, `modules` | The roadmap itself: every module, step, project, keyword, link and search. |
| `users` | Email, bcrypt password hash, `createdAt`, and `startedAt` (the day you began; shown as "Started" and "Day N"). |
| `progress` | One document per checked step per user, with `doneAt` (the date shown next to each finished step, and used for "This week" and each module's first/finished dates). |
| `notes` | One document per note per user (on a module, step or project). Saving an empty note deletes it. |

Every read and write of progress and notes is scoped to the signed-in user's id.

## Environment variables

| Name | What to put |
| --- | --- |
| `MONGODB_URI` | Your Atlas connection string (Atlas → Connect → Drivers) |
| `AUTH_SECRET` | A long random string. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MONGODB_USERNAME`, `MONGODB_PASSWORD` | Optional. If both are set they override credentials in `MONGODB_URI` (no URL-encoding needed) |
| `MONGODB_DB` | Optional. Defaults to `ai_dev_tracker` |

Keep these out of Git and out of chats. `.env`, `.env.local` and
`atlas-credentials.env` are git-ignored.

## Run locally

```bash
pnpm install
cp .env.local.example .env.local   # fill in MONGODB_URI and AUTH_SECRET
pnpm seed                           # copies the roadmap into MongoDB
pnpm dev                            # http://localhost:3000
```

**Atlas must allow your IP.** If `pnpm seed` fails with an SSL/TLS error, go to
Atlas → Network Access → Add IP Address → "Add current IP address".

## Changing the roadmap

The content lives in [lib/roadmap-seed.ts](lib/roadmap-seed.ts). Edit it and run
`pnpm seed`; that updates the `stages` and `modules` collections only. It never
touches users, progress or notes. Keep a step's `id` the same when you reword it:
progress and notes are saved by id. If you remove a step, its saved progress is
kept in the database but ignored by the app (the seed script lists such ids).

If the database has no roadmap yet, the app seeds it by itself on the first
page load, so `pnpm seed` is for updates.

## Deploy to Vercel

1. **Atlas network access**: Atlas → Network Access → Add IP Address →
   "Allow access from anywhere" (`0.0.0.0/0`). Vercel's servers don't have
   fixed IPs.
2. Push this folder to a GitHub repo.
3. https://vercel.com/new → import the repo → Environment Variables → add
   `MONGODB_URI` and `AUTH_SECRET` → Deploy.

Changing `AUTH_SECRET` later signs everyone out; accounts and progress stay.
