# input-otp Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
  - Selector: `app-input-otp` -> `argusx-input-otp`
  - Length input: `length` -> `maxLength`
  - Child selectors: `app-input-otp-group` -> `argusx-input-otp-group`, etc.
- [x] remove conflicting local/zardui primary entries
  - Remove old `app-*` selectors

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - `valueChange` output for Angular standard change notification
  - `complete` output for OTP completion
  - Keep all existing useful inputs (placeholder, disabled, etc.)
- [x] ensure extension does not break shadcn main path
  - Core functionality remains the same
  - Pattern validation works as before
- [x] set plain default style behavior
  - Default styling uses neutral classes from design tokens

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
  - No old aliases exist in current implementation
- [x] keep single canonical API path only
  - Only `argusx-input-otp*` selectors

## Naming Migration (z -> argusx)
- [x] selector migration
  - `app-input-otp` -> `argusx-input-otp`
  - `app-input-otp-group` -> `argusx-input-otp-group`
  - `app-input-otp-slot` -> `argusx-input-otp-slot`
  - `app-input-otp-separator` -> `argusx-input-otp-separator`
- [x] input/output/type symbol migration
  - `length` -> `maxLength`
- [x] index export migration
  - Update exports to use new names

## shadcn API Alignment
- [x] API surface alignment
  - maxLength: number (default 6)
  - value: model<string>
  - pattern: string | RegExp | null
- [x] behavior alignment
  - Input handling works the same
  - Paste support preserved
  - Pattern validation works
- [x] accessibility alignment
  - aria attributes properly set
  - Hidden input for keyboard navigation

## Plain Style Alignment
- [x] default variant/style is plain
  - Uses neutral styling from design tokens
- [x] avoid heavy decoration in default state
  - No heavy shadows or gradients
- [x] verify token usage and no hardcoded brand colors in component internals
  - Uses CSS variables from styles.css

## File-level Plan
1. `src/app/shared/ui/input-otp/input-otp.component.ts` - Update selectors and maxLength
2. `src/app/shared/ui/input-otp/index.ts` - Update exports
3. `src/app/preview/input-otp-preview.component.ts` - Update to use new selectors and maxLength
