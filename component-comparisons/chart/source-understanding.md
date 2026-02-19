# chart Source Understanding

## Mapping
- local: `chart`
- zardui: `chart` (not available in /tmp/zardui)
- shadcn: `chart`
- rationale: zardui chart component not available, using existing ApexCharts-based implementation

## Shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | registry/new-york-v4/ui/chart.tsx | - | ChartContainer with config prop |
| S2 | registry/new-york-v4/ui/chart.tsx | - | ChartTooltip with custom content |
| S3 | registry/new-york-v4/ui/chart.tsx | - | ChartLegend with ChartLegendContent |
| S4 | examples/chart-bar-demo.tsx | - | Bar chart example using recharts |
| S5 | examples/chart-bar-demo-tooltip.tsx | - | Tooltip integration example |

**Shadcn API ():**
- `based on rechartsChartContainer`: wrapper component with `config` and `class`
- `ChartTooltip`: tooltip component with `content`
- `ChartLegend`: legend component with `content`
- `ChartConfig`: type for chart configuration

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | chart-container.component.ts | 41 | selector: `app-chart-container` |
| L2 | chart-container.component.ts | 67-112 | inputs: config, series, type, options, title, subtitle, categories, etc. |
| L3 | chart-container.component.ts | 114-118 | outputs: chartReady, chartClick |
| L4 | chart-tooltip.component.ts | 29 | selector: `app-chart-tooltip` |
| L5 | chart-legend.component.ts | 17 | selector: `app-chart-legend` |
| L6 | index.ts | 8-10 | exports ChartContainer, ChartTooltip, ChartLegend |

## Key Differences
1. **Library**: shadcn uses recharts, local uses ApexCharts
2. **Selector naming**: `app-chart-*` should become `argusx-chart*`
3. **API structure**: shadcn has separate wrapper components; local has monolithic container

## Strategy
Since the underlying library is different (ApexCharts vs recharts), we will:
1. Keep ApexCharts as the underlying implementation
2. Align API naming conventions with ArgusX standards (argusx-* prefix)
3. Apply plain style baseline per skill requirements
