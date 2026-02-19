import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldGroup component for grouping multiple fields.
 * Provides container query context for responsive field layouts.
 *
 * @example
 * ```html
 * <app-field-group>
 *   <app-field orientation="responsive">...</app-field>
 *   <app-field orientation="responsive">...</app-field>
 * </app-field-group>
 * ```
 */
@Component({
  selector: 'argusx-field-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-group"',
    '[class]': 'computedClass()',
  },
})
export class FieldGroupComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'gap-4 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4 group/field-group @container/field-group flex w-full flex-col',
      this.class()
    )
  );
}
