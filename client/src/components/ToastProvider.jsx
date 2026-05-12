import { createContext, useEffect, useMemo, useState } from "react";

export const ToastContext = createContext({
  success: () => {},
  error: () => {},
});

const TOAST_LIFETIME_MS = 3200;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!toasts.length) return undefined;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, TOAST_LIFETIME_MS)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  const api = useMemo(
    () => ({
      success(message) {
        setToasts((current) => [...current, { id: `${Date.now()}-${Math.random()}`, message, tone: "success" }]);
      },
      error(message) {
        setToasts((current) => [...current, { id: `${Date.now()}-${Math.random()}`, message, tone: "error" }]);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${
              toast.tone === "success"
                ? "border-accent-green/30 bg-accent-green/10 text-green-100"
                : "border-red-400/30 bg-red-500/10 text-red-100"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
