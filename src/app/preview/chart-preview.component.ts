import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartContainerComponent } from '@app/shared/ui/chart';
import type { ChartConfig, ChartSeries } from '@app/shared/ui/chart';

@Component({
  selector: 'app-chart-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartContainerComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Chart</h1>
      <p class="mb-8 text-muted-foreground">
        Display data visualizations with ApexCharts integration.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Line Chart</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-chart-container
            [config]="lineConfig"
            [series]="lineSeries"
            type="line"
            [height]="200"
          />
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Bar Chart</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-chart-container
            [config]="barConfig"
            [series]="barSeries"
            type="bar"
            [height]="200"
          />
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Area Chart</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-chart-container
            [config]="areaConfig"
            [series]="areaSeries"
            type="area"
            [height]="200"
          />
        </div>
      </section>
    </div>
  `,
})
export class ChartPreviewComponent {
  readonly lineConfig: ChartConfig = {
    Sales: { label: 'Sales', color: 'hsl(var(--chart-1))' },
  };

  readonly lineSeries: ChartSeries[] = [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

  readonly barConfig: ChartConfig = {
    Revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
  };

  readonly barSeries: ChartSeries[] = [
    {
      name: 'Revenue',
      data: [30, 40, 35, 50, 49, 60, 70],
    },
  ];

  readonly areaConfig: ChartConfig = {
    Users: { label: 'Users', color: 'hsl(var(--chart-3))' },
  };

  readonly areaSeries: ChartSeries[] = [
    {
      name: 'Users',
      data: [30, 40, 35, 50, 49, 60, 70],
    },
  ];
}
