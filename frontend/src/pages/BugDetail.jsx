// src/pages/BugDetail.jsx
import { useState, useEffect } from "react";
import { bugsApi } from "../services/api";
import { CommentSection } from "../components/CommentSection";

const SEVERITY_STYLE = {
    low: { background: "#EAF3DE", color: "#27500A" },
    medium: { background: "#E6F1FB", color: "#0C447C" },
    high: { background: "#FAEEDA", color: "#633806" },
    critical: { background: "#FCEBEB", color: "#A32D2D" },
};

export function BugDetail({ bugId, onBack }) {
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bugsApi.getOne(bugId).then((data) => {
            setBug(data);
            setLoading(false);
        });
    }, [bugId]);

    const handleCommentAdded = (comment) => {
        setBug((prev) => ({
            ...prev,
            comments: [...prev.comments, comment],
        }));
    };

    if (loading) return <p style={{ color: "#888" }}>Carregando...</p>;
    if (!bug) return <p style={{ color: "#888" }}>Bug não encontrado.</p>;

    return (
        <div>
            <button onClick={onBack} style={styles.backBtn}>← Voltar</button>

            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{bug.title}</h2>
                    <span style={{ ...styles.badge, ...SEVERITY_STYLE[bug.severity] }}>
                        {bug.severity}
                    </span>
                </div>

                <div style={styles.meta}>
                    <MetaItem label="Projeto" value={bug.project?.name} />
                    <MetaItem label="Status" value={bug.status.replace("_", " ")} />
                    <MetaItem label="Reporter" value={bug.reporter?.name} />
                    <MetaItem label="Responsável" value={bug.assignee?.name ?? "—"} />
                    <MetaItem
                        label="Criado em"
                        value={new Date(bug.created_at).toLocaleDateString("pt-BR")}
                    />
                </div>

                {bug.description && (
                    <div style={styles.description}>
                        <p style={styles.descLabel}>Descrição</p>
                        <p style={styles.descText}>{bug.description}</p>
                    </div>
                )}
            </div>

            <CommentSection
                bugId={bug.id}
                comments={bug.comments ?? []}
                onCommentAdded={handleCommentAdded}
            />
        </div>
    );
}

function MetaItem({ label, value }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "11px", color: "#999" }}>{label}</span>
            <span style={{ fontSize: "13px", fontWeight: "500" }}>{value}</span>
        </div>
    );
}

const styles = {
    backBtn: {
        fontSize: "13px", padding: "6px 12px", borderRadius: "8px",
        border: "0.5px solid #ddd", background: "transparent",
        cursor: "pointer", marginBottom: "16px",
    },
    card: {
        background: "#fff", border: "0.5px solid #ddd",
        borderRadius: "12px", padding: "20px",
    },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
    title: { fontSize: "17px", fontWeight: "500", lineHeight: "1.4" },
    badge: { fontSize: "11px", padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" },
    meta: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "16px" },
    description: { borderTop: "0.5px solid #eee", paddingTop: "14px" },
    descLabel: { fontSize: "12px", color: "#999", marginBottom: "6px" },
    descText: { fontSize: "14px", color: "#444", lineHeight: "1.6" },
};