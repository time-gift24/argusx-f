import { Injectable, signal, computed } from '@angular/core';
import { LucideAngularModule, CircleCheck, Info, TriangleAlert, OctagonX, Loader2, X } from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
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
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  dismissAll(): void {
    this.toasts.set([]);
  }

  setPosition(position: ToastPosition): void {
    this.position.set(position);
  }
}
