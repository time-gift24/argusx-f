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
      "text-muted-foreground text-xs/relaxed text-balance md:text-pretty [&_p:not(:last-child)]:mb-4 [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
      this.class()
    )
  );
}
