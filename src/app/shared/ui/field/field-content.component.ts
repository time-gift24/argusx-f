import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldContent component for wrapping field content (inputs, controls).
 * Provides flex layout for content area within a field.
 *
 * @example
 * ```html
 * <app-field>
 *   <app-field-label>Username</app-field-label>
 *   <app-field-content>
 *     <input argusxInput type="text" />
 *   </app-field-content>
 * </app-field>
 * ```
 */
@Component({
  selector: 'app-field-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-content"',
    '[class]': 'computedClass()',
  },
})
export class FieldContentComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'gap-0.5 group/field-content flex flex-1 flex-col leading-snug',
      this.class()
    )
  );
}
