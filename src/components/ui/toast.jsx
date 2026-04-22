import * as React from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';

// Backward-compatible adapter over Sonner.
// Exports the same useToast() API ({ success, error, warning, info }) and ToastProvider.
// Consumer files require zero changes.

function success(message, opts) {
  sonnerToast.success(message, opts);
}

function error(message, opts) {
  sonnerToast.error(message, opts);
}

function warning(message, opts) {
  sonnerToast.warning(message, opts);
}

function info(message, opts) {
  sonnerToast.info(message, opts);
}

function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        theme="system"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toaster]:text-muted-foreground',
          },
        }}
      />
    </>
  );
}

function useToast() {
  return { success, error, warning, info, addToast: info };
}

export { ToastProvider, useToast };
