"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  searchUrl,
  stepsOf,
  type ModuleDoc,
  type Search,
  type StageDoc,
  type Step,
} from "@/lib/roadmap-types";
import { saveNote, setDone as saveDone } from "@/app/progress-actions";

type DoneMap = Record<string, string>; // step id -> ISO time it was completed

const DAY = 24 * 60 * 60 * 1000;

function fmtTime(min: number): string {
  if (min < 60) return `${min} min`;
  const h = min / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)} h`;
}

function fmtHours(min: number): string {
  const h = Math.round(min / 60);
  return `${h} h`;
}

export default function Tracker({
  stages,
  modules,
  initialDone,
  initialNotes,
  startedAt,
}: {
  stages: StageDoc[];
  modules: ModuleDoc[];
  initialDone: DoneMap;
  initialNotes: Record<string, string>;
  startedAt: string;
}) {
  const [done, setDone] = useState<DoneMap>(initialDone);
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [cheer, setCheer] = useState<string | null>(null);
  const cheerTimer = useRef<ReturnType<typeof setTimeout>>();

  // Dates are shown in the visitor's time zone. Until mounted, render the same
  // thing the server did (UTC) so hydration matches.
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => Date.parse(startedAt));
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
  }, []);
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...(mounted ? {} : { timeZone: "UTC" }),
    });
  const fmtShort = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(mounted ? {} : { timeZone: "UTC" }),
    });

  const allSteps = useMemo(() => modules.flatMap((m) => stepsOf(m)), [modules]);
  const total = allSteps.length;
  const doneCount = allSteps.filter((s) => done[s.id]).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const minutesLeft = allSteps.reduce((n, s) => n + (done[s.id] ? 0 : s.minutes), 0);

  const dayNumber = Math.max(1, Math.floor((now - Date.parse(startedAt)) / DAY) + 1);
  const doneThisWeek = allSteps.filter((s) => done[s.id] && now - Date.parse(done[s.id]) < 7 * DAY).length;

  // First unchecked step in roadmap order = what to do today.
  const next = useMemo(() => {
    for (const mod of modules) {
      for (const task of mod.tasks) if (!done[task.id]) return { mod, step: task as Step, project: false };
      if (!done[mod.project.id]) return { mod, step: mod.project as Step, project: true };
    }
    return null;
  }, [modules, done]);

  const [open, setOpen] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (next) setOpen((prev) => new Set(prev).add(next.mod._id));
  }, [next?.mod._id]);
  const toggleOpen = (id: string) =>
    setOpen((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  function say(msg: string) {
    setCheer(msg);
    clearTimeout(cheerTimer.current);
    cheerTimer.current = setTimeout(() => setCheer(null), 4500);
  }

  async function toggle(id: string) {
    if (saving.has(id)) return;
    const wasDone = !!done[id];
    const prevAt = done[id];
    setError(null);
    setDone((prev) => {
      const d = { ...prev };
      wasDone ? delete d[id] : (d[id] = new Date().toISOString());
      return d;
    });
    setSaving((prev) => new Set(prev).add(id));

    let result: { ok: boolean; doneAt?: string } = { ok: false };
    try {
      result = await saveDone(id, !wasDone);
    } catch {
      result = { ok: false };
    }

    setSaving((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });

    if (!result.ok) {
      setDone((prev) => {
        const d = { ...prev };
        wasDone ? (d[id] = prevAt) : delete d[id];
        return d;
      });
      setError("Couldn’t save that. Check your connection and try again.");
      return;
    }

    if (!wasDone) {
      if (result.doneAt) setDone((prev) => ({ ...prev, [id]: result.doneAt! }));
      const mod = modules.find((m) => m.itemIds.includes(id));
      if (mod) {
        const left = mod.itemIds.filter((i) => i !== id && !done[i]).length;
        say(left === 0 ? `Module complete: ${mod.title}. Nice work.` : `Done. ${left} left in this module.`);
      }
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

  const doneDate = (id: string) => (done[id] ? fmtShort(done[id]) : undefined);

  return (
    <>
      <div className="stickybar" aria-hidden="true">
        <span className="tabular stickybar-pct">{pct}%</span>
        <div className="bar bar-sm">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="muted small tabular">{doneCount}/{total}</span>
      </div>

      <section className="hero" aria-label="Overall progress">
        <ProgressRing pct={pct} />
        <div className="hero-body">
          <h1>Your roadmap</h1>
          <p className="hero-line">
            <strong className="tabular">{doneCount}</strong> of <span className="tabular">{total}</span> steps done
          </p>
          <dl className="facts">
            <div>
              <dt>Started</dt>
              <dd>{fmtDate(startedAt)}</dd>
            </div>
            <div>
              <dt>Day</dt>
              <dd className="tabular">{dayNumber}</dd>
            </div>
            <div>
              <dt>This week</dt>
              <dd className="tabular">{doneThisWeek} {doneThisWeek === 1 ? "step" : "steps"}</dd>
            </div>
            <div>
              <dt>Focused hours left</dt>
              <dd className="tabular">~{fmtHours(minutesLeft)}</dd>
            </div>
          </dl>
        </div>
      </section>

      {next ? (
        <section key={next.step.id} className="next" aria-label="Up next">
          <p className="eyebrow">
            Do this next · {next.mod.week} · {next.mod.title}
          </p>
          <p className="next-text">
            {next.project && <span className="project-label">Project · </span>}
            {next.step.title}
          </p>
          <p className="next-meta muted small">
            About {fmtTime(next.step.minutes)}
          </p>
          <p className="next-learn">{next.step.learn}</p>
          <p className="done-when">
            <strong>Done when:</strong> {next.step.doneWhen}
          </p>
          {(next.step.search[0] || next.step.links[0]) && (
            <div className="next-search">
              <span className="chips-label">Start here</span>
              {next.step.links[0] && <LinkChip label={next.step.links[0].label} url={next.step.links[0].url} best />}
              {next.step.search[0] && <SearchLink s={next.step.search[0]} best={!next.step.links[0]} />}
            </div>
          )}
          <button
            className="btn-primary"
            onClick={() => toggle(next.step.id)}
            disabled={saving.has(next.step.id)}
            aria-busy={saving.has(next.step.id)}
          >
            {saving.has(next.step.id) && <span className="spinner" aria-hidden="true" />}
            {saving.has(next.step.id) ? "Saving…" : "Mark done"}
          </button>
        </section>
      ) : (
        <section className="next next-done">
          <p className="next-text">Every step is done. You built the whole thing.</p>
        </section>
      )}

      <div className="toasts" aria-live="polite">
        {cheer && <p className="alert alert-ok">{cheer}</p>}
        {error && <p className="alert alert-error" role="alert">{error}</p>}
      </div>

      <div className="stages">
        {stages.map((stage) => {
          const mods = modules.filter((m) => m.stage === stage._id);
          const ids = mods.flatMap((m) => m.itemIds);
          const stageDone = ids.filter((id) => done[id]).length;
          const stagePct = ids.length ? Math.round((stageDone / ids.length) * 100) : 0;
          return (
            <section key={stage._id} className="stage" aria-label={stage.title}>
              <div className="stage-head">
                <h2>
                  <span className="stage-num">Stage {stage.order}</span> {stage.title}
                </h2>
                <span className="muted small tabular">{stageDone}/{ids.length} · {stagePct}%</span>
              </div>
              <p className="muted small stage-blurb">{stage.blurb}</p>
              <div className="bar bar-sm" aria-hidden="true">
                <div className="bar-fill" style={{ width: `${stagePct}%` }} />
              </div>

              <div className="modules">
                {mods.map((mod) => {
                  const steps = stepsOf(mod);
                  const modDone = steps.filter((s) => done[s.id]).length;
                  const modPct = Math.round((modDone / steps.length) * 100);
                  const complete = modDone === steps.length;
                  const status = complete ? "done" : modDone > 0 ? "progress" : "todo";
                  const times = steps.map((s) => done[s.id]).filter(Boolean).sort();
                  const isOpen = open.has(mod._id);
                  const isCurrent = next?.mod._id === mod._id;
                  return (
                    <article key={mod._id} className={`module is-${status} ${isOpen ? "is-open" : ""}`}>
                      <button
                        type="button"
                        className="module-toggle"
                        aria-expanded={isOpen}
                        aria-controls={`mod-${mod._id}`}
                        onClick={() => toggleOpen(mod._id)}
                      >
                        <span className={`badge badge-${status}`} aria-hidden="true">
                          {complete ? (
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                              <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            mod.order
                          )}
                        </span>
                        <span className="module-head">
                          <span className="module-title">{mod.title}</span>
                          <span className="muted small tabular">
                            {mod.week} · {modDone}/{steps.length}
                            {isCurrent && <span className="here"> · You are here</span>}
                          </span>
                        </span>
                        <svg className="chev" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <div className="bar bar-xs" aria-hidden="true">
                        <div className="bar-fill" style={{ width: `${modPct}%` }} />
                      </div>

                      {isOpen && (
                        <div id={`mod-${mod._id}`} className="module-body">
                          {times.length > 0 && (
                            <p className="muted small dates">
                              First step done {fmtShort(times[0])}
                              {complete && ` · Finished ${fmtShort(times[times.length - 1])}`}
                            </p>
                          )}
                          <p className="goal">{mod.goal}</p>
                          {mod.nodeTip && (
                            <p className="node-tip">
                              <strong>Coming from Node:</strong> {mod.nodeTip}
                            </p>
                          )}
                          <NoteBox id={mod._id} label="module note" note={notes[mod._id]} onSave={storeNote} />

                          <ul className="list">
                            {mod.tasks.map((task) => (
                              <li key={task.id}>
                                <StepCard
                                  step={task}
                                  doneOn={doneDate(task.id)}
                                  checked={!!done[task.id]}
                                  busy={saving.has(task.id)}
                                  onToggle={() => toggle(task.id)}
                                  note={notes[task.id]}
                                  onSaveNote={storeNote}
                                />
                              </li>
                            ))}
                          </ul>

                          <div className="project">
                            <StepCard
                              step={mod.project}
                              label={mod.project.label}
                              major={mod.project.kind === "major"}
                              doneOn={doneDate(mod.project.id)}
                              checked={!!done[mod.project.id]}
                              busy={saving.has(mod.project.id)}
                              onToggle={() => toggle(mod.project.id)}
                              note={notes[mod.project.id]}
                              onSaveNote={storeNote}
                            />
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="rule">
        <strong>ADHD rule:</strong> don’t reread the whole list. Look at “Do this next”, open the first link, stop at “Done when”, tap Mark done, close the tab.
      </p>
    </>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="ring"
      role="progressbar"
      aria-label="Overall progress"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="ring-track" fill="none" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="ring-fill"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="ring-label tabular">{pct}%</span>
    </div>
  );
}

function StepCard({
  step,
  label,
  major,
  checked,
  busy,
  doneOn,
  onToggle,
  note,
  onSaveNote,
}: {
  step: Step;
  label?: string;
  major?: boolean;
  checked: boolean;
  busy: boolean;
  doneOn?: string;
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
        aria-label={checked ? `Mark “${step.title}” not done` : `Mark “${step.title}” done`}
        onClick={onToggle}
        disabled={busy}
      >
        <span className={`box ${busy ? "is-busy" : ""}`} aria-hidden="true">
          {busy ? (
            <span className="spinner spinner-sm" />
          ) : checked && (
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>
      <div className="task-body">
        {label && <span className="project-label">{major ? "Major project" : "Mini project"} · {label.split("·").pop()?.trim()}</span>}
        <p className="task-title">{step.title}</p>
        <p className="task-meta muted small">
          <span>About {fmtTime(step.minutes)}</span>
          {checked && doneOn && <span className="done-on"> · Done {doneOn}</span>}
        </p>

        {/* Finished steps collapse to one line so the page stays short. */}
        {!checked && (
          <>
            <p className="task-learn">{step.learn}</p>
            <p className="done-when">
              <strong>Done when:</strong> {step.doneWhen}
            </p>

            {step.keywords.length > 0 && (
              <div className="chips" aria-label="Keywords to learn">
                <span className="chips-label">Keywords</span>
                {step.keywords.map((k) => (
                  <span key={k} className="chip">{k}</span>
                ))}
              </div>
            )}

            {(step.links.length > 0 || step.search.length > 0) && (
              <div className="searches" aria-label="Free resources and searches">
                <span className="chips-label">Free</span>
                {step.links.map((l, i) => (
                  <LinkChip key={l.url} label={l.label} url={l.url} best={i === 0} />
                ))}
                {step.search.map((s, i) => (
                  <SearchLink key={s.q} s={s} best={step.links.length === 0 && i === 0} />
                ))}
              </div>
            )}
          </>
        )}

        <NoteBox id={step.id} label="note" note={note} onSave={onSaveNote} />
      </div>
    </div>
  );
}

function LinkChip({ label, url, best }: { label: string; url: string; best?: boolean }) {
  return (
    <a className={`search ${best ? "search-best" : ""}`} href={url} target="_blank" rel="noreferrer">
      <span className="search-on">Link</span>
      {label}
    </a>
  );
}

function SearchLink({ s, best }: { s: Search; best?: boolean }) {
  return (
    <a className={`search ${best ? "search-best" : ""}`} href={searchUrl(s)} target="_blank" rel="noreferrer">
      <span className="search-on">{s.on === "yt" ? "YouTube" : "Search"}</span>
      {s.q}
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
            {busy && <span className="spinner" aria-hidden="true" />}
            {busy ? "Saving…" : "Save"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => setEditing(false)} disabled={busy}>
            Cancel
          </button>
          <span className="muted small">Ctrl+Enter saves</span>
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
