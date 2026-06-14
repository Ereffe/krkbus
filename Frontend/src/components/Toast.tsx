import * as React from "react";

export type ToastVariant = "success" | "error" | "info";

export type ToastState = {
    open: boolean;
    title?: string;
    message?: string;
    variant: ToastVariant;
};

const variantToStyles: Record<ToastVariant, string> = {
    success:
        "bg-emerald-600 text-white border-emerald-700 dark:border-emerald-500",
    error: "bg-red-600 text-white border-red-700 dark:border-red-500",
    info: "bg-blue-600 text-white border-blue-700 dark:border-blue-500",
};

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
    // Auto-dismiss
    React.useEffect(() => {
        if (!toast.open) return;
        const t = window.setTimeout(() => onClose(), 3500);
        return () => window.clearTimeout(t);
    }, [toast.open, onClose]);

    if (!toast.open) return null;

    return (
        <div
            className="fixed top-6 right-6 z-[100] w-full max-w-sm"
            role="status"
            aria-live="polite"
        >
            <div
                className={
                    "rounded-xl border px-4 py-3 shadow-lg flex items-start gap-3 " +
                    variantToStyles[toast.variant]
                }
            >
                <div className="mt-0.5 text-lg leading-none">✅</div>
                <div className="flex-1">
                    {toast.title ? (
                        <div className="font-semibold text-sm">{toast.title}</div>
                    ) : null}
                    {toast.message ? (
                        <div className="text-sm opacity-95 mt-0.5">{toast.message}</div>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-2 rounded-md px-2 py-1 text-white/90 hover:text-white hover:bg-white/10 transition"
                    aria-label="Zamknij"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

