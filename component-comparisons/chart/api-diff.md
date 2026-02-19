# chart API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | N/A | `app-chart-container` | `ChartContainer` | `argusx-chart` | yes | rename to argusx prefix | N/A | L1 |
| config | N/A | `ChartConfig` | `ChartConfig` | `ChartConfig` | no | keep | uses CSS variables | L2, S1 |
| series | N/A | `ChartSeries[]` | data prop in recharts | `ChartSeries[]` | no | keep | plain data structure | L2 |
| type | N/A | `ChartType` | N/A (handled by recharts) | `ChartType` | no | keep | `line` default | L2 |
| options | N/A | `Partial<ChartOptions>` | N/A | `Partial<ChartOptions>` | no | keep | ApexCharts options | L2 |
| title | N/A | `string` | N/A | `string` | no | keep | optional subtitle | L2 |
| subtitle | N/A | `string` | N/A | `string` | no | keep | optional | L2 |
| categories | N/A | `(string \| number)[]` | XAxis dataKey | `(string \| number)[]` | no | keep | axis labels | L2 |
| showLegend | N/A | `boolean` | ChartLegend separate | `boolean` | no | keep | default true | L2 |
| legendPosition | N/A | `ChartLegendPosition` | ChartLegend position | `ChartLegendPosition` | no | keep | default bottom | L2 |
| showTooltip | N/A | `boolean` | ChartTooltip separate | `boolean` | no | keep | default true | L2 |
| tooltipIndicator | N/A | `ChartTooltipIndicator` | ChartTooltipContent | `ChartTooltipIndicator` | no | keep | default dot | L2 |
| animated | N/A | `boolean` | N/A | `boolean` | no | keep | default true | L2 |
| height | N/A | `string \| number` | className | `string \| number` | no | keep | default auto | L2 |
| width | N/A | `string \| number` | className | `string \| number` | no | keep | default 100% | L2 |
| chartReady | N/A | `output<void>` | N/A | `output<void>` | no | keep | event | L3 |
| chartClick | N/A | `output<unknown>` | N/A | `output<unknown>` | no | keep | event | L3 |
| tooltip selector | N/A | `app-chart-tooltip` | `ChartTooltip` | `argusx-chart-tooltip` | yes | rename | N/A | L4 |
| legend selector | N/A | `app-chart-legend` | `ChartLegend` | `argusx-chart-legend` | yes | rename | N/A | L5 |

## Conflict Decisions (Must Adopt shadcn)
- **selector naming**: `app-chart-*` conflicts with ArgusX naming convention → adopt `argusx-chart-*` prefix
- This is a naming migration from `app-` prefix to `argusx-` prefix per ArgusX standards

## Non-conflict Extensions (ArgusX Plain)
- **variant**: N/A - ApexCharts handles chart types internally, no variant concept needed
- **size**: N/A - height/width props serve this purpose

## Missing APIs
- None significant - all major functionality is covered

## Behavior Mismatches
- None - both use their respective libraries' default behaviors

## Final Target API
- **selectors**:
  - `argusx-chart` (main container, renamed from `app-chart-container`)
  - `argusx-chart-tooltip` (tooltip, renamed from `app-chart-tooltip`)
  - `argusx-chart-legend` (legend, renamed from `app-chart-legend`)
- **inputs**: all current inputs preserved, selector renamed
- **outputs**: chartReady, chartClick preserved
- **data attributes**: `data-chart`, `data-slot="chart"` preserved
- **accessibility contract**: role="img", aria-label preserved
- **plain style defaults**: all defaults maintain plain/neutral styling (no gradients, minimal shadows)
