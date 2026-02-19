import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

@Component({
  selector: 'argusx-alert-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"alert-description"',
    '[class]': 'computedClass()',
  },
})
export class ArgusxAlertDescriptionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
      this.class()
    )
  );
}
