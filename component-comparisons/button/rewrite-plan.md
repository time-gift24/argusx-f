# button Rewrite Plan

## Naming Migration (z -> argusx)
- [x] selector migration
  - `argus-button`/`argusButton` -> `argusx-button`
- [x] input/type symbol migration
  - exported types now `ArgusxButtonVariant`, `ArgusxButtonSize`, `ArgusxButtonShape`
  - variant function now `argusxButtonVariants`
- [x] index export migration
  - `src/app/shared/ui/button/index.ts` exports argusx symbols only
- [x] compatibility alias
  - intentionally **not provided** per migration decision

## shadcn API Alignment
- [x] API surface alignment
  - kept `variant`, `size`, `asChild`, `class`, `disabled`
- [x] behavior alignment
  - `data-slot`, `data-variant`, `data-size` output
  - `asChild` no host class injection + `getClasses()` composition path
- [x] accessibility alignment
  - `aria-disabled`, `aria-invalid`, `aria-busy`
  - disabled anchor gets `tabindex=-1`

## File-level Execution Log
1. `src/app/shared/ui/button/button.directive.ts`
- unified to single implementation with `argusx-button`
- merged shape/full/loading/invalid behavior
2. `src/app/shared/ui/button/index.ts`
- switched to argusx-only exports
3. `src/app/shared/ui/button/button.component.ts`
- removed to prevent dual implementation drift
4. `src/app/shared/ui/button/button.directive.spec.ts`
- expanded tests for selector, data attrs, loading/disabled semantics, asChild behavior
5. `src/app/preview/button-preview.component.ts`
- upgraded to full shadcn + zard extension scenario coverage
6. `src/app/**`
- migrated all `argus-button` / `argusButton` usages to `argusx-button`
- migrated imports to `ArgusxButtonDirective`
