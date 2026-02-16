import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * AlertDescription component for displaying the description of an alert.
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
  selector: 'app-alert-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"alert-description"',
    '[class]': 'computedClass()',
  },
})
export class AlertDescriptionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "col-start-2 text-sm text-muted-foreground grid justify-items-start gap-1 [&_p]:leading-relaxed [&_p:not(:last-child)]:mb-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
      this.class()
    )
  );
}
