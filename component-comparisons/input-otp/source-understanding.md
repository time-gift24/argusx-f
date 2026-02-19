# input-otp Source Understanding

## Mapping
- local: `input-otp`
- zardui: `N/A` (no direct counterpart exists in zardui)
- shadcn: `input-otp`
- rationale: InputOTP is based on radix-ui/primitive and input-otp library. No zardui equivalent exists, so shadcn is the primary reference for API alignment.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | - | No zardui input-otp component exists |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| S1 | shadcn MCP: input-otp-demo | - | Basic 6-digit OTP with separator |
| S2 | shadcn MCP: input-otp-pattern | - | Pattern validation example |
| S3 | shadcn MCP: input-otp-controlled | - | Controlled component with value/onChange |
| S4 | shadcn MCP: input-otp-separator | - | Multiple separators example |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/input-otp/input-otp.component.ts | 62-459 | Main component with 4 sub-components |
| L2 | src/app/preview/input-otp-preview.component.ts | 1-61 | Preview using app-input-otp selectors |
