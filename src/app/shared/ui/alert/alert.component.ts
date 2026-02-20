import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';

// Shadcn alert baseline with ArgusX plain extensions.
const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-xs/relaxed grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>lucide-icon]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 has-[>lucide-icon]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>lucide-icon]:size-4 [&>lucide-icon>svg]:size-full [&>svg]:translate-y-0.5 [&>lucide-icon]:translate-y-0.5 [&>svg]:text-current [&>lucide-icon]:text-current [&>lucide-icon>svg]:text-current',
  {
    variants: {
      variant: {
        plain: 'bg-card text-card-foreground',
        destructive:
          'text-destructive bg-card [&>svg]:text-current [&>lucide-icon]:text-current [&>lucide-icon>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        warning:
          'text-warning-foreground bg-warning/10 border-warning/20 *:data-[slot=alert-description]:text-warning/90',
        info: 'text-info-foreground bg-info/10 border-info/20 *:data-[slot=alert-description]:text-info/90',
        success:
          'text-success-foreground bg-success/10 border-success/20 *:data-[slot=alert-description]:text-success/90',
      },
    },
    defaultVariants: {
      variant: 'plain',
    },
  }
);

type AlertVariants = VariantProps<typeof alertVariants>;

export type AlertVariant = NonNullable<AlertVariants['variant']>;

@Component({
  selector: 'argusx-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    role: 'alert',
    '[attr.data-slot]': '"alert"',
    '[attr.data-variant]': 'variant()',
    '[attr.aria-live]': '"polite"',
    '[class]': 'computedClass()',
  },
})
export class ArgusxAlertComponent {
  readonly variant = input<AlertVariant>('plain');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(alertVariants({ variant: this.variant() }), this.class())
  );
}

export { alertVariants };
