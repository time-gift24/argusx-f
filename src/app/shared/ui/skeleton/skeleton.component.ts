import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { cn } from '../../utils/cn';

/**
 * Component that renders a customizable placeholder during data loading.
 * Use to improve perceived performance and prevent layout shifts.
 *
 * @example
 * ```html
 * <argusx-skeleton class="h-4 w-20"></argusx-skeleton>
 * <argusx-skeleton class="size-10 rounded-full"></argusx-skeleton>
 * ```
 */
@Component({
  selector: 'argusx-skeleton',
  template: `
    <div data-slot="skeleton" [class]="computedClass()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ArgusxSkeletonComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-muted animate-pulse rounded-md', this.class())
  );
}
