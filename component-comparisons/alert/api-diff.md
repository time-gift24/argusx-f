# alert API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Alert variant | N/A | "default" \| "destructive" \| "warning" \| "info" \| "success" | "default" \| "destructive" | "default" \| "destructive" | Partial | extend-argusx | Extended variants (warning, info, success) are ArgusX plain extensions | L1/S1 |
| Alert class | N/A | input<string> | N/A | input<string> | No | extend-argusx | Custom class support | L1 |
| Alert close | N/A | output<void> | N/A | output<void> | No | extend-argusx | Close button support (not in shadcn) | L1 |
| AlertTitle class | N/A | input<string> | N/A | input<string> | No | extend-argusx | Custom class support | L2 |
| AlertDescription class | N/A | input<string> | N/A | input<string> | No | extend-argusx | Custom class support | L3 |

## Conflict Decisions (Must Adopt shadcn)
- None. The local implementation already aligns with shadcn API.

## Non-conflict Extensions (ArgusX Plain)
- **Additional variants (warning, info, success)**: Extended from shadcn's base (default, destructive). Provides more semantic alert types while maintaining plain style.
- **close output**: Allows parent to handle dismiss behavior. Not in shadcn but useful for UX.

## Missing APIs
- None. All shadcn APIs are covered.

## Behavior Mismatches
- None. Local implementation matches shadcn behavior.

## Final Target API
- **selectors**: `app-alert`, `app-alert-title`, `app-alert-description`, `app-alert-action`
- **inputs**:
  - AlertComponent: `variant` ("default" | "destructive" | "warning" | "info" | "success"), `class` (string)
  - AlertTitleComponent: `class` (string)
  - AlertDescriptionComponent: `class` (string)
- **outputs**:
  - AlertComponent: `close` (void)
- **data attributes**: `data-slot="alert"`, `data-variant`
- **accessibility contract**: `role="alert"`, `aria-live="polite"`
- **plain style defaults**: Default variant is "plain" style (no strong shadows, minimal colors)
