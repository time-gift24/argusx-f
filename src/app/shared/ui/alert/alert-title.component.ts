import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * AlertTitle component for displaying the title of an alert.
 * Should be used as a child of AlertComponent.
 *
 * @example
 * ```html
 * <app-alert>
 *   <app-alert-title>Error occurred</app-alert-title>
 *   <app-alert-description>Please try again later.</app-alert-description>
 * </app-alert>
 * ```
 */
@Component({
  selector: 'argusx-alert-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"alert-title"',
    '[class]': 'computedClass()',
  },
})
export class ArgusxAlertTitleComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "col-start-2 font-medium leading-snug tracking-tight [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
      this.class()
    )
  );
}
