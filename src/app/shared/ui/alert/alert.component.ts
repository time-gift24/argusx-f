import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>lucide-icon]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 has-[>lucide-icon]:gap-x-3 gap-y-0.5 items-start group/alert [&>svg]:size-3.5 [&>lucide-icon]:size-3.5 [&>lucide-icon>svg]:size-full [&>svg]:translate-y-0.5 [&>lucide-icon]:translate-y-0.5 [&>svg]:text-current [&>lucide-icon]:text-current [&>lucide-icon>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90",
        warning:
          "text-warning-foreground bg-warning/10 border-warning/20 *:data-[slot=alert-description]:text-warning/90",
        info: "text-info-foreground bg-info/10 border-info/20 *:data-[slot=alert-description]:text-info/90",
        success:
          "text-success-foreground bg-success/10 border-success/20 *:data-[slot=alert-description]:text-success/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type AlertVariants = VariantProps<typeof alertVariants>;

export type AlertVariant = NonNullable<AlertVariants['variant']>;

/**
 * Alert component for displaying important information to users.
 * Supports multiple variants for different types of alerts.
 *
 * @example
 * ```html
 * <app-alert variant="default">
 *   <lucide-icon [img]="infoIcon"></lucide-icon>
 *   <app-alert-title>Information</app-alert-title>
 *   <app-alert-description>This is an informational message.</app-alert-description>
 * </app-alert>
 * ```
 *
 * @example With close button
 * ```html
 * <app-alert variant="destructive" (close)="handleClose()">
 *   <lucide-icon [img]="alertIcon"></lucide-icon>
 *   <app-alert-title>Error</app-alert-title>
 *   <app-alert-description>Something went wrong.</app-alert-description>
 *   <app-alert-action>
 *     <button argusx-button variant="ghost" size="icon" data-close>
 *       <lucide-icon [img]="xIcon"></lucide-icon>
 *     </button>
 *   </app-alert-action>
 * </app-alert>
 * ```
 */
@Component({
  selector: 'app-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  host: {
    role: 'alert',
    '[attr.data-slot]': '"alert"',
    '[attr.data-variant]': 'variant()',
    '[attr.aria-live]': '"polite"',
    '[class]': 'computedClass()',
  },
})
export class AlertComponent {
  /**
   * Visual variant of the alert.
   * @default 'default'
   */
  readonly variant = input<AlertVariant>('default');

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  /**
   * Event emitted when the close button is clicked.
   * This is not automatically handled - parent component must implement hide logic.
   */
  readonly close = output<void>();

  protected readonly computedClass = computed(() =>
    cn(alertVariants({ variant: this.variant() }), this.class())
  );

  /**
   * Handle close button click.
   */
  handleClose(): void {
    this.close.emit();
  }
}

export { alertVariants };
