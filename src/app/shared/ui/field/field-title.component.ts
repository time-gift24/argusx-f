import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * FieldTitle component for field titles/headers.
 * Used for smaller field titles, typically with checkbox/radio groups.
 *
 * @example
 * ```html
 * <app-field-title>Notification Preferences</app-field-title>
 * ```
 */
@Component({
  selector: 'app-field-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"field-label"',
    '[class]': 'computedClass()',
  },
})
export class FieldTitleComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'gap-2 text-xs/relaxed font-medium group-data-[disabled=true]/field:opacity-50 flex w-fit items-center leading-snug',
      this.class()
    )
  );
}
