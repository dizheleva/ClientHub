import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function ClientDetails() {
    const { id } = useParams()
    const [client, setClient] = useState(null)
    const [interactions, setInteractions] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ type: 'Call', summary: '' })

    async function load() {
        try {
            setError(null); setLoading(true)
            const r = await api.get(`/api/clients/${id}`)
            setClient(r.data)
            const i = await api.get(`/api/clients/${id}/interactions`)
            setInteractions(i.data)
        } catch (e) { setError(e.message || 'Failed to load client') }
        finally { setLoading(false) }
    }
    useEffect(() => { load() }, [id])

    async function addInteraction(e) {
        e.preventDefault()
        if (!form.type) return
        try {
            setError(null)
            await api.post(`/api/clients/${id}/interactions`, form)
            setForm({ type: 'Call', summary: '' })
            load()
        } catch (e) {
            const msg = e.response?.data?.title || e.message
            const details = e.response?.data?.errors ? Object.entries(e.response.data.errors).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''
            setError(`${msg}${details ? ' - ' + details : ''}`)
        }
    }

    if (loading) return <p className="muted">Loading…</p>
    if (!client) return <div className="error">Client not found</div>

    return (
        <div className="grid">
            <div className="row" style={{ justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0 }}>{client.name}</h2>
                <Link to="/clients"><button>← Back</button></Link>
            </div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div>
                    <p><b>Email:</b> <span className="muted">{client.email || '-'}</span></p>
                    <p><b>Company:</b> <span className="muted">{client.company || '-'}</span></p>
                    <p><b>Notes:</b> <span className="muted">{client.notes || '-'}</span></p>
                </div>
                <form onSubmit={addInteraction} className="grid" style={{ gridTemplateColumns: '1fr 2fr auto' }}>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Call</option><option>Email</option><option>Meeting</option>
                    </select>
                    <input className="input" placeholder="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
                    <button className="primary">Add</button>
                </form>
            </div>

            {error && <div className="error">Error: {error}</div>}

            <h3>Interactions</h3>
            {interactions.length === 0 ? <p className="muted">No interactions yet.</p> : (
                <table className="table">
                    <thead><tr><th>Type</th><th>Summary</th><th>Created</th></tr></thead>
                    <tbody>
                        {interactions.map(i => (
                            <tr key={i.id}>
                                <td><span className="badge">{i.type}</span></td>
                                <td className="muted">{i.summary || '-'}</td>
                                <td className="muted">{i.createdAt ? new Date(i.createdAt).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
