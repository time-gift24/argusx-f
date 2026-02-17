import { Injectable, signal } from '@angular/core';
import { CircleCheck, Info, TriangleAlert, OctagonX, Loader2, X } from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ToastState = 'show' | 'hide';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  state?: ToastState;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// Toast Service
// ============================================================================

let toastIdCounter = 0;
const EXIT_ANIMATION_MS = 150;

/**
 * Toast Service
 * Manages global toast notifications
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  readonly position = signal<ToastPosition>('bottom-right');
  private readonly removalTimers = new Map<string, ReturnType<typeof setTimeout>>();

  private readonly icons: Record<ToastType, typeof CircleCheck | typeof Loader2> = {
    success: CircleCheck,
    error: OctagonX,
    warning: TriangleAlert,
    info: Info,
    loading: Loader2,
  };

  readonly closeIcon = X;

  getIcon(type: ToastType) {
    return this.icons[type];
  }

  private createId(): string {
    return `toast-${toastIdCounter++}`;
  }

  private addToast(toast: Omit<Toast, 'id'>): string {
    const id = this.createId();
    const newToast: Toast = {
      ...toast,
      id,
      state: 'show',
      duration: toast.duration ?? 5000,
      dismissible: toast.dismissible ?? true,
    };

    this.toasts.update((toasts) => [...toasts, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }

    return id;
  }

  success(title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'type'>>): string {
    return this.addToast({ title, description, type: 'success', ...options });
  }

  error(title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'type'>>): string {
    return this.addToast({ title, description, type: 'error', ...options });
  }

  warning(title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'type'>>): string {
    return this.addToast({ title, description, type: 'warning', ...options });
  }

  info(title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'type'>>): string {
    return this.addToast({ title, description, type: 'info', ...options });
  }

  loading(title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'type'>>): string {
    return this.addToast({ title, description, type: 'loading', dismissible: false, ...options });
  }

  dismiss(id: string): void {
    const target = this.toasts().find((toast) => toast.id === id);
    if (!target || target.state === 'hide') {
      return;
    }

    this.toasts.update((toasts) =>
      toasts.map((toast) =>
        toast.id === id ? { ...toast, state: 'hide' as const } : toast
      )
    );

    const existingTimer = this.removalTimers.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
      this.removalTimers.delete(id);
    }, EXIT_ANIMATION_MS);

    this.removalTimers.set(id, timer);
  }

  dismissAll(): void {
    for (const toast of this.toasts()) {
      this.dismiss(toast.id);
    }
  }

  setPosition(position: ToastPosition): void {
    this.position.set(position);
  }
}
