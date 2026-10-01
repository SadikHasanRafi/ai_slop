"use client";

import { useMemo, useState } from "react";
import { ALL_ITEM_IDS, ROADMAP, TOTAL_WEEKS, searchUrl, type Module, type Search, type Task } from "@/lib/roadmap";
import { saveNote, setDone as saveDone } from "@/app/progress-actions";

const TOTAL = ALL_ITEM_IDS.length;

const moduleIds = (m: Module) => [...m.tasks.map((t) => t.id), m.project.id];

export default function Tracker({
  initialDone,
  initialNotes,
}: {
  initialDone: string[];
  initialNotes: Record<string, string>;
}) {
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone));
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const doneCount = ALL_ITEM_IDS.filter((id) => done.has(id)).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  // First unchecked task or project across the whole roadmap = what to do today.
  const next = useMemo(() => {
    for (const mod of ROADMAP) {
      for (const task of mod.tasks) if (!done.has(task.id)) return { mod, task };
      if (!done.has(mod.project.id)) return { mod, task: mod.project as Task, label: mod.project.label };
    }
    return null;
  }, [done]);

  // Only the module you're on starts expanded, so the page stays short.
  const [open, setOpen] = useState<Set<string>>(() => new Set(next ? [next.mod.id] : []));
  const toggleOpen = (id: string) =>
    setOpen((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  async function toggle(id: string) {
    if (saving.has(id)) return;
    const wasDone = done.has(id);
    setError(null);
    setDone((prev) => {
      const s = new Set(prev);
      wasDone ? s.delete(id) : s.add(id);
      return s;
    });
    setSaving((prev) => new Set(prev).add(id));

    let failed = false;
    try {
      const res = await saveDone(id, !wasDone);
      failed = !res.ok;
    } catch {
      failed = true;
    }

    setSaving((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });

    if (failed) {
      setDone((prev) => {
        const s = new Set(prev);
        wasDone ? s.add(id) : s.delete(id);
        return s;
      });
      setError("Couldn’t save that. Check your connection and try again.");
    }
  }

  async function storeNote(id: string, text: string): Promise<boolean> {
    let ok = false;
    try {
      ok = (await saveNote(id, text)).ok;
    } catch {
      ok = false;
    }
    if (ok) {
      setNotes((prev) => {
        const n = { ...prev };
        const clean = text.trim();
        clean ? (n[id] = clean) : delete n[id];
        return n;
      });
    }
    return ok;
  }

  return (
    <>
      <section className="summary" aria-label="Overall progress">
        <div className="summary-head">
          <h1>Your roadmap</h1>
          <span className="pct">{pct}%</span>
        </div>
        <div
          className="bar bar-lg"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="muted small">
          {doneCount} of {TOTAL} steps done · {ROADMAP.length} modules · {TOTAL_WEEKS} weeks · about 2 hours a day
        </p>
      </section>

      {next ? (
        <section className="next" aria-label="Up next">
          <p className="eyebrow">
            Up next · {next.mod.week} · {next.mod.title}
          </p>
          <p className="next-text">{next.label ? `${next.label}: ` : ""}{next.task.title}</p>
          <p className="next-learn muted">{next.task.learn}</p>
          {next.task.search[0] && (
            <p className="next-search">
              <span className="muted small">Start here:</span> <SearchLink s={next.task.search[0]} best />
            </p>
          )}
          <button className="btn-primary" onClick={() => toggle(next.task.id)} disabled={saving.has(next.task.id)}>
            Mark done
          </button>
        </section>
      ) : (
        <section className="next next-done">
          <p className="next-text">Every step is done. You built the whole thing.</p>
        </section>
      )}

      {error && <p className="alert alert-error" role="alert">{error}</p>}

      <div className="phases">
        {ROADMAP.map((mod, idx) => {
          const ids = moduleIds(mod);
          const modDone = ids.filter((id) => done.has(id)).length;
          const modPct = Math.round((modDone / ids.length) * 100);
          const isOpen = open.has(mod.id);
          return (
            <section key={mod.id} className={`phase ${isOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="phase-toggle"
                aria-expanded={isOpen}
                aria-controls={`mod-${mod.id}`}
                onClick={() => toggleOpen(mod.id)}
              >
                <span className="phase-head">
                  <span className="phase-title">
                    <span className="phase-num">Module {idx + 1}</span> {mod.title}
                  </span>
                  <span className="muted small tabular">
                    {mod.week} · {modDone}/{ids.length}
                  </span>
                </span>
                <span className="chev" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              <div className="bar bar-sm" aria-hidden="true">
                <div className="bar-fill" style={{ width: `${modPct}%` }} />
              </div>

              {isOpen && (
                <div id={`mod-${mod.id}`}>
                  <p className="goal">{mod.goal}</p>
                  {mod.nodeTip && (
                    <p className="node-tip">
                      <strong>Coming from Node:</strong> {mod.nodeTip}
                    </p>
                  )}
                  <NoteBox id={mod.id} label="module note" note={notes[mod.id]} onSave={storeNote} />

                  <ul className="list">
                    {mod.tasks.map((task) => (
                      <li key={task.id}>
                        <TaskCard
                          task={task}
                          checked={done.has(task.id)}
                          busy={saving.has(task.id)}
                          onToggle={() => toggle(task.id)}
                          note={notes[task.id]}
                          onSaveNote={storeNote}
                        />
                      </li>
                    ))}
                  </ul>

                  <div className="project">
                    <TaskCard
                      task={mod.project}
                      label={mod.project.label}
                      checked={done.has(mod.project.id)}
                      busy={saving.has(mod.project.id)}
                      onToggle={() => toggle(mod.project.id)}
                      note={notes[mod.project.id]}
                      onSaveNote={storeNote}
                    />
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p className="rule">
        <strong>Rule for an ADHD brain:</strong> don’t reread the whole list. Look at “Up next”, search the first link, do it, tap it, close the tab.
      </p>
    </>
  );
}

function TaskCard({
  task,
  label,
  checked,
  busy,
  onToggle,
  note,
  onSaveNote,
}: {
  task: Task;
  label?: string;
  checked: boolean;
  busy: boolean;
  onToggle: () => void;
  note?: string;
  onSaveNote: (id: string, text: string) => Promise<boolean>;
}) {
  return (
    <div className={`task ${checked ? "is-done" : ""} ${label ? "task-project" : ""}`}>
      <button
        type="button"
        className="check"
        aria-pressed={checked}
        aria-label={checked ? `Mark “${task.title}” not done` : `Mark “${task.title}” done`}
        onClick={onToggle}
        disabled={busy}
      >
        <span className="box" aria-hidden="true">
          {checked && (
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>
      <div className="task-body">
        {label && <span className="project-label">{label}</span>}
        <p className="task-title">{task.title}</p>
        <p className="task-learn">{task.learn}</p>

        {task.keywords.length > 0 && (
          <div className="chips" aria-label="Keywords">
            <span className="chips-label">Keywords</span>
            {task.keywords.map((k) => (
              <span key={k} className="chip">{k}</span>
            ))}
          </div>
        )}

        {task.search.length > 0 && (
          <div className="searches" aria-label="What to search">
            <span className="chips-label">Search</span>
            {task.search.map((s, i) => (
              <SearchLink key={s.q} s={s} best={i === 0} />
            ))}
          </div>
        )}

        <NoteBox id={task.id} label="note" note={note} onSave={onSaveNote} />
      </div>
    </div>
  );
}

function SearchLink({ s, best }: { s: Search; best?: boolean }) {
  return (
    <a className={`search ${best ? "search-best" : ""}`} href={searchUrl(s)} target="_blank" rel="noreferrer">
      <span className="search-on">{s.on === "yt" ? "YouTube" : "Web"}</span>
      {s.q}
      {best && <span className="search-badge">Best</span>}
    </a>
  );
}

function NoteBox({
  id,
  label,
  note,
  onSave,
}: {
  id: string;
  label: string;
  note?: string;
  onSave: (id: string, text: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note ?? "");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  function start() {
    setDraft(note ?? "");
    setFailed(false);
    setEditing(true);
  }

  async function save() {
    setBusy(true);
    setFailed(false);
    const ok = await onSave(id, draft);
    setBusy(false);
    if (ok) setEditing(false);
    else setFailed(true);
  }

  if (editing) {
    return (
      <div className="note note-editing">
        <textarea
          className="note-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) save();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder="What you learned, links you found, questions to come back to…"
          aria-label={`Edit ${label}`}
          maxLength={5000}
          rows={4}
          autoFocus
        />
        <div className="note-actions">
          <button type="button" className="btn-small btn-primary" onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setEditing(false)} disabled={busy}>
            Cancel
          </button>
          {failed && <span className="note-error" role="alert">Couldn’t save. Try again.</span>}
        </div>
      </div>
    );
  }

  if (note) {
    return (
      <div className="note">
        <p className="note-text">{note}</p>
        <button type="button" className="link-btn" onClick={start}>
          Edit {label}
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="link-btn note-add" onClick={start}>
      + Add {label}
    </button>
  );
}
