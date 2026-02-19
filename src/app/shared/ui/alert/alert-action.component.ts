import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

@Component({
  selector: 'argusx-alert-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[attr.data-slot]': '"alert-action"',
    '[class]': 'computedClass()',
  },
})
export class ArgusxAlertActionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn("col-span-2 mt-2 flex items-center justify-end gap-2", this.class())
  );
}
