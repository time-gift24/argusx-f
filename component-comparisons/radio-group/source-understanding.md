# radio-group Source Understanding

## Mapping
- local: `radio-group`
- zardui: `radio-group` (NOT FOUND - using local baseline + shadcn target)
- shadcn: `radio-group`
- rationale: ZardUI radio-group component not found in /tmp/zardui. Using local implementation as baseline with shadcn API as target.

## Shadcn Evidence (Target API)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | registry/new-york-v4/ui/radio-group.tsx | 1-47 | RadioGroup component with Root + Item structure |
| S2 | registry/new-york-v4/examples/radio-group-demo.tsx | 1-29 | Usage example with Label integration |

### Shadcn API Summary:
**RadioGroup (Root)**
- Props: `className`, all radix primitive props
- Data attributes: `data-slot="radio-group"`
- Structure: `<RadioGroupPrimitive.Root data-slot="radio-group" class={cn("grid gap-3", className)} {...props} />`

**RadioGroupItem**
- Props: `className`, all radix primitive props, `value` (required)
- Data attributes: `data-slot="radio-group-item"`, `data-state="checked|unchecked"`, `data-disabled`
- Visual: Circle icon indicator when checked, rounded-full border
- Classes: `border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aspect-square size-4 shrink-0 rounded-full border shadow-xs`

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | ZardUI component not found in /tmp/zardui |

## Usage Evidence (Doc + Demo)
| id | file | scenario |
| --- | --- | --- |
| U1 | shadcn registry example | RadioGroup with RadioGroupItem + Label |
| U2 | local preview | RadioGroup with disabled state |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/radio-group/radio-group.component.ts | 1-290 | RadioGroupComponent + RadioItemComponent |
| L2 | src/app/preview/radio-group-preview.component.ts | 1-58 | Preview with basic usage |

### Local Current API:
**RadioGroupComponent**
- selector: `app-radio-group`
- Inputs: `value`, `disabled`, `name`, `required`, `ariaLabelledBy`
- Model: `value` (two-way binding via model())
- Context: provides `RADIO_GROUP_TOKEN` for child items
- Data attributes: `data-slot="radio-group"`, `data-disabled`

**RadioItemComponent**
- selector: `app-radio-item`
- Inputs: `value` (required), `disabled`, `class`
- Data attributes: `data-slot="radio-group-item"`, `data-state`, `data-disabled`
- Indicator: CircleIcon when checked
- Control: implements keyboard navigation (Space/Enter)
