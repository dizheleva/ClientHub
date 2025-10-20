import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Clients from './pages/Clients.jsx'
import ClientDetails from './pages/ClientDetails.jsx'
import './styles.css'

import { ToastProvider } from "./ui/Toast.jsx";

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <div className="container">
                    <header className="header">
                        <div className="brand">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12L12 4l8 8-8 8-8-8Z" stroke="url(#g)" strokeWidth="1.6" />
                                <defs><linearGradient id="g" x1="0" y1="0" x2="24" y2="0">
                                    <stop stopColor="#22d3ee" /><stop offset="1" stopColor="#6366f1" />
                                </linearGradient></defs>
                            </svg>
                            <h1>ClientHub</h1>
                        </div>
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
        </ToastProvider>
    )
}
createRoot(document.getElementById('root')).render(<App />)
