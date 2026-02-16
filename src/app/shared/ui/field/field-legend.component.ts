import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldLegend component for labeling fieldset groups.
 * Supports 'legend' (default) and 'label' variants.
 *
 * @example
 * ```html
 * <app-field-legend>Personal Information</app-field-legend>
 * <app-field-legend variant="label">Contact Details</app-field-legend>
 * ```
 */
@Component({
  selector: 'app-field-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-legend"',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class FieldLegendComponent {
  /**
   * Visual variant of the legend.
   * - 'legend': larger text for main sections (default)
   * - 'label': smaller text similar to labels
   * @default 'legend'
   */
  readonly variant = input<'legend' | 'label'>('legend');

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'mb-2 font-medium data-[variant=label]:text-xs/relaxed data-[variant=legend]:text-sm',
      this.class()
    )
  );
}
