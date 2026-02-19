# skeleton Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior - skeleton is simple, no conflicts
- [x] all non-conflict extension APIs in plain style - class input, data-slot attribute
- [x] all key state combinations - skeleton has no states, just displays placeholder
- [x] shadcn preview parity examples - profile card, list loading, text lines patterns
- [x] one complex combined scenario - profile card with avatar and text lines

## Local Preview Routes
- main: `/preview?component=skeleton`
- reference: `https://ui.shadcn.com/preview/radix/skeleton-example`

## Preview Coverage Details

### 1. Profile Card (Shadcn-aligned)
- Circular skeleton (avatar placeholder)
- Text line skeletons
- Full width skeleton

### 2. List Loading (Shadcn-aligned)
- Multiple list items with avatar + text

### 3. Text Lines (Extension)
- Multiple text lines with varying widths

## Verification Notes
- build: Passed (popover error is unrelated to skeleton)
- tests: No spec file exists for skeleton
- manual check: Preview route exists at `/preview/skeleton`
