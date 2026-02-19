# chart Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (selector renamed to argusx-*)
- [x] all non-conflict extension APIs in plain style (chart types, options)
- [x] all key state combinations (legend on/off, tooltip on/off)
- [x] shadcn preview parity examples (line, bar, area charts)
- [x] one complex combined scenario (categories example)

## Local Preview Routes
- main: `/preview?component=chart` or `/preview/chart`
- reference: `https://ui.shadcn.com/preview/radix/chart-example` (shadcn uses recharts, not directly comparable)

## Preview Examples Coverage
1. Line Chart - basic line chart with single series
2. Bar Chart - basic bar chart with single series
3. Area Chart - basic area chart with single series
4. Pie Chart - pie chart with multiple categories
5. Donut Chart - donut chart with multiple categories
6. Plain Style - No Legend - chart with legend hidden
7. Plain Style - No Tooltip - chart with tooltip disabled
8. With Categories - bar chart with custom x-axis categories

## Verification Notes
- build: PASSED (npx ng build)
- tests: N/A (no spec files exist for chart components)
- manual check: http://localhost:4200/preview/chart
