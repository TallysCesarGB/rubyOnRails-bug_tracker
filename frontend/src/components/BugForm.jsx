import { useState, useEffect } from "react";
import { projectsApi, usersApi } from "../services/api";

const SEVERITIES = ["low", "medium", "high", "critical"];
const STATUSES   = ["open", "in_progress", "resolved", "closed"];

const SEVERITY_LABEL = {
  low: "Baixa", medium: "Média", high: "Alta", critical: "Crítica"
};
const STATUS_LABEL = {
  open: "Aberto", in_progress: "Em andamento",
  resolved: "Resolvido", closed: "Fechado"
};

const EMPTY_FORM = {
  title: "", description: "", severity: "low",
  status: "open", project_id: "", reporter_id: "", assignee_id: ""
};

export function BugForm({ onSubmit, onCancel, initialData = {} }) {
  const [form, setForm]         = useState({ ...EMPTY_FORM, ...initialData });
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    projectsApi.getAll().then(setProjects);
    usersApi.getAll().then(setUsers);
  }, []);

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim())      errs.title      = "Título é obrigatório";
    if (!form.project_id)        errs.project_id = "Selecione um projeto";
    if (!form.reporter_id)       errs.reporter_id = "Selecione o responsável";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <h2>{initialData.id ? "Editar Bug" : "Novo Bug"}</h2>

      {/* Título */}
      <div className="field">
        <label>Título *</label>
        <input
          type="text"
          value={form.title}
          onChange={set("title")}
          placeholder="Ex: Botão de login não responde no Safari"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      {/* Descrição */}
      <div className="field">
        <label>Descrição</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={set("description")}
          placeholder="Descreva o comportamento esperado e o que está acontecendo..."
        />
      </div>

      {/* Projeto + Severidade (lado a lado) */}
      <div className="field-row">
        <div className="field">
          <label>Projeto *</label>
          <select value={form.project_id} onChange={set("project_id")}>
            <option value="">Selecione...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.project_id && (
            <span className="error">{errors.project_id}</span>
          )}
        </div>

        <div className="field">
          <label>Severidade</label>
          <select value={form.severity} onChange={set("severity")}>
            {SEVERITIES.map(s => (
              <option key={s} value={s}>{SEVERITY_LABEL[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status + Responsável (lado a lado) */}
      <div className="field-row">
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={set("status")}>
            {STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Reportado por *</label>
          <select value={form.reporter_id} onChange={set("reporter_id")}>
            <option value="">Selecione...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          {errors.reporter_id && (
            <span className="error">{errors.reporter_id}</span>
          )}
        </div>
      </div>

      {/* Atribuído a */}
      <div className="field">
        <label>Atribuído a</label>
        <select value={form.assignee_id} onChange={set("assignee_id")}>
          <option value="">Nenhum</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {/* Botões */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Salvando..." : initialData.id ? "Salvar" : "Criar Bug"}
        </button>
      </div>
    </form>
  );
}