import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { ChartConfig, ChartTooltipIndicator } from './chart.types';

interface TooltipPayload {
  series: number[];
  seriesIndex: number;
  dataPointIndex: number;
  w: {
    config: {
      series: { name: string; data: number[] }[];
    };
  };
}

/**
 * Custom Chart Tooltip Component
 *
 * A styled tooltip content component that matches shadcn design.
 * Use this for custom tooltip rendering.
 */
@Component({
  selector: 'argusx-chart-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()">
      @if (!hideLabel()) {
        <div class="font-medium text-sm mb-1">{{ label() }}</div>
      }
      <div class="grid gap-1.5">
        @for (item of items(); track item.key) {
          <div [class]="itemClass()">
            @if (!hideIndicator()) {
              <div
                [class]="indicatorClass()"
                [style.backgroundColor]="item.color"
              ></div>
            }
            <div class="flex flex-1 justify-between items-center leading-none">
              <span class="text-muted-foreground text-xs">{{ item.label }}</span>
              <span class="font-mono font-medium text-xs tabular-nums">
                {{ item.value | number }}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ChartTooltipComponent {
  /** Chart configuration */
  readonly config = input<ChartConfig>({});

  /** Label for the tooltip */
  readonly label = input<string>('');

  /** Tooltip items */
  readonly items = input<
    Array<{ key: string; label: string; value: number; color: string }>
  >([]);

  /** Hide label */
  readonly hideLabel = input<boolean>(false);

  /** Hide indicator */
  readonly hideIndicator = input<boolean>(false);

  /** Indicator style */
  readonly indicator = input<ChartTooltipIndicator>('dot');

  /** Custom class */
  readonly class = input<string>('');

  protected readonly containerClass = computed(() =>
    cn(
      'border-border/50 bg-background rounded-lg border px-2.5 py-1.5 shadow-xl',
      'grid min-w-32 items-start gap-1.5',
      this.class()
    )
  );

  protected readonly itemClass = computed(() =>
    cn(
      'flex w-full flex-wrap items-stretch gap-2',
      this.indicator() === 'dot' && 'items-center'
    )
  );

  protected readonly indicatorClass = computed(() =>
    cn('shrink-0 rounded-sm', {
      'h-2 w-2': this.indicator() === 'dot',
      'w-1 h-2.5': this.indicator() === 'line',
      'w-0 border-[1.5px] border-dashed bg-transparent h-2.5':
        this.indicator() === 'dashed',
    })
  );
}
