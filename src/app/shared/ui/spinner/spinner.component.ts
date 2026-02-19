import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, Loader2 } from 'lucide-angular';
import { cn } from '../../utils/cn';

/**
 * Spinner Component
 *
 * A loading spinner component using lucide icons.
 * Aligned with official shadcn spinner API.
 *
 * @example
 * ```html
 * <argusx-spinner />
 * <argusx-spinner class="size-6" />
 * <argusx-spinner class="size-8" />
 * ```
 */
@Component({
  selector: 'argusx-spinner',
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
export class ArgusxSpinnerComponent {
  readonly class = input<string>('size-4');

  protected readonly loaderIcon = Loader2;

  protected readonly computedClass = computed(() =>
    cn('animate-spin', this.class())
  );
}
