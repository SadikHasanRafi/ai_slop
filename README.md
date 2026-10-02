# ai_slop 🤖

A collection of AI-generated projects and hand-coded experiments. This repo is where I dump side projects, learning tools, and full-stack apps built with Claude, Node.js, Next.js, MongoDB and whatever else I'm tinkering with.

## Projects

### 🎯 [AI Dev Tracker](./ai-dev-tracker-mongo/)

A **multi-user roadmap tracker** for going from Node.js developer to fine-tuning LLMs, vision models and object detectors.

**What it does:**
- Personal progress tracker with a "Do this next" card (ADHD-friendly)
- 6 stages, 18 modules, 78 steps (26 weeks of learning)
- Real-time progress saving to MongoDB
- Multi-user accounts with email + password auth
- Beautiful UI with smooth animations and loading states

**Tech stack:** Next.js 14, React, MongoDB Atlas, TypeScript, bcrypt, JWT

**Quick start:**
```bash
cd ai-dev-tracker-mongo
pnpm install
cp .env.local.example .env.local  # add your MongoDB URI and AUTH_SECRET
pnpm seed                         # load the roadmap
pnpm dev                          # http://localhost:3000
```

See [ai-dev-tracker-mongo/README.md](./ai-dev-tracker-mongo/README.md) for deployment and customization.

---

### 🛠️ [DevOps Tracker](./devops-tracker-mongo/)

The sister app to the AI tracker: a **multi-user roadmap** from Node.js developer to DevOps engineer, same UX with an indigo theme and its own database.

- 7 stages, 20 modules, 92 steps (about 30 weeks): Linux, Git, networking, Docker, CI/CD, AWS + Terraform, Kubernetes + GitOps, observability, SRE, DevSecOps
- Free resources, keywords, "Done when" checks and a project per module

**Quick start:** `cd devops-tracker-mongo && pnpm install && pnpm seed && pnpm dev` (http://localhost:3001). See its [README](./devops-tracker-mongo/README.md).

---

### 🐍 [Python FastAPI Tracker](./python-fastapi-tracker-mongo/)

A **multi-user roadmap** for a 2-year Node/Express developer going to a job-ready Python + FastAPI backend engineer. Skips the basics and maps everything to what you already know.

- 6 stages, 19 modules, 95 steps (about 25 weeks): Python for JS devs, Pydantic, async, FastAPI, auth, PostgreSQL + SQLAlchemy, Redis/Celery, testing, Docker/deploy, system design, interview prep
- Warm orange theme, its own database and port 3002

**Quick start:** `cd python-fastapi-tracker-mongo && pnpm install && pnpm seed && pnpm dev` (http://localhost:3002). See its [README](./python-fastapi-tracker-mongo/README.md).

---

### 🌍 [Career Tracker](./career-tracker-mongo/)

A **multi-user roadmap** for going from a 2-year Node.js/Angular developer to internationally employable as a remote full-stack engineer.

- 7 stages, 24 modules, ~88 steps (16 weeks): reposition (resume/GitHub/LinkedIn), NestJS + PostgreSQL depth, a flagship AI project, Docker/CI/CD/cloud, interview readiness, open source + writing, and a systematic international job search
- Warm stone + amber theme, its own database and port 3003

**Quick start:** `cd career-tracker-mongo && pnpm install && pnpm seed && pnpm dev` (http://localhost:3003). See its [README](./career-tracker-mongo/README.md).

---

## How this repo works

- Each folder is a self-contained project
- Projects have their own `package.json`, `.env.local` and git history
- The root [.gitignore](.gitignore) keeps secrets out
- Use `pnpm` (or `npm`) to manage dependencies

## Features across projects

✨ **Smooth UX:** Loaders, spinners, transitions and animations  
🔐 **Auth:** Secure password hashing, session cookies, JWT tokens  
💾 **Databases:** MongoDB for multi-user data and persistence  
📱 **Responsive:** Mobile-first designs  
🌙 **Dark mode:** Prefers-color-scheme support  
♿ **Accessible:** WCAG labels, keyboard navigation, screen readers  

---

## Adding new projects

1. Create a new folder: `mkdir my-project`
2. Set up the project (Next.js, CLI, etc.)
3. Add a `README.md` explaining what it does
4. Update this file with a link and description

---

**Status:** Active. Built with Claude.
