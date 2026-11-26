import { ReactNode, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface WorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  role?: 'dialog' | 'alertdialog';
  maxWidthClass?: string;
  disableClose?: boolean;
  children: ReactNode;
}

/**
 * Accessible modal dialog wrapper for workspace views.
 * Handles Escape dismissal, backdrop click, aria-labelledby, initial focus,
 * Tab focus trapping, and focus restoration on close.
 */
export function WorkspaceDialog({
  open,
  onClose,
  title,
  description,
  icon,
  role = 'dialog',
  maxWidthClass = 'max-w-md',
  disableClose = false,
  children,
}: WorkspaceDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const firstFocusable = panel.querySelector<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      (firstFocusable ?? panel).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableClose) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panel) {
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [disableClose, onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && !disableClose) {
          onClose();
        }
      }}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`w-full ${maxWidthClass} bg-surface-card border border-surface-border rounded-2xl shadow-xl p-6 space-y-4 max-h-[90dvh] overflow-y-auto focus:outline-none`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span aria-hidden="true" className="shrink-0">{icon}</span>}
            <h3 id={titleId} className="font-display text-base font-bold text-on-surface text-balance truncate">
              {title}
            </h3>
          </div>
          <button
            type="button"
            disabled={disableClose}
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-text-muted hover:text-on-surface hover:bg-surface-container-low disabled:opacity-40 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {description && (
          <p id={descriptionId} className="text-xs text-text-muted text-pretty">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
