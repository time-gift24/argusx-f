# toast Preview Coverage

## Required Scenarios
- [x] selector migration demo (argusx-toast-*)
- [x] toast types: success, error, warning, info, loading
- [x] positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- [x] with action button
- [x] dismissible toggle
- [x] complex combined scenario

## Local Preview Routes
- main: `/preview?component=toast`
- reference: `https://ui.shadcn.com/preview/radix/sonner-example`

## Verification Notes
- build: ng build
- tests: ng test --include="src/app/shared/ui/toast/**/*.spec.ts"
- manual check: http://localhost:4200/preview/toast
