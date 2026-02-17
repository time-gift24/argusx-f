# toast - local sources

## index.ts
```typescript
export * from './toast.component';
export * from './toast.service';
```

## toast.component.ts
```typescript
import { ChangeDetectionStrategy, Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { ToastService, type Toast, type ToastType } from './toast.service';

// ============================================================================
// Toast Item
// ============================================================================

/**
 * Individual Toast Item Component
 */
@Component({
  selector: 'app-toast-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      [class]="computedClass()"
      role="alert"
      [attr.data-state]="'show'"
      [attr.data-type]="toast().type">
      <!-- Icon -->
      @if (toast().type !== 'loading') {
        <div class="shrink-0" [class]="iconClass()">
          <lucide-icon [img]="icon()" class="size-4" />
        </div>
      } @else {
        <div class="shrink-0" [class]="iconClass()">
          <lucide-icon [img]="icon()" class="size-4 animate-spin" />
        </div>
      }

      <!-- Content -->
      <div class="grid gap-1 flex-1">
        @if (toast().title) {
          <div class="text-xs font-medium">{{ toast().title }}</div>
        }
        @if (toast().description) {
          <div class="text-xs opacity-90">{{ toast().description }}</div>
        }
        @if (toast().action) {
          <button
            class="text-xs font-medium hover:underline justify-self-start mt-1 pointer-events-auto"
            (click)="toast().action!.onClick()">
            {{ toast().action!.label }}
          </button>
        }
      </div>

      <!-- Close button -->
      @if (toast().dismissible) {
        <button
          class="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity pointer-events-auto"
          (click)="dismiss()"
          aria-label="Dismiss">
          <lucide-icon [img]="closeIcon" class="size-3" />
        </button>
      }
    </div>
  `,
  host: {
    '[class]': 'computedWrapperClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastItemComponent {
  readonly toastService = inject(ToastService);
  readonly toast = input.required<Toast>();

  protected readonly closeIcon = this.toastService.closeIcon;

  protected icon() {
    return this.toastService.getIcon(this.toast().type);
  }

  protected readonly iconClass = computed(() => {
    const type = this.toast().type;
    return cn(
      type === 'success' && 'text-green-500',
      type === 'error' && 'text-destructive',
      type === 'warning' && 'text-yellow-500',
      type === 'info' && 'text-blue-500',
      type === 'loading' && 'text-muted-foreground'
    );
  });

  protected readonly computedClass = computed(() => {
    const type = this.toast().type;
    return cn(
      'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-3 shadow-lg transition-opacity transition-transform',
      'data-[state=show]:animate-in data-[state=hide]:animate-out',
      'data-[state=show]:fade-in-0 data-[state=hide]:fade-out-0',
      'data-[state=show]:slide-in-from-bottom-0 data-[state=hide]:slide-out-to-bottom-0',
      // Dark variants
      'dark:data-[state=show]:fade-in-0 dark:data-[state=hide]:fade-out-0',
      // Position-specific
      'data-[state=top-left]:slide-in-from-top-left',
      'data-[state=top-center]:slide-in-from-top',
      'data-[state=top-right]:slide-in-from-top-right',
      'data-[state=bottom-left]:slide-in-from-bottom-left',
      'data-[state=bottom-center]:slide-in-from-bottom',
      'data-[state=bottom-right]:slide-in-from-bottom-right',
      // Type-specific styles - using semantic tokens
      type === 'success' && 'border-success/20 bg-success/10 text-success',
      type === 'error' && 'border-destructive/20 bg-destructive/10 text-destructive',
      type === 'warning' && 'border-warning/20 bg-warning/10 text-warning',
      type === 'info' && 'border-info/20 bg-info/10 text-info',
      type === 'loading' && 'border-border bg-background text-foreground'
    );
  });

  protected readonly computedWrapperClass = computed(() =>
    cn('group relative pointer-events-auto')
  );

  dismiss(): void {
    this.toastService.dismiss(this.toast().id);
  }
}

// ============================================================================
// Toast Container
// ============================================================================

/**
 * Toast Container Component
 * Displays all active toasts
 */
@Component({
  selector: 'app-toast-container',
  imports: [CommonModule, LucideAngularModule, ToastItemComponent],
  template: `
    <div
      [class]="containerClass()"
      aria-live="polite"
      aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <app-toast-item [toast]="toast" />
      }
    </div>
  `,
  host: {
    '[attr.data-slot]': '"toast-container"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  protected readonly containerClass = computed(() => {
    const position = this.toastService.position();
    const isTop = position.startsWith('top');
    const isLeft = position.includes('left');
    const isCenter = position.includes('center');
    const isRight = position.includes('right');
    const isBottom = position.startsWith('bottom');

    return cn(
      'fixed z-[100] flex flex-col-reverse gap-2 p-4 w-full max-w-sm pointer-events-none',
      isTop && 'top-0',
      isBottom && 'bottom-0',
      isLeft && 'left-0 items-start',
      isCenter && 'left-1/2 -translate-x-1/2 items-center',
      isRight && 'right-0 items-end'
    );
  });
}

// ============================================================================
// Toaster Component (styled like sonner)
// ============================================================================

/**
 * Toaster Component
 * Placeholder for sonner-style toast container
 */
@Component({
  selector: 'app-toaster',
  imports: [ToastContainerComponent],
  template: `<app-toast-container />`,
  host: {
    '[attr.data-slot]': '"toaster"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent {}

// ============================================================================
// Exports
// ============================================================================

export const ToastComponents = [
  ToastContainerComponent,
  ToastItemComponent,
  ToasterComponent,
];

export { ToastService } from './toast.service';
```

## toast.service.ts
```typescript
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
```

