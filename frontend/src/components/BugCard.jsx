
const SEVERITY_STYLE = {
  low: { background: "#EAF3DE", color: "#27500A" },
  medium: { background: "#E6F1FB", color: "#0C447C" },
  high: { background: "#FAEEDA", color: "#633806" },
  critical: { background: "#FCEBEB", color: "#A32D2D" },
};

const STATUS_STYLE = {
  open: { background: "#FAEEDA", color: "#633806" },
  in_progress: { background: "#E6F1FB", color: "#0C447C" },
  resolved: { background: "#EAF3DE", color: "#27500A" },
  closed: { background: "#F1EFE8", color: "#444441" },
};

const STATUS_LABEL = {
  open: "aberto", in_progress: "em andamento",
  resolved: "resolvido", closed: "fechado",
};

const SEVERITY_LABEL = {
  low: "baixa", medium: "média",
  high: "alta", critical: "crítico",
};

export function BugCard({ bug, onClick, onStatusChange, onDelete }) {
  return (
    <div style={styles.card}>
      <div 
        style={styles.clickableArea} 
        onClick={() => onClick(bug)}
      >
        <div style={styles.top}>
          <span style={styles.title}>{bug.title}</span>
          <div style={styles.badges}>
            <span style={{ ...styles.badge, ...SEVERITY_STYLE[bug.severity] }}>
              {SEVERITY_LABEL[bug.severity]}
            </span>
            <span style={{ ...styles.badge, ...STATUS_STYLE[bug.status] }}>
              {STATUS_LABEL[bug.status]}
            </span>
          </div>
        </div>

        {bug.description && (
          <p style={styles.description}>
            {bug.description.length > 100
              ? bug.description.slice(0, 100) + "..."
              : bug.description}
          </p>
        )}

        <div style={styles.meta}>
          <span>📁 {bug.project?.name}</span>
          <span>👤 {bug.reporter?.name}</span>
          {bug.assignee && <span>🔧 {bug.assignee.name}</span>}
        </div>
      </div>

      <div
        style={styles.actions}
        onClick={(e) => e.stopPropagation()}
      >
        <select
          value={bug.status}
          onChange={(e) => onStatusChange(bug.id, e.target.value)}
          style={styles.select}
        >
          <option value="open">Aberto</option>
          <option value="in_progress">Em andamento</option>
          <option value="resolved">Resolvido</option>
          <option value="closed">Fechado</option>
        </select>

        <button
          onClick={() => onDelete(bug.id)}
          style={styles.deleteBtn}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "0.5px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "border-color .15s",
  },
  clickableArea: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  title: {
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1.4",
  },
  badges: { display: "flex", gap: "5px", flexShrink: 0 },
  badge: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
  },
  description: { fontSize: "13px", color: "#666", lineHeight: "1.5" },
  meta: {
    display: "flex",
    gap: "14px",
    fontSize: "12px",
    color: "#888",
  },
  actions: { display: "flex", gap: "8px", alignItems: "center" },
  select: {
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "0.5px solid #ddd",
  },
  deleteBtn: {
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "0.5px solid #f09595",
    background: "#fff",
    color: "#A32D2D",
    cursor: "pointer",
  },
};