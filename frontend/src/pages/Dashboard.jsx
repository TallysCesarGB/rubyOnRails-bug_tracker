// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { bugsApi } from "../services/api";
import { BugCard } from "../components/BugCard";
import { BugForm } from "../components/BugForm";
import { MetricCards } from "../components/MetricCards";

const FILTERS = [
  { label: "Todos", value: "" },
  { label: "Abertos", value: "open" },
  { label: "Em andamento", value: "in_progress" },
  { label: "Resolvidos", value: "resolved" },
  { label: "Fechados", value: "closed" },
];

export function Dashboard({ projectId, onSelectBug }) {
  const [bugs, setBugs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBugs();
  }, [filter, projectId]);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.status = filter;
      if (projectId) params.project_id = projectId;

      const res = await bugsApi.getAll(params);
      setBugs(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    await bugsApi.create(data);
    setShowForm(false);
    fetchBugs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este bug?")) return;
    await bugsApi.remove(id);
    fetchBugs();
  };

  const handleStatusChange = async (id, status) => {
    await bugsApi.update(id, { status });
    fetchBugs();
  };

  return (
    <div>
      <div style={styles.topbar}>
        <h1 style={styles.heading}>{projectId ? "Bugs do Projeto" : "Dashboard"}</h1>
        <button style={styles.addBtn} onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Novo Bug"}
        </button>
      </div>

      <MetricCards meta={meta} />

      {showForm && (
        <BugForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div style={styles.filterBar}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            style={{
              ...styles.filterBtn,
              ...(filter === f.value ? styles.filterActive : {}),
            }}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.loading}>Carregando bugs...</p>
      ) : bugs.length === 0 ? (
        <p style={styles.empty}>Nenhum bug encontrado.</p>
      ) : (
        <div style={styles.list}>
          {bugs.map((bug) => (
            <BugCard
              key={bug.id}
              bug={bug}
              onClick={onSelectBug}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  heading: { fontSize: "20px", fontWeight: "500" },
  addBtn: {
    fontSize: "13px", padding: "7px 16px", borderRadius: "8px",
    border: "0.5px solid #ccc", background: "#fff",
    fontWeight: "500", cursor: "pointer",
  },
  filterBar: { display: "flex", gap: "6px", marginBottom: "14px", flexWrap: "wrap" },
  filterBtn: {
    fontSize: "12px", padding: "4px 12px", borderRadius: "20px",
    border: "0.5px solid #ddd", background: "#fff", cursor: "pointer", color: "#666",
  },
  filterActive: { background: "#f0f0f0", color: "#111", fontWeight: "500", borderColor: "#bbb" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  loading: { color: "#888", fontSize: "14px" },
  empty: { color: "#888", fontSize: "14px" },
};