import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../services/api";

const BASE_URL = "http://localhost:3000/api/v1";

export function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const user = await usersApi.create({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "member",
        });
        login(user);
      } else {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
        login(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🐞</span>
          <span style={styles.logoText}>Bug Tracker</span>
        </div>

        <h2 style={styles.title}>
          {mode === "login" ? "Entrar na conta" : "Criar conta"}
        </h2>

        {error && <p style={styles.errorBox}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "register" && (
            <Field label="Nome">
              <input
                style={styles.input}
                value={form.name}
                onChange={set("name")}
                placeholder="Seu nome"
                required
              />
            </Field>
          )}

          <Field label="Email">
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="seu@email.com"
              required
            />
          </Field>

          <Field label="Senha">
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              required
            />
          </Field>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading
              ? "Aguarde..."
              : mode === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>
        </form>

        <p style={styles.switchText}>
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            style={styles.switchBtn}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F5F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
    justifyContent: "center",
  },
  logoIcon: { fontSize: "24px" },
  logoText: { fontSize: "18px", fontWeight: "700", color: "#111827" },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column" },
  label: { fontSize: "12px", color: "#666", display: "block", marginBottom: "5px" },
  input: {
    width: "100%",
    fontSize: "13px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    boxSizing: "border-box",
    outline: "none",
  },
  submitBtn: {
    marginTop: "6px",
    fontSize: "14px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#4F46E5",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
  errorBox: {
    background: "#FCEBEB",
    color: "#A32D2D",
    fontSize: "13px",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  switchText: { fontSize: "13px", color: "#666", textAlign: "center", marginTop: "16px" },
  switchBtn: {
    background: "none",
    border: "none",
    color: "#4F46E5",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    padding: 0,
  },
};