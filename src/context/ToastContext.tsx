import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastItem } from '../components/Toast';

export interface ToastOptions {
  txHash?: string;
  durationMs?: number;
}

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastItem['type'], message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      type,
      message,
      txHash: options?.txHash,
      durationMs: options?.durationMs || 5000,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.durationMs);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg: string, opt?: ToastOptions) => addToast('success', msg, opt), [addToast]);
  const error = useCallback((msg: string, opt?: ToastOptions) => addToast('error', msg, opt), [addToast]);
  const info = useCallback((msg: string, opt?: ToastOptions) => addToast('info', msg, opt), [addToast]);
  const warning = useCallback((msg: string, opt?: ToastOptions) => addToast('warning', msg, opt), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
