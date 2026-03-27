import { useState, useEffect } from "react";
import { bugsApi } from "../services/api";
import { BugCard } from "../components/BugCard";
import { BugForm } from "../components/BugForm";

export default function Dashboard() {
  const [bugs, setBugs]       = useState([]);
  const [filter, setFilter]   = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    bugsApi.getAll(filter ? { status: filter } : {}).then(setBugs);
  }, [filter]);

  const handleCreate = async (data) => {
    const newBug = await bugsApi.create(data);
    setBugs(prev => [newBug, ...prev]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await bugsApi.remove(id);
    setBugs(prev => prev.filter(b => b.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    const updated = await bugsApi.update(id, { status });
    setBugs(prev => prev.map(b => b.id === id ? updated : b));
  };

  return (
    <div className="dashboard">
      <h1>Bug Tracker</h1>

      <div className="toolbar">
        <select onChange={e => setFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="open">Abertos</option>
          <option value="in_progress">Em andamento</option>
          <option value="resolved">Resolvidos</option>
        </select>
        <button onClick={() => setShowForm(true)}>+ Novo Bug</button>
      </div>

      {showForm && (
        <BugForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <div className="bug-list">
        {bugs.map(bug => (
          <BugCard
            key={bug.id}
            bug={bug}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}