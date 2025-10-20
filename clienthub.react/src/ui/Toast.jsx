import React, { createContext, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(1);

    const api = useMemo(() => ({
        show: (message, opts = {}) => {
            const id = idRef.current++;
            const toast = {
                id,
                message,
                type: opts.type || "info",     // "success" | "error" | "info"
                duration: opts.duration ?? 3000
            };
            setToasts(prev => [...prev, toast]);
            if (toast.duration > 0) {
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                }, toast.duration);
            }
            return id;
        },
        success: (msg, duration) => api.show(msg, { type: "success", duration }),
        error: (msg, duration) => api.show(msg, { type: "error", duration }),
        info: (msg, duration) => api.show(msg, { type: "info", duration }),
        dismiss: (id) => setToasts(prev => prev.filter(t => t.id !== id)),
        clear: () => setToasts([])
    }), []);

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="toast-container" role="region" aria-live="polite" aria-atomic="true">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.type}`} role="status">
                        <span className="toast-msg">{t.message}</span>
                        <button
                            className="toast-close"
                            aria-label="Close"
                            onClick={() => api.dismiss(t.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}
