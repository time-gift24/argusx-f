# typography Source Understanding

## Mapping
- local: `typography`
- zardui: `N/A` (typography is CSS-only in zardui, no component implementation)
- shadcn: `typography` (CSS utility classes)
- rationale: Typography in shadcn is implemented as raw CSS utility classes, not as Angular components. The local implementation uses Angular directives to apply these utility classes, which is a pattern that works well for Angular but differs from shadcn's pure CSS approach.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | zardui has no typography component - it's a pure CSS utility concept |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | shadcn registry | N/A | typography-demo shows all typography styles in raw CSS |
| U2 | shadcn docs | https://ui.shadcn.com/docs/components/typography | Official shadcn typography preset |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/typography/typography.directive.ts` | 1-276 | 12 typography directives (H1-H4, P, Blockquote, Code, Lead, Large, Small, Muted, List) with shadcn-aligned CSS classes |
| L2 | `src/app/shared/ui/typography/index.ts` | 1-15 | Exports all directive classes |

## Key Observations
1. **No zardui implementation**: Typography is typically not a component but a CSS utility pattern. Both shadcn and local implementations use raw CSS classes.
2. **Local already shadcn-aligned**: The local implementation already uses the exact same CSS utility classes as shadcn.
3. **Naming needs migration**: The current `appTypography*` naming should migrate to `argusxTypography*` to match the ArgusX naming convention.
4. **Directive pattern is appropriate**: Angular directives are a reasonable pattern for typography utilities since they don't require component templates.
