import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, Loader2 } from 'lucide-angular';
import { cn } from '../../utils/cn';

/**
 * Spinner Component
 *
 * A loading spinner component using lucide icons.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/spinner.tsx)
 *
 * @example
 * ```html
 * <app-spinner />
 * <app-spinner class="size-6" />
 * <app-spinner class="size-8" />
 * ```
 */
@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon
      [img]="loaderIcon"
      role="status"
      aria-label="Loading"
      [class]="computedClass()"
    />
  `,
})
export class SpinnerComponent {
  readonly class = input<string>('');
  readonly size = input<string | number>('size-4');

  protected readonly loaderIcon = Loader2;

  protected readonly computedClass = computed(() =>
    cn('animate-spin', this.size(), this.class())
  );
}
