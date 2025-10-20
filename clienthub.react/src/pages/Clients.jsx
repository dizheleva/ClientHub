import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Clients() {
    const navigate = useNavigate();

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data
    const [items, setItems] = useState([]);

    // Search (debounced)
    const [q, setQ] = useState("");

    // Form state (used for create and edit)
    const emptyForm = { name: "", email: "", phone: "", company: "", notes: "" };
    const [form, setForm] = useState(emptyForm);

    // Edit state
    const [editingClient, setEditingClient] = useState(null);

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

    useEffect(() => { loadClients(); }, []);
    useEffect(() => {
        const id = setTimeout(() => loadClients(q.trim()), 400);
        return () => clearTimeout(id);
    }, [q]);

    // Create
    async function createClient(e) {
        e.preventDefault();
        if (!form.name.trim()) { setError("Name is required."); return; }
        try {
            setError(null);
            await api.post("/api/clients", form);
            setForm(emptyForm);
            await loadClients(q.trim());
        } catch (e) {
            const title = e?.response?.data?.title || "Failed to create client";
            const details = e?.response?.data?.errors
                ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ")
                : "";
            setError(details ? `${title} — ${details}` : title);
        }
    }

    // Start editing
    function startEdit(client) {
        setEditingClient(client);
        setForm({
            name: client.name || "",
            email: client.email || "",
            phone: client.phone || "",
            company: client.company || "",
            notes: client.notes || "",
        });
    }

    // Save edit (PUT /api/clients/{id})
    async function saveEdit(e) {
        e.preventDefault();
        if (!editingClient) return;
        if (!form.name.trim()) { setError("Name is required."); return; }
        try {
            setError(null);
            await api.put(`/api/clients/${editingClient.id}`, {
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                notes: form.notes,
            });
            setEditingClient(null);
            setForm(emptyForm);
            await loadClients(q.trim());
        } catch (e) {
            const title = e?.response?.data?.title || "Failed to update client";
            const details = e?.response?.data?.errors
                ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ")
                : "";
            setError(details ? `${title} — ${details}` : title);
        }
    }

    // Cancel edit
    function cancelEdit() {
        setEditingClient(null);
        setForm(emptyForm);
    }

    // Delete
    async function deleteClient(id) {
        if (!window.confirm("Are you sure you want to delete this client?")) return;
        try {
            setError(null);
            await api.delete(`/api/clients/${id}`);
            await loadClients(q.trim());
        } catch (e) {
            setError(e?.response?.data?.title || e.message || "Failed to delete client");
        }
    }

    function openDetails(id) {
        navigate(`/clients/${id}`);
    }

    return (
        <div className="grid">
            {/* Add / Edit card */}
            <div className="card add-client-card">
                <h2 className="section-title">{editingClient ? "Edit Client" : "Add New Client"}</h2>

                {/* Search */}
                <div className="row" style={{ marginBottom: 8 }}>
                    <div className="search-bar">
                        <input
                            className="input"
                            placeholder="Search name / company / email…"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                </div>

                {/* Form */}
                <form className="form-grid" onSubmit={editingClient ? saveEdit : createClient}>
                    <input
                        className="input"
                        placeholder="Name *"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Company"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />

                    <div className="row" style={{ gap: 8 }}>
                        <button type="submit" className="primary">
                            {editingClient ? "Save Changes" : "Add"}
                        </button>
                        {editingClient && (
                            <button type="button" className="ghost" onClick={cancelEdit}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="card clients-list">
                <h2 className="section-title">Clients</h2>

                {error && <div className="error">Error: {error}</div>}

                {loading ? (
                    <p className="muted">Loading…</p>
                ) : items.length === 0 ? (
                    <p className="muted">No clients yet. Add one using the form above.</p>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Company</th>
                                    <th>Notes</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td className="muted">{c.email || "—"}</td>
                                        <td>{c.phone || "—"}</td>
                                        <td>{c.company || "—"}</td>
                                        <td className="muted">{c.notes || "—"}</td>
                                        <td className="actions" style={{ whiteSpace: "nowrap" }}>
                                            <button className="open" onClick={() => openDetails(c.id)}>Open</button>
                                            <button className="ghost" onClick={() => startEdit(c)}>Edit</button>
                                            <button className="danger" onClick={() => deleteClient(c.id)}>Delete</button>
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
