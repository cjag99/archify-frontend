// Page-level UI component that renders the HTTPToast interface
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Lock,
  Shield,
  Clock,
  Server,
} from "lucide-react";

type ToastItem = {
  id: string;
  message: string;
  status: number;
  success: boolean;
  title: string;
};

const getStatusMessage = (status: number, success: boolean): string => {
  if (success && status === 200) return "Success";
  if (!success) {
    const statusMessages: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Validation Error",
      429: "Too Many Requests",
      500: "Server Error",
      503: "Service Unavailable",
    };
    return statusMessages[status] || "Error";
  }
  return "Success";
};

const getStatusIcon = (status: number, success: boolean) => {
  if (success) return <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />;
  
  const iconMap: Record<number, React.ReactNode> = {
    400: <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />,
    401: <Lock className="w-5 h-5 shrink-0 mt-0.5" />,
    403: <Shield className="w-5 h-5 shrink-0 mt-0.5" />,
    404: <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />,
    409: <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />,
    422: <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />,
    429: <Clock className="w-5 h-5 shrink-0 mt-0.5" />,
    500: <Server className="w-5 h-5 shrink-0 mt-0.5" />,
    503: <Server className="w-5 h-5 shrink-0 mt-0.5" />,
  };
  
  return iconMap[status] || <XCircle className="w-5 h-5 shrink-0 mt-0.5" />;
};

export default function HTTPToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent | undefined;
      const detail = ce?.detail as { status?: number; success?: boolean; message?: string } | undefined;
      const status = detail?.status ?? 0;
      const success = !!detail?.success;
      const message = detail?.message || (success ? "Your request was processed successfully" : "Something went wrong. Please try again.");
      const title = getStatusMessage(status, success);

      const item: ToastItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message,
        status,
        success,
        title,
      };

      setToasts((t) => [item, ...t]);


      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== item.id));
      }, 5000);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("archify:api-response", handler as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("archify:api-response", handler as EventListener);
      }
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full rounded-xl shadow-xl px-5 py-4 text-sm text-white flex items-start gap-3 animate-in slide-in-from-right-5 fade-in-80 pointer-events-auto
            ${t.success 
              ? "bg-linear-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 border border-emerald-400/20" 
              : "bg-linear-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 border border-red-400/20"
            }`}
          role="status"
          aria-atomic="true"
        >
          {getStatusIcon(t.status, t.success)}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-tight">
              {t.title}
            </div>
            <div className="mt-2 text-xs/relaxed opacity-95 wrap-break-word">
              {t.message}
            </div>
            {t.status > 0 && (
              <div className="mt-1 text-xs opacity-75">
                HTTP {t.status}
              </div>
            )}
          </div>
          <button
            aria-label="Close notification"
            onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))}
            className="ml-2 shrink-0 text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

