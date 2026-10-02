// Copies roadmap content into MongoDB. Used by `pnpm seed` and by the app's
// first-run auto-seed. Only touches the `stages` and `modules` collections;
// users' progress and notes are never changed here.
//
// Imports are types only so Node can run this file directly.
import type { Db } from "mongodb";
import type { ModuleDoc, StageDoc } from "./roadmap-types";

export async function syncRoadmap(db: Db, stages: StageDoc[], modules: ModuleDoc[]) {
  const stagesCol = db.collection<StageDoc>("stages");
  const modulesCol = db.collection<ModuleDoc>("modules");

  await stagesCol.bulkWrite(
    stages.map((doc) => ({ replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true } }))
  );
  await modulesCol.bulkWrite(
    modules.map((doc) => ({ replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true } }))
  );

  // Remove roadmap rows that are no longer in the source file.
  const removedStages = await stagesCol.deleteMany({ _id: { $nin: stages.map((s) => s._id) } });
  const removedModules = await modulesCol.deleteMany({ _id: { $nin: modules.map((m) => m._id) } });

  await modulesCol.createIndex({ order: 1 });
  await modulesCol.createIndex({ itemIds: 1 });

  return {
    stages: stages.length,
    modules: modules.length,
    steps: modules.reduce((n, m) => n + m.itemIds.length, 0),
    removed: removedStages.deletedCount + removedModules.deletedCount,
  };
}
