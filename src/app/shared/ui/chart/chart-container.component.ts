import {
  Component,
  input,
  output,
  computed,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import type { ApexOptions } from 'apexcharts';
import { cn } from '../../utils/cn';
import {
  ChartConfig,
  ChartType,
  ChartSeries,
  ChartTooltipIndicator,
  ChartLegendPosition,
  ChartOptions,
} from './chart.types';

/**
 * Chart Container Component
 *
 * A wrapper around ApexCharts that provides shadcn-style theming and a simplified API.
 * Supports line, area, bar, pie, donut, and other chart types.
 *
 * @example
 * ```html
 * <argusx-chart
 *   [config]="chartConfig"
 *   [series]="chartSeries"
 *   type="line"
 *   [options]="chartOptions"
 * />
 * ```
 */
@Component({
  selector: 'argusx-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="containerClass()"
      [attr.data-chart]="chartId()"
      [attr.data-slot]="'chart'"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <!-- Dynamic styles for theme colors -->
      <style [innerHTML]="themeStyles()"></style>

      <!-- Chart -->
      <div class="w-full h-full" #chartContainer></div>
    </div>
  `,
  host: {
    class: 'block',
  },
})
export class ChartContainerComponent implements OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private chartInstance: ApexCharts | null = null;

  /** Chart configuration for colors and labels */
  readonly config = input.required<ChartConfig>();

  /** Chart data series */
  readonly series = input<ChartSeries[]>([]);

  /** Chart type */
  readonly type = input<ChartType>('line');

  /** Additional ApexCharts options */
  readonly options = input<Partial<ChartOptions>>({});

  /** Chart title */
  readonly title = input<string>('');

  /** Chart subtitle */
  readonly subtitle = input<string>('');

  /** X-axis categories (for bar/line charts) */
  readonly categories = input<(string | number)[]>([]);

  /** Custom aria-label */
  readonly ariaLabelInput = input<string>('Chart');

  /** Show legend */
  readonly showLegend = input<boolean>(true);

  /** Legend position */
  readonly legendPosition = input<ChartLegendPosition>('bottom');

  /** Show tooltip */
  readonly showTooltip = input<boolean>(true);

  /** Tooltip indicator style */
  readonly tooltipIndicator = input<ChartTooltipIndicator>('dot');

  /** Enable animations */
  readonly animated = input<boolean>(true);

  /** Chart height */
  readonly height = input<string | number>('auto');

  /** Chart width */
  readonly width = input<string | number>('100%');

  /** Custom class */
  readonly class = input<string>('');

  /** Chart ready event */
  readonly chartReady = output<void>();

  /** Chart click event */
  readonly chartClick = output<unknown>();

  /** Unique chart ID */
  protected readonly chartId = signal(`chart-${Math.random().toString(36).substring(2, 11)}`);

  /** Is dark theme active */
  protected readonly isDark = signal(false);

  /** Computed aria-label */
  protected readonly ariaLabel = computed(() => this.ariaLabelInput() || 'Data chart');

  /** Container classes */
  protected readonly containerClass = computed(() =>
    cn(
      'aspect-video flex justify-center text-xs',
      this.class()
    )
  );

  /** Theme styles for CSS variables */
  protected readonly themeStyles = computed(() => {
    const config = this.config();
    const id = this.chartId();
    const isDark = this.isDark();

    const colorEntries = Object.entries(config)
      .filter(([, item]) => item.color || item.theme)
      .map(([key, item]) => {
        const color = isDark
          ? item.theme?.dark || item.color
          : item.theme?.light || item.color;
        return `  --color-${key}: ${color || 'inherit'};`;
      });

    if (colorEntries.length === 0) return '';

    return `[data-chart="${id}"] {\n${colorEntries.join('\n')}\n}`;
  });

  /** Get full chart options */
  protected getChartOptions(): ApexOptions {
    const type = this.type();
    const isDark = this.isDark();
    const colors = this.getColors();

    // Base options
    const baseOptions: ApexOptions = {
      chart: {
        type: type,
        height: this.height() === 'auto' ? '100%' : this.height() as number,
        width: this.width() === '100%' ? '100%' : this.width() as number,
        animations: {
          enabled: this.animated(),
          dynamicAnimation: {
            enabled: this.animated(),
          },
        },
        background: 'transparent',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        fontFamily: 'inherit',
        foreColor: 'var(--muted-foreground)',
        parentHeightOffset: 0,
        redrawOnParentResize: true,
      },
      colors: colors,
      stroke: {
        curve: 'smooth',
        width: type === 'line' || type === 'area' ? 2 : 0,
      },
      fill: {
        type: type === 'area' ? 'gradient' : 'solid',
        opacity: type === 'area' ? [0.15, 0.3] : 1,
        gradient: {
          opacityFrom: 0.4,
          opacityTo: 0.1,
        },
      },
      markers: {
        size: 0,
        strokeWidth: 2,
        strokeColors: 'var(--background)',
        hover: {
          size: 5,
        },
      },
      grid: {
        show: true,
        borderColor: 'var(--border)',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          left: 8,
          right: 8,
          top: 8,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: this.showTooltip()
        ? {
            enabled: true,
            theme: isDark ? 'dark' : 'light',
            style: {
              fontSize: '0.75rem',
            },
            marker: {
              show: this.tooltipIndicator() === 'dot',
            },
            x: {
              show: true,
            },
          }
        : { enabled: false },
      legend: this.showLegend()
        ? {
            show: true,
            position: this.legendPosition(),
            horizontalAlign:
              this.legendPosition() === 'top' || this.legendPosition() === 'bottom'
                ? 'center'
                : undefined,
            fontSize: '0.75rem',
            fontFamily: 'inherit',
            markers: {
              size: 5,
              strokeWidth: 0,
              shape: 'circle',
            },
            itemMargin: {
              horizontal: 8,
              vertical: 4,
            },
            labels: {
              colors: 'var(--foreground)',
            },
          }
        : { show: false },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    // Add title if provided
    if (this.title()) {
      baseOptions.title = {
        text: this.title(),
        align: 'left',
        style: {
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--foreground)',
        },
      };
    }

    // Add subtitle if provided
    if (this.subtitle()) {
      baseOptions.subtitle = {
        text: this.subtitle(),
        align: 'left',
        style: {
          fontSize: '0.875rem',
          color: 'var(--muted-foreground)',
        },
      };
    }

    // Handle different chart types
    if (type === 'pie' || type === 'donut' || type === 'radialBar') {
      // For pie/donut/radialBar charts
      const series = this.series();
      baseOptions.labels = Object.keys(this.config());
      baseOptions.series = series[0]?.data?.map((d) =>
        typeof d === 'number' ? d : d.y
      ) || [];

      baseOptions.plotOptions = {
        pie: {
          expandOnClick: true,
          donut: {
            size: type === 'donut' ? '60%' : '0%',
            labels: {
              show: type === 'donut',
              name: {
                show: true,
                fontSize: '0.875rem',
                color: 'var(--foreground)',
              },
              value: {
                show: true,
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--foreground)',
              },
            },
          },
        },
      };
    } else {
      // For line/area/bar charts
      const series = this.series();
      baseOptions.series = series.map((s) => ({
        name: s.name,
        data: s.data as number[],
      })) as NonNullable<ApexOptions['series']>;

      baseOptions.xaxis = {
        type: 'category',
        categories:
          this.categories().length > 0 ? this.categories() : undefined,
        labels: {
          style: {
            colors: 'var(--muted-foreground)',
            fontSize: '0.75rem',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      };

      baseOptions.yaxis = {
        labels: {
          style: {
            colors: 'var(--muted-foreground)',
            fontSize: '0.75rem',
          },
        },
      };

      if (type === 'bar') {
        baseOptions.plotOptions = {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            columnWidth: '60%',
          },
        };
      }
    }

    // Merge with custom options
    return { ...baseOptions, ...this.options() } as ApexOptions;
  }

  /** Get colors from config */
  private getColors(): string[] {
    const config = this.config();
    const isDark = this.isDark();

    return Object.values(config).map((item) => {
      if (item.theme) {
        return isDark ? (item.theme.dark ?? 'var(--chart-1)') : (item.theme.light ?? 'var(--chart-1)');
      }
      return item.color || 'var(--chart-1)';
    });
  }

  constructor() {
    // Observe theme changes
    effect(() => {
      const observer = new MutationObserver(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        this.isDark.set(isDarkMode);

        // Update chart if exists
        if (this.chartInstance) {
          this.chartInstance.updateOptions(this.getChartOptions());
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      // Initial check
      this.isDark.set(document.documentElement.classList.contains('dark'));
    });

    // Effect to update chart when inputs change
    effect(async () => {
      // Consume signals to establish dependencies
      this.config();
      this.series();
      this.type();
      this.options();
      this.title();
      this.subtitle();
      this.categories();
      this.showLegend();
      this.legendPosition();
      this.showTooltip();
      this.tooltipIndicator();
      this.animated();
      this.height();
      this.width();
      this.isDark();

      // Update or create chart
      await this.updateChart();
    });
  }

  private async updateChart(): Promise<void> {
    const container = this.elementRef.nativeElement.querySelector('#chartContainer');
    if (!container) return;

    const options = this.getChartOptions();

    // Destroy existing chart
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    // Clear container
    container.innerHTML = '';

    // Create new chart
    const ApexCharts = (await import('apexcharts')).default;
    this.chartInstance = new ApexCharts(container, options);
    await this.chartInstance.render();

    this.chartReady.emit();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }
}

// Type for ApexCharts
declare global {
  interface ApexCharts {
    render(): Promise<void>;
    updateOptions(options: ApexOptions): Promise<void>;
    destroy(): void;
  }
}
