# alert Source Understanding

## Mapping
- local: `alert`
- zardui: `alert` (not available - component doesn't exist in zardui)
- shadcn: `alert`
- rationale: ZardUI doesn't have an alert component. Local implementation is aligned with shadcn API.

## Shadcn Evidence (Target API Baseline)
| id | file | lines | API/Behavior |
| --- | --- | --- | --- |
| S1 | registry/new-york-v4/examples/alert-demo.tsx | full | Alert component with `variant` prop (default, destructive) |
| S2 | registry/new-york-v4/examples/alert-demo.tsx | full | AlertTitle component for title |
| S3 | registry/new-york-v4/examples/alert-demo.tsx | full | AlertDescription component for description |

### Shadcn Alert API (from examples):
- **Alert**: `variant` prop (optional, default: "default", destructive)
- **AlertTitle**: Slot for title text
- **AlertDescription**: Slot for description content

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/alert/alert.component.ts | 1-107 | AlertComponent with variant, class, close output |
| L2 | src/app/shared/ui/alert/alert-title.component.ts | 1-39 | AlertTitleComponent |
| L3 | src/app/shared/ui/alert/alert-description.component.ts | 1-39 | AlertDescriptionComponent |
| L4 | src/app/shared/ui/alert/alert-action.component.ts | 1-2 | AlertActionComponent (action buttons) |

### Local Current API:
- **AlertComponent**:
  - `variant`: input<AlertVariant> - "default" | "destructive" | "warning" | "info" | "success"
  - `class`: input<string>
  - `close`: output<void>
- **AlertTitleComponent**: `class` input
- **AlertDescriptionComponent**: `class` input
- **AlertActionComponent**: for action buttons
