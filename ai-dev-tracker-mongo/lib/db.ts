import "server-only";
import { MongoClient, type Collection, type ObjectId } from "mongodb";

export type UserDoc = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
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

export async function collections(): Promise<{
  users: Collection<UserDoc>;
  progress: Collection<ProgressDoc>;
  notes: Collection<NoteDoc>;
}> {
  const db = (await client()).db(process.env.MONGODB_DB || "ai_dev_tracker");
  const users = db.collection<UserDoc>("users");
  const progress = db.collection<ProgressDoc>("progress");
  const notes = db.collection<NoteDoc>("notes");

  if (!globalForMongo._indexesReady) {
    globalForMongo._indexesReady = Promise.all([
      users.createIndex({ email: 1 }, { unique: true }),
      progress.createIndex({ userId: 1, itemId: 1 }, { unique: true }),
      notes.createIndex({ userId: 1, itemId: 1 }, { unique: true }),
    ]).then(() => undefined);
  }
  await globalForMongo._indexesReady;

  return { users, progress, notes };
}
