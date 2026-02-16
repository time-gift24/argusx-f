import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cn } from '../../../src/app/shared/utils/cn';

@Component({
  selector: 'app-aspect-ratio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'computedClass()',
    '[style.aspectRatio]': 'ratio()',
    '[style.display]': '"block"',
  },
})
export class AspectRatioComponent {
  readonly ratio = input<number>(16 / 9);
  readonly class = input<string>('');

  readonly computedClass = () => cn('w-full overflow-hidden', this.class());
}
