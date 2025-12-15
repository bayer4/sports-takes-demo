"use client";

import { useEffect, useState } from "react";

type Take = {
  id: number;
  author: string;
  text: string;
  confidence: string;
  result: string;
  createdAt: string;
};

const MAX_TEXT_LENGTH = 280;

export default function Page() {
  const [takes, setTakes] = useState<Take[]>([]);
  const [author, setAuthor] = useState("alex");
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState("NORMAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/takes", { cache: "no-store" });
    const data = await res.json();
    setTakes(data.takes ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  function validate(): string | null {
    if (!author.trim()) return "Author is required";
    if (!text.trim()) return "Take is required";
    if (text.length > MAX_TEXT_LENGTH) return `Take must be under ${MAX_TEXT_LENGTH} characters`;
    return null;
  }

  async function submit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/takes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text, confidence })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error ?? "Failed to post");
        return;
      }

      setText("");
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function resolveTake(id: number, result: "HIT" | "MISS" | "PUSH") {
    const res = await fetch(`/api/takes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err?.error ?? "Failed to resolve take");
      return;
    }

    await refresh();
  }

  const isValid = author.trim() && text.trim() && text.length <= MAX_TEXT_LENGTH;

  return (
    <main>
      <h1 style={{ fontSize: 22, marginBottom: 6 }}>Sports Take Ledger (Demo)</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Minimal vertical slice: Prisma/SQLite → API → UI.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "14px 0", flexWrap: "wrap" }}>
        <input
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setError(""); }}
          placeholder="author"
          style={{ padding: 8, flex: "0 0 140px" }}
        />
        <select value={confidence} onChange={(e) => setConfidence(e.target.value)} style={{ padding: 8 }}>
          <option value="HUNCH">HUNCH</option>
          <option value="NORMAL">NORMAL</option>
          <option value="BOLD">BOLD</option>
        </select>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); }}
          placeholder="write a take..."
          style={{ padding: 8, flex: 1, minWidth: 200 }}
          maxLength={MAX_TEXT_LENGTH + 20}
        />
        <button onClick={submit} disabled={loading || !isValid} style={{ padding: "8px 12px" }}>
          {loading ? "Posting…" : "Post"}
        </button>
      </div>

      {/* Character count */}
      <div style={{ fontSize: 12, color: text.length > MAX_TEXT_LENGTH ? "#e53935" : "#888", marginBottom: 8 }}>
        {text.length}/{MAX_TEXT_LENGTH}
      </div>

      {/* Inline error */}
      {error && (
        <div style={{ 
          color: "#e53935", 
          backgroundColor: "#ffebee", 
          padding: "8px 12px", 
          borderRadius: 6, 
          marginBottom: 12,
          fontSize: 14 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {takes.map((t) => (
          <div key={t.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <strong>@{t.author}</strong>
              <span style={{ 
                color: t.result === "HIT" ? "#43a047" : t.result === "MISS" ? "#e53935" : "#666",
                fontWeight: t.result !== "OPEN" ? 600 : 400
              }}>
                {t.confidence} • {t.result}
              </span>
            </div>
            <div style={{ fontSize: 14 }}>{t.text}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#777" }}>
              {new Date(t.createdAt).toLocaleString()}
            </div>
            
            {/* Resolve buttons - only show for OPEN takes */}
            {t.result === "OPEN" && (
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button 
                  onClick={() => resolveTake(t.id, "HIT")}
                  style={{ 
                    padding: "4px 10px", 
                    fontSize: 12, 
                    backgroundColor: "#e8f5e9",
                    border: "1px solid #a5d6a7",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  ✅ HIT
                </button>
                <button 
                  onClick={() => resolveTake(t.id, "MISS")}
                  style={{ 
                    padding: "4px 10px", 
                    fontSize: 12, 
                    backgroundColor: "#ffebee",
                    border: "1px solid #ef9a9a",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  ❌ MISS
                </button>
                <button 
                  onClick={() => resolveTake(t.id, "PUSH")}
                  style={{ 
                    padding: "4px 10px", 
                    fontSize: 12, 
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #bdbdbd",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  ➖ PUSH
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
