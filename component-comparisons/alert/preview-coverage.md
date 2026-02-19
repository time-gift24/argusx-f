# alert Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Preview Coverage Details

### Shadcn-aligned APIs
- Basic alert (title only)
- Alert with icon, title and description
- Destructive variant

### ArgusX Plain Extensions
- Additional variants: info, warning, success
- Alert action buttons
- Long content handling

### State Combinations
- Title only
- Description only
- Icon + title
- Icon + description
- Icon + title + description
- With actions (buttons)
- Extended content (long text)

### Complex Combined Scenario
- Extended content with multiple variants and actions

## Local Preview Routes
- main: `/preview?component=alert`
- reference: `https://ui.shadcn.com/preview/radix/alert-example`

## Verification Notes
- build: PASSED
- tests: N/A (no spec files for alert component)
- manual check: Available at http://localhost:4200/preview/alert
