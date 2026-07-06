import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 p-4 rounded-xl border bg-zinc-950 text-foreground shadow-2xl pointer-events-auto w-full
                ${toast.type === "success" ? "border-emerald-500/30 shadow-emerald-500/5" : ""}
                ${toast.type === "error" ? "border-red-500/30 shadow-red-500/5" : ""}
                ${toast.type === "warning" ? "border-amber-500/30 shadow-amber-500/5" : ""}
                ${toast.type === "info" ? "border-indigo-500/30 shadow-indigo-500/5" : ""}
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                {toast.type === "error" && <XCircle className="h-5 w-5 text-red-400" />}
                {toast.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-400" />}
                {toast.type === "info" && <Info className="h-5 w-5 text-indigo-400" />}
              </div>

              {/* Message */}
              <div className="flex-1 text-sm font-medium pr-2">
                {toast.message}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-zinc-400 hover:text-foreground transition-colors p-0.5 rounded hover:bg-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
