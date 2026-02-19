# resizable Preview Coverage

## Required Scenarios

### Conflict APIs (shadcn-aligned)
- [x] orientation: horizontal
- [x] orientation: vertical
- [x] defaultSize on panels
- [x] withHandle indicator

### Non-conflict Extensions (ArgusX Plain)
- [x] disabled handle
- [x] minSize/maxSize constraints
- [x] autoSaveId (localStorage persistence)
- [x] sizesChange output event

### State Combinations
- [x] horizontal layout with resize
- [x] vertical layout with resize
- [x] disabled handle state

### shadcn Preview Parity
- [x] Basic horizontal panels (like shadcn demo)
- [x] Basic vertical panels (like shadcn demo)
- [x] Handle indicator (withHandle prop)

### Complex Combined Scenario
- [x] Horizontal panels with minSize constraints + autoSaveId

## Local Preview Routes
- main: `/preview?component=resizable`
- reference: `https://ui.shadcn.com/preview/radix/resizable-example`

## Verification Notes

### Build
- Status: Pre-existing error in breadcrumb-preview component (unrelated to resizable)
- Resizable component compiles correctly

### Tests
- Status: No spec file for resizable component
- Pre-existing build errors in other components prevent full test run

### Manual Check
- Route configured at: `/preview/resizable`
- Preview includes:
  1. Horizontal panels (shadcn-aligned)
  2. Vertical panels (shadcn-aligned)
  3. Disabled handle (ArgusX extension)
  4. Auto-save to localStorage (ArgusX extension)
