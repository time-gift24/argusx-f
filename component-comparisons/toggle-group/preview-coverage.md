# toggle-group Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=toggle-group`
- reference: `https://ui.shadcn.com/preview/radix/toggle-group-example`

## Preview Coverage Checklist
### Single Selection Mode
- [x] variant="default" (plain)
- [x] variant="outline"
- [x] with text labels (Left/Center/Right)

### Multiple Selection Mode
- [x] variant="outline"
- [x] with icons/text (Bold/Italic/Underline)
- [x] shows selected values

### State Combinations
- [x] default size
- [x] sm size
- [x] lg size

## Verification Notes
- build: ng build (run after changes)
- tests: ng test for toggle-group spec (if exists)
- manual check: open /preview?component=toggle-group
