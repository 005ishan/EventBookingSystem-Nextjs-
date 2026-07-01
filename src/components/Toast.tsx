"use client";

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + nextId.current++;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const iconMap: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const styleMap: Record<ToastType, string> = {
  success: "bg-green-500/15 border-green-500/30 text-green-400",
  error: "bg-red-500/15 border-red-500/30 text-red-400",
  info: "bg-blue-500/15 border-blue-500/30 text-blue-400",
};

function ToastItem({ toast, onDone }: { toast: Toast; onDone: (id: number) => void }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDone(toast.id), 300);
    }, 4000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDone(toast.id), 300);
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${
        styleMap[toast.type]
      } ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"} ${
        exiting ? "translate-x-8 opacity-0" : ""
      }`}
    >
      <span className="text-base font-bold shrink-0">{iconMap[toast.type]}</span>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={handleDismiss}
        className="text-current/60 hover:text-current shrink-0 text-sm leading-none"
      >
        ✕
      </button>
    </div>
  );
}
