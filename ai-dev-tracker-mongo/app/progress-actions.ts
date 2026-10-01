"use server";

import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ALL_ITEM_IDS, NOTE_IDS } from "@/lib/roadmap";

const VALID = new Set(ALL_ITEM_IDS);
const VALID_NOTES = new Set(NOTE_IDS);
const MAX_NOTE = 5000;

// Marks one roadmap step done or not done for the signed-in user.
export async function setDone(itemId: string, done: boolean): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session || !VALID.has(itemId)) return { ok: false };

  const { progress } = await collections();
  const userId = new ObjectId(session.userId);

  if (done) {
    await progress.updateOne(
      { userId, itemId },
      { $setOnInsert: { userId, itemId, doneAt: new Date() } },
      { upsert: true }
    );
  } else {
    await progress.deleteOne({ userId, itemId });
  }
  return { ok: true };
}

// Saves the signed-in user's note on a module, task or project. Empty text deletes it.
export async function saveNote(itemId: string, text: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session || !VALID_NOTES.has(itemId) || typeof text !== "string") return { ok: false };

  const clean = text.trim().slice(0, MAX_NOTE);
  const { notes } = await collections();
  const userId = new ObjectId(session.userId);

  if (clean) {
    await notes.updateOne(
      { userId, itemId },
      { $set: { text: clean, updatedAt: new Date() } },
      { upsert: true }
    );
  } else {
    await notes.deleteOne({ userId, itemId });
  }
  return { ok: true };
}
