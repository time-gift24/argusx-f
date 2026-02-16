import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Directive that applies skeleton loading animation to any element.
 * Use on <div> or other elements to create placeholder content.
 *
 * @example
 * ```html
 * <div appSkeleton class="h-4 w-20"></div>
 * <div appSkeleton variant="circular" class="size-10"></div>
 * ```
 */
@Directive({
  selector: '[appSkeleton]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"skeleton"',
  },
})
export class SkeletonDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-muted rounded-md animate-pulse', this.class())
  );
}
