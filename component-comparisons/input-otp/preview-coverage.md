# input-otp Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
  - Selector renamed to argusx-input-otp
  - maxLength used instead of length
- [x] all non-conflict extension APIs in plain style
  - valueChange output added
  - complete output preserved
  - placeholder, disabled, inputMode, textAlign, autoComplete, class preserved
- [x] all key state combinations
  - Basic 6-digit code example with separator
- [x] shadcn preview parity examples
  - Basic usage with group and separator matches shadcn demo
- [ ] one complex combined scenario
  - Could add controlled example with valueChange

## Local Preview Routes
- main: `/preview?component=input-otp`
- reference: `https://ui.shadcn.com/preview/radix/input-otp-example`

## Verification Notes
- build: Need to run `ng build` to verify
- tests: No spec files exist for this component
- manual check: Need to verify preview at http://localhost:4200/preview/input-otp
