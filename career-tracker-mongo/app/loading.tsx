// Shown while the page fetches the roadmap and your progress from the database.
export default function Loading() {
  return (
    <main className="page" aria-busy="true" aria-label="Loading your roadmap">
      <header className="topbar">
        <span className="brand">Career Tracker</span>
        <span className="skeleton" style={{ width: 140, height: 28 }} />
      </header>

      <section className="hero">
        <span className="skeleton skeleton-ring" />
        <div className="hero-body">
          <span className="skeleton" style={{ width: "50%", height: 24, marginBottom: 10 }} />
          <span className="skeleton" style={{ width: "35%", height: 14, marginBottom: 18 }} />
          <div className="facts">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="skeleton" style={{ height: 34 }} />
            ))}
          </div>
        </div>
      </section>

      <section className="next">
        <span className="skeleton" style={{ width: "45%", height: 12, marginBottom: 14 }} />
        <span className="skeleton" style={{ width: "80%", height: 20, marginBottom: 12 }} />
        <span className="skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <span className="skeleton" style={{ width: "70%", height: 14, marginBottom: 18 }} />
        <span className="skeleton" style={{ width: 110, height: 40 }} />
      </section>

      <div className="modules">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="module">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="skeleton" style={{ width: 28, height: 28, borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <span className="skeleton" style={{ width: "60%", height: 16, marginBottom: 6 }} />
                <span className="skeleton" style={{ width: "30%", height: 12 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
