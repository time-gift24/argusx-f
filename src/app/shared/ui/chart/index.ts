/**
 * Chart Component Module
 *
 * Exports all chart-related components and types for data visualization.
 * Uses ApexCharts as the underlying charting library.
 *
 * @example
 * ```html
 * <argusx-chart
 *   [config]="chartConfig"
 *   [series]="chartSeries"
 *   type="line"
 * />
 * ```
 */

// Components
export { ChartContainerComponent } from './chart-container.component';
export { ChartTooltipComponent } from './chart-tooltip.component';
export { ChartLegendComponent } from './chart-legend.component';

// Types
export type {
  ChartConfig,
  ChartConfigItem,
  ChartType,
  ChartTooltipIndicator,
  ChartLegendPosition,
  ChartDataPoint,
  ChartSeries,
  ChartOptions,
} from './chart.types';
