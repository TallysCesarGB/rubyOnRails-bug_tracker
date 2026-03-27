// src/App.jsx
import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { BugDetail } from "./pages/BugDetail";
import { Projects } from "./pages/Projects";

export default function App() {
    const [page, setPage] = useState("dashboard");
    const [selectedBug, setSelectedBug] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [fromPage, setFromPage] = useState(null);

    const goToBug = (bug) => {
        setSelectedBug(bug);
        setFromPage(page);
        if (page === "dashboard") {
            setSelectedProject(bug.project);
        }
        setPage("bug-detail");
    };

    const goBack = () => {
        setSelectedBug(null);
        if (fromPage === "dashboard") {
            setSelectedProject(null);
            setPage("dashboard");
        } else if (fromPage === "project-dashboard" || selectedProject) {
            setPage("project-dashboard");
        } else {
            setPage("dashboard");
        }
    };

    const goToProjectDashboard = (project) => {
        setSelectedProject(project);
        setPage("project-dashboard");
    };

    const navTo = (p) => {
        setPage(p);
        if (p === "dashboard" || p === "projects") {
            setSelectedProject(null);
            setSelectedBug(null);
        }
    };

    return (
        <div style={styles.app}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>🐞</span> Bug Tracker
                </div>
                <nav style={styles.nav}>
                    <button
                        style={{ ...styles.navItem, ...(page === "dashboard" ? styles.navActive : {}) }}
                        onClick={() => navTo("dashboard")}
                    >
                        Dashboard Geral
                    </button>
                    <button
                        style={{ ...styles.navItem, ...(page === "projects" ? styles.navActive : {}) }}
                        onClick={() => navTo("projects")}
                    >
                        Projetos
                    </button>
                    {(page === "project-dashboard" || (page === "bug-detail" && selectedProject)) && (
                        <button
                            style={{ ...styles.navItem, ...(page === "project-dashboard" ? styles.navActive : {}) }}
                            onClick={() => setPage("project-dashboard")}
                        >
                            ↳ {selectedProject.name}
                        </button>
                    )}
                    {page === "bug-detail" && selectedBug && (
                        <button
                            style={{ ...styles.navItem, ...styles.navActive, paddingLeft: "20px" }}
                            onClick={() => {}}
                        >
                            ↳ {selectedBug.title.length > 20 ? selectedBug.title.slice(0, 20) + '...' : selectedBug.title}
                        </button>
                    )}
                </nav>
            </aside>

            <div style={styles.mainWrapper}>
                <main style={styles.main}>
                    {page === "dashboard" && (
                        <Dashboard onSelectBug={goToBug} />
                    )}
                    {page === "projects" && (
                        <Projects onSelectProject={goToProjectDashboard} />
                    )}
                    {page === "project-dashboard" && (
                        <Dashboard projectId={selectedProject?.id} onSelectBug={goToBug} />
                    )}
                    {page === "bug-detail" && (
                        <BugDetail bugId={selectedBug?.id} onBack={goBack} />
                    )}
                </main>
            </div>
        </div>
    );
}

const styles = {
    app: { display: "flex", minHeight: "100vh", background: "#F4F5F7", fontFamily: "Inter, system-ui, sans-serif" },
    sidebar: {
        width: "220px", background: "#fff",
        borderRight: "1px solid #E5E7EB",
        padding: "20px 16px", display: "flex", flexDirection: "column", gap: "8px",
        flexShrink: 0
    },
    logo: { 
        fontSize: "16px", fontWeight: "700", padding: "4px 10px 24px", 
        color: "#111827", display: "flex", alignItems: "center", gap: "8px" 
    },
    logoIcon: { fontSize: "20px" },
    nav: { display: "flex", flexDirection: "column", gap: "6px" },
    navItem: {
        fontSize: "14px", padding: "10px 14px", borderRadius: "8px",
        border: "none", background: "transparent", cursor: "pointer",
        textAlign: "left", color: "#4B5563", fontWeight: "500",
        transition: "background 0.2s, color 0.2s"
    },
    navActive: { background: "#EEF2FF", color: "#4F46E5", fontWeight: "600" },
    mainWrapper: { 
        flex: 1, 
        display: "flex", 
        justifyContent: "center", 
        overflowY: "auto" 
    },
    main: { 
        flex: 1, 
        padding: "32px 40px", 
        maxWidth: "960px",
        width: "100%"
    },
};