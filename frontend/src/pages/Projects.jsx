import { useState, useEffect } from "react";
import { projectsApi } from "../services/api";
import { ProjectForm } from "../components/ProjectForm";

export function Projects({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    if (data.id) {
      await projectsApi.update(data.id, data);
    } else {
      await projectsApi.create(data);
    }
    closeForm();
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Certeza que deseja excluir este projeto? Todos os bugs vinculados serão perdidos (dependendo do banco de dados).")) return;
    await projectsApi.remove(id);
    fetchProjects();
  };

  const openEdit = (proj) => {
    setEditProject(proj);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditProject(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={styles.topbar}>
        <h1 style={styles.heading}>Projetos</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Novo Projeto"}
        </button>
      </div>

      {showForm && (
        <ProjectForm
          initialData={editProject || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <p style={styles.loading}>Carregando projetos...</p>
      ) : projects.length === 0 ? (
        <p style={styles.empty}>Nenhum projeto cadastrado.</p>
      ) : (
        <div style={styles.grid}>
          {projects.map((proj) => (
            <div key={proj.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.title}>{proj.name}</h3>
                <span style={{
                  ...styles.statusBadge,
                  background: proj.status === "active" ? "#EAF3DE" : "#F1EFE8",
                  color: proj.status === "active" ? "#27500A" : "#444441"
                }}>
                  {proj.status === "active" ? "Ativo" : "Arquivado"}
                </span>
              </div>
              
              <p style={styles.desc}>
                {proj.description || <span style={{color: "#aaa", fontStyle: "italic"}}>Sem descrição</span>}
              </p>
              
              <div style={styles.meta}>
                <span>🐛 {proj.bugs_count || 0} bugs associados</span>
              </div>

              <div style={styles.actions}>
                <button style={styles.bugsBtn} onClick={() => onSelectProject(proj)}>
                   Ver Bugs
                </button>
                <div style={styles.btnGroup}>
                   <button style={styles.editBtn} onClick={() => openEdit(proj)}>Editar</button>
                   <button style={styles.delBtn} onClick={() => handleDelete(proj.id)}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  heading: { fontSize: "24px", fontWeight: "600", color: "#111" },
  addBtn: {
    fontSize: "13px", padding: "8px 16px", borderRadius: "8px",
    border: "1px solid #ddd", background: "#fff", fontWeight: "500", cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s"
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
    gap: "20px" 
  },
  card: {
    background: "#fff", border: "1px solid #eaeaea", borderRadius: "12px",
    padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "transform 0.1s, box-shadow 0.1s"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: "16px", fontWeight: "600", margin: 0, color: "#222" },
  statusBadge: { fontSize: "11px", padding: "3px 8px", borderRadius: "20px", fontWeight: "500" },
  desc: { fontSize: "13px", color: "#666", margin: 0, lineHeight: "1.5", flex: 1 },
  meta: { fontSize: "12px", color: "#888", marginTop: "4px", paddingBottom: "12px", borderBottom: "1px solid #f0f0f0" },
  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" },
  bugsBtn: {
    fontSize: "13px", padding: "6px 14px", borderRadius: "6px",
    background: "#f0f8ff", color: "#0056b3", border: "1px solid #d0e3ff",
    cursor: "pointer", fontWeight: "500", transition: "background 0.2s"
  },
  btnGroup: { display: "flex", gap: "8px" },
  editBtn: {
    fontSize: "12px", padding: "5px 10px", borderRadius: "6px",
    background: "#fff", color: "#555", border: "1px solid #ddd", cursor: "pointer",
  },
  delBtn: {
    fontSize: "12px", padding: "5px 10px", borderRadius: "6px",
    background: "#fff", color: "#d32f2f", border: "1px solid #f8d7da", cursor: "pointer",
  },
  loading: { color: "#888", fontSize: "14px" },
  empty: { color: "#888", fontSize: "14px" },
};
