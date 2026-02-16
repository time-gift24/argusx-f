import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/alert.tsx)
const alertVariants = cva(
  "grid gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5 w-full relative group/alert",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
        warning: "text-warning-foreground bg-warning/10 *:data-[slot=alert-description]:text-warning/90 border-warning/20 *:[svg]:text-current",
        info: "text-info-foreground bg-info/10 *:data-[slot=alert-description]:text-info/90 border-info/20 *:[svg]:text-current",
        success: "text-success-foreground bg-success/10 *:data-[slot=alert-description]:text-success/90 border-success/20 *:[svg]:text-current",
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
 *     <button argusButton variant="ghost" size="icon" data-close>
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
