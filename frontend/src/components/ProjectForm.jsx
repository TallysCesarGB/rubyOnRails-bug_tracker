import { useState } from "react";

const EMPTY = { name: "", description: "", status: "active" };

export function ProjectForm({ onSubmit, onCancel, initialData = {} }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

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
          {initialData.id ? "Editar Projeto" : "Novo Projeto"}
        </h2>

        {errors.general && <p style={styles.errorBox}>{errors.general}</p>}

        <Field label="Nome *" error={errors.name}>
          <input
            style={styles.input}
            value={form.name}
            onChange={set("name")}
            placeholder="Ex: Refatoração do App"
          />
        </Field>

        <Field label="Descrição">
          <textarea
            style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            value={form.description}
            onChange={set("description")}
            placeholder="Objetivos do projeto..."
          />
        </Field>

        <Field label="Status">
          <select style={styles.input} value={form.status} onChange={set("status")}>
            <option value="active">Ativo</option>
            <option value="archived">Arquivado</option>
          </select>
        </Field>

        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Salvando..." : initialData.id ? "Salvar" : "Criar Projeto"}
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
    background: "rgba(0,0,0,0.35)", borderRadius: "12px",
    display: "flex", justifyContent: "center", padding: "20px", marginBottom: "16px",
  },
  modal: {
    background: "#fff", borderRadius: "12px", border: "0.5px solid #ddd",
    padding: "24px", width: "100%", maxWidth: "480px",
  },
  title: { fontSize: "16px", fontWeight: "500", marginBottom: "16px" },
  input: {
    width: "100%", fontSize: "13px", padding: "7px 10px",
    borderRadius: "8px", border: "0.5px solid #ccc", boxSizing: "border-box",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" },
  cancelBtn: {
    fontSize: "13px", padding: "6px 14px", borderRadius: "8px",
    border: "0.5px solid #ccc", background: "transparent", cursor: "pointer",
  },
  submitBtn: {
    fontSize: "13px", padding: "6px 16px", borderRadius: "8px",
    border: "0.5px solid #ccc", background: "#f5f5f5", fontWeight: "500", cursor: "pointer",
  },
  errorBox: {
    background: "#FCEBEB", color: "#A32D2D", fontSize: "13px",
    padding: "8px 12px", borderRadius: "8px", marginBottom: "12px",
  },
};
