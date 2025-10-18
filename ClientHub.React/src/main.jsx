import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Clients from './pages/Clients.jsx'
import ClientDetails from './pages/ClientDetails.jsx'
import './styles.css'

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <header className="header">
                    <h1>ClientHub</h1>
                    <nav className="nav">
                        <Link to="/clients">Clients</Link>
                    </nav>
                </header>
                <div className="card">
                    <Routes>
                        <Route path="/" element={<Navigate to="/clients" replace />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/clients/:id" element={<ClientDetails />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}
createRoot(document.getElementById('root')).render(<App />)
