# tabs API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| root selector | z-tab-group | app-tabs | Tabs | app-tabs (keep for compat) | no | keep-local | N/A | L1 |
| list selector | z-tab-group (nav) | app-tabs-list | TabsList | app-tabs-list | no | keep-local | N/A | L1 |
| trigger selector | (button in nav) | app-tabs-trigger | TabsTrigger | app-tabs-trigger | no | keep-local | N/A | L1 |
| content selector | (div in template) | app-tabs-content | TabsContent | app-tabs-content | no | keep-local | N/A | L1 |
| value binding | zActiveIndex (index) | value (model) | value (model) | value (model) | yes | adopt-shadcn | N/A | S1/L1 |
| default value | N/A | N/A | defaultValue | defaultValue | no | adopt-shadcn | N/A | S1 |
| orientation | zTabsPosition | orientation | orientation | orientation | yes | adopt-shadcn | N/A | S1/L1 |
| variant | N/A | variant | N/A | variant | no | extend-argusx | default=default | L1 |
| disabled | N/A | disabled | N/A | disabled | no | extend-argusx | N/A | L1 |
| valueChange | zTabChange | valueChange | valueChange | valueChange | yes | adopt-shadcn | N/A | S1/L1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] value binding: Zardui uses index, shadcn uses string value. Local already uses value. Confirm shadcn pattern adopted.
- [x] orientation: Zardui uses zTabsPosition (top/bottom/left/right), shadcn uses orientation (horizontal/vertical). Local already uses orientation. Confirm shadcn pattern adopted.
- [x] valueChange: Local has it, shadcn has it. Confirm usage.

## Non-conflict Extensions (ArgusX Plain)
- [x] defaultValue: Add explicit defaultValue input that sets initial value if value is empty. Provides shadcn-compatible defaulting.
- [x] variant: Already exists (default/line). Ensure default is plain.
- [x] disabled: Already exists. Ensure proper behavior.

## Missing APIs
- [x] defaultValue: Need to add this input to match shadcn fully.

## Behavior Mismatches
- None significant. Local component already matches shadcn pattern closely.

## Final Target API
- selectors:
  - root: `app-tabs` (keep for backwards compatibility)
  - list: `app-tabs-list`
  - trigger: `app-tabs-trigger`
  - content: `app-tabs-content`
- inputs:
  - TabsComponent: `value` (model), `defaultValue`, `orientation`, `disabled`, `class`
  - TabsListComponent: `variant`, `class`
  - TabsTriggerComponent: `value` (required), `disabled`, `class`
  - TabsContentComponent: `value` (required), `class`
- outputs:
  - TabsComponent: `valueChange`
- data attributes:
  - `data-slot`: "tabs", "tabs-list", "tabs-trigger", "tabs-content"
  - `data-variant`: from list
  - `data-state`: "active"/"inactive" on trigger
  - `data-orientation`: on root
- accessibility contract:
  - role="tablist", role="tab", role="tabpanel"
  - aria-orientation, aria-selected, aria-controls, aria-labelledby
  - Keyboard navigation (arrow keys)
- plain style defaults:
  - variant default: "default" (bg-muted, rounded)
  - Minimal decoration, use theme tokens
