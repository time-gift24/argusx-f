# resizable Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] lock shadcn naming/default/behavior for conflict APIs
  - orientation (from zLayout)
  - defaultSize
  - withHandle
- [x] remove conflicting local/zardui primary entries
  - Renamed selectors from app-* to argusx-*
  - Removed z-* selectors

## Non-conflict Extensions (ArgusX Plain)
- [x] define extension API and naming
  - autoSaveId: localStorage persistence
  - minSize/maxSize: panel constraints
  - sizesChange: reactive output
  - collapsible: collapse panel to 0
  - disabled: disable handle interaction
- [x] ensure extension does not break shadcn main path
  - All shadcn-aligned APIs work independently
  - Extensions are optional and backward-compatible
- [x] set plain default style behavior
  - Default styles use Tailwind theme variables
  - No heavy decorations in default state

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] remove legacy API entrances and deprecated aliases
  - No app-* or z-* selectors remain
  - Single canonical API path only
- [x] keep single canonical API path only

## Naming Migration (z -> argusx)
- [x] selector migration
  - z-resizable -> argusx-resizable-panel-group
  - z-resizable-panel -> argusx-resizable-panel
  - z-resizable-handle -> argusx-resizable-handle
- [x] input/output/type symbol migration
  - zLayout -> orientation
  - zDefaultSize -> defaultSize
  - zWithHandle -> withHandle
  - zDisabled -> disabled
  - zCollapsible -> collapsible
  - zMin/zMax -> minSize/maxSize
- [x] index export migration
  - ResizableComponents -> ArgusxResizableComponents

## shadcn API Alignment
- [x] API surface alignment
  - orientation: horizontal | vertical
  - defaultSize: number (0-100)
  - withHandle: boolean
- [x] behavior alignment
  - Panel sizing logic matches shadcn pattern
  - Handle dragging behavior aligned
- [x] accessibility alignment
  - role=separator
  - aria-orientation
  - tabindex
  - keyboard support (arrows, home, etc.)

## Plain Style Alignment
- [x] default variant/style is plain
  - Minimal border styling
  - No heavy shadows or decorations
- [x] avoid heavy decoration in default state
- [x] verify token usage and no hardcoded brand colors in component internals
  - Uses bg-border, bg-muted, text-muted-foreground theme tokens

## File-level Plan
1. [x] `src/app/shared/ui/resizable/resizable.component.ts` - Component implementation
2. [x] `src/app/shared/ui/resizable/index.ts` - Exports
3. [x] `src/app/preview/resizable-preview.component.ts` - Preview with shadcn + argusx extensions
