import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function ClientDetails() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [client, setClient] = useState(null);
    const [interactions, setInteractions] = useState([]);

    const [form, setForm] = useState({ type: "Call", summary: "" });

    async function load() {
        try {
            setError(null);
            setLoading(true);

            const [c, i] = await Promise.all([
                api.get(`/api/clients/${id}`),
                api.get(`/api/clients/${id}/interactions`)
            ]);

            setClient(c.data);
            setInteractions(i.data);
        } catch (e) {
            setError(e?.response?.data?.title || e.message || "Failed to load client");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [id]);

    async function addInteraction(e) {
        e.preventDefault();
        if (!form.type) return;
        try {
            setError(null);
            await api.post(`/api/clients/${id}/interactions`, form);
            setForm({ type: "Call", summary: "" });
            await load();
        } catch (e) {
            const title = e?.response?.data?.title || "Failed to add interaction";
            const details = e?.response?.data?.errors
                ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ")
                : "";
            setError(details ? `${title} — ${details}` : title);
        }
    }

    if (loading) return <p className="muted">Loading…</p>;
    if (!client) return <div className="error">Client not found</div>;

    return (
        <div className="grid">
            <div className="row" style={{ justifyContent: "space-between" }}>
                <h2 style={{ margin: 0 }}>{client.name}</h2>
                <Link to="/clients"><button className="ghost">← Back</button></Link>
            </div>

            {/* Client profile */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 className="section-title">Client Profile</h3>
                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                        <p><b>Email:</b> <span className="muted">{client.email || "—"}</span></p>
                        <p><b>Phone:</b> <span className="muted">{client.phone || "—"}</span></p>
                    </div>
                    <div>
                        <p><b>Company:</b> <span className="muted">{client.company || "—"}</span></p>
                        <p><b>Notes:</b> <span className="muted">{client.notes || "—"}</span></p>
                    </div>
                </div>
            </div>

            {/* Add interaction */}
            <div className="card" style={{ marginBottom: 16 }}>
                <h3 className="section-title">Add Interaction</h3>
                <form
                    onSubmit={addInteraction}
                    className="grid"
                    style={{ gridTemplateColumns: "160px 1fr auto", gap: "12px" }}
                >
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option>Call</option>
                        <option>Email</option>
                        <option>Meeting</option>
                    </select>
                    <input
                        className="input"
                        placeholder="Summary (optional)…"
                        value={form.summary}
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    />
                    <button className="primary">Add</button>
                </form>
            </div>

            {error && <div className="error">Error: {error}</div>}

            {/* Interactions */}
            <div className="card">
                <h3 className="section-title">Interactions</h3>
                {interactions.length === 0 ? (
                    <p className="muted">No interactions yet.</p>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Summary</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interactions.map((i) => (
                                    <tr key={i.id}>
                                        <td><span className={`badge type-${i.type}`}>{i.type}</span></td>
                                        <td className="muted">{i.summary || "—"}</td>
                                        <td className="muted">{i.createdAt ? new Date(i.createdAt).toLocaleString() : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
