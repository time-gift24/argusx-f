# empty Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=empty`
- reference: `https://ui.shadcn.com/preview/radix/empty-example`

## Preview Coverage Details

### 1. Default Empty State (with icon, title, description, actions)
- Uses: `argusxEmpty`, `argusxEmptyMedia variant="icon"`, `argusxEmptyHeader`, `argusxEmptyTitle`, `argusxEmptyDescription`, `argusxEmptyContent`
- Aligned with shadcn empty-demo

### 2. Description Only (no media)
- Uses: `argusxEmpty`, `argusxEmptyHeader`, `argusxEmptyTitle`, `argusxEmptyDescription`
- Shows minimal empty state

### 3. With Action Button Only
- Uses: `argusxEmpty`, `argusxEmptyHeader`, `argusxEmptyTitle`, `argusxEmptyContent`
- Shows action-only empty state

## Verification Notes
- build: PASSED (`ng build` succeeded)
- tests: PASSED (9 tests passed)
- manual check: Available at http://localhost:4200/preview?component=empty
