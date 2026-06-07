"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: "#16a34a",
    text: "#15803d",
  },
  error: {
    bg: "#fef2f2",
    border: "#fecaca",
    icon: "#dc2626",
    text: "#b91c1c",
  },
  info: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: "#2563eb",
    text: "#1d4ed8",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + counter++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.625rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => {
          const c = COLORS[toast.type];
          return (
            <div
              key={toast.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1.25rem",
                borderRadius: "12px",
                background: c.bg,
                border: `1px solid ${c.border}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                minWidth: 280,
                maxWidth: 380,
                pointerEvents: "auto",
                animation: "toastSlideIn 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: c.icon,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {ICONS[toast.type]}
              </div>
              <span style={{ fontSize: "0.9rem", color: c.text, fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
