import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldLabel component for labeling form fields.
 * Extends label functionality with additional styling for field context.
 *
 * @example
 * ```html
 * <app-field-label for="email">Email Address</app-field-label>
 * <input argusxInput id="email" type="email" />
 * ```
 */
@Component({
  selector: 'app-field-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-label"',
    '[class]': 'computedClass()',
  },
})
export class FieldLabelComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'has-data-checked:bg-primary/5 dark:has-data-checked:bg-primary/10 gap-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-2 group/field-label peer/field-label flex w-fit leading-snug',
      'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
      this.class()
    )
  );
}
