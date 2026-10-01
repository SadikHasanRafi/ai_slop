import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { getSession } from "@/lib/session";
import { loadRoadmap } from "@/lib/roadmap-db";
import { signOut } from "./login/actions";
import Tracker from "@/components/Tracker";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { progress, notes, users } = await collections();
  const userId = new ObjectId(session.userId);
  const [roadmap, rows, noteRows, user] = await Promise.all([
    loadRoadmap(),
    progress.find({ userId }, { projection: { itemId: 1, doneAt: 1, _id: 0 } }).toArray(),
    notes.find({ userId }, { projection: { itemId: 1, text: 1, _id: 0 } }).toArray(),
    users.findOne({ _id: userId }, { projection: { createdAt: 1, startedAt: 1 } }),
  ]);

  // Accounts made before start dates existed: use the sign-up date and save it.
  const startedAt = user?.startedAt ?? user?.createdAt ?? new Date();
  if (user && !user.startedAt) {
    await users.updateOne({ _id: userId, startedAt: { $exists: false } }, { $set: { startedAt } });
  }

  return (
    <main className="page">
      <header className="topbar">
        <span className="brand">AI Dev Tracker</span>
        <div className="who">
          <span className="email" title={session.email}>{session.email}</span>
          <form action={signOut}>
            <SubmitButton className="btn-ghost" pendingText="Signing out…">Sign out</SubmitButton>
          </form>
        </div>
      </header>

      <Tracker
        stages={roadmap.stages}
        modules={roadmap.modules}
        initialDone={Object.fromEntries(rows.map((r) => [r.itemId, r.doneAt.toISOString()]))}
        initialNotes={Object.fromEntries(noteRows.map((n) => [n.itemId, n.text]))}
        startedAt={startedAt.toISOString()}
      />
    </main>
  );
}
