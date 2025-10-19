import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Clients() {
    const navigate = useNavigate();

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data state
    const [items, setItems] = useState([]);

    // Search state (debounced)
    const [q, setQ] = useState("");

    // Create form state
    const [newClient, setNewClient] = useState({
        name: "",
        email: "",
        company: "",
        notes: "",
    });

    // Load clients from API
    async function loadClients(query) {
        try {
            setError(null);
            setLoading(true);
            const res = await api.get("/api/clients", { params: query ? { q: query } : {} });
            setItems(res.data);
        } catch (e) {
            setError(e?.response?.data?.title || e.message || "Failed to load clients");
        } finally {
            setLoading(false);
        }
    }

    // Initial load
    useEffect(() => {
        loadClients();
    }, []);

    // Debounced search
    useEffect(() => {
        const id = setTimeout(() => loadClients(q.trim()), 400);
        return () => clearTimeout(id);
    }, [q]);

    // Add new client
    async function handleAddClient(e) {
        e.preventDefault();
        if (!newClient.name.trim()) {
            setError("Name is required.");
            return;
        }
        try {
            setError(null);
            await api.post("/api/clients", newClient);
            setNewClient({ name: "", email: "", company: "", notes: "" });
            await loadClients(q.trim());
        } catch (e) {
            const title = e?.response?.data?.title || "Failed to create client";
            const details = e?.response?.data?.errors
                ? Object.entries(e.response.data.errors)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                    .join(" | ")
                : "";
            setError(details ? `${title} — ${details}` : title);
        }
    }

    function handleOpen(id) {
        navigate(`/clients/${id}`);
    }

    return (
        <div className="grid">
            {/* Òop search bar */}
            <div className="row" style={{ marginBottom: 8 }}>
                <div className="search-bar">
                    <input
                        className="input"
                        placeholder="Search name / company / email..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
            </div>

            {/* Add Client */}
            <div className="card add-client-card">
                <h2 className="section-title">Add New Client</h2>                

                <form className="form-grid" onSubmit={handleAddClient}>
                    <input
                        className="input"
                        placeholder="Name *"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Company"
                        value={newClient.company}
                        onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Notes"
                        value={newClient.notes}
                        onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    />
                    <button type="submit" className="primary">Add</button>
                </form>
            </div>

            {/* Clients List */}
            <div className="card clients-list">
                <h2 className="section-title">Clients</h2>

                {error && <div className="error">Error: {error}</div>}

                {loading ? (
                    <p className="muted">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="muted">No clients yet. Add one using the form above.</p>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company</th>
                                    <th>Notes</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td className="muted">{c.email || "-"}</td>
                                        <td>{c.company || "-"}</td>
                                        <td className="muted">{c.notes || "-"}</td>
                                        <td>
                                            <button className="open" onClick={() => handleOpen(c.id)}>Open</button>
                                        </td>
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
