# resizable API Diff

## API Matrix

### ResizablePanelGroup / Component

| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-resizable` | `app-resizable-panel-group` | N/A | `argusx-resizable-panel-group` | yes | rename | - | Z1/L1 |
| layout/orientation | `zLayout` | `orientation` | `orientation` | `orientation` | yes | adopt-shadcn | default: horizontal | Z1/S1 |
| lazy | `zLazy` | - | - | - (not in shadcn) | no | extend-argusx | optional feature | Z1 |
| class | `class` | `class` | `className` | `class` | partial | adopt-local/shadcn | - | Z1/L1 |
| autoSaveId | - | `autoSaveId` | - | `autoSaveId` | no | extend-argusx | persist sizes to localStorage | L1 |
| events | zResizeStart/zResize/zResizeEnd | sizesChange | - | `sizesChange` | no | extend-argusx | output sizes array | L1 |

### ResizablePanel

| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-resizable-panel` | `app-resizable-panel` | N/A | `argusx-resizable-panel` | yes | rename | - | Z2/L1 |
| defaultSize | `zDefaultSize` | `defaultSize` | `defaultSize` | `defaultSize` | yes | adopt-shadcn | default: 50 | Z2/S1 |
| minSize | `zMin` | `minSize` | - | `minSize` | no | extend-argusx | default: 0 | Z2/L1 |
| maxSize | `zMax` | `maxSize` | - | `maxSize` | no | extend-argusx | default: 100 | Z2/L1 |
| collapsible | `zCollapsible` | - | - | `collapsible` | no | extend-argusx | from zardui | Z2 |
| resizable | `zResizable` | - | - | - | no | extend-argusx | optional, default: true | Z2 |
| class | `class` | `class` | - | `class` | no | adopt-local | - | Z2/L1 |
| id | - | `id` | - | `id` | no | extend-argusx | - | L1 |

### ResizableHandle

| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector | `z-resizable-handle` | `app-resizable-handle` | N/A | `argusx-resizable-handle` | yes | rename | - | Z3/L1 |
| withHandle | `zWithHandle` | `withHandle` | `withHandle` | `withHandle` | yes | adopt-shadcn | default: false | Z3/S1 |
| disabled | `zDisabled` | - | - | `disabled` | no | extend-argusx | default: false | Z3 |
| handleIndex | `zHandleIndex` | - | - | - | no | extend-argusx | internal index | Z3 |
| class | `class` | `class` | - | `class` | no | adopt-local | - | Z3/L1 |

## Conflict Decisions (Must Adopt shadcn)

1. **orientation** (zLayout -> orientation): Adopt shadcn naming
   - shadcn uses `orientation` with values 'horizontal' | 'vertical'
   - zardui uses `zLayout` with same semantics
   - Decision: Use `orientation` as input name

2. **defaultSize**: Already aligned, keep as is

3. **withHandle**: Already aligned, keep as is

4. **Selector naming**: Use `argusx-*` prefix instead of `z-*` or `app-*`

## Non-conflict Extensions (ArgusX Plain)

1. **autoSaveId** (ResizablePanelGroup): Persist panel sizes to localStorage
   - Local feature not in shadcn or zardui
   - Plain behavior: No UI, just localStorage key

2. **minSize/maxSize** (ResizablePanel): Min/max constraints
   - Available in zardui and local, not in shadcn
   - Plain behavior: Constrain resize range

3. **sizesChange** (ResizablePanelGroup): Output event for size changes
   - Reactive extension for controlled scenarios
   - Plain behavior: Emit on resize end

4. **collapsible** (ResizablePanel): Collapse panel to 0
   - From zardui feature
   - Plain behavior: Toggle collapse state

5. **disabled** (ResizableHandle): Disable handle interaction
   - From zardui feature
   - Plain behavior: Visual disabled state + no interaction

## Missing APIs

- None significant. Local has all necessary APIs.

## Behavior Mismatches

1. **Data attributes**: Local uses `data-slot`, zardui uses `data-layout`
   - Decision: Align with shadcn `data-slot`

## Final Target API

### ArgusxResizablePanelGroupComponent
- selector: `argusx-resizable-panel-group`
- inputs:
  - `orientation`: 'horizontal' | 'vertical' = 'horizontal'
  - `class`: string = ''
  - `autoSaveId`: string = ''
- outputs:
  - `sizesChange`: EventEmitter<number[]>
- data attributes:
  - `data-slot="resizable-panel-group"`
  - `data-orientation`
- host role: group

### ArgusxResizablePanelComponent
- selector: `argusx-resizable-panel`
- inputs:
  - `defaultSize`: number = 50
  - `minSize`: number = 0
  - `maxSize`: number = 100
  - `collapsible`: boolean = false
  - `class`: string = ''
  - `id`: string = ''
- data attributes:
  - `data-slot="resizable-panel"`
- host: role=presentation

### ArgusxResizableHandleComponent
- selector: `argusx-resizable-handle`
- inputs:
  - `withHandle`: boolean = false
  - `disabled`: boolean = false
  - `class`: string = ''
- data attributes:
  - `data-slot="resizable-handle"`
- host: role=separator, aria-orientation, tabindex, keyboard handlers
