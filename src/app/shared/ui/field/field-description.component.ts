import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldDescription component for adding helper text to fields.
 * Displays muted text below form controls.
 *
 * @example
 * ```html
 * <app-field>
 *   <app-field-label>Password</app-field-label>
 *   <input argusxInput type="password" />
 *   <app-field-description>Must be at least 8 characters.</app-field-description>
 * </app-field>
 * ```
 */
@Component({
  selector: 'argusx-field-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-description"',
    '[class]': 'computedClass()',
  },
})
export class FieldDescriptionComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground text-left text-xs/relaxed [[data-variant=legend]+&]:-mt-1.5 leading-normal font-normal group-has-data-horizontal/field:text-balance',
      'last:mt-0 nth-last-2:-mt-1',
      '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
      this.class()
    )
  );
}
