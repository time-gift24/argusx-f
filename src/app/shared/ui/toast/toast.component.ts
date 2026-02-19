import { ChangeDetectionStrategy, Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { ToastService, type Toast, type ToastPosition } from './toast.service';

// ============================================================================
// Toast Item
// ============================================================================

/**
 * Individual Toast Item Component
 */
@Component({
  selector: 'argusx-toast-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      [class]="computedClass()"
      role="alert"
      [attr.data-state]="toast().state ?? 'show'"
      [attr.data-position]="position()"
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
  readonly position = input.required<ToastPosition>();

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
    const isTop = this.position().startsWith('top');
    return cn(
      'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-3 shadow-lg transition-opacity transition-transform',
      'data-[state=show]:animate-in data-[state=hide]:animate-out',
      'data-[state=show]:fade-in-0 data-[state=hide]:fade-out-0',
      isTop
        ? 'data-[state=show]:slide-in-from-top-2 data-[state=hide]:slide-out-to-top-2'
        : 'data-[state=show]:slide-in-from-bottom-2 data-[state=hide]:slide-out-to-bottom-2',
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
  selector: 'argusx-toast-container',
  imports: [CommonModule, LucideAngularModule, ToastItemComponent],
  template: `
    <div
      [class]="containerClass()"
      aria-live="polite"
      aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <argusx-toast-item [toast]="toast" [position]="toastService.position()" />
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
      'fixed z-[100] flex gap-2 p-4 w-full max-w-sm pointer-events-none',
      isTop && 'flex-col',
      isBottom && 'flex-col-reverse',
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
  selector: 'argusx-toaster',
  imports: [ToastContainerComponent],
  template: `<argusx-toast-container />`,
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
