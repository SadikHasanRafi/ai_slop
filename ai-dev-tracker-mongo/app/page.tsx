import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { collections } from "@/lib/db";
import { getSession } from "@/lib/session";
import { signOut } from "./login/actions";
import Tracker from "@/components/Tracker";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { progress, notes } = await collections();
  const userId = new ObjectId(session.userId);
  const [rows, noteRows] = await Promise.all([
    progress.find({ userId }, { projection: { itemId: 1, _id: 0 } }).toArray(),
    notes.find({ userId }, { projection: { itemId: 1, text: 1, _id: 0 } }).toArray(),
  ]);

  return (
    <main className="page">
      <header className="topbar">
        <span className="brand">AI Dev Tracker</span>
        <div className="who">
          <span className="email" title={session.email}>{session.email}</span>
          <form action={signOut}>
            <button className="btn-ghost" type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <Tracker
        initialDone={rows.map((r) => r.itemId)}
        initialNotes={Object.fromEntries(noteRows.map((n) => [n.itemId, n.text]))}
      />
    </main>
  );
}
