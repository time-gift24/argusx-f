import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * Progress component that displays a horizontal progress bar.
 * Supports determinate values and indeterminate state.
 *
 * @example
 * ```html
 * <app-progress [value]="50" [max]="100"></app-progress>
 * <app-progress [value]="75"></app-progress>
 * <app-progress [indeterminate]="true"></app-progress>
 * ```
 */
@Component({
  selector: 'app-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"progress"',
    role: 'progressbar',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'indeterminate() ? undefined : value()',
    '[attr.aria-valuetext]': 'indeterminate() ? "Loading" : undefined',
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

  protected readonly percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    if (val === undefined || maxVal === 0) return 0;
    return Math.min(100, Math.max(0, (val / maxVal) * 100));
  });

  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted h-1 rounded-md relative flex w-full items-center overflow-hidden',
      this.class()
    )
  );

  protected readonly indicatorClass = computed(() =>
    cn('bg-primary size-full flex-1 transition-transform')
  );

  protected readonly indicatorStyle = computed(() => {
    if (this.indeterminate() || this.value() === undefined) {
      return {};
    }
    return {
      transform: `translateX(-${100 - this.percentage()}%)`,
    };
  });
}
