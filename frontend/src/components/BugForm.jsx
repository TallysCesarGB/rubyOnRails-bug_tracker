import { useState, useEffect } from "react";
import { projectsApi, usersApi } from "../services/api";

const EMPTY = {
  title: "", description: "", severity: "low",
  status: "open", project_id: "", reporter_id: "", assignee_id: "",
};

export function BugForm({ onSubmit, onCancel, initialData = {} }) {
  const [form, setForm]         = useState({ ...EMPTY, ...initialData });
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    projectsApi.getAll().then(setProjects);
    usersApi.getAll().then(setUsers);
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())  e.title      = "Título é obrigatório";
    if (!form.project_id)    e.project_id = "Selecione um projeto";
    if (!form.reporter_id)   e.reporter_id = "Selecione o reporter";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.modal}>
        <h2 style={styles.title}>
          {initialData.id ? "Editar Bug" : "Novo Bug"}
        </h2>

        {errors.general && (
          <p style={styles.errorBox}>{errors.general}</p>
        )}

        <Field label="Título *" error={errors.title}>
          <input
            style={styles.input}
            value={form.title}
            onChange={set("title")}
            placeholder="Ex: Botão não responde no Safari"
          />
        </Field>

        <Field label="Descrição">
          <textarea
            style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            value={form.description}
            onChange={set("description")}
            placeholder="Comportamento esperado vs atual..."
          />
        </Field>

        <div style={styles.row}>
          <Field label="Projeto *" error={errors.project_id}>
            <select style={styles.input} value={form.project_id} onChange={set("project_id")}>
              <option value="">Selecione...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Severidade">
            <select style={styles.input} value={form.severity} onChange={set("severity")}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </Field>
        </div>

        <div style={styles.row}>
          <Field label="Status">
            <select style={styles.input} value={form.status} onChange={set("status")}>
              <option value="open">Aberto</option>
              <option value="in_progress">Em andamento</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </select>
          </Field>

          <Field label="Reportado por *" error={errors.reporter_id}>
            <select style={styles.input} value={form.reporter_id} onChange={set("reporter_id")}>
              <option value="">Selecione...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Atribuído a">
          <select style={styles.input} value={form.assignee_id} onChange={set("assignee_id")}>
            <option value="">Nenhum</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </Field>

        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Salvando..." : initialData.id ? "Salvar" : "Criar Bug"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: "11px", color: "#A32D2D" }}>{error}</span>}
    </div>
  );
}

const styles = {
  overlay: {
    background: "rgba(0,0,0,0.35)",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    marginBottom: "16px",
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    border: "0.5px solid #ddd",
    padding: "24px",
    width: "100%",
    maxWidth: "480px",
  },
  title: { fontSize: "16px", fontWeight: "500", marginBottom: "16px" },
  input: {
    width: "100%",
    fontSize: "13px",
    padding: "7px 10px",
    borderRadius: "8px",
    border: "0.5px solid #ccc",
    boxSizing: "border-box",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  actions: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" },
  cancelBtn: {
    fontSize: "13px", padding: "6px 14px", borderRadius: "8px",
    border: "0.5px solid #ccc", background: "transparent", cursor: "pointer",
  },
  submitBtn: {
    fontSize: "13px", padding: "6px 16px", borderRadius: "8px",
    border: "0.5px solid #ccc", background: "#f5f5f5",
    fontWeight: "500", cursor: "pointer",
  },
  errorBox: {
    background: "#FCEBEB", color: "#A32D2D", fontSize: "13px",
    padding: "8px 12px", borderRadius: "8px", marginBottom: "12px",
  },
};