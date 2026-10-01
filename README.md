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
