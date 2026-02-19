import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { ChartConfig, ChartLegendPosition } from './chart.types';

/**
 * Custom Chart Legend Component
 *
 * A styled legend component that matches shadcn design.
 * Use this for custom legend rendering.
 */
@Component({
  selector: 'argusx-chart-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClass()">
      @for (item of items(); track item.key) {
        <div class="flex items-center gap-1.5">
          @if (!hideIcon()) {
            <div
              class="h-2 w-2 shrink-0 rounded-sm"
              [style.backgroundColor]="item.color"
            ></div>
          }
          <span class="text-muted-foreground text-xs">{{ item.label }}</span>
        </div>
      }
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ChartLegendComponent {
  /** Chart configuration */
  readonly config = input<ChartConfig>({});

  /** Legend items */
  readonly items = input<
    Array<{ key: string; label: string; color: string }>
  >([]);

  /** Hide icon indicator */
  readonly hideIcon = input<boolean>(false);

  /** Legend position */
  readonly position = input<ChartLegendPosition>('bottom');

  /** Custom class */
  readonly class = input<string>('');

  protected readonly containerClass = computed(() =>
    cn(
      'flex items-center justify-center gap-4 flex-wrap',
      this.position() === 'top' ? 'pb-3' : 'pt-3',
      this.class()
    )
  );
}
