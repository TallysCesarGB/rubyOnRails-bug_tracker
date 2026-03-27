// src/services/api.js
const BASE_URL = "http://localhost:3000/api/v1";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro na requisição");
  }

  return data;
}

// ─── Bugs ────────────────────────────────────────────────────
export const bugsApi = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    ).toString();
    return request(`/bugs${query ? `?${query}` : ""}`);
  },

  getOne: (id) => request(`/bugs/${id}`),

  create: (data) =>
    request("/bugs", {
      method: "POST",
      body: JSON.stringify({ bug: data }),
    }),

  update: (id, data) =>
    request(`/bugs/${id}`, {
      method: "PUT",
      body: JSON.stringify({ bug: data }),
    }),

  remove: (id) =>
    request(`/bugs/${id}`, { method: "DELETE" }),
};

// ─── Projects ────────────────────────────────────────────────
export const projectsApi = {
  getAll: () => request("/projects"),
  getOne: (id) => request(`/projects/${id}`),

  create: (data) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify({ project: data }),
    }),

  update: (id, data) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({ project: data }),
    }),

  remove: (id) =>
    request(`/projects/${id}`, { method: "DELETE" }),
};

// ─── Users ───────────────────────────────────────────────────
export const usersApi = {
  getAll: () => request("/users"),
  getOne: (id) => request(`/users/${id}`),

  create: (data) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify({ user: data }),
    }),

  update: (id, data) =>
    request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ user: data }),
    }),

  remove: (id) =>
    request(`/users/${id}`, { method: "DELETE" }),
};

// ─── Comments ────────────────────────────────────────────────
export const commentsApi = {
  getAll: (bugId) => request(`/bugs/${bugId}/comments`),

  create: (bugId, data) =>
    request(`/bugs/${bugId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment: data }),
    }),

  remove: (bugId, commentId) =>
    request(`/bugs/${bugId}/comments/${commentId}`, { method: "DELETE" }),
};