// Copies the roadmap (lib/roadmap-seed.ts) into MongoDB.
//   pnpm seed
// Reads MONGODB_URI (and optional MONGODB_USERNAME / MONGODB_PASSWORD / MONGODB_DB)
// from .env, .env.local or the environment. Safe to run any time: it updates
// roadmap content only and never touches users, progress or notes.
import { MongoClient } from "mongodb";
import { existsSync } from "node:fs";
import { MODULES, STAGES } from "../lib/roadmap-seed.ts";
import { syncRoadmap } from "../lib/roadmap-sync.ts";

for (const f of [".env.local", ".env"]) if (existsSync(f)) process.loadEnvFile(f);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Put it in .env.local (see .env.local.example).");
  process.exit(1);
}
const { MONGODB_USERNAME: username, MONGODB_PASSWORD: password } = process.env;
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
  ...(username && password && { auth: { username, password } }),
});

try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "career_tracker");
  const r = await syncRoadmap(db, STAGES, MODULES);
  console.log(`Seeded ${r.stages} stages, ${r.modules} modules, ${r.steps} steps into "${db.databaseName}".`);
  if (r.removed) console.log(`Removed ${r.removed} old roadmap rows that are no longer in the roadmap.`);

  // Tell the user if saved progress points at steps that no longer exist.
  const valid = new Set(MODULES.flatMap((m) => m.itemIds));
  const saved = await db.collection("progress").distinct("itemId");
  const orphans = saved.filter((id) => !valid.has(id));
  if (orphans.length) {
    console.log(`Note: ${orphans.length} saved progress id(s) are not in the new roadmap and are ignored: ${orphans.join(", ")}`);
  }
} catch (e) {
  console.error("Seed failed:", e.message);
  if (/ssl|tls|ECONNREFUSED|ETIMEDOUT|selection/i.test(e.message)) {
    console.error("Likely cause: Atlas Network Access doesn't include this machine's IP. Add it in Atlas → Network Access.");
  }
  process.exitCode = 1;
} finally {
  await client.close();
}
