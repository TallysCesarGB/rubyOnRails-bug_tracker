const SEVERITY_COLOR = {
  low: "green", medium: "yellow", high: "orange", critical: "red"
};

export function BugCard({ bug, onDelete, onStatusChange }) {
  return (
    <div className="bug-card">
      <div className="bug-header">
        <span className={`badge ${SEVERITY_COLOR[bug.severity]}`}>
          {bug.severity}
        </span>
        <h3>{bug.title}</h3>
      </div>
      <p>{bug.description}</p>
      <div className="bug-actions">
        <select
          value={bug.status}
          onChange={e => onStatusChange(bug.id, e.target.value)}
        >
          {["open","in_progress","resolved","closed"].map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <button onClick={() => onDelete(bug.id)}>Excluir</button>
      </div>
    </div>
  );
}