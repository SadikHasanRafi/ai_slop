"use client";

import { useMemo, useState } from "react";
import { ALL_ITEM_IDS, ROADMAP } from "@/lib/roadmap";
import { setDone as saveDone } from "@/app/progress-actions";

const TOTAL = ALL_ITEM_IDS.length;

export default function Tracker({ initialDone }: { initialDone: string[] }) {
  const [done, setDone] = useState<Set<string>>(() => new Set(initialDone));
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const doneCount = ALL_ITEM_IDS.filter((id) => done.has(id)).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  // First unchecked item across the whole roadmap = what to do today.
  const next = useMemo(() => {
    for (const phase of ROADMAP) {
      for (const item of phase.items) if (!done.has(item.id)) return { phase, text: item.text, id: item.id };
      if (!done.has(phase.project.id)) return { phase, text: phase.project.text, id: phase.project.id, label: phase.project.label };
    }
    return null;
  }, [done]);

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
          {doneCount} of {TOTAL} steps done · 14 weeks · about 2 hours a day
        </p>
      </section>

      {next ? (
        <section className="next" aria-label="Up next">
          <p className="eyebrow">Up next · {next.phase.weeks}</p>
          <p className="next-text">{next.label ? `${next.label}: ` : ""}{next.text}</p>
          <button className="btn-primary" onClick={() => toggle(next.id)} disabled={saving.has(next.id)}>
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
        {ROADMAP.map((phase, idx) => {
          const ids = [...phase.items.map((i) => i.id), phase.project.id];
          const phaseDone = ids.filter((id) => done.has(id)).length;
          const phasePct = Math.round((phaseDone / ids.length) * 100);
          return (
            <section key={phase.id} className="phase">
              <div className="phase-head">
                <h2>
                  <span className="phase-num">Phase {idx + 1}</span> {phase.title}
                </h2>
                <span className="muted small tabular">
                  {phase.weeks} · {phaseDone}/{ids.length}
                </span>
              </div>
              <div className="bar bar-sm" aria-hidden="true">
                <div className="bar-fill" style={{ width: `${phasePct}%` }} />
              </div>

              <ul className="list">
                {phase.items.map((item) => (
                  <li key={item.id}>
                    <Row
                      checked={done.has(item.id)}
                      busy={saving.has(item.id)}
                      onToggle={() => toggle(item.id)}
                    >
                      {item.text}
                    </Row>
                  </li>
                ))}
              </ul>

              <div className="project">
                <Row
                  checked={done.has(phase.project.id)}
                  busy={saving.has(phase.project.id)}
                  onToggle={() => toggle(phase.project.id)}
                  variant="project"
                >
                  <span className="project-label">{phase.project.label}</span>
                  <span className="project-text">{phase.project.text}</span>
                </Row>
              </div>
            </section>
          );
        })}
      </div>

      <p className="rule">
        <strong>Rule for an ADHD brain:</strong> don’t reread the whole list. Look at “Up next”, do it, tap it, close the tab.
      </p>
    </>
  );
}

function Row({
  checked,
  busy,
  onToggle,
  variant,
  children,
}: {
  checked: boolean;
  busy: boolean;
  onToggle: () => void;
  variant?: "project";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`row ${checked ? "is-done" : ""} ${variant === "project" ? "row-project" : ""}`}
      aria-pressed={checked}
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
      <span className="row-text">{children}</span>
    </button>
  );
}
