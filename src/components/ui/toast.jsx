import * as React from 'react';
import { cva } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success: 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300',
        error: 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300',
        warning: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
        info: 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  // Define removeToast FIRST (before it's used in addToast)
  const removeToast = React.useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (message, options = {}) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast = {
        id,
        message,
        variant: options.variant || 'default',
        duration: options.duration || 5000,
        ...options,
      };
      setToasts(prev => [...prev, toast]);

      if (toast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }

      return id;
    },
    [removeToast]
  );

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      success: (message, opts) => addToast(message, { ...opts, variant: 'success' }),
      error: (message, opts) => addToast(message, { ...opts, variant: 'error' }),
      warning: (message, opts) => addToast(message, { ...opts, variant: 'warning' }),
      info: (message, opts) => addToast(message, { ...opts, variant: 'info' }),
    }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  default: Info,
};

function Toast({ toast, onRemove }) {
  const Icon = iconMap[toast.variant] || Info;

  return (
    <div
      className={cn(
        toastVariants({ variant: toast.variant }),
        'animate-in slide-in-from-bottom-4 fade-in duration-300'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
          <div className="text-sm">{toast.message}</div>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export { Toast };
