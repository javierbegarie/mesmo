import { create } from 'zustand';

export type ToastVariant = 'error' | 'success' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  add: (message: string, variant: ToastVariant) => void;
  dismiss: (id: string) => void;
}

let counter = 0;

const createToastStore = () =>
  create<ToastStore>((set) => ({
    toasts: [],
    add: (message, variant) =>
      set((state) => ({
        toasts: [
          ...state.toasts,
          { id: `${Date.now()}-${counter++}`, message, variant },
        ],
      })),
    dismiss: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  }));

// Consumed as source across projects, this module can be evaluated more than
// once (e.g. once via the shell, once via a feature module). A Symbol-keyed
// global guarantees every caller of `toast` and every <Toaster/> share one
// store instance.
const STORE_KEY = Symbol.for('mesmo.ui-kit.toast-store');
const globalRef = globalThis as unknown as Record<
  symbol,
  ReturnType<typeof createToastStore> | undefined
>;

export const useToastStore = (globalRef[STORE_KEY] ??= createToastStore());

/** Imperative API for raising toasts from anywhere (UI or not). */
export const toast = {
  error: (message: string) => useToastStore.getState().add(message, 'error'),
  success: (message: string) =>
    useToastStore.getState().add(message, 'success'),
  info: (message: string) => useToastStore.getState().add(message, 'info'),
};
