import type { ApexOptions } from 'apexcharts';

/**
 * Chart configuration item for defining series and styling
 */
export interface ChartConfigItem {
  /** Display label for the data series */
  label: string;
  /** Color for the series (CSS color value) */
  color?: string;
  /** Theme-specific colors (light/dark) */
  theme?: {
    light?: string;
    dark?: string;
  };
}

/**
 * Chart configuration map - keys correspond to data keys
 */
export type ChartConfig = Record<string, ChartConfigItem>;

/**
 * Supported chart types
 */
export type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'rangeBar';

/**
 * Tooltip indicator style
 */
export type ChartTooltipIndicator = 'dot' | 'line' | 'dashed';

/**
 * Legend position
 */
export type ChartLegendPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Data point for chart series
 */
export interface ChartDataPoint {
  x: string | number;
  y: number;
}

/**
 * Chart series data
 */
export interface ChartSeries {
  name: string;
  data: (number | ChartDataPoint)[];
}

/**
 * Extended ApexOptions with our custom configurations
 */
export type ChartOptions = ApexOptions;
