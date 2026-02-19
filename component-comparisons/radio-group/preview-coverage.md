# radio-group Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=radio-group`
- reference: `https://ui.shadcn.com/preview/radix/radio-group-example`

## Coverage Details

### Covered Scenarios:
1. **Default (Basic)**: Shows default radio group with three options
2. **Disabled Group**: Entire radio group is disabled
3. **Disabled Item**: Individual radio item is disabled (mixed state)
4. **Custom Name**: Custom name attribute for form integration
5. **Required**: Required attribute with aria-labelledby
6. **Custom Class**: Custom className on individual items

### API Coverage:
- `value` (model two-way binding) - covered
- `disabled` (group and item) - covered
- `name` - covered
- `required` - covered
- `ariaLabelledBy` - covered
- `className` (item) - covered

## Verification Notes
- build: TODO
- tests: TODO
- manual check: TODO
