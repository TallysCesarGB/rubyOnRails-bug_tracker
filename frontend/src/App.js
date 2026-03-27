// src/App.jsx
import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { BugDetail } from "./pages/BugDetail";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedBug, setSelectedBug] = useState(null);

  const goToBug = (id) => {
    setSelectedBug(id);
    setPage("bug-detail");
  };

  const goBack = () => {
    setSelectedBug(null);
    setPage("dashboard");
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>Bug Tracker</div>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.navItem, ...(page === "dashboard" ? styles.navActive : {}) }}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
        </nav>
      </aside>

      <main style={styles.main}>
        {page === "dashboard" && (
          <Dashboard onSelectBug={goToBug} />
        )}
        {page === "bug-detail" && (
          <BugDetail bugId={selectedBug} onBack={goBack} />
        )}
      </main>
    </div>
  );
}

const styles = {
  app: { display: "flex", minHeight: "100vh", background: "#f8f8f8" },
  sidebar: {
    width: "180px", background: "#fff",
    borderRight: "0.5px solid #e0e0e0",
    padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px",
  },
  logo: { fontSize: "14px", fontWeight: "500", padding: "4px 10px 16px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px" },
  navItem: {
    fontSize: "13px", padding: "7px 10px", borderRadius: "8px",
    border: "none", background: "transparent", cursor: "pointer",
    textAlign: "left", color: "#666",
  },
  navActive: { background: "#f0f0f0", color: "#111", fontWeight: "500" },
  main: { flex: 1, padding: "24px", maxWidth: "860px" },
};