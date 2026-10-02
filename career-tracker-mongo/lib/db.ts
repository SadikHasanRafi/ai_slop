import "server-only";
import { MongoClient, type Collection, type ObjectId } from "mongodb";
import type { ModuleDoc, StageDoc } from "./roadmap-types";

export type UserDoc = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
  // When the user began the roadmap. Defaults to sign-up time.
  startedAt?: Date;
};

export type ProgressDoc = {
  userId: ObjectId;
  itemId: string;
  doneAt: Date;
};

export type NoteDoc = {
  userId: ObjectId;
  itemId: string;
  text: string;
  updatedAt: Date;
};

// Reuse one client across hot reloads (dev) and warm serverless invocations (Vercel).
const globalForMongo = globalThis as unknown as {
  _mongoClient?: Promise<MongoClient>;
  _indexesReady?: Promise<void>;
};

function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  // Optional: credentials passed separately (as in Atlas's generated credentials file)
  // take precedence over any in the URI and need no URL-encoding.
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const auth = username && password ? { username, password } : undefined;
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri, {
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
      ...(auth && { auth }),
    }).connect();
  }
  return globalForMongo._mongoClient;
}

export const dbName = () => process.env.MONGODB_DB || "career_tracker";

export async function getDb() {
  return (await client()).db(dbName());
}

export async function collections(): Promise<{
  users: Collection<UserDoc>;
  progress: Collection<ProgressDoc>;
  notes: Collection<NoteDoc>;
  stages: Collection<StageDoc>;
  modules: Collection<ModuleDoc>;
}> {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const progress = db.collection<ProgressDoc>("progress");
  const notes = db.collection<NoteDoc>("notes");
  const stages = db.collection<StageDoc>("stages");
  const modules = db.collection<ModuleDoc>("modules");

  if (!globalForMongo._indexesReady) {
    globalForMongo._indexesReady = Promise.all([
      users.createIndex({ email: 1 }, { unique: true }),
      progress.createIndex({ userId: 1, itemId: 1 }, { unique: true }),
      notes.createIndex({ userId: 1, itemId: 1 }, { unique: true }),
      modules.createIndex({ order: 1 }),
      modules.createIndex({ itemIds: 1 }),
    ]).then(() => undefined);
  }
  await globalForMongo._indexesReady;

  return { users, progress, notes, stages, modules };
}
