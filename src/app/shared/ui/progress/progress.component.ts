import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Progress size variants
 */
export type ProgressSize = 'sm' | 'default' | 'lg';

/**
 * Progress color variants
 */
export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

/**
 * Progress shape variants
 */
export type ProgressShape = 'default' | 'square';

/**
 * Progress component that displays a horizontal progress bar.
 * Supports determinate values, indeterminate state, and multiple size/color variants.
 * Aligned with shadcn/ui progress component.
 *
 * @example
 * ```html
 * <app-progress [value]="50" [max]="100"></app-progress>
 * <app-progress [value]="75" size="lg"></app-progress>
 * <app-progress [value]="100" variant="success"></app-progress>
 * <app-progress [indeterminate]="true"></app-progress>
 * ```
 */
@Component({
  selector: 'app-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"progress"',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-shape]': 'shape()',
    role: 'progressbar',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'indeterminate() ? undefined : value()',
    '[attr.aria-valuetext]': 'indeterminate() ? "Loading" : undefined',
    '[attr.tabindex]': '0',
    '[class]': 'computedClass()',
  },
  template: `
    <div
      data-slot="progress-indicator"
      [class]="indicatorClass()"
      [style]="indicatorStyle()"
    ></div>
  `,
})
export class ProgressComponent {
  readonly value = input<number | undefined>(undefined);
  readonly max = input<number>(100);
  readonly class = input<string>('');
  readonly indeterminate = input<boolean>(false);
  readonly size = input<ProgressSize>('default');
  readonly variant = input<ProgressVariant>('default');
  readonly shape = input<ProgressShape>('default');

  protected readonly percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    if (val === undefined || maxVal === 0) return 0;
    return Math.min(100, Math.max(0, (val / maxVal) * 100));
  });

  protected readonly computedClass = computed(() =>
    cn(
      // Base styles aligned with shadcn/ui
      'bg-primary/20 relative w-full overflow-hidden',
      // Shape variants
      this.shapeClass(),
      // Size variants
      this.sizeClass(),
      this.class()
    )
  );

  protected readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  });

  protected readonly shapeClass = computed(() => {
    switch (this.shape()) {
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-full';
    }
  });

  protected readonly indicatorClass = computed(() =>
    cn(
      'size-full flex-1 transition-transform',
      this.variantClass(),
      this.indicatorShapeClass()
    )
  );

  protected readonly variantClass = computed(() => {
    switch (this.variant()) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  });

  protected readonly indicatorShapeClass = computed(() => {
    switch (this.shape()) {
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-full';
    }
  });

  protected readonly indicatorStyle = computed(() => {
    if (this.indeterminate() || this.value() === undefined) {
      return {};
    }
    return {
      transform: `translateX(-${100 - this.percentage()}%)`,
    };
  });
}
