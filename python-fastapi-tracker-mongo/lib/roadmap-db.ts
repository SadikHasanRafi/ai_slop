import "server-only";
import { collections, getDb } from "./db";
import { MODULES, STAGES } from "./roadmap-seed";
import { syncRoadmap } from "./roadmap-sync";
import type { Roadmap } from "./roadmap-types";

const globalForSeed = globalThis as unknown as { _roadmapSeeded?: Promise<void> };

// First run only: if the database has no roadmap yet, fill it from the seed file.
// After that the database is the source of truth; `pnpm seed` re-syncs on demand.
async function ensureSeeded() {
  if (!globalForSeed._roadmapSeeded) {
    globalForSeed._roadmapSeeded = (async () => {
      const { modules } = await collections();
      if ((await modules.estimatedDocumentCount()) === 0) {
        await syncRoadmap(await getDb(), STAGES, MODULES);
      }
    })().catch((e) => {
      globalForSeed._roadmapSeeded = undefined; // let the next request retry
      throw e;
    });
  }
  await globalForSeed._roadmapSeeded;
}

export async function loadRoadmap(): Promise<Roadmap> {
  await ensureSeeded();
  const { stages, modules } = await collections();
  const [s, m] = await Promise.all([
    stages.find().sort({ order: 1 }).toArray(),
    modules.find().sort({ order: 1 }).toArray(),
  ]);
  return { stages: s, modules: m };
}

// A step is a task or project id that exists in the roadmap.
export async function isStepId(id: string): Promise<boolean> {
  if (!id || id.length > 80) return false;
  const { modules } = await collections();
  return (await modules.countDocuments({ itemIds: id }, { limit: 1 })) > 0;
}

// Notes can go on a module or on any step in it.
export async function isNoteTarget(id: string): Promise<boolean> {
  if (!id || id.length > 80) return false;
  const { modules } = await collections();
  return (await modules.countDocuments({ $or: [{ _id: id }, { itemIds: id }] }, { limit: 1 })) > 0;
}
