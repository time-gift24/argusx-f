import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldSet component for grouping related form fields.
 * Use as a semantic container for form sections.
 *
 * @example
 * ```html
 * <app-field-set>
 *   <app-field-legend>Personal Information</app-field-legend>
 *   <!-- fields here -->
 * </app-field-set>
 * ```
 */
@Component({
  selector: 'app-field-set',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-set"',
    '[class]': 'computedClass()',
  },
})
export class FieldSetComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3 flex flex-col',
      this.class()
    )
  );
}
