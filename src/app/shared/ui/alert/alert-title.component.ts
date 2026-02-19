import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

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
    cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', this.class())
  );
}
