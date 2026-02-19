# table Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (N/A - no conflicts)
- [x] all non-conflict extension APIs in plain style (argusxType, argusxSize)
- [x] all key state combinations (default, striped, bordered types; default, compact, comfortable sizes)
- [x] shadcn preview parity examples (basic table with header, body, footer)
- [x] one complex combined scenario (invoice table with status badges and footer totals)

## Local Preview Routes
- main: `/preview?component=table`
- reference: `https://ui.shadcn.com/preview/radix/table-example`

## Preview Examples
1. Default Table - Invoice list with header, body, footer, status badges
2. Striped Variant - Products table with alternating row backgrounds
3. Bordered Variant - Categories table with outer border
4. Compact Size - Key-value pairs with smaller padding
5. Comfortable Size - Users table with larger padding

## Verification Notes
- build: Passed
- tests: No spec file for table component
- manual check: Preview available at http://localhost:4200/preview/table
