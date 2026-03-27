export function MetricCards({ meta }) {
    if (!meta) return null;

    const cards = [
        { label: "Total de bugs", value: meta.total, color: "#378ADD" },
        { label: "Abertos", value: meta.open, color: "#BA7517" },
        { label: "Em andamento", value: meta.in_progress, color: "#185FA5" },
        { label: "Resolvidos", value: meta.resolved, color: "#3B6D11" },
    ];

    return (
        <div style={styles.grid}>
            {cards.map((card) => (
                <div key={card.label} style={styles.card}>
                    <p style={styles.label}>{card.label}</p>
                    <p style={{ ...styles.value, color: card.color }}>{card.value}</p>
                </div>
            ))}
        </div>
    );
}

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "10px",
        marginBottom: "24px",
    },
    card: {
        background: "#f5f5f5",
        borderRadius: "8px",
        padding: "14px 16px",
    },
    label: {
        fontSize: "12px",
        color: "#666",
        marginBottom: "6px",
    },
    value: {
        fontSize: "24px",
        fontWeight: "500",
    },
};