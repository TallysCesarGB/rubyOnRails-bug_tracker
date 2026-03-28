import { useState } from "react";
import { commentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export function CommentSection({ bugId, comments, onCommentAdded }) {
    const { user } = useAuth();
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) return;
        setLoading(true);
        try {
        const comment = await commentsApi.create(bugId, {
            body,
            user_id: user.id,   // vem da sessão automaticamente
        });
        onCommentAdded(comment);
        setBody("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.section}>
            <h3 style={styles.heading}>Comentários ({comments.length})</h3>

            <div style={styles.list}>
                {comments.length === 0 && (
                    <p style={styles.empty}>Nenhum comentário ainda.</p>
                )}
                {comments.map((c) => (
                    <div key={c.id} style={styles.comment}>
                        <div style={styles.commentHeader}>
                            <span style={styles.author}>{c.user.name}</span>
                            <span style={styles.date}>
                                {new Date(c.created_at).toLocaleString("pt-BR")}
                            </span>
                        </div>
                        <p style={styles.body}>{c.body}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <textarea
                    style={styles.textarea}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escreva um comentário..."
                    rows={3}
                />
                <div style={styles.counter}>
                    {body.length} caracteres
                </div>
                <div style={styles.formBottom}>
                    <button type="submit" disabled={loading} style={styles.sendBtn}>
                        {loading ? "Enviando..." : "Comentar"}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    section: { marginTop: "24px" },
    heading: { fontSize: "15px", fontWeight: "500", marginBottom: "12px" },
    list: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
    empty: { fontSize: "13px", color: "#888" },
    comment: {
        background: "#f9f9f9", border: "0.5px solid #eee",
        borderRadius: "8px", padding: "12px",
    },
    commentHeader: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
    author: { fontSize: "13px", fontWeight: "500" },
    date: { fontSize: "11px", color: "#999" },
    body: { fontSize: "13px", color: "#444", lineHeight: "1.5" },
    form: { display: "flex", flexDirection: "column", gap: "8px" },
    textarea: {
        fontSize: "13px", padding: "8px 10px", borderRadius: "8px",
        border: "0.5px solid #ccc", resize: "vertical",
    },
    formBottom: { display: "flex", gap: "8px" },
    userInput: {
        fontSize: "13px", padding: "6px 10px", borderRadius: "8px",
        border: "0.5px solid #ccc", width: "130px",
    },
    sendBtn: {
        fontSize: "13px", padding: "6px 16px", borderRadius: "8px",
        border: "0.5px solid #ccc", background: "#f5f5f5",
        fontWeight: "500", cursor: "pointer",
    },
    counter: {
        fontSize: "11px",
        color: "#999",
        textAlign: "right",
        marginTop: "4px",
    },
};