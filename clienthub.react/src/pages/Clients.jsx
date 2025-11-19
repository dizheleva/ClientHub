import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useToast } from "../ui/Toast.jsx";

export default function Clients() {
    const navigate = useNavigate();

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toast = useToast();

    // Data
    const [items, setItems] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState("name");
    const [dir, setDir] = useState("asc");
    const [total, setTotal] = useState(0);

    // Search (debounced)
    const [q, setQ] = useState("");

    // Form state (used for create and edit)
    const emptyForm = { name: "", email: "", phone: "", company: "", notes: "" };
    const [form, setForm] = useState(emptyForm);

    // Edit state
    const [editingClient, setEditingClient] = useState(null);

    async function loadClients(queryQ) {
        try {
            setError(null);
            setLoading(true);
            const res = await api.get("/api/clients", {
                params: {
                    q: queryQ ?? q.trim(),
                    page,
                    pageSize,
                    sort,
                    dir
                }
            });
            setItems(res.data.items);
            setTotal(res.data.total);
        } catch (e) {
            setError(e?.response?.data?.title || e.message || "Failed to load clients");
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadClients();
    }, [page, pageSize, sort, dir]);

    useEffect(() => {
        const id = setTimeout(() => { setPage(1); loadClients(q.trim()) }, 400);
        return () => clearTimeout(id);
    }, [q]);

    // Sort
    function toggleSort(col) {
        if (sort === col) {
            setDir(dir === "asc" ? "desc" : "asc");
        } else {
            setSort(col);
            setDir("asc");
        }
        setPage(1);
    }
    function sortIndicator(col) {
        if (sort !== col) return "";
        return dir === "asc" ? " ▲" : " ▼";
    }


    // Create
    async function createClient(e) {
        e.preventDefault();
        if (!form.name.trim()) { setError("Name is required."); return; }
        try {
            await api.post("/api/clients", form);
            toast.success("Client created");
            setForm(emptyForm);
            await loadClients(q.trim());
        } catch (e) {
            const title = e?.response?.data?.title || "Failed to create client";
            const details = e?.response?.data?.errors
                ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ")
                : "";
            setError(details ? `${title} — ${details}` : title);
            toast.error(title);
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
            toast.success("Client updated");
            setEditingClient(null);
            setForm(emptyForm);
            await loadClients(q.trim());
        } catch (e) {
            
            const title = e?.response?.data?.title || "Failed to update client";
            const details = e?.response?.data?.errors
                ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ")
                : "";
            setError(details ? `${title} — ${details}` : title);
            toast.error(title);
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
            await api.delete(`/api/clients/${id}`);
            toast.success("Client deleted");
            await loadClients(q.trim());
        } catch (e) {
            toast.error("Failed to delete client");
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
                                    <th style={{ cursor: 'pointer' }} onClick={() => toggleSort("name")}>
                                        Name{sortIndicator("name")}
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => toggleSort("email")}>
                                        Email{sortIndicator("email")}
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => toggleSort("phone")}>
                                        Phone{sortIndicator("phone")}
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => toggleSort("company")}>
                                        Company{sortIndicator("company")}
                                    </th>
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

                        <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
                            <div className="muted">
                                Total: {total} • Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                            </div>
                            <div className="row">
                                <select
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                    title="Items per page"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>

                                <button
                                    className="ghost"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    style={{ marginLeft: 8 }}
                                >
                                    ◀ Prev
                                </button>
                                <button
                                    className="ghost"
                                    onClick={() => {
                                        const last = Math.max(1, Math.ceil(total / pageSize));
                                        setPage(p => Math.min(last, p + 1));
                                    }}
                                    disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
                                    style={{ marginLeft: 8 }}
                                >
                                    Next ▶
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
