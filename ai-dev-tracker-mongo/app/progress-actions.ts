"use server";

import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ALL_ITEM_IDS } from "@/lib/roadmap";

const VALID = new Set(ALL_ITEM_IDS);

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
