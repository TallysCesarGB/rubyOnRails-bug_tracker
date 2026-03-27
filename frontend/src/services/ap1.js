const BASE = "/api/v1";

export const bugsApi = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetch(`${BASE}/bugs?${query}`).then(r => r.json());
  },
  getOne:  (id)      => fetch(`${BASE}/bugs/${id}`).then(r => r.json()),
  create:  (data)    => fetch(`${BASE}/bugs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bug: data })
  }).then(r => r.json()),
  update:  (id, data) => fetch(`${BASE}/bugs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bug: data })
  }).then(r => r.json()),
  remove:  (id)      => fetch(`${BASE}/bugs/${id}`, { method: "DELETE" })
};