# input-otp API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| selector (main) | N/A | `app-input-otp` | `InputOTP` | `argusx-input-otp` | yes | adopt-shadcn | N/A | S1 |
| selector (group) | N/A | `app-input-otp-group` | `InputOTPGroup` | `argusx-input-otp-group` | yes | adopt-shadcn | N/A | S1 |
| selector (slot) | N/A | `app-input-otp-slot` | `InputOTPSlot` | `argusx-input-otp-slot` | yes | adopt-shadcn | N/A | S1 |
| selector (separator) | N/A | `app-input-otp-separator` | `InputOTPSeparator` | `argusx-input-otp-separator` | yes | adopt-shadcn | N/A | S1 |
| length input | N/A | `length` | `maxLength` | `maxLength` | yes | adopt-shadcn | N/A | S2 |
| value input | N/A | `value` (model) | `value` | `value` (model) | no | same | N/A | S3 |
| onChange output | N/A | N/A | `onChange` | `valueChange` | yes | extend-argusx | Using Angular standard | S3 |
| complete output | N/A | `complete` | N/A | `complete` | no | extend-argusx | Emit when OTP complete | L1 |
| pattern input | N/A | `pattern` | `pattern` | `pattern` | no | same | N/A | S2 |
| placeholder input | N/A | `placeholder` | N/A | `placeholder` | no | extend-argusx | Plain style, no decoration | L1 |
| disabled input | N/A | `disabled` | N/A | `disabled` | no | extend-argusx | Plain style | L1 |
| inputMode input | N/A | `inputMode` | N/A | `inputMode` | no | extend-argusx | N/A | L1 |
| textAlign input | N/A | `textAlign` | N/A | `textAlign` | no | extend-argusx | N/A | L1 |
| autoComplete input | N/A | `autoComplete` | N/A | `autoComplete` | no | extend-argusx | Default one-time-code | L1 |
| class input | N/A | `class`/`containerClass` | N/A | `class` | no | extend-argusx | Plain styling | L1 |
| index (slot) | N/A | `index` | `index` | `index` | no | same | N/A | S1 |

## Conflict Decisions (Must Adopt shadcn)
- [x] Selector naming: Change from `app-input-otp` to `argusx-input-otp` (and similar for child components). Shadcn uses PascalCase which translates to kebab-case with argusx prefix.
- [x] Input naming: Change `length` to `maxLength` to align with shadcn API. This is the primary API conflict.

## Non-conflict Extensions (ArgusX Plain)
- [x] `valueChange` output: While shadcn uses `onChange`, Angular standard is `valueChange`. Keep both behaviors - model for two-way binding and output for change notifications.
- [x] `complete` output: Local extension that emits when OTP is fully filled. Useful for auto-submit scenarios.
- [x] `placeholder`, `disabled`, `inputMode`, `textAlign`, `autoComplete`, `class`: Local extensions that enhance usability without breaking shadcn main path.

## Missing APIs
- None identified. Local implementation covers shadcn functionality plus additional useful features.

## Behavior Mismatches
- None identified. Core OTP functionality (input, paste, pattern validation) is aligned.

## Final Target API
- selectors:
  - `argusx-input-otp` (main)
  - `argusx-input-otp-group` (container)
  - `argusx-input-otp-slot` (individual slot)
  - `argusx-input-otp-separator` (visual separator)
- inputs:
  - `maxLength`: number (default 6)
  - `value`: model<string>
  - `pattern`: string | RegExp | null
  - `placeholder`: string
  - `inputMode`: 'numeric' | 'text' | 'tel'
  - `textAlign`: 'left' | 'center' | 'right'
  - `autoComplete`: string
  - `disabled`: boolean
  - `class`: string
  - `ariaDescribedby`: string
  - `ariaInvalid`: boolean
- outputs:
  - `valueChange`: outputEmitter<string>
  - `complete`: outputEmitter<string>
- data attributes:
  - `data-slot`: "input-otp" | "input-otp-group" | "input-otp-slot" | "input-otp-separator"
  - `data-active`: boolean (slot only)
- accessibility contract:
  - Input has proper aria attributes
  - Slots are visually rendered but input is hidden
  - Keyboard navigation works via hidden input
- plain style defaults:
  - Default variant is plain (neutral styling)
  - Uses design tokens from styles.css
  - No heavy shadows, gradients or decorations
