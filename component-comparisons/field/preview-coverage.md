# field Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=field`
- reference: `https://ui.shadcn.com/preview/radix/field-example`

## Preview Coverage Details

### Basic Field
- argusx-field
- argusx-field-label
- argusx-field-description

### Field Set + Error
- argusx-field-set
- argusx-field-legend
- argusx-field
- argusx-field-label
- argusx-field-description
- argusx-field-error

### Horizontal Orientation
- argusx-field orientation="horizontal"
- argusx-field-label with for attribute

### Field Legend
- argusx-field-set
- argusx-field-legend with variant="legend" (default)
- argusx-field-legend with variant="label"

## Verification Notes
- build: passed
- tests: no spec files for field component
- manual check: http://localhost:4200/preview/field
