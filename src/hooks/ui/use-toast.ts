import { toast as sonnerToast, type ToastOptions } from 'sonner';

// Re-export toast with explicit type to avoid DTS issues
export function toast(options?: ToastOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sonnerToast(options) as any;
}

export function useToast(): { toast: typeof sonnerToast } {
  return {
    toast: sonnerToast,
  };
}

