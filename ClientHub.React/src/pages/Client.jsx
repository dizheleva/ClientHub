import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Clients() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [q, setQ] = useState('')
    const [form, setForm] = useState({ name: '', email: '', company: '', notes: '' })

    async function load() {
        try {
            setError(null); setLoading(true)
            const res = await api.get('/api/clients', { params: q ? { q } : {} })
            setItems(res.data)
        } catch (e) { setError(e.message || 'Failed to load clients') }
        finally { setLoading(false) }
    }
    useEffect(() => { load() }, [])
    useEffect(() => { const id = setTimeout(load, 400); return () => clearTimeout(id) }, [q])

    async function create(e) {
        e.preventDefault()
        if (!form.name.trim()) { setError('Name is required'); return }
        try {
            setError(null)
            await api.post('/api/clients', form)
            setForm({ name: '', email: '', company: '', notes: '' })
            load()
        } catch (e) {
            const msg = e.response?.data?.title || e.message
            const details = e.response?.data?.errors ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''
            setError(`${msg}${details ? ' — ' + details : ''}`)
        }
    }

    return (
        <div className="grid">
            <div className="row">
                <input className="input" placeholder="Search name/company/email..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1 }} />
            </div>

            <form onSubmit={create} className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
                <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="input" placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                <input className="input" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                <button className="primary">Add</button>
            </form>

            {error && <div className="error">Error: {error}</div>}
            {loading ? <p className="muted">Loading…</p> :
                items.length === 0 ? <p className="muted">No clients. Add one above.</p> : (
                    <table className="table">
                        <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Notes</th><th></th></tr></thead>
                        <tbody>
                            {items.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td className="muted">{c.email || '-'}</td>
                                    <td>{c.company || '-'}</td>
                                    <td className="muted">{c.notes || '-'}</td>
                                    <td><div className="actions">
                                        <Link to={`/clients/${c.id}`}><button>Open</button></Link>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
        </div>
    )
}
