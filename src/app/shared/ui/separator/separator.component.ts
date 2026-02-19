import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Separator component for visually or semantically separating content.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/separator.tsx)
 *
 * @example
 * ```html
 * <!-- Horizontal separator (default) -->
 * <argusx-separator />
 *
 * <!-- Vertical separator -->
 * <argusx-separator orientation="vertical" />
 *
 * <!-- Non-decorative (accessible) separator -->
 * <argusx-separator decorative="false" />
 * ```
 */
@Component({
  selector: 'argusx-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    '[attr.data-slot]': '"separator"',
    '[attr.data-orientation]': 'orientation()',
    '[attr.role]': 'decorative() ? "none" : "separator"',
    '[attr.aria-orientation]': 'decorative() ? null : orientation()',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
    '[class]': 'computedClass()',
  },
})
export class ArgusxSeparatorComponent {
  /**
   * Orientation of the separator.
   * @default 'horizontal'
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /**
   * Whether the separator is decorative (no semantic meaning).
   * When true, role="none" and aria-hidden="true" are set.
   * When false, role="separator" with aria-orientation is set.
   * @default true
   */
  readonly decorative = input<boolean>(true);

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  /**
   * Computed classes based on orientation and custom classes.
   */
  protected readonly computedClass = computed(() => {
    const isHorizontal = this.orientation() === 'horizontal';

    return cn(
      'bg-border shrink-0',
      // Orientation-specific styles
      isHorizontal ? 'h-px w-full' : 'h-full w-px self-stretch',
      this.class()
    );
  });
}
