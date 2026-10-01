"use server";

import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { getSession } from "@/lib/session";
import { isNoteTarget, isStepId } from "@/lib/roadmap-db";

const MAX_NOTE = 5000;

// Marks one roadmap step done or not done for the signed-in user.
// Returns the time it was completed so the page can show the date.
export async function setDone(
  itemId: string,
  done: boolean
): Promise<{ ok: boolean; doneAt?: string }> {
  const session = await getSession();
  if (!session || typeof itemId !== "string" || !(await isStepId(itemId))) return { ok: false };

  const { progress } = await collections();
  const userId = new ObjectId(session.userId);

  if (done) {
    const doneAt = new Date();
    await progress.updateOne(
      { userId, itemId },
      { $setOnInsert: { userId, itemId, doneAt } },
      { upsert: true }
    );
    // If it was already done, keep the original date.
    const row = await progress.findOne({ userId, itemId }, { projection: { doneAt: 1 } });
    return { ok: true, doneAt: (row?.doneAt ?? doneAt).toISOString() };
  }

  await progress.deleteOne({ userId, itemId });
  return { ok: true };
}

// Saves the signed-in user's note on a module, task or project. Empty text deletes it.
export async function saveNote(itemId: string, text: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session || typeof itemId !== "string" || typeof text !== "string" || !(await isNoteTarget(itemId))) {
    return { ok: false };
  }

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
