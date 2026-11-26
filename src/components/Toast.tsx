import { Bell, CheckCircle2, Info } from 'lucide-react';
import { ToastState } from '../types/omnibook';

interface ToastProps {
  toast: ToastState;
}

export function Toast({ toast }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border border-surface-border bg-white text-on-surface transition-[transform,opacity] duration-200 ease-out ${
        toast.visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" aria-hidden="true" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-secondary shrink-0" aria-hidden="true" />}
      {toast.type === 'warning' && <Bell className="w-5 h-5 text-status-warning shrink-0" aria-hidden="true" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
